export type SkillCategory = 'coding' | 'research' | 'creative' | 'life'

export interface SkillChangelogEntry {
  version: string
  date: string
  note: string
}

export interface Skill {
  /** slug used in the URL, e.g. 'react-ui-builder' */
  id: string
  /** folder path relative to the repo root, e.g. 'public/skill-hub/engineering/code-review' */
  sourcePath?: string
  name: string
  /** 1-2 sentences, used on cards */
  description: string
  author: string
  version: string
  tags: string[]
  category: SkillCategory
  license: string
  /** ISO date string */
  updatedAt: string
  /** full SKILL.md body in Markdown, NO frontmatter; loaded on demand for generated skills */
  body?: string
  popular?: boolean
  featured?: boolean
  compatibility?: { claudeCode: boolean; codex: boolean; kimiCode: boolean }
  changelog?: SkillChangelogEntry[]
  /** single emoji per skill, e.g. '🌱' */
  icon: string
}

/** Metadata-only view of a skill: everything except the Markdown body. */
export type SkillSummary = Omit<Skill, 'body'>

export interface SiteMeta {
  owner: string
  repoUrl: string
  siteTitle: string
  siteSubtitle: string
  tagline: string
  /** ISO date */
  lastUpdated: string
}
