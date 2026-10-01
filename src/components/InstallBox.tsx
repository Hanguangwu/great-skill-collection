import { CopyButton } from './CopyButton'

type InstallBoxProps = {
  repoUrl: string
  skillId: string
  /** repo-root-relative folder path, e.g. 'public/skill-hub/engineering/code-review' */
  sourcePath?: string
}

/** 🪵 wooden crate with the two things you actually need to copy */
export function InstallBox({ repoUrl, skillId, sourcePath }: InstallBoxProps) {
  const folder = `${sourcePath ?? `skills/${skillId}`}/`

  return (
    <section className="overflow-hidden rounded-card border-2 border-wood-500 bg-wood-500 p-3 shadow-pop">
      <div className="rounded-card bg-wood-400 p-4">
        <p className="font-display text-lg text-sand-50">🪵 安装这个 Skill</p>
        <p className="mt-1 text-xs text-sand-100/85">
          Agent Skills 只有一份 SKILL.md —— 克隆仓库或直接复制文件夹都行。
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border-2 border-wood-500 bg-ink-900 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sand-300">
                ① 克隆仓库
              </span>
              <CopyButton text={repoUrl} label="复制" />
            </div>
            <code className="block overflow-x-auto font-mono text-xs leading-relaxed text-sand-50">
              git clone {repoUrl}
            </code>
          </div>

          <div className="rounded-2xl border-2 border-wood-500 bg-ink-900 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sand-300">
                ② 复制 Skill 文件夹
              </span>
              <CopyButton text={folder} label="复制路径" />
            </div>
            <code className="block overflow-x-auto font-mono text-xs leading-relaxed text-sand-50">
              {folder}
            </code>
          </div>
        </div>

        <p className="mt-3 rounded-2xl border-2 border-dashed border-sand-100/40 px-3 py-2 text-[11px] leading-relaxed text-sand-100/90">
          把这个文件夹丢进你的 agent skills 目录，Claude Code / Codex / Kimi Code 都能直接读到。
        </p>
      </div>
    </section>
  )
}
