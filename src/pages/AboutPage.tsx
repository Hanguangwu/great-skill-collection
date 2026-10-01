import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { siteMeta, site } from '@/lib/skills'
import { PageHeading, SectionTitle } from '@/components/PageHeading'
import { PageShell } from '@/components/PageShell'
import { riseVariants } from '@/components/motion'

/** 🪟 a code panel with fake window chrome */
function CodePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="code-frame">
      <div className="code-frame-bar">
        <i className="bg-coral-400" />
        <i className="bg-mango-300" />
        <i className="bg-leaf-400" />
        <span className="ml-2 text-[11px] font-semibold text-sand-200/80">{title}</span>
      </div>
      <pre className="island-code rounded-none border-0 shadow-none">
        <code>{children}</code>
      </pre>
    </div>
  )
}

const BULLETS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '📁',
    title: '一个技能 = 一个文件夹',
    body: '文件夹名字就是技能 id，里面通常只有一份 SKILL.md。',
  },
  {
    emoji: '🏷',
    title: '写在文件头，不写在数据库里',
    body: '名称、描述、作者、版本、标签、分类都来自 YAML frontmatter。',
  },
  {
    emoji: '🧩',
    title: '正文就是说明书',
    body: 'Agent 读正文就知道什么时候用、怎么用；网站也只是把同一份文件渲染出来。',
  },
]

const ADD_STEPS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '1️⃣',
    title: '建文件夹',
    body: '在仓库里新建 public/skill-hub/<分类>/<技能 id>/，全小写、用连字符。',
  },
  {
    emoji: '2️⃣',
    title: '写 SKILL.md',
    body: '先写 frontmatter（名称、描述、版本、标签、分类），再写正文说明。',
  },
  {
    emoji: '3️⃣',
    title: '提 PR',
    body: '构建脚本会读完全部 SKILL.md 生成索引，站点自动多出一位居民。',
  },
]

const AGENTS: { emoji: string; name: string; hint: string; code: string }[] = [
  {
    emoji: '🧠',
    name: 'Claude Code',
    hint: '把技能文件夹放进项目的 skills 目录，Claude 就会自动发现。',
    code: 'cp -r public/skill-hub/<分类>/<id>/ ./my-project/skills/<id>/',
  },
  {
    emoji: '🛠',
    name: 'Codex',
    hint: '同样按文件夹读取，放在仓库或工作区的 skills 目录即可。',
    code: 'cp -r public/skill-hub/<分类>/<id>/ ./workspace/skills/<id>/',
  },
  {
    emoji: '🌙',
    name: 'Kimi Code',
    hint: '认同一套 SKILL.md 结构，复制过去就能用。',
    code: 'cp -r public/skill-hub/<分类>/<id>/ ./project/skills/<id>/',
  },
]

