import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { countByCategory, getAllSkills } from '@/lib/skills'
import { PageHeading, SectionTitle } from '@/components/PageHeading'
import { PageShell } from '@/components/PageShell'
import { CategoryIsland } from '@/components/CategoryIsland'
import { SkillGrid } from '@/components/SkillGrid'
import { EmptyState } from '@/components/EmptyState'
import { CATEGORY_META, CATEGORY_ORDER } from '@/components/categoryMeta'
import { staggerVariants } from '@/components/motion'
import type { Skill, SkillCategory } from '@/types/skill'

function latestOf(skills: Skill[]) {
  return [...skills].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
}

export function CategoryPage() {
  const reduced = useReducedMotion()
  const all = getAllSkills()
  const base = countByCategory(all)

  const counts = CATEGORY_ORDER.reduce<Record<SkillCategory, number>>(
    (acc, category) => {
      acc[category] = base?.[category] ?? 0
      return acc
    },
    { coding: 0, research: 0, creative: 0, life: 0 },
  )

  return (
    <PageShell>
      <PageHeading
        emoji="🗺"
        title="分类岛"
        description="技能按用途分了四片区域。先挑一座岛，再进去看居民。"
        meta={`4 座岛 · ${all.length} 个技能`}
      />

      <motion.div
        variants={staggerVariants}
        initial={reduced ? false : 'initial'}
        animate="animate"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {CATEGORY_ORDER.map((category) => (
          <CategoryIsland key={category} category={category} count={counts[category]} />
        ))}
      </motion.div>

      <section className="mt-14 space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category]
          const skills = all.filter((skill) => skill.category === category)
          if (skills.length === 0) return null

          return (
            <div key={category}>
              <SectionTitle
                emoji={meta.emoji}
                title={`${meta.zh} · ${meta.label}`}
                hint={`${skills.length} 个技能 · ${meta.sampleTags.join(' / ')}`}
                action={{ label: '在图鉴里查看', to: `/skills?category=${category}` }}
              />
              <SkillGrid
                skills={latestOf(skills)}
                onScroll
                emptyTitle={`🐿 ${meta.zh}还没有居民`}
                emptyHint="这一类暂时是空的，去别的岛看看吧。"
              />
            </div>
          )
        })}

        {all.length === 0 ? (
          <EmptyState
            emoji="🏝"
            title="岛上还没有发现新的技能"
            hint="仓库里还没有 SKILL.md，先去 GitHub 放一个进来。"
            action={{ label: '看看格式说明', to: '/about' }}
          />
        ) : null}
      </section>

      <p className="mt-14 text-center text-sm text-ink-500">
        想按标签找？去{' '}
        <Link
          to="/skills"
          className="font-bold text-leaf-700 underline decoration-dashed underline-offset-4 hover:text-ink-900"
        >
          Skill 图鉴
        </Link>{' '}
        搜索更快。
      </p>
    </PageShell>
  )
}
