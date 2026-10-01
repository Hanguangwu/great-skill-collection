import type { SkillCategory } from '@/types/skill'

export type CategoryMeta = {
  /** island name in english */
  label: string
  /** island name in chinese */
  zh: string
  emoji: string
  blurb: string
  sampleTags: string[]
  /** big colored island plate */
  plate: string
  plateDeep: string
  chip: string
  text: string
  wash: string
  dot: string
}

export const CATEGORY_META: Record<SkillCategory, CategoryMeta> = {
  coding: {
    label: 'Coding Village',
    zh: '编程村',
    emoji: '🏡',
    blurb: '写代码、查 bug、把界面搭起来 —— 技术居民都住在这座村子里。',
    sampleTags: ['Frontend', 'Backend', 'DevOps'],
    plate: 'bg-leaf-400',
    plateDeep: 'bg-leaf-600',
    chip: 'bg-leaf-300/45 text-leaf-700 border-leaf-500/60',
    text: 'text-leaf-700',
    wash: 'bg-leaf-300/15',
    dot: 'bg-leaf-600',
  },
  research: {
    label: 'Knowledge Forest',
    zh: '知识森林',
    emoji: '📚',
    blurb: '读论文、查资料、做摘要 —— 越走越深的那片林子。',
    sampleTags: ['Paper Reading', 'Research', 'Summary'],
    plate: 'bg-ocean-400',
    plateDeep: 'bg-ocean-500',
    chip: 'bg-ocean-300/45 text-ocean-500 border-ocean-400/60',
    text: 'text-ocean-500',
    wash: 'bg-ocean-300/15',
    dot: 'bg-ocean-500',
  },
  creative: {
    label: 'Creative Workshop',
    zh: '创作工坊',
    emoji: '🎨',
    blurb: '写文案、做图稿、想点子 —— 灵感在这里加工成成品。',
    sampleTags: ['Image Prompt', 'Writing', 'Design'],
    plate: 'bg-mango-300',
    plateDeep: 'bg-mango-400',
    chip: 'bg-mango-300/45 text-ink-900 border-mango-400/70',
    text: 'text-ink-900',
    wash: 'bg-mango-300/15',
    dot: 'bg-mango-400',
  },
  life: {
    label: 'Life Harbor',
    zh: '生活港',
    emoji: '🌊',
    blurb: '旅行、学习、日程安排 —— 出岛和回岛都从这里出发。',
    sampleTags: ['Travel', 'Learning', 'Planning'],
    plate: 'bg-coral-300',
    plateDeep: 'bg-coral-500',
    chip: 'bg-coral-300/45 text-coral-500 border-coral-400/70',
    text: 'text-coral-500',
    wash: 'bg-coral-300/15',
    dot: 'bg-coral-500',
  },
}

export const CATEGORY_ORDER: SkillCategory[] = ['coding', 'research', 'creative', 'life']
