import { lazy, Suspense, useCallback, useState, type ChangeEvent } from 'react'
// import { ROUTE_TOTAL_LI, ROUTE_TOTAL_METERS } from '../data/longMarchRoute'
import { useGroups } from '../hooks/useGroups'
import {
  readTilePreference,
  writeTilePreference,
  type MapTilePreference,
} from '../lib/mapTiles'

const LongMarchMap = lazy(() =>
  import('../components/LongMarchMap').then((m) => ({ default: m.LongMarchMap })),
)

export function MapPage() {
  const { groups, loading, error } = useGroups()
  const [tilePref, setTilePref] = useState<MapTilePreference>(() => readTilePreference())
  const [tileSource, setTileSource] = useState<'osm' | 'carto' | null>(null)

  const onTileSourceChange = useCallback((s: 'osm' | 'carto') => {
    setTileSource(s)
  }, [])

  const handleTilePrefChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as MapTilePreference
    setTilePref(v)
    writeTilePreference(v)
    if (v === 'auto') setTileSource(null)
    else setTileSource(v)
  }

  if (loading) {
    return (
      <div className="page map-page">
        <p className="muted">正在加载…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page map-page">
        <p className="error-text">{error}</p>
      </div>
    )
  }

  return (
    <div className="page map-page">
      <div className="map-intro">
        <h1 className="page-title">长征路线大地图</h1>
        {/* <p className="lede narrow">
          深红色折线为按<strong>十八处关键节点</strong>顺序连接的示意路线（节点经纬度不变）；浅色圆点为历史节点，彩色圆点为各党小组位置。
          累计步数（米）按<strong>二万五千里</strong>叙事总里程（{ROUTE_TOTAL_LI.toLocaleString()} 里 ≈{' '}
          {(ROUTE_TOTAL_METERS / 1000).toLocaleString()} 千米，1 里 = 500 米）映射到折线弧长，达到或超过总里程则停在终点。
        </p> */}
        <div className="map-tile-toolbar">
          <label htmlFor="map-tile-pref" className="map-tile-label">
            底图来源
          </label>
          <select
            id="map-tile-pref"
            className="map-tile-select"
            value={tilePref}
            onChange={handleTilePrefChange}
          >
            {/* <option value="auto">优先中文OSM,不可用时用英文Carto</option> */}
            <option value="osm">OpenStreetMap</option>
            <option value="carto">Carto</option>
          </select>
        </div>
      </div>
      <div className="map-wrap">
        <Suspense fallback={<div className="map-loading">地图加载中…</div>}>
          <LongMarchMap
            key={tilePref}
            groups={groups}
            tilePreference={tilePref}
            onTileSourceChange={onTileSourceChange}
          />
        </Suspense>
      </div>
      <p className="map-tile-hint muted small" role="status">
        {tilePref === 'osm' && '当前：OpenStreetMap 中文底图。'}
        {tilePref === 'carto' && '当前：Carto 国际底图（英文），适合局域网或境外 CDN 受限环境。'}
        {tilePref === 'auto' && tileSource === null && '正在初始化底图…'}
        {tilePref === 'auto' && tileSource === 'carto' &&
          '自动模式：先使用 Carto 保证能出图；若探测到可访问 OpenStreetMap，会切换为中文底图。若长时间仍为英文，说明当前网络无法访问 OSM。'}
        {tilePref === 'auto' && tileSource === 'osm' && '自动模式：已切换为 OpenStreetMap 中文底图。'}
      </p>
      <ul className="map-legend">
        {groups.map((g) => (
          <li key={g.id}>
            <span className="legend-dot" style={{ background: g.color }} />
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
