/** 探测当前网络是否能加载 OSM 官方瓦片（用于自动切换中文底图） */
export function probeOsmTile(timeoutMs = 4500): Promise<boolean> {
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
    // z=3 亚洲区域常见瓦片，存在即认为 OSM 可达
    img.src = 'https://a.tile.openstreetmap.org/3/6/3.png'
  })
}

export type MapTilePreference = 'auto' | 'osm' | 'carto'

const STORAGE_KEY = 'changzheng_map_tiles'

export function readTilePreference(): MapTilePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'osm' || v === 'carto' || v === 'auto') return v
  } catch {
    /* ignore */
  }
  return 'osm'
}

export function writeTilePreference(p: MapTilePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, p)
  } catch {
    /* ignore */
  }
}
