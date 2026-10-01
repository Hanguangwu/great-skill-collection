// @ts-check
/**
 * Scan every SKILL.md under public/skill-hub and emit:
 *   - src/data/skillsIndex.ts        (metadata only, no body)
 *   - src/data/skill-bodies/<id>.md   (one raw Markdown file per skill)
 *
 * Keeping the bodies out of the TS module keeps them out of the main bundle:
 * SkillDetailPage fetches a single body on demand.
 *
 * Usage: node scripts/generate-skills.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import matter from 'gray-matter'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const hubDir = path.join(rootDir, 'public', 'skill-hub')
const dataDir = path.join(rootDir, 'src', 'data')
const indexFile = path.join(dataDir, 'skillsIndex.ts')
const bodiesDir = path.join(dataDir, 'skill-bodies')

/** top-level directory -> site category */
const CATEGORY_BY_DIR = {
  engineering: 'coding',
  business: 'life',
  fintech: 'creative',
  academic: 'research',
  study: 'research',
  thoughts: 'research',
  'meta-wisdom': 'research',
  design: 'creative',
  writing: 'creative',
  productivity: 'life',
}

const CATEGORIES = ['coding', 'research', 'creative', 'life']

const DATE_KEYS = ['date', 'updated', 'updatedAt']

/** 'engineering/code-review' -> 'engineering-code-review' */
function kebab(relativeDir) {
  return relativeDir
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .filter(Boolean)
    .join('-')
}

/** '2025/1/5' | '2025-01-05' | ISO datetime -> 'YYYY-MM-DD', else null */
function toIsoDate(value) {
  if (value == null) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10)
  }

  if (typeof value === 'number') {
    const fromNumber = new Date(value)
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber.toISOString().slice(0, 10)
  }

  if (typeof value !== 'string') return null

  const raw = value.trim()
  if (!raw) return null

  const plain = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(raw)
  if (plain) {
    const [, year, month, day] = plain
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10)
}

function pickDate(data) {
  for (const key of DATE_KEYS) {
    const iso = toIsoDate(data[key])
    if (iso) return iso
  }
  return null
}

function pickCategory(dir, data) {
  const mapped = CATEGORY_BY_DIR[dir.toLowerCase()]
  if (mapped) return mapped

  const fromFrontmatter =
    typeof data.category === 'string' ? data.category.trim().toLowerCase() : ''
  if (CATEGORIES.includes(fromFrontmatter)) return fromFrontmatter

  return 'coding'
}

function pickName(data, folderName, relativeDir) {
  const raw = typeof data.name === 'string' ? data.name.trim() : ''
  if (raw) return raw
  return folderName || kebab(relativeDir) || 'Untitled Skill'
}

function pickDescription(data, name) {
  const raw = typeof data.description === 'string' ? data.description : ''
  const collapsed = raw.replace(/\s+/g, ' ').trim()
  if (collapsed) return collapsed
  return `${name} — imported from the skill hub.`
}

function pickTags(data) {
  const raw = data.tags
  if (!Array.isArray(raw)) return []
  return raw.map((tag) => String(tag).trim()).filter(Boolean)
}

function serialize(value) {
  return JSON.stringify(value)
}

const today = new Date().toISOString().slice(0, 10)

const files = await fg('**/SKILL.md', {
  cwd: hubDir,
  onlyFiles: true,
  dot: false,
  ignore: ['**/node_modules/**'],
})

files.sort((a, b) => a.localeCompare(b))

const skills = []
const failures = []

