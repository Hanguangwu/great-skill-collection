import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDate } from '@/lib/skills'
import { cardVariants } from './motion'
import { TagBadge } from './TagBadge'
import type { Skill } from '@/types/skill'

type SkillCardProps = {
  skill: Skill
}

/** 🪪 a resident plaque + a museum collection card */
export function SkillCard({ skill }: SkillCardProps) {
  const reduced = useReducedMotion()
  const tags = skill.tags.slice(0, 3)
  const overflow = skill.tags.length - tags.length

  return (
    <motion.div
      variants={cardVariants}
      whileHover={reduced ? undefined : { y: -4, rotate: -0.35 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="h-full"
    >
      <Link
        to={`/skill/${skill.id}`}
        className="group flex h-full flex-col rounded-card border-2 border-sand-300 bg-sand-100 p-5 shadow-soft transition-[box-shadow,border-color] duration-200 hover:border-wood-400 hover:shadow-pop"
      >
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-sand-300 bg-sand-50 text-2xl shadow-soft transition-transform duration-200 group-hover:-rotate-6"
          >
            {skill.icon}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg leading-tight text-ink-900">{skill.name}</h3>
            <p className="mt-0.5 truncate text-xs font-semibold text-ink-500">
              👤 {skill.author}
            </p>
          </div>

          {skill.popular ? (
            <span className="stamp shrink-0 px-2 py-0.5 text-[11px] font-bold text-coral-500">
              ⭐ Popular
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-700">
          {skill.description}
        </p>

        <div className="my-4 border-t-2 border-dashed border-sand-300" />

        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
          {overflow > 0 ? (
            <span className="rounded-full bg-sand-200 px-2 py-0.5 text-xs font-bold text-ink-500">
              +{overflow}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-500">
            <span className="stamp px-2 py-0.5 text-ink-700">v{skill.version}</span>
            <span>🕒 {formatDate(skill.updatedAt)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-leaf-700 transition-transform duration-200 group-hover:translate-x-1">
            🌱 Visit Skill
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
