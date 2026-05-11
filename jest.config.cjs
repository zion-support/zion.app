const fs = require('fs')
const path = require('path')
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

function quarantinePatterns() {
  if (process.env.JEST_INCLUDE_QUARANTINED === '1' || process.env.JEST_INCLUDE_QUARANTINED === 'true') {
    return []
  }
  try {
    const p = path.join(__dirname, 'config', 'jest-quarantine.json')
    if (!fs.existsSync(p)) return []
    const j = JSON.parse(fs.readFileSync(p, 'utf8'))
    const list = Array.isArray(j.paths) ? j.paths : []
    return list
      .filter((x) => typeof x === 'string' && x.trim())
      .map((rel) => path.join('<rootDir>', rel.replace(/^\//, '')))
  } catch {
    return []
  }
}

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', ...quarantinePatterns()],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)