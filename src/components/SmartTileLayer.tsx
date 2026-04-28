import { useEffect, useMemo, useState } from 'react'
import { TileLayer } from 'react-leaflet'
import { OSM_TILE_URL, probeOsmTile, type ActiveTileLayer, type MapTilePreference } from '../lib/mapTiles'

type Props = {
  preference: MapTilePreference
  onSourceChange?: (source: ActiveTileLayer | null) => void
}

export function SmartTileLayer({ preference, onSourceChange }: Props) {
  const [autoLayer, setAutoLayer] = useState<ActiveTileLayer | null>(null)

  const layer: ActiveTileLayer = useMemo(() => {
    if (preference === 'osm') return 'osm'
    if (preference === 'carto') return 'carto'
    return autoLayer ?? 'osm'
  }, [preference, autoLayer])

  useEffect(() => {
    if (preference === 'auto') onSourceChange?.(autoLayer)
    else onSourceChange?.(preference)
  }, [preference, autoLayer, onSourceChange])

  useEffect(() => {
    if (preference !== 'auto') {
      setAutoLayer(null)
      return
    }
    let cancelled = false
    setAutoLayer(null)
    ;(async () => {
      if (await probeOsmTile()) {
        if (!cancelled) setAutoLayer('osm')
        return
      }
      if (!cancelled) setAutoLayer('carto')
    })()
    return () => {
      cancelled = true
    }
  }, [preference])

  if (layer === 'osm') {
    return (
      <TileLayer
        key="osm"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://www.openstreetmap.de/">FOSSGIS</a>'
        url={OSM_TILE_URL}
        maxZoom={20}
        maxNativeZoom={20}
      />
    )
  }

  return (
    <TileLayer
      key="carto"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      subdomains={['a', 'b', 'c', 'd']}
      maxZoom={20}
    />
  )
}
