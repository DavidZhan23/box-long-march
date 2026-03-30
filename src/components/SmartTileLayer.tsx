import { useEffect, useMemo, useState } from 'react'
import { TileLayer } from 'react-leaflet'
import { probeOsmTile, type MapTilePreference } from '../lib/mapTiles'

type Layer = 'osm' | 'carto'

type Props = {
  preference: MapTilePreference
  onSourceChange?: (source: Layer) => void
}

export function SmartTileLayer({ preference, onSourceChange }: Props) {
  const [probeResult, setProbeResult] = useState<'idle' | 'ok' | 'fail'>('idle')

  const layer: Layer = useMemo(() => {
    if (preference === 'osm') return 'osm'
    if (preference === 'carto') return 'carto'
    return probeResult === 'ok' ? 'osm' : 'carto'
  }, [preference, probeResult])

  useEffect(() => {
    onSourceChange?.(layer)
  }, [layer, onSourceChange])

  useEffect(() => {
    if (preference !== 'auto') return
    let cancelled = false
    probeOsmTile().then((ok) => {
      if (cancelled) return
      setProbeResult(ok ? 'ok' : 'fail')
    })
    return () => {
      cancelled = true
    }
  }, [preference])

  if (layer === 'osm') {
    return (
      <TileLayer
        key="osm"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 贡献者'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={['a', 'b', 'c']}
        maxZoom={19}
        maxNativeZoom={19}
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
