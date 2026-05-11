const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// PM2 Automation Auditor - Eliminate Orphaned Cron Jobs
class AutomationAuditor {
    constructor() {
        this.logFile = '/logs/pm2_audit.log';
        this.auditReport = '/automation.git/additional_automation/pm2_audit_report.json';
        this.duplicates = [];
        this.orphans = [];
        this.performanceMetrics = [];
    }

    async auditPM2Processes() {
        console.log('🔍 Starting PM2 Automation Audit...');
        
        try {
            // Get current PM2 processes
            const pm2List = await this.execCommand('pm2 list --no-color');
            const processes = this.parsePM2Output(pm2List);
            
            // Detect duplicates
            const nameCounts = {};
            processes.forEach(p => {
                nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
                if (nameCounts[p.name] > 1) {
                    this.duplicates.push({
                        name: p.name,
                        id: p.id,
                        status: p.status,
                        memory: p.memory,
                        cpu: p.cpu,
                        restarts: p.restarts,
                        uptime: p.uptime
                    });
                }
            });

            // Detect orphaned processes (no related cron jobs)
            await this.detectOrphans(processes);

            // Generate performance metrics
            this.generatePerformanceMetrics(processes);

            return {
                timestamp: new Date().toISOString(),
                totalProcesses: processes.length,
                duplicates: this.duplicates,
                orphans: this.orphans,
                metrics: this.performanceMetrics,
                recommendations: this.generateRecommendations()
            };

        } catch (error) {
            console.error('❌ PM2 Audit failed:', error.message);
            throw error;
        }
    }

    async detectOrphans(processes) {
        // Check for processes without corresponding cron entries
        const cronJobs = await this.getCronJobs();
        
        processes.forEach(p => {
            const hasCron = cronJobs.some(cron => 
                cron.command.includes(p.name) || 
                cron.name === p.name
            );
            
            if (!hasCron && p.status === 'online') {
                this.orphans.push({
                    name: p.name,
                    id: p.id,
                    status: p.status,
                    memory: p.memory,
                    cpu: p.cpu,
                    reason: 'No corresponding cron job found'
                });
            }
        });
    }

    async getCronJobs() {
        try {
            const cronOutput = await this.execCommand('crontab -l');
            return cronOutput.split('\n')
                .filter(line => line.trim() && !line.startsWith('#'))
                .map(line => {
                    const parts = line.split(/\s+/);
                    return {
                        name: parts[parts.length - 1] || 'unnamed',
                        command: parts.slice(-1)[0],
                        schedule: parts.slice(0, -1).join(' ')
                    };
                });
        } catch (error) {
            console.warn('⚠️ Could not access cron jobs:', error.message);
            return [];
        }
    }

    generatePerformanceMetrics(processes) {
        const totalMemory = processes.reduce((sum, p) => sum + (parseFloat(p.memory) || 0), 0);
        const totalCPU = processes.reduce((sum, p) => sum + (parseFloat(p.cpu) || 0), 0);
        const avgUptime = processes.reduce((sum, p) => sum + (parseFloat(p.uptime) || 0), 0) / processes.length;

        this.performanceMetrics = {
            totalMemory: `${(totalMemory / 1024 / 1024).toFixed(2)} MB`,
            totalCPU: `${totalCPU.toFixed(2)}%`,
            avgUptime: `${(avgUptime / 3600).toFixed(2)} hours`,
            processesCount: processes.length,
            duplicatesCount: this.duplicates.length,
            orphansCount: this.orphans.length
        };
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.duplicates.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Remove duplicate PM2 instances',
                details: `Found ${this.duplicates.length} duplicate processes`,
                command: 'pm2 delete ' + this.duplicates.map(d => d.id).join(' ')
            });
        }

        if (this.orphans.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Investigate orphaned processes',
                details: `${this.orphans.length} processes running without cron jobs`,
                command: 'pm2 stop ' + this.orphans.map(o => o.id).join(' ')
            });
        }

        if (this.performanceMetrics.totalCPU > '80%') {
            recommendations.push({
                priority: 'HIGH',
                action: 'Optimize CPU usage',
                details: 'High CPU usage detected',
                command: 'pm2 scale down'
            });
        }

        return recommendations;
    }

    parsePM2Output(output) {
        const lines = output.split('\n');
        const processes = [];
        
        lines.forEach(line => {
            if (line.includes('│')) {
                const columns = line.split('│').map(col => col.trim()).filter(col => col);
                if (columns.length >= 8) {
                    processes.push({
                        id: columns[0],
                        name: columns[1],
                        namespace: columns[2],
                        mode: columns[3],
                        status: columns[4],
                        cpu: columns[5],
                        memory: columns[6],
                        uptime: columns[7],
                        restarts: columns[8] || '0'
                    });
                }
            }
        });

        return processes.filter(p => p.name && p.status);
    }

    async execCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
    }

    async saveReport(auditData) {
        const reportPath = path.join(__dirname, this.auditReport);
        await fs.promises.writeFile(
            reportPath, 
            JSON.stringify(auditData, null, 2)
        );
        console.log(`✅ Audit report saved to: ${reportPath}`);
    }

    async run() {
        try {
            const auditData = await this.auditPM2Processes();
            await this.saveReport(auditData);
            
            console.log('📊 Audit Summary:');
            console.log(`Total Processes: ${auditData.totalProcesses}`);
            console.log(`Duplicates Found: ${auditData.duplicates.length}`);
            console.log(`Orphans Found: ${auditData.orphans.length}`);
            console.log(`Recommendations: ${auditData.recommendations.length}`);
            
            if (auditData.recommendations.length > 0) {
                console.log('\n🔧 Recommendations:');
                auditData.recommendations.forEach((rec, index) => {
                    console.log(`${index + 1}. [${rec.priority}] ${rec.action}`);
                    console.log(`   Details: ${rec.details}`);
                    console.log(`   Command: ${rec.command}\n`);
                });
            }
            
            return auditData;
        } catch (error) {
            console.error('❌ Audit failed:', error);
            throw error;
        }
    }
}

// Export for use as module
module.exports = AutomationAuditor;

// Run directly if called from CLI
if (require.main === module) {
    const auditor = new AutomationAuditor();
    auditor.run()
        .then(() => {
            console.log('✅ PM2 Audit completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ PM2 Audit failed:', error);
            process.exit(1);
        });
}