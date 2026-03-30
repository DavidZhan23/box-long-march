export function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const [lat1, lon1] = a.map((x) => (x * Math.PI) / 180) as [number, number]
  const [lat2, lon2] = b.map((x) => (x * Math.PI) / 180) as [number, number]
  const dlat = lat2 - lat1
  const dlon = lon2 - lon1
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function polylineLengthMeters(points: [number, number][]): number {
  let sum = 0
  for (let i = 0; i < points.length - 1; i++) {
    sum += haversineMeters(points[i], points[i + 1])
  }
  return sum
}

export function pointAlongPolyline(
  points: [number, number][],
  distanceMeters: number,
): [number, number] {
  if (points.length === 0) return [0, 0]
  if (points.length === 1) return points[0]
  let remaining = Math.max(0, distanceMeters)
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const seg = haversineMeters(a, b)
    if (remaining <= seg) {
      const t = seg === 0 ? 0 : remaining / seg
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    }
    remaining -= seg
  }
  return points[points.length - 1]
}
