import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// GitHub Pages 项目页地址为 https://<用户>.github.io/<仓库名>/
// 部署时在 CI 里设置 VITE_BASE_PATH=/<仓库名>/（须与仓库名一致，含末尾 /）
// 本地开发不设则默认为根路径 /
const offline = process.env.VITE_OFFLINE_SINGLE === '1'

/** 空字符串视为未设置，否则 base 会变成 ''，BASE_URL 为空，/map 等路由下相对资源（如 images/…）会 404 */
function resolveViteBase(offlineMode: boolean): string {
  if (offlineMode) return './'
  const raw = process.env.VITE_BASE_PATH
  if (raw == null || raw.trim() === '') return '/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

function offlineHtmlPlugin(): Plugin {
  return {
    name: 'offline-strip-external',
    transformIndexHtml(html: string) {
      return html
        .replace(/<link rel="preconnect"[^>]*\/>\s*/g, '')
        .replace(/<link[^>]*fonts\.googleapis\.com[^>]*\/>\s*/g, '')
        .replace(/<link rel="icon"[^>]*\/>\s*/g, '')
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    ...(offline ? [offlineHtmlPlugin(), viteSingleFile()] : []),
  ],
  base: resolveViteBase(offline),
  server: { host: true },
  preview: { host: true },
})
