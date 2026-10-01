import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { countByCategory, getAllSkills, searchSkills } from '@/lib/skills'
import { PageHeading } from '@/components/PageHeading'
import { PageShell } from '@/components/PageShell'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter, type CategoryFilterValue } from '@/components/CategoryFilter'
import { SkillGrid } from '@/components/SkillGrid'
import { LoadingState } from '@/components/LoadingState'
import { CATEGORY_META, CATEGORY_ORDER } from '@/components/categoryMeta'
import { riseVariants } from '@/components/motion'
import type { SkillCategory } from '@/types/skill'

function isCategory(value: string | null): value is SkillCategory {
  return value !== null && (CATEGORY_ORDER as string[]).includes(value)
}

export function SkillsPage() {
  const reduced = useReducedMotion()
  const [params, setParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const all = useMemo(() => getAllSkills(), [])

  // simulated fetch, so the 🐻 loading state is part of the design
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const rawCategory = params.get('category')
  const activeCategory: CategoryFilterValue = isCategory(rawCategory) ? rawCategory : 'all'
  const tag = params.get('tag')

  const setCategory = (value: CategoryFilterValue) => {
    const next = new URLSearchParams(params)
    if (value === 'all') {
      next.delete('category')
    } else {
      next.set('category', value)
    }
    setParams(next, { replace: true })
  }

  const counts = useMemo(() => {
    const base = countByCategory(all)
    return CATEGORY_ORDER.reduce<Record<SkillCategory, number>>(
      (acc, category) => {
        acc[category] = base?.[category] ?? 0
        return acc
      },
      { coding: 0, research: 0, creative: 0, life: 0 },
    )
  }, [all])

  const results = useMemo(() => {
    const base = searchSkills(all, query, activeCategory)
    return tag ? base.filter((skill) => skill.tags.includes(tag)) : base
  }, [all, query, activeCategory, tag])

  const label =
    activeCategory === 'all' ? '全部技能' : `${CATEGORY_META[activeCategory].zh}岛`

  return (
    <PageShell>
      <PageHeading
        emoji="🗂"
        title="Skill 图鉴"
        description="岛上全部居民的收藏册 —— 按分类逛，或者直接搜名字、描述、标签。"
        meta={`${all.length} 个技能`}
      />

      <div className="lg:grid lg:grid-cols-[248px_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            variants={riseVariants}
            initial={reduced ? false : 'initial'}
            animate="animate"
            className="flex flex-col gap-4"
          >
            <SearchBar value={query} onChange={setQuery} />

            <div>
              <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">
                分类岛
              </p>
              <CategoryFilter
                value={activeCategory}
                onChange={setCategory}
                counts={counts}
                total={all.length}
              />
            </div>

            {tag ? (
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.delete('tag')
                  setParams(next, { replace: true })
                }}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-dashed border-leaf-500 bg-leaf-300/25 px-3 py-1 text-xs font-bold text-leaf-700 transition-colors hover:bg-leaf-300/40"
              >
                🏷 {tag} <span aria-hidden="true">✕</span>
              </button>
            ) : null}

            <p className="hidden rounded-2xl border-2 border-dashed border-sand-300 px-3 py-2.5 text-[11px] leading-relaxed text-ink-500 lg:block">
              提示：点技能卡上的 🏷 标签可以直接按标签过滤。
            </p>
          </motion.div>
        </aside>

        <section aria-label="技能列表">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-dashed border-sand-300 pb-3">
            <p className="text-sm font-bold text-ink-900">
              {loading ? '正在整理…' : `${results.length} 个技能`}
              <span className="ml-1 font-semibold text-ink-500">· {label}</span>
            </p>
            {query.trim() ? (
              <p className="text-xs text-ink-500">关键词「{query.trim()}」</p>
            ) : null}
          </div>

          {loading ? (
            <LoadingState cards={6} />
          ) : (
            <SkillGrid
              skills={results}
              emptyTitle={`🐿 岛上没找到「${query.trim() || tag || label}」相关技能`}
              emptyHint="换个关键词试试，或者回到全部技能再逛一圈。"
            />
          )}
        </section>
      </div>
    </PageShell>
  )
}
