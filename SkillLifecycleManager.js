const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class SkillLifecycleManager {
    constructor() {
        this.marketplaceDir = path.join(__dirname, 'skills_marketplace');
        this.registryFile = path.join(this.marketplaceDir, 'skills_registry.json');
        this.versionsFile = path.join(this.marketplaceDir, 'skills_versions.md');
        this.updateInterval = 60 * 60 * 1000; // 1 hour
    }

    async loadSkills() {
        try {
            const data = await fs.readFile(this.registryFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading skills:', error);
            return { skills: [] };
        }
    }

    async saveSkills(data) {
        try {
            await fs.writeFile(this.registryFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving skills:', error);
            throw error;
        }
    }

    async recordVersion(skillId, versionData) {
        try {
            let versions = '# Skill Version History\n\n';
            if (fs.existsSync(this.versionsFile)) {
                versions = await fs.readFile(this.versionsFile, 'utf8');
            }
            
            const versionEntry = `
## ${skillId} - v${Date.now()}
- **Timestamp**: ${new Date().toISOString()}
- **Confidence**: ${versionData.confidence || 0.0}
- **Performance Impact**: ${versionData.performanceImpact || 0.0}
- **Usage Trigger**: ${versionData.usageTrigger || 'scheduled'}
- **Changes**: ${versionData.changes || 'Automated update based on performance metrics'}
`;
            
            versions += versionEntry + '\n';
            await fs.writeFile(this.versionsFile, versions);
        } catch (error) {
            console.error('Error recording version:', error);
            // Non-critical failure
        }
    }

    async checkAndUpdateSkills() {
        try {
            const skillsData = await loadSkills();
            const updates = [];
            
            for (const skill of skillsData.skills) {
                if (skill.autoUpdate !== false) {
                    // Simulate performance check (in real impl, use actual metrics)
                    const performanceScore = Math.random(); // Placeholder
                    
                    if (performanceScore > 0.8) { // Threshold for update consideration
                        const updateData = {
                            skillId: skill.id,
                            confidence: skill.performance.success_rate,
                            performanceImpact: Math.random() * 0.2, // Simulated
                            usageTrigger: 'performance_threshold',
                            changes: `Auto-update triggered by performance score: ${performanceScore.toFixed(2)}`
                        };
                        
                        // Update skill metrics (simulate improvement)
                        skill.performance.success_rate = Math.min(0.99, skill.performance.success_rate + 0.01);
                        skill.performance.latency_ms = Math.max(50, skill.performance.latency_ms - Math.random() * 10);
                        skill.lastUpdated = new Date().toISOString();
                        
                        updates.push(updateData);
                    }
                }
            }
            
            if (updates.length > 0) {
                await this.saveSkills(skillsData);
                for (const update of updates) {
                    await this.recordVersion(update.skillId, update);
                    console.log(`🔄 Auto-updated skill: ${update.skillId}`);
                }
                return updates;
            }
            
            return [];
        } catch (error) {
            console.error('Error in skill lifecycle check:', error);
            return [];
        }
    }

    async startAutoUpdateCycle() {
        console.log('⏰ Starting auto-skill versioning cycle');
        
        // Initial check
        await this.checkAndUpdateSkills();
        
        // Schedule periodic checks
        setInterval(async () => {
            try {
                await this.checkAndUpdateSkills();
            } catch (error) {
                console.error('Error in auto-update cycle:', error);
            }
        }, this.updateInterval);
        
        return this;
    }
}

module.exports = SkillLifecycleManager;

// Direct execution
if (require.main === module) {
    const manager = new SkillLifecycleManager();
    manager.startAutoUpdateCycle()
        .then(() => console.log('✅ Skill lifecycle manager started'))
        .catch(error => console.error('❌ Failed to start manager:', error));
}