import { useContext } from 'react'
import { GroupsContext } from '../context/groups-context'

export function useGroups() {
  const ctx = useContext(GroupsContext)
  if (!ctx) throw new Error('useGroups must be used within GroupsProvider')
  return ctx
}
