import { motion, useReducedMotion } from 'framer-motion'
import { staggerVariants } from './motion'
import { SkillCard } from './SkillCard'
import { EmptyState } from './EmptyState'
import type { Skill } from '@/types/skill'

type SkillGridProps = {
  skills: Skill[]
  /** when empty */
  emptyTitle?: string
  emptyHint?: string
  /** reveal on scroll instead of on mount (used below the fold) */
  onScroll?: boolean
}

/** the collection album: staggered grid of SkillCards */
export function SkillGrid({
  skills,
  emptyTitle = '🐿 岛上还没有发现新的技能',
  emptyHint = '换个关键词，或者去别的分类岛看看。',
  onScroll = false,
}: SkillGridProps) {
  const reduced = useReducedMotion()

  if (skills.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        hint={emptyHint}
        action={{ label: '回到全部技能', to: '/skills' }}
      />
    )
  }

  return (
    <motion.ul
      variants={staggerVariants}
      initial={reduced ? false : 'initial'}
      animate={onScroll ? undefined : 'animate'}
      whileInView={onScroll ? 'animate' : undefined}
      viewport={onScroll ? { once: true, margin: '-60px' } : undefined}
      className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {skills.map((skill) => (
        <li key={skill.id} className="h-full">
          <SkillCard skill={skill} />
        </li>
      ))}
    </motion.ul>
  )
}
