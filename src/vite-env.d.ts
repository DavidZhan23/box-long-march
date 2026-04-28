/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 为 "1" 时：单 HTML 内网分发包（HashRouter、内嵌 groups 数据）；底图仍按所选源尝试联网加载 */
  readonly VITE_OFFLINE_SINGLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
