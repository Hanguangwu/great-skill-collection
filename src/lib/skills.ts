import { skillsIndex } from '@/data/skillsIndex'
import { mockSkills } from '@/data/mockSkills'
import * as site from '@/config/site'
import type { SiteMeta, SkillSummary } from '@/types/skill'

export type { Skill, SkillSummary, SkillCategory, SkillChangelogEntry, SiteMeta } from '@/types/skill'
export { skillsIndex, mockSkills }

/**
 * Links and identity come from `@/config/site` (which reads `.env`), so the
 * repository URL is defined exactly once for the whole app.
 */
export const siteMeta: SiteMeta = {
  owner: site.owner,
  repoUrl: site.repoUrl,
  siteTitle: site.siteTitle,
  siteSubtitle: site.siteSubtitle,
  tagline: site.tagline,
  lastUpdated: new Date().toISOString().slice(0, 10),
}

export { site }

/**
 * Skill bodies are shipped as individual raw Markdown files and pulled in on
 * demand, so they never land in the main bundle. The glob path has to be
 * relative to this module: `@/` alias resolution in import.meta.glob is not
 * reliable across bundlers.
 */
const bodyLoaders = import.meta.glob<false, '?raw', string>('../data/skill-bodies/*.md', {
  query: '?raw',
  import: 'default',
})

/** mock data carries its bodies inline, so keep them reachable as a last resort */
const inlineBodies = new Map(mockSkills.map((skill) => [skill.id, skill.body ?? '']))

/** Fetch one skill's Markdown body. Resolves to `undefined` if it has none. */
export async function loadSkillBody(id: string): Promise<string | undefined> {
  const loader = bodyLoaders[`../data/skill-bodies/${id}.md`]
  if (loader) return await loader()
  return inlineBodies.get(id)
}

/** Metadata source: generated index, falling back to mock data without bodies. */
const source: SkillSummary[] =
  skillsIndex.length > 0
    ? skillsIndex
    : mockSkills.map(({ body: _body, ...rest }) => rest as SkillSummary)

/** Look up a single skill by its URL slug. */
export function getSkillById(id: string): SkillSummary | undefined {
  return source.find((skill) => skill.id === id)
}

/** All skill metadata, newest first. */
export function getAllSkills(): SkillSummary[] {
  return [...source].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

/**
 * Case-insensitive match across name, description, tags and author.
 * `category` of `'all'` disables category filtering.
 */
export function searchSkills(
  skills: SkillSummary[],
  query: string,
  category: SkillSummary['category'] | 'all',
): SkillSummary[] {
  const q = query.trim().toLowerCase()

  return skills.filter((skill) => {
    if (category !== 'all' && skill.category !== category) return false
    if (!q) return true

    const haystack = [skill.name, skill.description, skill.author, ...skill.tags]
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
}

/** Unique categories present in the given skills, in canonical order. */
export function getCategories(
  skills: SkillSummary[] = getAllSkills(),
): SkillSummary['category'][] {
  const order: SkillSummary['category'][] = ['coding', 'research', 'creative', 'life']
  const present = new Set(skills.map((skill) => skill.category))

  return order.filter((category) => present.has(category))
}

/** `'2026-03-04'` -> `'Mar 4, 2026'`. Invalid input is returned untouched. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Count of skills per category; categories with no skills are present as `0`. */
export function countByCategory(
  skills: SkillSummary[] = getAllSkills(),
): Record<SkillSummary['category'], number> {
  const counts: Record<SkillSummary['category'], number> = {
    coding: 0,
    research: 0,
    creative: 0,
    life: 0,
  }

  for (const skill of skills) {
    counts[skill.category] += 1
  }

  return counts
}
