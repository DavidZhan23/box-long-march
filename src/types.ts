export type PartyGroup = {
  id: string
  name: string
  steps: number
  color: string
  /** 小组成员姓名（与 public/data/groups.json 配置；不含部门） */
  members?: string[]
}
