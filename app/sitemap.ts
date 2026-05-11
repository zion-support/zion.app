import fs from 'node:fs'
import path from 'node:path'
import type { MetadataRoute } from 'next'
import { AI_SERVICE_LINKS } from './constants/navigation'
import { BLOG_SLUGS } from './lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ziontechgroup.com'
  const lastModified = new Date()
  type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

  const findRepoRoot = (startDir: string) => {
    let dir = startDir
    for (let i = 0; i < 20; i++) {
      if (fs.existsSync(path.join(dir, 'package.json'))) return dir
      const parent = path.dirname(dir)
      if (parent === dir) break
      dir = parent
    }
    return startDir
  }

  const normalizePath = (p: string) => {
    if (!p.startsWith('/')) return p
    return p !== '/' ? p.replace(/\/$/, '') : '/'
  }

  const isExcludedPath = (p: string) => {
    if (p === '/404' || p === '/_not-found') return true
    if (p === '/SimpleErrorBoundary') return true
    return false
  }

  const ROOT = findRepoRoot(process.cwd())
  const APP_DIR = path.join(ROOT, 'app')
  const PAGES_DIR = path.join(ROOT, 'pages')

  const walkRoutesFromApp = (dir: string, prefix = ''): string[] => {
    if (!fs.existsSync(dir)) return []
    const out: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // route groups: (group) do not appear in URL path
        if (entry.name.startsWith('(')) {
          out.push(...walkRoutesFromApp(full, prefix))
          continue
        }
        if (entry.name.startsWith('[')) continue
        if (prefix === '' && entry.name === 'api') continue
        out.push(...walkRoutesFromApp(full, `${prefix}/${entry.name}`))
        continue
      }
      if (entry.name !== 'page.tsx' && entry.name !== 'page.js') continue
      const route = normalizePath(prefix || '/')
      if (!isExcludedPath(route)) out.push(route)
    }
    return out
  }

  const walkRoutesFromPages = (dir: string, prefix = ''): string[] => {
    if (!fs.existsSync(dir)) return []
    const out: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'api') continue
        out.push(...walkRoutesFromPages(full, `${prefix}/${entry.name}`))
        continue
      }
      if (!/\.(tsx|ts|js|jsx)$/.test(entry.name)) continue
      if (entry.name.startsWith('_')) continue
      const base = entry.name.replace(/\.(tsx|ts|js|jsx)$/, '')
      if (base.startsWith('[')) continue
      const route = normalizePath(base === 'index' ? prefix || '/' : `${prefix}/${base}`)
      if (!isExcludedPath(route)) out.push(route)
    }
    return out
  }

  const discoveredPaths = Array.from(
    new Set([...walkRoutesFromApp(APP_DIR), ...walkRoutesFromPages(PAGES_DIR)]),
  )

  const blogPostUrls = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const coreRoutes: Array<{
    path: string
    changeFrequency: ChangeFrequency
    priority: number
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/solutions', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/solutions/beauty-wellness', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/legal-professional-services', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/education-training', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/packaging-materials', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/technology-and-saas', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/government-and-public-sector', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/warehousing-3pl', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/asset-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/financial-services', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/insurance', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/healthcare', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/banking-and-capital-markets', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/telecommunications', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/ecommerce-retail', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/manufacturing-industrial', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/logistics-supply-chain', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/media-entertainment', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/real-estate-property', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/agriculture-agritech', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/automotive-mobility', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/energy-utilities', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/renewable-energy-cleantech', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/mining-natural-resources', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/food-beverage', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/veterinary-animal-health', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/home-services-contractors', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/hospitality-travel', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/non-profit-social-impact', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/construction-engineering', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/pharmaceuticals-life-sciences', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/aerospace-defense', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/maritime-shipping', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/oil-gas', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/environmental-waste-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/gaming-esports', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/sports-fitness', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/consumer-goods-cpg', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/transportation-fleet', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/marketing-advertising', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/chemicals-materials', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/electronics-semiconductors', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/space-satellite', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/textiles-apparel', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/accounting-tax-services', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/wholesale-distribution', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/restaurants-food-service', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/staffing-recruiting', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/solutions/facilities-property-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-asset-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-compliance-checker', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-vendor-manager', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-incident-response', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-data-governance', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-customer-success', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-brand-monitor', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-demand-forecasting', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-workflow-orchestrator', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-cost-optimizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-resource-scheduler', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-supply-visibility', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-quality-insights', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-contract-lifecycle', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-procurement-automation', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-field-service-manager', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-sustainability-tracker', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-spend-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-capacity-planner', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-knowledge-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-employee-experience', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-vendor-risk-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-chatbot-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-cyber-threat-intel', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-document-classifier', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-revenue-forecaster', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-workforce-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-inventory-planner', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-expense-tracker', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-project-portfolio', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-talent-acquisition', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-customer-feedback', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-pricing-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-schedule-optimizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-approval-workflow', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-supplier-risk', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-lead-enrichment', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-market-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-incident-predictor', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-conversation-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-customer-360', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-sales-assistant', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-deal-desk', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-fleet-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-route-optimizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-audit-automation', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-log-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-supplier-portal', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-maintenance-scheduler', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-order-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-campaign-optimizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-help-desk-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-deal-pipeline', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-talent-sourcing', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-competitive-intelligence', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-approval-automation', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-claims-automation', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-lease-analyzer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-compliance-reporting', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-legal-research', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-incident-management', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-backup-optimizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-intent-classifier', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-feedback-summarizer', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-contact-center-analytics', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-quote-generator', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/zion-ai-territory-planner', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/products', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/ai-services', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/ai-services/generative-ai-enterprise', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-agents-autonomous', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-model-orchestration', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-copilot-enterprise', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-multimodal-intelligence', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-rag-knowledge-systems', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-governance-trust', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-observability-mlops', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-strategy-roadmap', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/ai-services/ai-integration-apis', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/case-studies', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/community', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/innovation-bundles', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/industries', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/careers', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/press', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/partners', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/consultation', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/search', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/site-map', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/micro-saas-services', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/automation', changeFrequency: 'monthly', priority: 0.65 },
  ]

  const featuredCatalogPaths = [
    '/zion-ai-marketing-automation',
    '/zion-ai-social-media-manager',
    '/zion-ai-sales-predictor',
    '/zion-performance-monitor',
    '/zion-data-sync',
    '/zion-ai-translation-service',
    '/zion-ai-video-generator',
    '/zion-ai-onboarding-pro',
    '/zion-ai-pricing-optimizer',
    '/zion-ai-accessibility-checker',
    '/zion-ai-notification-hub',
    '/zion-ai-talent-analytics',
    '/zion-ai-sentiment-analyzer',
  ] as const
  const featuredAppPaths = Array.from(
    new Set([...AI_SERVICE_LINKS.map((service) => service.href), ...featuredCatalogPaths]),
  )

  const coreByPath = new Map(
    coreRoutes.map((r) => [normalizePath(r.path), { changeFrequency: r.changeFrequency, priority: r.priority }]),
  )

  const classify = (p: string): { changeFrequency: ChangeFrequency; priority: number } => {
    const normalized = normalizePath(p)
    const core = coreByPath.get(normalized)
    if (core) return core
    if (normalized === '/') return { changeFrequency: 'weekly', priority: 1.0 }
    if (normalized === '/solutions' || normalized === '/services' || normalized === '/ai-services') {
      return { changeFrequency: 'weekly', priority: 0.95 }
    }
    if (normalized === '/blog' || normalized.startsWith('/blog/')) return { changeFrequency: 'weekly', priority: 0.75 }
    if (normalized.startsWith('/case-studies')) return { changeFrequency: 'monthly', priority: 0.7 }
    if (normalized.startsWith('/ai-lab')) return { changeFrequency: 'weekly', priority: 0.75 }
    if (normalized.startsWith('/ai-services/')) return { changeFrequency: 'monthly', priority: 0.8 }
    if (normalized.startsWith('/solutions/')) return { changeFrequency: 'monthly', priority: 0.8 }
    return { changeFrequency: 'monthly', priority: 0.65 }
  }

  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>()

  const upsertPath = (
    p: string,
    override?: Partial<Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'>>,
  ) => {
    const normalized = normalizePath(p)
    if (!normalized.startsWith('/')) return
    if (isExcludedPath(normalized)) return
    const { changeFrequency, priority } = classify(normalized)
    const url = `${baseUrl}${normalized === '/' ? '' : normalized}`
    urlMap.set(url, {
      url,
      lastModified,
      changeFrequency: override?.changeFrequency ?? changeFrequency,
      priority: override?.priority ?? priority,
    })
  }

  for (const r of coreRoutes) {
    upsertPath(r.path, { changeFrequency: r.changeFrequency, priority: r.priority })
  }
  for (const p of discoveredPaths) upsertPath(p)

  for (const entry of blogPostUrls) urlMap.set(entry.url, entry)
  for (const p of featuredAppPaths) upsertPath(p, { changeFrequency: 'weekly', priority: 0.7 })

  return Array.from(urlMap.values()).sort((a, b) => a.url.localeCompare(b.url))
}