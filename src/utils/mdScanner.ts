import { ref } from 'vue'
import type { MdFile } from './mdLoader'

// 存储扫描到的文件信息
export const scannedFiles = ref<MdFile[]>([])

// 文件系统接口（用于 Node.js 环境）
interface FileSystem {
  readdirSync(path: string): string[]
  readFileSync(path: string, encoding: string): string
  statSync(path: string): { isDirectory(): boolean }
  existsSync(path: string): boolean
}

// 扫描 Markdown 文件目录
export async function scanMdDirectory(dirPath: string = '/md'): Promise<MdFile[]> {
  const files: MdFile[] = []
  
  try {
    // 在浏览器环境中，我们需要通过 API 或预定义的路径来获取文件列表
    // 这里我们使用一个示例文件列表，实际使用时可以通过 API 获取
    const fileList = await getMdFileList(dirPath)
    
    for (const filePath of fileList) {
      try {
        const file = await loadMdFileFromPath(filePath)
        if (file) {
          files.push(file)
        }
      } catch (error) {
        console.error(`Failed to load file: ${filePath}`, error)
      }
    }
    
    scannedFiles.value = files
    return files
  } catch (error) {
    console.error('Failed to scan markdown directory:', error)
    return []
  }
}

// 获取 Markdown 文件列表（模拟 API 调用）
async function getMdFileList(dirPath: string): Promise<string[]> {
  // 在实际项目中，这里应该调用后端 API 来获取文件列表
  // 或者使用 Vite 的 import.meta.glob 来动态导入
  
  // 示例文件列表
  return [
    '/md/hello-world.md',
    '/md/vue3-guide.md',
    '/md/typescript-tips.md',
    '/md/css-animations.md',
    '/md/web-development.md'
  ]
}

// 从路径加载 Markdown 文件
async function loadMdFileFromPath(filePath: string): Promise<MdFile | null> {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const content = await response.text()
    const { parseMdContent, generateFileId, extractTitle, extractDescription } = await import('./mdLoader')
    
    const parsed = parseMdContent(content)
    const id = generateFileId(filePath)
    
    return {
      id,
      title: parsed.title || extractTitle(content),
      content: parsed.content || content,
      path: filePath,
      date: parsed.date || new Date().toISOString().split('T')[0],
      tags: parsed.tags || [],
      description: parsed.description || extractDescription(content),
      top: parsed.top
    }
  } catch (error) {
    console.error(`Failed to load file from path: ${filePath}`, error)
    return null
  }
}

// 监听文件变化（在开发环境中）
export function watchMdDirectory(dirPath: string = '/md', callback?: (files: MdFile[]) => void) {
  // 在浏览器环境中，我们可以使用轮询来检查文件变化
  // 或者使用 WebSocket 来接收服务器推送的文件变化通知
  
  const pollInterval = 5000 // 5秒轮询一次
  
  const poll = async () => {
    const files = await scanMdDirectory(dirPath)
    if (callback) {
      callback(files)
    }
  }
  
  // 立即执行一次
  poll()
  
  // 设置轮询
  const intervalId = setInterval(poll, pollInterval)
  
  // 返回清理函数
  return () => {
    clearInterval(intervalId)
  }
}

// 使用 Vite 的 import.meta.glob 动态导入（推荐方式）
export async function loadMdFilesWithGlob(): Promise<MdFile[]> {
  const files: MdFile[] = []
  
  try {
    // 使用 Vite 的 import.meta.glob 来动态导入所有 .md 文件
    const mdModules = import.meta.glob('/public/md/**/*.md', { as: 'raw' })
    
    for (const path in mdModules) {
      try {
        const content = await mdModules[path]()
        const { parseMdContent, generateFileId, extractTitle, extractDescription } = await import('./mdLoader')
        
        const parsed = parseMdContent(content)
        const id = generateFileId(path)
        
        files.push({
          id,
          title: parsed.title || extractTitle(content),
          content: parsed.content || content,
          path,
          date: parsed.date || new Date().toISOString().split('T')[0],
          tags: parsed.tags || [],
          description: parsed.description || extractDescription(content),
          top: parsed.top
        })
      } catch (error) {
        console.error(`Failed to load file: ${path}`, error)
      }
    }
    
    scannedFiles.value = files
    return files
  } catch (error) {
    console.error('Failed to load markdown files with glob:', error)
    return []
  }
}

// 生成路由配置
export function generateRoutes(files: MdFile[]) {
  const routes = []
  
  for (const file of files) {
    routes.push({
      path: `/article/${file.id}`,
      name: `article-${file.id}`,
      component: () => import('@/components/MdArticleDetail.vue'),
      props: true,
      meta: {
        title: file.title,
        description: file.description,
        tags: file.tags
      }
    })
  }
  
  return routes
}

// 获取文件统计信息
export function getFileStats(files: MdFile[]) {
  const stats = {
    total: files.length,
    tags: new Set<string>(),
    dateRange: {
      earliest: null as string | null,
      latest: null as string | null
    }
  }
  
  for (const file of files) {
    // 收集标签
    file.tags.forEach(tag => stats.tags.add(tag))
    
    // 更新日期范围
    if (!stats.dateRange.earliest || file.date < stats.dateRange.earliest) {
      stats.dateRange.earliest = file.date
    }
    if (!stats.dateRange.latest || file.date > stats.dateRange.latest) {
      stats.dateRange.latest = file.date
    }
  }
  
  return {
    ...stats,
    tags: Array.from(stats.tags).sort()
  }
}
