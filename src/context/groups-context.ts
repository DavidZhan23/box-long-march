import { createContext } from 'react'
import type { PartyGroup } from '../types'

export type GroupsCtx = {
  groups: PartyGroup[]
  sortedGroups: PartyGroup[]
  loading: boolean
  error: string | null
  updateGroup: (id: string, steps: number) => void
  setAllGroups: (next: PartyGroup[]) => void
  persist: () => void
}

export const GroupsContext = createContext<GroupsCtx | null>(null)
