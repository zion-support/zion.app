const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills_marketplace');
const SKILLS_FILE = path.join(SKILLS_DIR, 'skills_registry.json');

// Initialize skills registry if it doesn't exist
async function initSkillsRegistry() {
    try {
        await fs.access(SKILLS_FILE);
    } catch (error) {
        // Create initial registry with seeded skills
        const initialRegistry = {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            skills: [
                {
                    id: "auto-pr-labeler",
                    name: "Auto-PR Labeler",
                    description: "Automatically labels PRs based on file changes and content analysis",
                    category: "github",
                    dependencies: ["github-api", "openai"],
                    executionLogic: "function autoLabelPR(context) { /* implementation */ }",
                    performance: {
                        success_rate: 0.92,
                        latency_ms: 150,
                        usage_count: 0
                    },
                    lastUpdated: new Date().toISOString(),
                    autoUpdate: true
                },
                {
                    id: "log-analyzer",
                    name: "Log Analyzer",
                    description: "Extracts insights and patterns from application logs",
                    category: "monitoring",
                    dependencies: ["fs", "regex"],
                    executionLogic: "function analyzeLogs(context) { /* implementation */ }",
                    performance: {
                        success_rate: 0.88,
                        latency_ms: 200,
                        usage_count: 0
                    },
                    lastUpdated: new Date().toISOString(),
                    autoUpdate: true
                },
                {
                    id: "dependency-checker",
                    name: "Dependency Checker",
                    description: "Identifies outdated and vulnerable npm packages",
                    category: "devops",
                    dependencies: ["npm", "semver"],
                    executionLogic: "function checkDeps(context) { /* implementation */ }",
                    performance: {
                        success_rate: 0.95,
                        latency_ms: 300,
                        usage_count: 0
                    },
                    lastUpdated: new Date().toISOString(),
                    autoUpdate: true
                }
            ]
        };
        
        await fs.writeFile(SKILLS_FILE, JSON.stringify(initialRegistry, null, 2));
    }
}

// Load skills from registry
async function loadSkills() {
    await initSkillsRegistry();
    const data = await fs.readFile(SKILLS_FILE, 'utf8');
    return JSON.parse(data);
}

// Save skills to registry
async function saveSkills(data) {
    const updatedData = {
        ...data,
        lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(SKILLS_FILE, JSON.stringify(updatedData, null, 2));
}

// GET /skills - List all skills
router.get('/', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        res.json({
            skills: skillsData.skills,
            total: skillsData.skills.length,
            version: skillsData.version
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /skills/:id - Get skill details
router.get('/:id', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const skill = skillsData.skills.find(s => s.id === req.params.id);
        
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        
        res.json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /skills - Register new skill
router.post('/', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const newSkill = {
            ...req.body,
            id: req.body.id || `skill_${Date.now()}`,
            performance: {
                success_rate: req.body.performance?.success_rate || 0.0,
                latency_ms: req.body.performance?.latency_ms || 0,
                usage_count: 0
            },
            lastUpdated: new Date().toISOString(),
            autoUpdate: req.body.autoUpdate !== undefined ? req.body.autoUpdate : true
        };
        
        // Check for duplicate ID
        if (skillsData.skills.some(s => s.id === newSkill.id)) {
            return res.status(409).json({ error: 'Skill ID already exists' });
        }
        
        skillsData.skills.push(newSkill);
        await saveSkills(skillsData);
        
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /skills/:id - Update existing skill
router.put('/:id', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const skillIndex = skillsData.skills.findIndex(s => s.id === req.params.id);
        
        if (skillIndex === -1) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        
        // Update skill while preserving performance history
        const updatedSkill = {
            ...skillsData.skills[skillIndex],
            ...req.body,
            lastUpdated: new Date().toISOString()
        };
        
        // Preserve usage count if not explicitly provided
        if (!req.body.performance) {
            updatedSkill.performance = {
                ...skillsData.skills[skillIndex].performance,
                ...(req.body.performance || {})
            };
        }
        
        skillsData.skills[skillIndex] = updatedSkill;
        await saveSkills(skillsData);
        
        res.json(updatedSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /skills/:id - Remove skill
router.delete('/:id', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const skillIndex = skillsData.skills.findIndex(s => s.id === req.params.id);
        
        if (skillIndex === -1) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        
        const [deletedSkill] = skillsData.skills.splice(skillIndex, 1);
        await saveSkills(skillsData);
        
        res.json({ message: 'Skill deleted successfully', skill: deletedSkill });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /skills/search - Search skills
router.post('/search', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const { query, category, tags } = req.body;
        
        let results = skillsData.skills;
        
        // Filter by text query
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            results = results.filter(skill => 
                skill.name.toLowerCase().includes(lowercaseQuery) ||
                skill.description.toLowerCase().includes(lowercaseQuery) ||
                (skill.tags || []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
            );
        }
        
        // Filter by category
        if (category) {
            results = results.filter(skill => skill.category === category);
        }
        
        // Filter by tags
        if (tags && Array.isArray(tags)) {
            results = results.filter(skill => 
                tags.every(tag => 
                    (skill.tags || []).includes(tag)
                )
            );
        }
        
        res.json({
            results,
            count: results.length,
            query: { query, category, tags }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /skills/:id/execute - Execute skill
router.post('/:id/execute', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const skill = skillsData.skills.find(s => s.id === req.params.id);
        
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        
        // In a real implementation, this would execute the skill logic
        // For now, we'll simulate execution and update performance metrics
        const executionStart = Date.now();
        
        // Simulate skill execution (replace with actual execution logic)
        const executionResult = {
            success: Math.random() > 0.1, // 90% success rate for demo
            data: {
                message: `Skill ${skill.id} executed successfully`,
                timestamp: new Date().toISOString()
            }
        };
        
        const executionTime = Date.now() - executionStart;
        
        // Update performance metrics
        skill.performance.usage_count += 1;
        skill.performance.latency_ms = 
            ((skill.performance.latency_ms * (skill.performance.usage_count - 1)) + executionTime) / 
            skill.performance.usage_count;
        
        if (executionResult.success) {
            skill.performance.success_rate = 
                ((skill.performance.success_rate * (skill.performance.usage_count - 1)) + 1) / 
                skill.performance.usage_count;
        } else {
            skill.performance.success_rate = 
                ((skill.performance.success_rate * (skill.performance.usage_count - 1)) + 0) / 
                skill.performance.usage_count;
        }
        
        skill.lastExecution = new Date().toISOString();
        
        await saveSkills(skillsData);
        
        res.json({
            skillId: skill.id,
            executionTime: executionTime,
            success: executionResult.success,
            data: executionResult.data,
            updatedPerformance: skill.performance
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /skills/stats - Get marketplace statistics
router.get('/stats', async (req, res) => {
    try {
        const skillsData = await loadSkills();
        const skills = skillsData.skills;
        
        const stats = {
            totalSkills: skills.length,
            autoUpdateEnabled: skills.filter(s => s.autoUpdate).length,
            categories: [...new Set(skills.map(s => s.category))],
            avgSuccessRate: skills.reduce((sum, s) => sum + s.performance.success_rate, 0) / skills.length,
            totalUsage: skills.reduce((sum, s) => sum + s.performance.usage_count, 0),
            mostUsedSkill: skills.reduce((prev, curr) => 
                prev.performance.usage_count > curr.performance.usage_count ? prev : curr
            ).name
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;