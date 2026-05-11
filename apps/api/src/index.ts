import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { createOpenAIClient, generateJobPost } from './openai';
import { withUser } from './pg';
import dotenv from 'dotenv';

interface RequestWithHeaders extends FastifyRequest {
  headers: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, unknown>;
}

dotenv.config();

const app = Fastify({ logger: true });

// CORS configuration
await app.register(cors, {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    const allowed = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim());
    if (!origin || allowed.includes('*') || allowed.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  }
});

// Rate limiting
await app.register(rateLimit, { 
  global: true, 
  max: 100, 
  timeWindow: '1m' 
});

const openai = createOpenAIClient(process.env.OPENAI_API_KEY || '');

function getUserId(req: RequestWithHeaders): string | null {
  return (req.headers['x-user-id'] as string) || (req.query as Record<string, string>)['user_id'] || null;
}

// AI Ask endpoint
app.post('/ai/ask', async (req: RequestWithHeaders, reply: FastifyReply) => {
  const body = (req.body as Record<string, unknown>) || {};
  const prompt = body.prompt as string;
  if (!prompt) return reply.code(400).send({ error: 'prompt required' });
  const completion = await openai.responses.create({ model: 'gpt-4o-mini', input: prompt });
  return { text: completion.output_text };
});

// Job generation endpoint
app.post('/jobs/generate', async (req: RequestWithHeaders, _reply: FastifyReply) => {
  const body = (req.body as Record<string, unknown>) || {};
  const role = (body.role as string) || 'Engineer';
  const userId = getUserId(req);
  const description = await generateJobPost(openai, role, body);
  
  if (!userId) return { description };
  
  await withUser(userId, async (client) => {
    await client.query(
      `INSERT INTO job_post (user_id, title, description, location, tags, status)
       VALUES ($1, $2, $3, $4, $5, 'draft')`,
      [userId, role, description, body.location || null, body.tags || null]
    );
  });
  
  return { saved: Boolean(userId), description };
});

// Talent search endpoint
app.get('/talent/search', async (req: RequestWithHeaders, reply: FastifyReply) => {
  const q = (req.query as Record<string, string>).q as string;
  const country = (req.query as Record<string, string>).country as string | undefined;
  const userId = getUserId(req);
  
  if (!userId) return reply.code(401).send({ error: 'unauthorized' });
  
  const rows = await withUser(userId, async (client) => {
    const res = await client.query(
      `SELECT id, full_name, country, skills, experience_years FROM talent_profile
       WHERE ($1::text IS NULL OR country = $1)
         AND ($2::text IS NULL OR EXISTS (
              SELECT 1 FROM unnest(skills) s WHERE s ILIKE '%' || $2 || '%'
           ))
       ORDER BY created_at DESC
       LIMIT 25`,
      [country || null, q || null]
    );
    return res.rows;
  });
  
  return { results: rows };
});

// Project tracking endpoint
app.get('/projects/:name/track', async (req: RequestWithHeaders, reply: FastifyReply) => {
  const name = (req.params as Record<string, string>).name as string;
  const userId = getUserId(req);
  
  if (!userId) return reply.code(401).send({ error: 'unauthorized' });
  
  const project = await withUser(userId, async (client) => {
    const res = await client.query(`SELECT id, name, status, milestones FROM project WHERE name = $1 LIMIT 1`, [name]);
    return res.rows[0];
  });
  
  if (!project) return reply.code(404).send({ error: 'not found' });
  
  return { project };
});

// Notifications endpoint
app.get('/notifications', async (req: RequestWithHeaders, reply: FastifyReply) => {
  const userId = getUserId(req);
  
  if (!userId) return reply.code(401).send({ error: 'unauthorized' });
  
  const items = await withUser(userId, async (client) => {
    const res = await client.query(
      `SELECT id, channel, title, body, data, read, created_at FROM notification
       WHERE read = false ORDER BY created_at DESC LIMIT 20`
    );
    return res.rows;
  });
  
  return { items };
});

const port = Number(process.env.API_PORT || 4000);

app.listen({ port, host: '0.0.0.0' }).catch((err: Error) => {
  app.log.error(err);
  process.exit(1);
});