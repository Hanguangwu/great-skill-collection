/**
 * Single source of truth for every project link and identity string.
 *
 * Anything that needs the repository URL, the site URL, or the owner reads it
 * from here — never hardcode `github.com/<owner>/<repo>` in a component.
 * Values come from `.env` (see `.env.example`) so renaming the repo or moving
 * to a custom domain is a one-line change, not a grep across the codebase.
 */

const DEFAULT_REPO_URL = 'https://github.com/Hanguangwu/great-skill-collection'

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

/** Repo root, no trailing slash. Derived from VITE_REPO_URL or the default. */
export const repoUrl = trimTrailingSlash(
  import.meta.env.VITE_REPO_URL?.trim() || DEFAULT_REPO_URL,
)

/** GitHub `<owner>/<repo>` slug, e.g. `Hanguangwu/great-skill-collection`. */
export const repoSlug = (() => {
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/)
  return match ? match[1] : ''
})()

/** Just the repo name, e.g. `great-skill-collection`. */
export const repoName = repoSlug.split('/')[1] || ''

export const owner = import.meta.env.VITE_OWNER?.trim() || repoSlug.split('/')[0] || ''

/** Live site. Defaults to the GitHub Pages project URL derived from repoSlug. */
export const siteUrl = trimTrailingSlash(
  import.meta.env.VITE_SITE_URL?.trim() ||
    (repoSlug ? `https://${repoSlug.split('/')[0]}.github.io/${repoSlug.split('/')[1]}` : ''),
)

export const siteTitle = '🌱 Skill Island'
export const siteSubtitle = 'My Open Agent Skills Collection'
export const tagline = import.meta.env.VITE_TAGLINE?.trim() ||
  'A small island of Agent Skills I keep coming back to.'
export const siteDescription =
  import.meta.env.VITE_SITE_DESCRIPTION?.trim() ||
  '我的智能体技能小岛 —— 可浏览、可搜索、可复制的 Agent Skills 收藏册。数据来源为标准 SKILL.md。'

/** Absolute URL to a file in the repo, e.g. `repoFile('README.md')`. */
export function repoFile(path: string): string {
  return `${repoUrl}/blob/main/${path.replace(/^\/+/, '')}`
}

/** Absolute URL to a folder in the repo, e.g. `repoTree('public/skill-hub/...')`. */
export function repoTree(path: string): string {
  return `${repoUrl}/tree/main/${path.replace(/^\/+/, '')}`
}
