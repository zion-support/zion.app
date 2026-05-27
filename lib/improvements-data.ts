import fs from 'fs';
import path from 'path';

export interface ImprovementEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planned';
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  technologies: string[];
  links?: {
    github?: string;
    demo?: string;
    documentation?: string;
  };
}

export function getRecentImprovements(limit: number = 10): ImprovementEntry[] {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'improvements.json'
    );
    
    if (!fs.existsSync(reportPath)) {
      return [];
    }
    
    const allImprovements = JSON.parse(fs.readFileSync(reportPath, 'utf8')) as ImprovementEntry[];
    return allImprovements
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function getAllImprovements(): ImprovementEntry[] {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'improvements.json'
    );
    
    if (!fs.existsSync(reportPath)) {
      return [];
    }
    
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as ImprovementEntry[];
  } catch {
    return [];
  }
}

export function addImprovement(improvement: Omit<ImprovementEntry, 'id' | 'timestamp'>): ImprovementEntry {
  const newImprovement: ImprovementEntry = {
    ...improvement,
    id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'improvements.json'
    );
    
    let existingImprovements: ImprovementEntry[] = [];
    if (fs.existsSync(reportPath)) {
      existingImprovements = JSON.parse(fs.readFileSync(reportPath, 'utf8')) as ImprovementEntry[];
    }
    
    existingImprovements.unshift(newImprovement);
    
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(existingImprovements, null, 2));
    
    return newImprovement;
  } catch (error) {
    console.error('Failed to save improvement:', error);
    throw error;
  }
}

export function getImprovementStats() {
  const improvements = getAllImprovements();
  const byStatus = improvements.reduce((acc, imp) => {
    acc[imp.status] = (acc[imp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byCategory = improvements.reduce((acc, imp) => {
    acc[imp.category] = (acc[imp.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byImpact = improvements.reduce((acc, imp) => {
    acc[imp.impact] = (acc[imp.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: improvements.length,
    byStatus,
    byCategory,
    byImpact,
    recent: improvements.slice(0, 5),
  };
}