import { CATEGORY_META, CATEGORY_ORDER } from './categoryMeta'
import type { SkillCategory } from '@/types/skill'

export type CategoryFilterValue = SkillCategory | 'all'

type CategoryFilterProps = {
  value: CategoryFilterValue
  onChange: (value: CategoryFilterValue) => void
  counts: Record<SkillCategory, number>
  total: number
}

const ALL_CHIP =
  'border-ink-900/15 bg-sand-300/70 text-ink-900 shadow-soft'

/** 🏷 category chips — horizontal rail on mobile, vertical rail on desktop */
export function CategoryFilter({ value, onChange, counts, total }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="按分类筛选"
      className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5 lg:overflow-visible"
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        aria-pressed={value === 'all'}
        className={`inline-flex shrink-0 items-center justify-between gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-all duration-200 lg:w-full lg:rounded-xl ${
          value === 'all'
            ? `${ALL_CHIP} border-ink-900`
            : 'border-transparent text-ink-500 hover:border-sand-300 hover:bg-sand-200/60 hover:text-ink-900'
        }`}
      >
        <span>🏝 全部</span>
        <span className="text-xs font-bold opacity-70">{total}</span>
      </button>

      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category]
        const active = value === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center justify-between gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-all duration-200 lg:w-full lg:rounded-xl ${
              active
                ? `${meta.chip} shadow-soft`
                : 'border-transparent text-ink-500 hover:border-sand-300 hover:bg-sand-200/60 hover:text-ink-900'
            }`}
          >
            <span>
              <span aria-hidden="true" className="mr-1.5">
                {meta.emoji}
              </span>
              {meta.zh}
            </span>
            <span className="text-xs font-bold opacity-70">{counts[category] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
