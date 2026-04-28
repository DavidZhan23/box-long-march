import type { LatLngExpression } from 'leaflet'
import { haversineMeters, pointAlongPolyline, polylineLengthMeters } from '../lib/geo'

export type MarchKeyNode = {
  order: number
  name: string
  description: string
  pos: [number, number]
}

export const MARCH_KEY_NODES: MarchKeyNode[] = [
  { order: 1, name: '瑞金', description: '长征出发地，中央红军主力集结出发。', pos: [25.8847, 116.0156] },
  { order: 2, name: '于都', description: '红军渡过于都河，正式开始战略转移。', pos: [25.9523, 115.4153] },
  { order: 3, name: '湘江', description: '血战湘江，长征中损失最惨重的一战。', pos: [25.93, 111.07] },
  { order: 4, name: '黎平', description: '召开黎平会议，改变进军方向。', pos: [26.2304, 109.1375] },
  { order: 5, name: '遵义', description: '召开遵义会议，确立正确领导，生死攸关转折点。', pos: [27.7255, 106.9276] },
  { order: 6, name: '赤水河', description: '四渡赤水，灵活机动摆脱敌军围追堵截。', pos: [28.5909, 105.6983] },
  { order: 7, name: '金沙江', description: '巧渡金沙江，跳出敌人包围圈。', pos: [26.26, 102.08] },
  { order: 8, name: '凉山（彝海）', description: '刘伯承与小叶丹彝海结盟，顺利通过彝族区。', pos: [28.545, 102.17] },
  { order: 9, name: '安顺场', description: '强渡大渡河，打开北上通道。', pos: [29.255, 102.264] },
  { order: 10, name: '泸定桥', description: '飞夺泸定桥，突破天险。', pos: [29.914, 102.234] },
  { order: 11, name: '夹金山', description: '翻越第一座大雪山。', pos: [30.85, 102.75] },
  { order: 12, name: '懋功（今小金）', description: '红一方面军与红四方面军胜利会师。', pos: [30.995, 102.364] },
  { order: 13, name: '毛儿盖', description: '召开毛儿盖会议，确定北上方针。', pos: [32.58, 103.48] },
  { order: 14, name: '松潘草地', description: '穿越茫茫水草地，环境极端艰苦。', pos: [33.58, 102.96] },
  { order: 15, name: '腊子口', description: '攻克天险腊子口，打开进入甘肃通道。', pos: [34.13, 103.92] },
  { order: 16, name: '哈达铺', description: '明确到陕北落脚的战略方向。', pos: [34.23, 104.39] },
  { order: 17, name: '吴起镇', description: '中央红军与陕北红军会师，长征胜利结束。', pos: [36.927, 108.175] },
  { order: 18, name: '会宁', description: '红一、二、四方面军会师，长征最终胜利。', pos: [35.692, 105.053] },
]

const KEY_WAYPOINTS: [number, number][] = MARCH_KEY_NODES.map((n) => n.pos)

function expandRoute(waypoints: [number, number][], segmentsPerLeg: number): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [aLat, aLng] = waypoints[i]
    const [bLat, bLng] = waypoints[i + 1]
    for (let j = 0; j < segmentsPerLeg; j++) {
      const t = j / segmentsPerLeg
      out.push([aLat + (bLat - aLat) * t, aLng + (bLng - aLng) * t])
    }
  }
  out.push(waypoints[waypoints.length - 1])
  return out
}

/** 与 expandRoute(KEY_WAYPOINTS, N) 中 N 一致，用于节点在折线上的索引 */
export const KEY_NODE_SEGMENTS_PER_LEG = 22

export const LONG_MARCH_POLYLINE = expandRoute(KEY_WAYPOINTS, KEY_NODE_SEGMENTS_PER_LEG)

/** 地图上折线的几何长度（米），仅用于比例映射，不改变各节点经纬度 */
export const LONG_MARCH_GEO_LENGTH_M = polylineLengthMeters(LONG_MARCH_POLYLINE)