function Card({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      variants={riseVariants}
      initial={reduced ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

function StepCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.li
      variants={riseVariants}
      initial={reduced ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className="h-full"
    >
      {children}
    </motion.li>
  )
}

export function AboutPage() {
  return (
    <PageShell>
      <PageHeading
        emoji="📖"
        title="关于这座岛"
        description="Skill Island 是我自己的 Agent Skills 收藏册 —— 一个长期维护的公开索引。"
        meta={siteMeta.siteTitle}
      />

      {/* ---------------------------------------------------------- what */}
      <section className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
        <div>
          <SectionTitle emoji="🧠" title="Agent Skill 是什么" />
          <div className="space-y-3 text-sm leading-relaxed text-ink-700">
            <p>
              Agent Skill 是一份给 AI 看的操作说明。它把某个具体任务的流程、约束和例子写清楚，
              Agent 在需要的时候自己加载这一份说明，而不是把规则一直背在系统提示里。
            </p>
            <p>
              好处很直接：提示词变短了、能力可以按需拼装，而且这份说明是纯文本 —— 能 review、
              能改、能放进任何支持 Agent Skills 标准的工具里。
            </p>
          </div>

          <div className="note-dash mt-5 rounded-card p-4 text-sm leading-relaxed text-ink-700">
            <p className="font-display text-base text-ink-900">一句话版本</p>
            <p className="mt-1">
              SKILL.md = 技能的身份证 + 使用说明书。网站只是给这份文件做了一层更好读的展示。
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3 lg:mt-14">
          {BULLETS.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-card border-2 border-sand-300 bg-sand-50 p-4 shadow-soft"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-wood-400 bg-sand-200 text-base"
              >
                {item.emoji}
              </span>
              <div>
                <p className="font-bold text-ink-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- format */}
      <section className="mt-16">
        <SectionTitle
          emoji="🗂"
          title="唯一事实来源：SKILL.md"
          hint="仓库结构长这样，没有额外的数据库"
        />
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
          <CodePanel title="repository">
            <>
              <span className="cmt">{site.repoName}/</span>
              {'\n'}
              <span className="cmt">├── public/skill-hub/</span>
              {'\n'}
              <span className="cmt">│   ├── engineering/</span>
              {'\n'}
              <span className="cmt">│   │   └── code-review/</span>
              {'\n'}
              <span className="cmt">│   │       └── SKILL.md</span>
              {'\n'}
              <span className="cmt">│   ├── design/</span>
              {'\n'}
              <span className="cmt">│   │   └── huashu-design/</span>
              {'\n'}
              <span className="cmt">│   │       └── SKILL.md</span>
              {'\n'}
              <span className="cmt">│   └── …</span>
              {'\n'}
              <span className="cmt">├── scripts/</span>
              {'\n'}
              <span className="cmt">│   └── generate-skills.mjs</span>
              {'\n'}
              <span className="cmt">└── src/</span>
              {'\n'}
              <span className="cmt">    └── data/skill-bodies/*.md</span>
            </>
          </CodePanel>

          <CodePanel title="SKILL.md (frontmatter)">
            <>
              <span className="cmt">---</span>
              {'\n'}
              <span className="key">name</span>
              <span className="cmt">: </span>
              <span className="val">React UI Builder</span>
              {'\n'}
              <span className="key">description</span>
              <span className="cmt">: </span>
              <span className="val">Generate modern React interfaces.</span>
              {'\n'}
              <span className="key">author</span>
              <span className="cmt">: </span>
              <span className="val">{siteMeta.owner}</span>
              {'\n'}
              <span className="key">version</span>
              <span className="cmt">: </span>
              <span className="val">1.0.0</span>
              {'\n'}
              <span className="key">tags</span>
              <span className="cmt">: </span>
              <span className="val">[React, TypeScript, UI]</span>
              {'\n'}
              <span className="key">category</span>
              <span className="cmt">: </span>
              <span className="val">coding</span>
              {'\n'}
              <span className="cmt">---</span>
              {'\n\n'}
              <span className="cmt"># React UI Builder</span>
              {'\n'}
              <span className="cmt">## Capability</span>
              {'\n'}
              <span className="cmt">…</span>
            </>
          </CodePanel>
        </div>
      </section>

      {/* ---------------------------------------------------------- add */}
      <section className="mt-16">
        <SectionTitle emoji="➕" title="怎么加一个新技能" hint="三步，都是纯文本操作" />
        <ol className="m-0 grid list-none gap-4 md:grid-cols-3">
          {ADD_STEPS.map((step, index) => (
            <StepCard key={step.title} delay={index * 0.05}>
              <div className="h-full rounded-card border-2 border-sand-300 bg-sand-50 p-5 shadow-soft">
                <p aria-hidden="true" className="text-2xl">
                  {step.emoji}
                </p>
                <p className="mt-2 font-display text-lg text-ink-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{step.body}</p>
              </div>
            </StepCard>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------ install */}
      <section className="mt-16">
        <SectionTitle
          emoji="🪵"
          title="装进你的 Agent"
          hint="复制文件夹，或者克隆整个仓库"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {AGENTS.map((agent, index) => (
            <Card key={agent.name} delay={index * 0.05}>
              <div className="h-full rounded-card border-2 border-sand-300 bg-sand-50 p-5 shadow-soft">
                <p className="font-display text-lg text-ink-900">
                  <span aria-hidden="true" className="mr-1.5">
                    {agent.emoji}
                  </span>
                  {agent.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{agent.hint}</p>
                <pre className="island-code mt-3 text-[11px]">
                  <code>{agent.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- cta */}
      <Card>
        <section className="mt-16 overflow-hidden rounded-card border-2 border-wood-500 bg-sand-300 p-6 shadow-pop sm:p-8">
          <p className="stamp inline-block px-3 py-0.5 text-[11px] font-bold tracking-widest text-wood-500">
            🏝 ISLAND OPEN
          </p>
          <h2 className="mt-3 font-display text-2xl text-ink-900 sm:text-3xl">
            源码、SKILL.md、都在 GitHub 上
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-700">
            整座岛就是一个公开仓库：技能文件夹、生成索引的脚本、还有这个网站本身。
            看到好用的技能，欢迎提 issue 或者直接 PR。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={siteMeta.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-ink-900 px-5 py-2.5 text-sm font-bold text-sand-50 shadow-[3px_3px_0_var(--color-sand-400)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              View on GitHub ↗
            </a>
            <a
              href={site.repoFile('README.md')}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-sand-50 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-[3px_3px_0_var(--color-ink-900)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              📄 读 README
            </a>
          </div>
        </section>
      </Card>
    </PageShell>
  )
}
