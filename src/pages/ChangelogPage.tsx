import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDate, getAllSkills } from '@/lib/skills'
import { PageHeading } from '@/components/PageHeading'
import { PageShell } from '@/components/PageShell'
import { EmptyState } from '@/components/EmptyState'
import { riseVariants, staggerVariants } from '@/components/motion'
import type { Skill, SkillChangelogEntry } from '@/types/skill'

type Entry = SkillChangelogEntry & { skill: Skill }

function monthLabel(key: string) {
  const [year, month] = key.split('-')
  return `${year} 年 ${month} 月`
}

export function ChangelogPage() {
  const reduced = useReducedMotion()

  const groups = useMemo(() => {
    const all = getAllSkills()
    const entries: Entry[] = all.flatMap((skill) =>
      (skill.changelog ?? []).map((entry) => ({ ...entry, skill })),
    )

    const byMonth = new Map<string, Entry[]>()
    for (const entry of [...entries].sort((a, b) => b.date.localeCompare(a.date))) {
      const key = entry.date.slice(0, 7)
      const bucket = byMonth.get(key)
      if (bucket) {
        bucket.push(entry)
      } else {
        byMonth.set(key, [entry])
      }
    }

    return [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [])

  const total = groups.reduce((sum, [, entries]) => sum + entries.length, 0)

  return (
    <PageShell>
      <PageHeading
        emoji="🕒"
        title="更新日志"
        description="所有技能版本变动汇总，按月份从新到旧排。"
        meta={`${total} 条记录`}
      />

      {groups.length === 0 ? (
        <EmptyState
          emoji="🐿"
          title="岛上还没有任何更新记录"
          hint="等第一个技能升版，这里就会热闹起来。"
          action={{ label: '去 Skill 图鉴', to: '/skills' }}
        />
      ) : (
        <div className="space-y-10">
          {groups.map(([month, entries]) => (
            <motion.section
              key={month}
              variants={staggerVariants}
              initial={reduced ? false : 'initial'}
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-xl text-ink-900">{monthLabel(month)}</h2>
                <span className="h-px flex-1 bg-sand-300" />
                <span className="text-xs font-bold text-ink-500">{entries.length} 条</span>
              </div>

              <ol className="m-0 list-none space-y-3 border-l-2 border-dashed border-sand-300 pl-5 sm:pl-6">
                {entries.map((entry, entryIndex) => (
                  <motion.li
                    key={`${entry.skill.id}-${entry.version}-${entryIndex}`}
                    variants={riseVariants}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.6rem] top-5 size-2.5 rounded-full border-2 border-sand-100 bg-leaf-500 sm:-left-[1.85rem]"
                    />
                    <Link
                      to={`/skill/${entry.skill.id}`}
                      className="group flex flex-col gap-2 rounded-card border-2 border-sand-300 bg-sand-50 p-4 shadow-soft transition-[box-shadow,border-color] duration-200 hover:border-wood-400 hover:shadow-pop sm:flex-row sm:items-start sm:gap-4"
                    >
                      <span className="stamp shrink-0 self-start px-2.5 py-0.5 text-xs font-bold text-leaf-700">
                        🌱 v{entry.version}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed text-ink-700">{entry.note}</p>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
                          <span aria-hidden="true">{entry.skill.icon}</span>
                          <span className="font-bold text-ink-900">{entry.skill.name}</span>
                          <span>·</span>
                          <span>🕒 {formatDate(entry.date)}</span>
                          <span className="text-leaf-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            · 查看详情 →
                          </span>
                        </p>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ol>
            </motion.section>
          ))}
        </div>
      )}

      <p className="mt-12 text-center text-sm text-ink-500">
        想知道某个技能改了什么？去{' '}
        <Link
          to="/skills"
          className="font-bold text-leaf-700 underline decoration-dashed underline-offset-4 hover:text-ink-900"
        >
          Skill 图鉴
        </Link>{' '}
        逐个翻。
      </p>
    </PageShell>
  )
}