/**
 * 叙事总里程：二万五千里 ≈ 一万二千五百千米。
 * 采用常用换算 1 里 = 500 米，则总步数（米）与「万里」叙事对齐。
 */
export const METERS_PER_LI = 500
export const ROUTE_TOTAL_LI = 25000
export const ROUTE_TOTAL_METERS = ROUTE_TOTAL_LI * METERS_PER_LI

/** 活动规则：每 1 步折合的米数（修改此处即可调整步长与里程的换算） */
export const METERS_PER_STEP = 0.9

/** 将界面/JSON 中保存的「步数」转为与长征叙事总里程对齐的逻辑米数 */
export function storedStepsToLogicalMeters(storedSteps: number): number {
  return Math.max(0, storedSteps) * METERS_PER_STEP
}

/**
 * 将「逻辑累计里程（米）」映射为折线上的弧长（米），再用于取点。
 * 逻辑全长 ROUTE_TOTAL_METERS 对应折线几何全长 LONG_MARCH_GEO_LENGTH_M，终点一致。
 */
export function logicalMetersToGeoDistanceAlongLine(logicalMeters: number): number {
  if (ROUTE_TOTAL_METERS <= 0) return 0
  const t = Math.min(1, Math.max(0, logicalMeters / ROUTE_TOTAL_METERS))
  return t * LONG_MARCH_GEO_LENGTH_M
}

/** @param storedSteps 各组保存的步数（整数），会先按 {@link METERS_PER_STEP} 折合为逻辑米数再映射到路线 */
export function positionAlongRouteForSteps(storedSteps: number): [number, number] {
  const logicalMeters = storedStepsToLogicalMeters(storedSteps)
  return pointAlongPolyline(LONG_MARCH_POLYLINE, logicalMetersToGeoDistanceAlongLine(logicalMeters))
}

export function polylineToLeaflet(positions: [number, number][]): LatLngExpression[] {
  return positions as LatLngExpression[]
}

/** 沿折线从起点到 polyline[targetIndex] 的累计弧长（米） */
function cumulativeDistanceAlongPolylineToIndex(
  polyline: [number, number][],
  targetIndex: number,
): number {
  if (polyline.length === 0) return 0
  const end = Math.min(Math.max(0, targetIndex), polyline.length - 1)
  let sum = 0
  for (let i = 0; i < end; i++) {
    sum += haversineMeters(polyline[i], polyline[i + 1])
  }
  return sum
}

/** 第 nodeOrder 个关键节点（1～18）在展开折线上的顶点下标 */
function polylineIndexForKeyNodeOrder(nodeOrder: number): number {
  if (nodeOrder <= 1) return 0
  if (nodeOrder >= MARCH_KEY_NODES.length) {
    return LONG_MARCH_POLYLINE.length - 1
  }
  return (nodeOrder - 1) * KEY_NODE_SEGMENTS_PER_LEG
}

/** 到达第 nodeOrder 个节点时，沿折线需走过的几何距离（米），与地图取点一致 */
export function cumulativeGeoMetersToKeyNodeOrder(nodeOrder: number): number {
  return cumulativeDistanceAlongPolylineToIndex(LONG_MARCH_POLYLINE, polylineIndexForKeyNodeOrder(nodeOrder))
}

/**
 * 根据各组保存的步数，折合为逻辑米数后，对应折线上已走距离，返回已到达的最远关键节点序号（1～18）。
 */
export function furthestKeyNodeOrderForSteps(storedSteps: number): number {
  const logicalMeters = storedStepsToLogicalMeters(storedSteps)
  const geoDist = logicalMetersToGeoDistanceAlongLine(logicalMeters)
  for (let order = MARCH_KEY_NODES.length; order >= 1; order--) {
    if (geoDist + 1e-6 >= cumulativeGeoMetersToKeyNodeOrder(order)) {
      return order
    }
  }
  return 1
}
