'use server';

import { allServices } from '../data/servicesData';
import type { Service } from '../data/servicesData';

/**
 * Recommends services based on budget range and business needs.
 * Uses keyword matching, category weighting, and budget-fit scoring.
 */
export function recommendServices(params: {
  budget: string;
  needs: string[];
  excludeIds?: string[];
}): Service[] {
  const { budget, needs, excludeIds = [] } = params;

  // Budget tier mapping for scoring
  const budgetTiers: Record<string, { min: number; max: number; weight: number }> = {
    'Under $1,000': { min: 0, max: 1000, weight: 1 },
    '$1,000–$5,000': { min: 1000, max: 5000, weight: 1 },
    '$5,000–$20,000': { min: 5000, max: 20000, weight: 1 },
    '$20,000–$100,000': { min: 20000, max: 100000, weight: 1 },
    'Over $100,000': { min: 100000, max: Infinity, weight: 1 },
  };

  const budgetTier = budgetTiers[budget] || { min: 0, max: Infinity, weight: 1 };

  // Normalize needs for matching
  const normalizedNeeds = needs.map((n) => n.toLowerCase().split(' '));

  // Score each service
  const scored = allServices
    .filter((s) => !excludeIds.includes(s.id))
    .map((service) => {
      let score = 0;

      // Keyword matching: check if any need keyword appears in service description, title, or features
      for (const needWords of normalizedNeeds) {
        const searchText = `${service.title} ${service.description} ${service.features.join(' ')} ${service.category}`.toLowerCase();
        for (const word of needWords) {
          if (word.length > 3 && searchText.includes(word)) {
            score += 10;
          }
        }
      }

      // Category bonus based on needs
      const needCategories = needs.map((n) => n.toLowerCase());
      if (needCategories.some((n) => service.category === 'ai' && (n.includes('automate') || n.includes('intelligence') || n.includes('analytics')))) {
        score += 5;
      }
      if (needCategories.some((n) => service.category === 'it' && (n.includes('security') || n.includes('infrastructure') || n.includes('scale')))) {
        score += 5;
      }
      if (needCategories.some((n) => service.category === 'automation' && (n.includes('software') || n.includes('cloud') || n.includes('manage') || n.includes('team')))) {
        score += 5;
      }

      // Budget fit scoring (prefer services with lower price tiers matching budget)
      const priceKeys = Object.keys(service.pricing);
      if (priceKeys.length > 0) {
        const lowestPrice = extractPrice(service.pricing[priceKeys[0] as keyof typeof service.pricing] ?? '0');
        const highestPrice = extractPrice(service.pricing[priceKeys[priceKeys.length - 1] as keyof typeof service.pricing] ?? '0');
        if (lowestPrice <= budgetTier.max && lowestPrice >= budgetTier.min) {
          score += 15; // Perfect budget fit
        } else if (lowestPrice <= budgetTier.max * 2) {
          score += 5; // Within range
        } else if (lowestPrice > budgetTier.max * 2) {
          score -= 10; // Over budget
        }
      }

      // Description length bonus (more detailed = higher quality listing)
      if (service.description.length > 100) score += 2;
      if (service.features.length >= 6) score += 3;

      return { service, score };
    });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Diversify: ensure we pick from different categories when possible
  const selected: Service[] = [];
  const categories = new Set<string>();
  const subcategories = new Set<string>();

  for (const item of scored) {
    if (selected.length >= 8) break;
    const diversityBonus = !categories.has(item.service.category) ? 3 : (!subcategories.has(item.service.category) ? 1 : 0);
    if (diversityBonus > 0 || selected.length < 4) {
      selected.push(item.service);
      categories.add(item.service.category);
      subcategories.add(item.service.category);
    }
  }

  // Fill remaining slots from top scored if needed
  if (selected.length < 8) {
    for (const item of scored) {
      if (selected.length >= 8) break;
      if (!selected.find((s) => s.id === item.service.id)) {
        selected.push(item.service);
      }
    }
  }

  return selected;
}

/** Helper to extract numeric price from string like "$999/mo" */
function extractPrice(priceStr: unknown): number {
  if (typeof priceStr !== 'string') return 0;
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function parsePrice(priceStr: string): number {
  return extractPrice(priceStr);
}

/**
 * Quick recommendation — returns just titles and IDs for lightweight use.
 */
export function quickRecommendKeys(budget: string, needs: string[]): { id: string; title: string; category: string }[] {
  const results = recommendServices({ budget, needs });
  return results.map((s) => ({ id: s.id, title: s.title, category: s.category }));
}

/**
 * Get all services by category.
 */
export function getServicesByCategory(category: string): Service[] {
  return allServices.filter((s) => s.category === category);
}

/**
 * Search services by keyword.
 */
export function searchServices(query: string): Service[] {
  const q = query.toLowerCase();
  return allServices.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.features.some((f) => f.toLowerCase().includes(q))
  );
}

/**
 * Get service pricing summary across all tiers.
 */
export function getPricingSummary(services: Service[]): {
  totalLowest: number;
  totalHighest: number;
  averagePerService: number;
  currency: number;
} {
  let totalLowest = 0;
  let totalHighest = 0;

  for (const s of services) {
    const priceKeys = Object.keys(s.pricing);
    const low = parsePrice(s.pricing[priceKeys[0] as keyof typeof s.pricing] ?? '0');
    const high = parsePrice(s.pricing[priceKeys[priceKeys.length - 1] as keyof typeof s.pricing] ?? '0');
    totalLowest += low;
    totalHighest += high;
  }

  return {
    totalLowest,
    totalHighest,
    averagePerService: totalLowest / (services.length || 1),
    currency: 1, // USD
  };
}