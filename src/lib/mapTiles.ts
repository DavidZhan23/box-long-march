/**
 * 使用 FOSSGIS 德国镜像（https://tile.openstreetmap.de/），与 OSM 官方数据一致，WGS84/Web 墨卡托，无 API Key。
 * 官方 tile.openstreetmap.org 在部分地区易被拦，故项目统一只用此镜像作为「OSM」底图。
 */
export const OSM_TILE_URL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png'

/** 当前实际使用的栅格底图（不含「自动」） */
export type ActiveTileLayer = 'osm' | 'carto'

export type MapTilePreference = 'auto' | ActiveTileLayer

const STORAGE_KEY = 'changzheng_map_tiles'

function probeTile(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const finish = (ok: boolean) => {
      window.clearTimeout(t)
      img.onload = null
      img.onerror = null
      resolve(ok)
    }
    const t = window.setTimeout(() => finish(false), timeoutMs)
    img.onload = () => finish(true)
    img.onerror = () => finish(false)
    img.src = url
  })
}

/** 探测德国 OSM 镜像是否可达 */
export function probeOsmTile(timeoutMs = 3500): Promise<boolean> {
  return probeTile('https://tile.openstreetmap.de/3/6/3.png', timeoutMs)
}

function normalizeStoredPreference(v: string): MapTilePreference | null {
  if (v === 'auto' || v === 'osm' || v === 'carto') return v
  // 旧版选项迁移到仅存的两种底图
  if (v === 'osm-de' || v === 'tracestrack-zh') return 'osm'
  return null
}

export function readTilePreference(): MapTilePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v != null) {
      const n = normalizeStoredPreference(v)
      if (n) return n
    }
  } catch {
    /* ignore */
  }
  return 'auto'
}

export function writeTilePreference(p: MapTilePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, p)
  } catch {
    /* ignore */
  }
}
