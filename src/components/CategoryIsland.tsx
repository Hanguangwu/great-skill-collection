import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORY_META } from './categoryMeta'
import { cardVariants } from './motion'
import type { SkillCategory } from '@/types/skill'

type CategoryIslandProps = {
  category: SkillCategory
  count: number
}

/** 🏡 one of the four districts of the island */
export function CategoryIsland({ category, count }: CategoryIslandProps) {
  const meta = CATEGORY_META[category]
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={cardVariants}
      whileHover={reduced ? undefined : { y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="h-full"
    >
      <Link
        to={`/skills?category=${category}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border-2 border-sand-300 bg-sand-50 shadow-soft transition-[box-shadow,border-color] duration-200 hover:border-ink-500/40 hover:shadow-pop focus-visible:border-ink-500/40"
      >
        {/* the island plate */}
        <div
          className={`relative h-28 ${meta.plate} overflow-hidden border-b-2 border-sand-300`}
        >
          <div className="absolute inset-x-0 bottom-0 h-7 bg-sand-50 [clip-path:polygon(0_100%,12%_38%,26%_100%,44%_46%,62%_100%,78%_34%,100%_100%)]" />
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-6 -translate-x-1/2 text-5xl drop-shadow-sm"
            animate={reduced ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {meta.emoji}
          </motion.span>

          <span
            className={`absolute right-3 top-3 rounded-full border-2 border-ink-900/15 bg-sand-50 px-2.5 py-0.5 text-xs font-bold text-ink-900 shadow-soft`}
          >
            {count} 个技能
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-xl text-ink-900">
            {meta.zh}
            <span className="ml-1.5 text-sm font-semibold text-ink-500">{meta.label}</span>
          </h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{meta.blurb}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.sampleTags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.chip}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            className={`mt-4 inline-flex items-center gap-1 text-sm font-bold ${meta.text} transition-transform duration-200 group-hover:translate-x-1`}
          >
            走进这座岛
            <span aria-hidden="true">→</span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
