import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'subscribers.json');

async function readSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

async function writeSubscribers(emails: string[]) {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string | undefined = body?.email;
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const lower = email.toLowerCase();
    if (!lower.includes('@')) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const emails = await readSubscribers();
    if (emails.includes(lower)) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }
    emails.push(lower);
    await writeSubscribers(emails);

    // Send welcome if SendGrid configured
    const { SENDGRID_API_KEY, SENDER_EMAIL, NEWSLETTER_SUBJECT, NEWSLETTER_BODY } = process.env;
    if (SENDGRID_API_KEY && SENDER_EMAIL) {
      try {
        const sg = (await import('@sendgrid/mail')).default;
        sg.setApiKey(SENDGRID_API_KEY);
        const subject = NEWSLETTER_SUBJECT || 'Welcome to Zion Tech Services';
        const text = NEWSLETTER_BODY || 'Thank you for subscribing to our newsletter!';
        await sg.send({
          to: lower,
          from: SENDER_EMAIL,
          subject,
          text,
        });
      } catch (err) {
        console.error('SendGrid error:', err);
      }
    }
    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}