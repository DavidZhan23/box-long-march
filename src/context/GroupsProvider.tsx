import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadGroupsFromStorage, saveGroupsToStorage } from '../lib/groupsStorage'
import type { PartyGroup } from '../types'
import { GroupsContext } from './groups-context'

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<PartyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const cached = loadGroupsFromStorage()
        const res = await fetch('/data/groups.json')
        if (!res.ok) throw new Error('无法加载 /data/groups.json')
        const base = (await res.json()) as PartyGroup[]
        if (cancelled) return
        if (cached && cached.length) {
          const byId = new Map(cached.map((g) => [g.id, g]))
          // 只合并本地步数；名称、颜色以 groups.json 为准，避免改 JSON 后仍被旧缓存盖住
          const merged = base.map((g) => {
            const c = byId.get(g.id)
            if (!c) return g
            return { ...g, steps: c.steps }
          })
          const extra = cached.filter((c) => !base.some((b) => b.id === c.id))
          setGroups([...merged, ...extra])
        } else {
          setGroups(base)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => b.steps - a.steps),
    [groups],
  )

  const updateGroup = useCallback((id: string, steps: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, steps: Math.max(0, Math.floor(steps)) } : g)),
    )
  }, [])

  const setAllGroups = useCallback((next: PartyGroup[]) => {
    setGroups(next)
  }, [])

  const persist = useCallback(() => {
    saveGroupsToStorage(groups)
  }, [groups])

  const value = useMemo(
    () => ({
      groups,
      sortedGroups,
      loading,
      error,
      updateGroup,
      setAllGroups,
      persist,
    }),
    [groups, sortedGroups, loading, error, updateGroup, setAllGroups, persist],
  )

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
}
