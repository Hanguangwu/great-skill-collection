import { Link } from 'react-router-dom'
import { CATEGORY_META } from './categoryMeta'
import type { SkillCategory } from '@/types/skill'

type TagBadgeProps = {
  children: string
  tone?: 'sand' | 'leaf'
  linked?: boolean
}

/** 🏷 tag pill. `linked` turns it into a /skills?tag= shortcut. */
export function TagBadge({ children, tone = 'sand', linked = false }: TagBadgeProps) {
  const base =
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 transition-colors duration-200'
  const skin =
    tone === 'leaf'
      ? 'border-leaf-500/50 bg-leaf-300/25 text-leaf-700'
      : 'border-sand-300 bg-sand-50 text-ink-700'

  if (!linked) {
    return <span className={`${base} ${skin}`}>🏷 {children}</span>
  }

  return (
    <Link
      to={`/skills?tag=${encodeURIComponent(children)}`}
      className={`${base} ${skin} hover:-translate-y-0.5 hover:border-ink-500/40 hover:text-ink-900`}
    >
      🏷 {children}
    </Link>
  )
}

type CategoryBadgeProps = {
  category: SkillCategory
  compact?: boolean
}

/** island badge used on cards + detail header */
export function CategoryBadge({ category, compact = false }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category]
  return (
    <Link
      to={`/skills?category=${category}`}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5 ${meta.chip}`}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      <span>{compact ? meta.zh : `${meta.zh} · ${meta.label}`}</span>
    </Link>
  )
}
