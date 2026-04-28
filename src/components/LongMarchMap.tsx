import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, Tooltip, useMap } from 'react-leaflet'
import { SmartTileLayer } from './SmartTileLayer'
import 'leaflet/dist/leaflet.css'
import {
  LONG_MARCH_POLYLINE,
  MARCH_KEY_NODES,
  polylineToLeaflet,
  ROUTE_TOTAL_METERS,
  positionAlongRouteForSteps,
  storedStepsToLogicalMeters,
} from '../data/longMarchRoute'
import type { ActiveTileLayer, MapTilePreference } from '../lib/mapTiles'
import type { PartyGroup } from '../types'

/** 懒加载后或部分网络环境下容器尺寸未就绪，需 invalidateSize 否则底图空白 */
function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    const run = () => map.invalidateSize()
    run()
    const timers = [50, 200, 500].map((ms) => window.setTimeout(run, ms))
    window.addEventListener('resize', run)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', run)
    }
  }, [map])
  return null
}

function FitBounds({ groups }: { groups: PartyGroup[] }) {
  const map = useMap()
  useEffect(() => {
    const positions = groups.map((g) => positionAlongRouteForSteps(g.steps))
    const all = [...LONG_MARCH_POLYLINE, ...positions]
    if (all.length === 0) return
    const bounds = L.latLngBounds(all.map((p) => L.latLng(p[0], p[1])))
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 7 })
  }, [map, groups])
  return null
}

type Props = {
  groups: PartyGroup[]
  tilePreference: MapTilePreference
  onTileSourceChange?: (source: ActiveTileLayer | null) => void
}

export function LongMarchMap({ groups, tilePreference, onTileSourceChange }: Props) {
  const markers = useMemo(
    () =>
      groups.map((g) => {
        const pos = positionAlongRouteForSteps(g.steps)
        const logicalM = storedStepsToLogicalMeters(g.steps)
        const pct =
          ROUTE_TOTAL_METERS > 0 ? Math.min(100, (logicalM / ROUTE_TOTAL_METERS) * 100) : 0
        return { group: g, pos, pct, logicalM }
      }),
    [groups],
  )

  const center: [number, number] = [30.2, 107.5]

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="leaflet-map"
      scrollWheelZoom
    >
      <SmartTileLayer preference={tilePreference} onSourceChange={onTileSourceChange} />
      <MapResizeFix />
      <Polyline
        positions={polylineToLeaflet(LONG_MARCH_POLYLINE)}
        pathOptions={{
          color: '#c41e3a',
          weight: 5,
          opacity: 0.92,
        }}
      />
      {MARCH_KEY_NODES.map((node) => (
        <CircleMarker
          key={node.order}
          center={node.pos}
          radius={7}
          pathOptions={{
            color: '#b71c1c',
            fillColor: '#fff8e7',
            fillOpacity: 0.98,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
            {`${node.order}. ${node.name}`}
          </Tooltip>
          <Popup>
            <div className="map-node-popup">
              <strong>
                {node.order}. {node.name}
              </strong>
              <p>{node.description}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {markers.map(({ group, pos, pct, logicalM }) => (
        <CircleMarker
          key={group.id}
          center={pos}
          radius={10}
          pathOptions={{
            color: '#fffef8',
            fillColor: group.color,
            fillOpacity: 0.95,
            weight: 3,
          }}
        >
          <Popup>
            <strong>{group.name}</strong>
            <br />
            累计步数：{group.steps.toLocaleString()} 步
            <br />
            折合里程：{Math.round(logicalM).toLocaleString()} 米
            <br />
            路线进度：{pct.toFixed(1)}%
          </Popup>
        </CircleMarker>
      ))}
      <FitBounds groups={groups} />
    </MapContainer>
  )
}