for (const relativeFile of files) {
  const absoluteFile = path.join(hubDir, relativeFile)
  const relativeDir = path.dirname(relativeFile).split(path.sep).join('/')

  try {
    const raw = fs.readFileSync(absoluteFile, 'utf8')
    const parsed = matter(raw)
    const data = parsed.data ?? {}

    const id = kebab(relativeDir) || kebab(path.basename(relativeFile, '.md'))
    const name = pickName(data, path.basename(relativeDir), relativeDir)

    skills.push({
      id,
      sourcePath: path.relative(rootDir, path.dirname(absoluteFile)).split(path.sep).join('/'),
      name,
      description: pickDescription(data, name),
      author: 'Qingyang',
      version: '1.0.0',
      tags: pickTags(data),
      category: pickCategory(relativeDir.split('/')[0] ?? '', data),
      license: 'MIT',
      updatedAt: pickDate(data) ?? today,
      body: String(parsed.content ?? '').trim(),
      popular: false,
      featured: false,
      compatibility: { claudeCode: false, codex: false, kimiCode: false },
      changelog: [],
      icon: '🌱',
    })
  } catch (error) {
    failures.push({
      file: relativeFile,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

// --- drop stale bodies from a previous run (ids may disappear upstream) ---
if (fs.existsSync(bodiesDir)) {
  const keep = new Set(skills.map((skill) => `${skill.id}.md`))
  for (const name of fs.readdirSync(bodiesDir)) {
    if (name.endsWith('.md') && !keep.has(name)) {
      fs.rmSync(path.join(bodiesDir, name), { force: true })
    }
  }
}

fs.mkdirSync(bodiesDir, { recursive: true })

const writtenBodies = []

for (const skill of skills) {
  // raw Markdown, byte-for-byte: no template literals, no escaping
  const bodyFile = path.join(bodiesDir, `${skill.id}.md`)
  fs.writeFileSync(bodyFile, skill.body, 'utf8')
  writtenBodies.push(`${skill.id}.md`)
}

const entries = skills
  .map(
    (skill) => `  {
    id: ${serialize(skill.id)},
    sourcePath: ${serialize(skill.sourcePath)},
    name: ${serialize(skill.name)},
    description: ${serialize(skill.description)},
    author: ${serialize(skill.author)},
    version: ${serialize(skill.version)},
    tags: ${serialize(skill.tags)},
    category: ${serialize(skill.category)},
    license: ${serialize(skill.license)},
    updatedAt: ${serialize(skill.updatedAt)},
    popular: ${skill.popular},
    featured: ${skill.featured},
    compatibility: ${serialize(skill.compatibility)},
    changelog: ${serialize(skill.changelog)},
    icon: ${serialize(skill.icon)},
  },`,
  )
  .join('\n')

const output = `// AUTO-GENERATED by scripts/generate-skills.mjs — do not edit by hand.
// Run \`node scripts/generate-skills.mjs\` to regenerate from public/skill-hub.
// Skill bodies live next door in ./skill-bodies/<id>.md and are loaded on demand.

import type { SkillSummary } from '@/types/skill'

export const skillsIndex: SkillSummary[] = ([
${entries}
] as SkillSummary[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
`

fs.mkdirSync(path.dirname(indexFile), { recursive: true })
fs.writeFileSync(indexFile, output, 'utf8')

// --- summary: bodies now match SKILL.md content exactly ---
const indexSize = fs.statSync(indexFile).size
const bodyBytes = writtenBodies.reduce(
  (total, name) => total + fs.statSync(path.join(bodiesDir, name)).size,
  0,
)

console.log(`scanned files : ${files.length}`)
console.log(`index entries : ${skills.length}`)
console.log(`body files    : ${writtenBodies.length} (${bodiesDir.replace(rootDir, '.')})`)
console.log(`failed        : ${failures.length}`)
console.log(`written       : ${path.relative(rootDir, indexFile).split(path.sep).join('/')}`)
console.log(`index size    : ${(indexSize / 1024).toFixed(1)} kB`)
console.log(`body bytes    : ${(bodyBytes / 1024).toFixed(1)} kB`)
console.log(`first 5 ids   : ${skills.slice(0, 5).map((skill) => skill.id).join(', ')}`)

if (failures.length > 0) {
  console.log('\nparse failures:')
  for (const failure of failures) console.log(`  - ${failure.file}: ${failure.message}`)
}

const byCategory = skills.reduce((acc, skill) => {
  acc[skill.category] = (acc[skill.category] ?? 0) + 1
  return acc
}, {})
console.log(`by category   : ${JSON.stringify(byCategory)}`)
