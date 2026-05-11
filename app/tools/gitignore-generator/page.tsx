'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Plus, Minus, Search, GitBranch, RotateCcw } from 'lucide-react';

type Template = {
  name: string;
  category: string;
  icon: string;
  description: string;
  content: string;
};

const TEMPLATES: Template[] = [
  {
    name: 'Node.js',
    category: 'Language',
    icon: '🟢',
    description: 'Node.js / npm / yarn projects',
    content: `# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage and testing
coverage/
.nyc_output/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Misc
*.tgz
.cache/
`,
  },
  {
    name: 'Python',
    category: 'Language',
    icon: '🐍',
    description: 'Python / pip / conda projects',
    content: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Distribution / packaging
build/
dist/
*.egg-info/
*.egg
.eggs/

# Virtual environments
venv/
env/
.venv/
.env/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Jupyter Notebook
.ipynb_checkpoints/

# pytest / coverage
.pytest_cache/
.coverage
htmlcov/

# mypy
.mypy_cache/

# dotenv
.env
.env.local

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'Java',
    category: 'Language',
    icon: '☕',
    description: 'Java / Maven / Gradle projects',
    content: `# Compiled class files
*.class

# Package files
*.jar
*.war
*.ear

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties

# Gradle
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar

# IDE
.idea/
*.iml
.vscode/
.settings/
.project
.classpath
.factorypath
*.launch
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`,
  },
  {
    name: 'Go',
    category: 'Language',
    icon: '🔵',
    description: 'Go modules and projects',
    content: `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Build output
/bin/
/dist/

# Test binary
*.test

# Coverage
*.out
*.prof
coverage.html

# Dependency directories
vendor/

# Go workspace
go.work.sum

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
`,
  },
  {
    name: 'Rust',
    category: 'Language',
    icon: '🦀',
    description: 'Rust / Cargo projects',
    content: `# Build output
/target/

# Cargo.lock for libraries (uncomment if publishing a library)
# Cargo.lock

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Coverage
tarpaulin-report.html
lcov.info

# Environment
.env
.env.local
`,
  },
  {
    name: 'React (Vite)',
    category: 'Framework',
    icon: '⚛️',
    description: 'React with Vite build tool',
    content: `# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local
.env.*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'Next.js',
    category: 'Framework',
    icon: '▲',
    description: 'Next.js / React framework',
    content: `# Dependencies
node_modules/

# Build output
.next/
out/

# Production
build/

# Environment variables
.env
.env.local
.env.*.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
`,
  },
  {
    name: 'Vue.js',
    category: 'Framework',
    icon: '💚',
    description: 'Vue.js / Nuxt projects',
    content: `# Dependencies
node_modules/

# Build output
dist/
.output/
.nuxt/
.nitro/

# Environment variables
.env
.env.local
.env.*.local

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'Django',
    category: 'Framework',
    icon: '🎸',
    description: 'Django Python web framework',
    content: `# Python
__pycache__/
*.py[cod]
*$py.class

# Virtual environment
venv/
env/

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Static files (if collected)
staticfiles/

# migrations (uncomment to ignore auto-generated migrations)
# */migrations/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
`,
  },
  {
    name: 'Ruby on Rails',
    category: 'Framework',
    icon: '💎',
    description: 'Ruby on Rails projects',
    content: `# Ruby
*.gem
*.rbc
.bundle
.yarn-integrity
vendor/bundle/

# Rails
db/*.sqlite3
db/*.sqlite3-journal
/log/*
/tmp/
!/log/.keep
!/tmp/.keep

# Asset cache
public/assets/
.byebug_history

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Coverage
coverage/
`,
  },
  {
    name: 'Docker',
    category: 'DevOps',
    icon: '🐳',
    description: 'Docker / containerized projects',
    content: `# Docker
docker-compose.override.yml

# Volumes
data/
volumes/

# Build context
*.tar

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'Terraform',
    category: 'DevOps',
    icon: '🏗️',
    description: 'Terraform / IaC projects',
    content: `# Terraform
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log

# Sensitive variables
*.auto.tfvars
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'C / C++',
    category: 'Language',
    icon: '⚡',
    description: 'C, C++, and CMake projects',
    content: `# Compiled object files
*.o
*.obj
*.d

# Libraries
*.a
*.so
*.dylib
*.dll

# Executables
*.exe
*.out
*.app

# Precompiled headers
*.gch
*.pch

# CMake
build/
CMakeFiles/
CMakeCache.txt
cmake_install.cmake
Makefile

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    name: 'Swift / iOS',
    category: 'Language',
    icon: '🍎',
    description: 'Swift, iOS, and Xcode projects',
    content: `# Xcode
build/
DerivedData/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
*.xcuserstate
*.xcscmblueprint

# CocoaPods
Pods/

# Carthage
Carthage/Build/

# Swift Package Manager
.build/
.swiftpm/

# IDE
.idea/

# OS
.DS_Store
`,
  },
  {
    name: 'VS Code',
    category: 'IDE',
    icon: '💙',
    description: 'Visual Studio Code settings',
    content: `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Local History
.history/
`,
  },
  {
    name: 'macOS',
    category: 'OS',
    icon: '🍎',
    description: 'macOS system files',
    content: `# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon?

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotbackup

# Directories potentially created on remote AFP share
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
`,
  },
  {
    name: 'Windows',
    category: 'OS',
    icon: '🪟',
    description: 'Windows system files',
    content: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db

# Folder config file
Desktop.ini

# Recycle bin used on file shares
$RECYCLE.BIN/

# Windows Installer files
*.cab
*.msi
*.msix
*.msm
*.msp

# Windows shortcuts
*.lnk
`,
  },
  {
    name: 'Linux',
    category: 'OS',
    icon: '🐧',
    description: 'Linux system files',
    content: `# Linux
*~

# KDE directory preferences
.directory

# Linux trash folder which might appear on any partition or disk
.Trash-*

# .nfs files are created when an open file is unintentionally deleted
.nfs*
`,
  },
];

const CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Language');

  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return TEMPLATES;
    const q = search.toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Template[]> = {};
    for (const t of filteredTemplates) {
      (groups[t.category] ??= []).push(t);
    }
    return groups;
  }, [filteredTemplates]);

  const toggleTemplate = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const generatedContent = useMemo(() => {
    const parts: string[] = [];
    for (const t of TEMPLATES) {
      if (selected.has(t.name)) {
        parts.push(`# === ${t.name} ===\n${t.content.trim()}`);
      }
    }
    if (custom.trim()) {
      parts.push(`# === Custom Rules ===\n${custom.trim()}`);
    }
    return parts.join('\n\n') + '\n';
  }, [selected, custom]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.gitignore';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setSelected(new Set());
    setCustom('');
  };

  const selectPopular = () => {
    const popular = ['Node.js', 'macOS', 'Windows', 'Linux', 'VS Code'];
    setSelected(new Set(popular));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">.gitignore Generator</h1>
              <p className="text-gray-600">
                Generate .gitignore files for {TEMPLATES.length} languages, frameworks, and tools.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Template selector */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={selectPopular}
                  className="px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition whitespace-nowrap"
                >
                  + Popular
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {CATEGORIES.filter((cat) => grouped[cat]?.length).map((category) => (
                  <div key={category} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() =>
                        setExpandedCategory(expandedCategory === category ? null : category)
                      }
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-800 bg-gray-50/80 hover:bg-gray-100 transition"
                    >
                      <span>{category}</span>
                      <span className="text-xs text-gray-400">
                        {grouped[category]?.length ?? 0} templates
                      </span>
                    </button>
                    {expandedCategory === category && (
                      <div className="divide-y divide-gray-50">
                        {grouped[category]?.map((template) => (
                          <button
                            key={template.name}
                            onClick={() => toggleTemplate(template.name)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                              selected.has(template.name)
                                ? 'bg-orange-50 hover:bg-orange-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                selected.has(template.name)
                                  ? 'bg-orange-500 border-orange-500 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selected.has(template.name) && (
                                <span className="text-xs">✓</span>
                              )}
                            </span>
                            <span className="text-lg">{template.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{template.name}</p>
                              <p className="text-xs text-gray-500 truncate">{template.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selected.size > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[...selected].map((name) => {
                    const t = TEMPLATES.find((t) => t.name === name);
                    return (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                      >
                        {t?.icon} {name}
                        <button
                          onClick={() => toggleTemplate(name)}
                          className="ml-0.5 text-orange-600 hover:text-orange-900"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-3">
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Rules{' '}
                <span className="font-normal text-gray-500">(add your own patterns)</span>
              </label>
              <textarea
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={`# My custom rules\n*.secret\ndata/cache/\n!important.config`}
                className="w-full h-24 p-3 font-mono text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Generated .gitignore{' '}
                {selected.size > 0 && (
                  <span className="font-normal text-gray-500">
                    ({selected.size} template{selected.size !== 1 ? 's' : ''})
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!generatedContent.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!generatedContent.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .gitignore
                </button>
              </div>
            </div>
            <textarea
              value={generatedContent}
              readOnly
              placeholder="Select templates on the left to generate your .gitignore file..."
              className="w-full h-[32rem] p-4 font-mono text-sm border border-gray-200 rounded-xl bg-gray-50 resize-y"
              spellCheck={false}
            />

            {/* Stats */}
            {generatedContent.trim() && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  Lines: <strong>{generatedContent.split('\n').length}</strong>
                </span>
                <span>
                  Size: <strong>{generatedContent.length}</strong> bytes
                </span>
                <span>
                  Patterns: <strong>{generatedContent.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About .gitignore</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What is .gitignore?</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Tells Git which files and folders to ignore</li>
                <li>Prevents committing build artifacts, secrets, and OS files</li>
                <li>Can be placed in any directory of your repo</li>
                <li>Supports glob patterns: <code className="text-xs bg-gray-100 px-1 rounded">*.log</code>, <code className="text-xs bg-gray-100 px-1 rounded">node_modules/</code></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use <code className="text-xs bg-gray-100 px-1 rounded">!</code> to negate a pattern (un-ignore)</li>
                <li>Add <code className="text-xs bg-gray-100 px-1 rounded">.gitignore</code> to your global Git config for all repos</li>
                <li>Combine templates for monorepos (e.g., Node.js + Python + Docker)</li>
                <li>100% client-side — nothing is sent to any server</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
