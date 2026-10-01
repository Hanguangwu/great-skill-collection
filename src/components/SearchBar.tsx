import { useId } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** 🔍 search the whole album */
export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const inputId = useId()

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        搜索 Skill
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base"
      >
        🔍
      </span>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? '搜索名称 / 描述 / 标签 / 作者'}
        className="w-full rounded-full border-2 border-sand-300 bg-sand-50 py-2.5 pl-10 pr-9 text-sm text-ink-900 shadow-soft transition-colors duration-200 outline-none placeholder:text-ink-500/80 focus:border-leaf-500 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="清空搜索"
          className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-sand-300 bg-sand-200 text-xs font-bold text-ink-700 transition-colors hover:bg-sand-300 hover:text-ink-900"
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}
