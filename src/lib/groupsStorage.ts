import type { PartyGroup } from '../types'

export const GROUPS_STORAGE_KEY = 'changzheng_groups_v1'

export function loadGroupsFromStorage(): PartyGroup[] | null {
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PartyGroup[]
    if (!Array.isArray(data)) return null
    return data
  } catch {
    return null
  }
}

export function saveGroupsToStorage(groups: PartyGroup[]) {
  localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups))
}

export function exportGroupsJson(groups: PartyGroup[]) {
  const blob = new Blob([JSON.stringify(groups, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'groups.json'
  a.click()
  URL.revokeObjectURL(a.href)
}
