import { lazy, Suspense, useCallback, useState, type ChangeEvent } from 'react'
// import { ROUTE_TOTAL_LI, ROUTE_TOTAL_METERS } from '../data/longMarchRoute'
import { useGroups } from '../hooks/useGroups'
import {
  readTilePreference,
  writeTilePreference,
  type ActiveTileLayer,
  type MapTilePreference,
} from '../lib/mapTiles'

const LongMarchMap = lazy(() =>
  import('../components/LongMarchMap').then((m) => ({ default: m.LongMarchMap })),
)

export function MapPage() {
  const { groups, loading, error } = useGroups()
  const [tilePref, setTilePref] = useState<MapTilePreference>(() => readTilePreference())
  const [tileSource, setTileSource] = useState<ActiveTileLayer | null>(null)

  const onTileSourceChange = useCallback((s: ActiveTileLayer | null) => {
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
          深红色折线为按<strong>十八处关键节点</strong>顺序连接的示意路线（节点经纬度不变）；浅色圆点为历史节点，彩色圆点为各铁军小组位置。
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
            <option value="auto">自动（OpenStreetMap 优先，失败则用 Carto）</option>
            <option value="osm">OpenStreetMap</option>
            <option value="carto">Carto（备选）</option>
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
        {tilePref === 'carto' && '当前：Carto（备选，英文为主）。'}
        {tilePref === 'auto' && tileSource === null && '正在探测：先尝试 OpenStreetMap…'}
        {tilePref === 'auto' && tileSource === 'osm' && '自动：已选用 OpenStreetMap。'}
        {tilePref === 'auto' && tileSource === 'carto' &&
          '自动：OpenStreetMap 不可用，已改用 Carto。'}
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
