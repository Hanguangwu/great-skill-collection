import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { formatDate, getSkillById, loadSkillBody, site, siteMeta } from '@/lib/skills'
import { MarkdownBody } from '@/components/MarkdownBody'
import { CategoryBadge, TagBadge } from '@/components/TagBadge'
import { InstallBox } from '@/components/InstallBox'
import { EmptyState } from '@/components/EmptyState'
import { LoadingState } from '@/components/LoadingState'
import { PageShell } from '@/components/PageShell'
import { CATEGORY_META } from '@/components/categoryMeta'
import { riseVariants, softEase } from '@/components/motion'
import type { Skill } from '@/types/skill'

type TabKey = 'overview' | 'changelog'

const COMPAT: { key: keyof NonNullable<Skill['compatibility']>; label: string }[] = [
  { key: 'claudeCode', label: 'Claude Code' },
  { key: 'codex', label: 'Codex' },
  { key: 'kimiCode', label: 'Kimi Code' },
]

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-dashed border-sand-300 py-2 last:border-0">
      <dt className="shrink-0 text-xs font-bold uppercase tracking-widest text-ink-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  )
}

function Compatibility({ skill }: { skill: Skill }) {
  if (!skill.compatibility) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-sand-300 px-3 py-2 text-[11px] text-ink-500">
        还没有填写兼容信息
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {COMPAT.map(({ key, label }) => {
        const ok = Boolean(skill.compatibility?.[key])
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 text-[11px] font-bold ${
              ok
                ? 'border-leaf-500/60 bg-leaf-300/30 text-leaf-700'
                : 'border-sand-300 bg-sand-200/60 text-ink-500 line-through decoration-1'
            }`}
          >
            <span aria-hidden="true">{ok ? '✓' : '✗'}</span>
            {label}
          </span>
        )
      })}
    </div>
  )
}

function Tabs({
  tab,
  onChange,
  changelogCount,
}: {
  tab: TabKey
  onChange: (tab: TabKey) => void
  changelogCount: number
}) {
  const reduced = useReducedMotion()
  const items: { key: TabKey; label: string; emoji: string }[] = [
    { key: 'overview', label: 'Overview', emoji: '📖' },
    { key: 'changelog', label: 'Changelog', emoji: '🕒' },
  ]

  return (
    <div
      role="tablist"
      aria-label="技能内容"
      className="no-scrollbar flex gap-1 overflow-x-auto border-b-2 border-dashed border-sand-300"
    >
      {items.map((item) => {
        const active = tab === item.key
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`tab-${item.key}`}
            aria-selected={active}
            aria-controls={`panel-${item.key}`}
            onClick={() => onChange(item.key)}
            className="relative shrink-0 px-4 py-2.5 text-sm font-bold transition-colors duration-200"
          >
            <span className={active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'}>
              <span aria-hidden="true" className="mr-1.5">
                {item.emoji}
              </span>
              {item.label}
              {item.key === 'changelog' && changelogCount > 0 ? (
                <span className="ml-1.5 text-xs opacity-70">{changelogCount}</span>
              ) : null}
            </span>
            {active ? (
              <motion.span
                layoutId={reduced ? undefined : 'skill-tab-underline'}
                className="absolute inset-x-1 -bottom-0.5 h-1 rounded-full bg-leaf-500"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>()
  const reduced = useReducedMotion()
  const [params, setParams] = useSearchParams()
  const skill = id ? getSkillById(id) : undefined

  // bodies ship as separate raw .md files, so only this page pays for the one it shows
  const [body, setBody] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!skill) return

    let cancelled = false
    void loadSkillBody(skill.id).then((loaded) => {
      if (!cancelled) setBody(loaded)
    })

    return () => {
      cancelled = true
    }
  }, [skill])

  // the active tab lives in the url, so the changelog is linkable
  const tab: TabKey = params.get('tab') === 'changelog' ? 'changelog' : 'overview'
  const setTab = (next: TabKey) => {
    const search = new URLSearchParams(params)
    if (next === 'overview') {
      search.delete('tab')
    } else {
      search.set('tab', next)
    }
    setParams(search, { replace: true })
  }

  if (!skill) {
    return (
      <EmptyState
        emoji="🐿"
        title="这座岛上没有这位居民"
        hint="也许 id 写错了，或者技能已经被移出仓库。回到图鉴再找找。"
        action={{ label: '回到 Skill 图鉴', to: '/skills' }}
      />
    )
  }

  const meta = CATEGORY_META[skill.category]
  const entries = skill.changelog ?? []

  return (
    <PageShell>
      <nav aria-label="面包屑" className="mb-5 flex items-center gap-1.5 text-sm text-ink-500">
        <Link to="/" className="hover:text-ink-900">
          🏝 首页
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/skills" className="hover:text-ink-900">
          图鉴
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate font-semibold text-ink-900">{skill.name}</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <motion.span
          aria-hidden="true"
          className="grid size-20 shrink-0 place-items-center rounded-card border-2 border-wood-400 bg-sand-50 text-4xl shadow-pop"
          animate={reduced ? undefined : { rotate: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {skill.icon}
        </motion.span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              {skill.name}
            </h1>
            {skill.popular ? (
              <span className="stamp px-2 py-0.5 text-xs font-bold text-coral-500">⭐ Popular</span>
            ) : null}
            <span className="stamp px-2 py-0.5 text-xs font-bold text-ink-700">v{skill.version}</span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <CategoryBadge category={skill.category} />
            {skill.featured ? (
              <span className="rounded-full border-2 border-mango-400 bg-mango-300/40 px-2.5 py-0.5 text-xs font-bold text-ink-900">
                ✨ Featured
              </span>
            ) : null}
            {skill.tags.map((tag) => (
              <TagBadge key={tag} tone="leaf" linked>
                {tag}
              </TagBadge>
            ))}
          </div>

          <p className="note-dash mt-4 rounded-card px-4 py-3 text-sm leading-relaxed text-ink-700">
            {skill.description}
          </p>
        </div>
      </header>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
        {/* ------------------------------------------------ main column */}
        <div>
          <Tabs tab={tab} onChange={setTab} changelogCount={entries.length} />

          <div className="pt-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                role="tabpanel"
                id={`panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: softEase }}
              >
                {tab === 'overview' ? (
                  <div className="rounded-card border-2 border-sand-300 bg-sand-50 p-5 shadow-soft sm:p-7">
                    {body === undefined ? (
                      <LoadingState cards={3} />
                    ) : (
                      <MarkdownBody content={body} />
                    )}
                  </div>
                ) : entries.length === 0 ? (
                  <EmptyState
                    emoji="🐿"
                    title="这位居民还没有更新记录"
                    hint="技能升级之后，改动会出现在这里。"
                  />
                ) : (
                  <ol className="m-0 list-none space-y-3">
                    {entries.map((entry, index) => (
                      <li
                        key={`${entry.version}-${entry.date}-${index}`}
                        className="flex flex-col gap-2 rounded-card border-2 border-sand-300 bg-sand-50 p-4 shadow-soft sm:flex-row sm:items-start sm:gap-4"
                      >
                        <span className="stamp shrink-0 self-start px-2.5 py-0.5 text-xs font-bold text-leaf-700">
                          🌱 v{entry.version}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed text-ink-700">{entry.note}</p>
                          <p className="mt-1 text-xs text-ink-500">🕒 {formatDate(entry.date)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ------------------------------------------------ side rail */}
        <aside className="mt-8 space-y-4 lg:mt-5 lg:sticky lg:top-24">
          <motion.section
            variants={riseVariants}
            initial={reduced ? false : 'initial'}
            animate="animate"
            className="rounded-card border-2 border-sand-300 bg-sand-50 p-4 shadow-soft"
          >
            <h2 className="font-display text-lg text-ink-900">🗂 Metadata</h2>
            <dl className="mt-2">
              <MetaRow label="Author" value={skill.author} />
              <MetaRow label="Version" value={skill.version} />
              <MetaRow label="License" value={skill.license} />
              <MetaRow label="Updated" value={formatDate(skill.updatedAt)} />
              <MetaRow label="Category" value={`${meta.emoji} ${meta.zh} · ${meta.label}`} />
              <MetaRow label="Skill id" value={skill.id} />
            </dl>

            <p className="mt-3 mb-1.5 text-xs font-bold uppercase tracking-widest text-ink-500">
              Compatible
            </p>
            <Compatibility skill={skill} />
          </motion.section>

          <motion.div
            variants={riseVariants}
            initial={reduced ? false : 'initial'}
            animate="animate"
            transition={{ delay: 0.06 }}
          >
            <InstallBox
              repoUrl={siteMeta.repoUrl}
              skillId={skill.id}
              sourcePath={skill.sourcePath}
            />
          </motion.div>

          <a
            href={site.repoTree(skill.sourcePath ?? `skills/${skill.id}`)}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-between gap-2 rounded-card border-2 border-ink-900 bg-sand-50 px-4 py-3 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span>View on GitHub</span>
            <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </PageShell>
  )
}
