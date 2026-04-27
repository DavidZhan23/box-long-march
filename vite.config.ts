import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目页地址为 https://<用户>.github.io/<仓库名>/
// 部署时在 CI 里设置 VITE_BASE_PATH=/<仓库名>/（须与仓库名一致，含末尾 /）
// 本地开发不设则默认为根路径 /
const base = process.env.VITE_BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  // 开发/预览时监听 0.0.0.0，便于同一局域网（如 192.168.100.x）内手机等设备访问本机 IP
  server: { host: true },
  preview: { host: true },
})
