/**
 * 拼接 Vite `public/` 资源的访问路径，随 `import.meta.env.BASE_URL` 变化（子路径部署、单文件离线包等）。
 * 路径分段做 encodeURIComponent，避免少数环境下非 ASCII 文件名异常。
 */
export function publicUrl(assetPath: string): string {
  const trimmed = assetPath.replace(/^\/+/, '')
  const encodedRel = trimmed.split('/').map(encodeURIComponent).join('/')
  const base = (import.meta.env.BASE_URL ?? '/').trim()
  if (base === '' || base === '/' || base === '//') {
    return `/${encodedRel}`
  }
  if (base === '.' || base === './') {
    return `./${encodedRel}`
  }
  const root = base.replace(/\/+$/, '')
  return `${root}/${encodedRel}`
}
