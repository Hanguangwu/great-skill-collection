import { useCallback, useEffect, useRef, useState } from 'react'

type CopyButtonProps = {
  text: string
  label?: string
  tone?: 'dark' | 'light'
  className?: string
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path below
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

/** 📋 copy with a short "已复制 ✓" confirmation */
export function CopyButton({ text, label = '复制', tone = 'dark', className = '' }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = useCallback(async () => {
    const ok = await writeToClipboard(text)
    setState(ok ? 'done' : 'fail')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }, [text])

  const dark = tone === 'dark'

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all duration-200 active:translate-y-px ${
        dark
          ? 'border-sand-100/40 bg-sand-100/10 text-sand-50 hover:border-sand-100 hover:bg-sand-100/20'
          : 'border-ink-900 bg-sand-50 text-ink-900 shadow-[2px_2px_0_var(--color-ink-900)] hover:-translate-y-0.5'
      } ${className}`}
    >
      <span aria-hidden="true">
        {state === 'done' ? '✓' : state === 'fail' ? '!' : '📋'}
      </span>
      {state === 'done' ? '已复制' : state === 'fail' ? '复制失败' : label}
    </button>
  )
}
