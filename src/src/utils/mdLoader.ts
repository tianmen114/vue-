import { ref } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css'

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true
})

// Markdown 文件接口
export interface MdFile {
  id: string
  title: string
  content: string
  path: string
  date: string
  tags: string[]
  description: string
  cover?: string
  top?: number
}

// 存储所有 Markdown 文件
export const mdFiles = ref<MdFile[]>([])

// 将日期标准化为包含时间的本地 ISO 字符串（不带 Z，不做时区转换）
function formatLocalISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`
}

function ensureIsoWithTime(dateValue?: string): string {
  if (!dateValue) return formatLocalISO(new Date())
  const trimmed = dateValue.trim()

  // 仅日期：YYYY-MM-DD 或 YYYY/MM/DD -> 补全本地 00:00:00
  if (/^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(trimmed)) {
    const normalized = trimmed.replace(/\//g, '-')
    return `${normalized}T00:00:00`
  }

  // 已是完整 ISO（可包含 Z 或时区偏移）或含时间的本地格式，则直接保留
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/.test(trimmed)) {
    return trimmed
  }

  // 其他可解析格式：解析后输出本地 ISO（不带 Z）
  const d = new Date(trimmed)
  return isNaN(d.getTime()) ? formatLocalISO(new Date()) : formatLocalISO(d)
}

// 解析 Markdown 文件内容
export function parseMdContent(content: string): Partial<MdFile> {
  const lines = content.split('\n')
  const metadata: Partial<MdFile> = {}
  
  // 查找 YAML front matter
  if (lines[0]?.trim() === '---') {
    let i = 1
    while (i < lines.length && lines[i]?.trim() !== '---') {
      const line = lines[i]
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        
        switch (key) {
          case 'title':
            metadata.title = value
            break
          case 'date':
            metadata.date = value
            break
          case 'tags':
            metadata.tags = value.split(',').map(tag => tag.trim())
            break
          case 'description':
            metadata.description = value
            break
          case 'mdimg':
          case 'cover':
            metadata.cover = value
            break
          case 'top':
            const topValue = parseInt(value, 10)
            if (!isNaN(topValue)) {
              metadata.top = topValue
            }
            break
        }
      }
      i++
    }
    
    // 提取正文内容（跳过 front matter）
    const contentStart = i + 1
    metadata.content = lines.slice(contentStart).join('\n')
  } else {
    // 没有 front matter，整个内容都是正文
    metadata.content = content
  }
  
  return metadata
}

// 生成文件 ID
export function generateFileId(path: string): string {
  // 处理 Vite glob 路径格式：/public/md/filename.md
  const filename = path.split('/').pop() || path
  const basename = filename.replace(/\.md$/, '')
  return basename.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
}

// 从内容中提取标题（如果没有在 front matter 中定义）
export function extractTitle(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/)
    if (match) {
      return match[1]
    }
  }
  return 'Untitled'
}

// 从内容中提取描述
export function extractDescription(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      return line.trim().substring(0, 100) + '...'
    }
  }
  return 'No description'
}

// 加载 Markdown 文件
export async function loadMdFile(path: string): Promise<MdFile> {
  try {
    const response = await fetch(path)
    const content = await response.text()
    
    const parsed = parseMdContent(content)
    const id = generateFileId(path)
    
    return {
      id,
      title: parsed.title || extractTitle(content),
      content: parsed.content || content,
      path,
      date: ensureIsoWithTime(parsed.date),
      tags: parsed.tags || [],
      description: parsed.description || extractDescription(content),
      cover: parsed.cover,
      top: parsed.top
    }
  } catch (error) {
    console.error(`Failed to load markdown file: ${path}`, error)
    throw error
  }
}

// 获取所有 Markdown 文件（自动扫描）
export async function loadAllMdFiles(): Promise<MdFile[]> {
  const files: MdFile[] = []
  
  try {
    // 使用 Vite 的 import.meta.glob 自动扫描所有 .md 文件
    const mdModules = import.meta.glob('/public/md/**/*.md', { as: 'raw' })
    
    for (const path in mdModules) {
      try {
        const content = await mdModules[path]()
        const parsed = parseMdContent(content)
        const id = generateFileId(path)
        
        // 转换为相对路径格式（去掉 /public 前缀）
        const relativePath = path.replace('/public', '')
        
        files.push({
          id,
          title: parsed.title || extractTitle(content),
          content: parsed.content || content,
          path: relativePath,
          date: ensureIsoWithTime(parsed.date),
          tags: parsed.tags || [],
          description: parsed.description || extractDescription(content),
          cover: parsed.cover,
          top: parsed.top
        })
      } catch (error) {
        console.error(`Failed to load file: ${path}`, error)
      }
    }
    
    mdFiles.value = files
    return files
  } catch (error) {
    console.error('Failed to load markdown files:', error)
    return []
  }
}

// 根据 ID 获取文件
export function getMdFileById(id: string): MdFile | undefined {
  return mdFiles.value.find(file => file.id === id)
}

// 根据标签过滤文件
export function getMdFilesByTag(tag: string): MdFile[] {
  return mdFiles.value.filter(file => file.tags.includes(tag))
}

// 搜索文件
export function searchMdFiles(query: string): MdFile[] {
  const lowerQuery = query.toLowerCase()
  return mdFiles.value.filter(file => 
    file.title.toLowerCase().includes(lowerQuery) ||
    file.content.toLowerCase().includes(lowerQuery) ||
    file.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
