import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getAllSkills, siteMeta } from '@/lib/skills'
import { IslandHeader } from '@/components/IslandHeader'
import { CategoryIsland } from '@/components/CategoryIsland'
import { SectionTitle } from '@/components/PageHeading'
import { PageShell } from '@/components/PageShell'
import { SkillGrid } from '@/components/SkillGrid'
import { CATEGORY_ORDER } from '@/components/categoryMeta'
import { riseVariants, staggerVariants } from '@/components/motion'
import type { SkillCategory } from '@/types/skill'

const STEPS = [
  {
    emoji: '📖',
    title: '看懂格式',
    body: '每个技能就是一个文件夹，里面放一份 SKILL.md。名称、描述、版本都写在文件头。',
    to: '/about',
    cta: '看标准说明',
  },
  {
    emoji: '📋',
    title: '复制走人',
    body: '详情页有安装框，复制仓库地址或 skills/<id>/ 路径，丢进你的 agent 目录就能用。',
    to: '/skills',
    cta: '打开图鉴',
  },
  {
    emoji: '🌱',
    title: '提 PR 加新住民',
    body: '新技能就往仓库里加一个文件夹，站点下次构建就会自动出现在岛上。',
    to: siteMeta.repoUrl,
    cta: '去 GitHub',
  },
]

function HowToUseStrip() {
  const reduced = useReducedMotion()

  return (
    <section className="mt-14">
      <SectionTitle
        emoji="🧭"
        title="怎么用这座岛"
        hint="三步，从看懂到用上"
      />
      <motion.ol
        variants={staggerVariants}
        initial={reduced ? false : 'initial'}
        whileInView="animate"
        viewport={{ once: true, margin: '-60px' }}
        className="m-0 grid list-none gap-4 sm:grid-cols-3"
      >
        {STEPS.map((step, index) => (
          <motion.li
            key={step.title}
            variants={riseVariants}
            className="note-dash flex flex-col rounded-card p-5"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full border-2 border-ink-900 bg-sand-300 font-display text-sm text-ink-900"
              >
                {index + 1}
              </span>
              <h3 className="font-display text-lg text-ink-900">
                <span aria-hidden="true" className="mr-1">
                  {step.emoji}
                </span>
                {step.title}
              </h3>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{step.body}</p>
            {step.to.startsWith('http') ? (
              <a
                href={step.to}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-leaf-700 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
              >
                {step.cta} →
              </a>
            ) : (
              <Link
                to={step.to}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-leaf-700 underline decoration-dashed underline-offset-4 transition-colors hover:text-ink-900"
              >
                {step.cta} →
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}

export function HomePage() {
  const reduced = useReducedMotion()
  const all = getAllSkills()
  const latest = [...all]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  const counts = all.reduce<Record<SkillCategory, number>>(
    (acc, skill) => {
      acc[skill.category] += 1
      return acc
    },
    { coding: 0, research: 0, creative: 0, life: 0 },
  )

  return (
    <PageShell>
      <IslandHeader />

      <section className="mt-12">
        <SectionTitle
          emoji="🗺"
          title="四座分类岛"
          hint={`岛上一共有 ${all.length} 个技能，分成四片区域`}
        />
        <motion.div
          variants={staggerVariants}
          initial={reduced ? false : 'initial'}
          animate="animate"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {CATEGORY_ORDER.map((category) => (
            <CategoryIsland key={category} category={category} count={counts[category]} />
          ))}
        </motion.div>
      </section>

      <section className="mt-14">
        <SectionTitle
          emoji="🌿"
          title="最近更新"
          hint="新搬上岛和刚修过的技能"
          action={{ label: '看全部', to: '/skills' }}
        />
        <SkillGrid
          skills={latest}
          emptyTitle="🐿 岛上还没有发现新的技能"
          emptyHint="仓库里还没有 SKILL.md，先去 GitHub 添一个吧。"
        />
      </section>

      <HowToUseStrip />
    </PageShell>
  )
}
