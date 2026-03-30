import { useState } from 'react'
import { useGroups } from '../hooks/useGroups'
import { exportGroupsJson } from '../lib/groupsStorage'

export function Admin() {
  const { groups, updateGroup, persist } = useGroups()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    persist()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page admin-page">
      <h1 className="page-title">数据录入</h1>
      {/* <p className="lede narrow">
        在此填写各党小组累计步数（<strong>1 步 = 1 米</strong>）。保存后写入浏览器本地存储，
        排行榜与地图会优先使用此处数据。部署到服务器时，可将导出的 <code>groups.json</code> 放到{' '}
        <code>public/data/</code> 目录覆盖默认文件。
      </p> */}

      <div className="admin-actions">
        <button type="button" className="btn-primary" onClick={handleSave}>
          保存到本地
        </button>
        <button type="button" className="btn-ghost" onClick={() => exportGroupsJson(groups)}>
          导出 groups.json
        </button>
        {saved ? <span className="saved-hint">已保存</span> : null}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>党小组</th>
              <th>累计步数（米）</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>
                  <span className="name-dot" style={{ background: g.color }} />
                  {g.name}
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="step-input"
                    value={g.steps}
                    onChange={(e) => updateGroup(g.id, Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <p className="muted small">
        若需新增党小组，请编辑项目中的 <code>public/data/groups.json</code> 增加条目（含 id、name、steps、color），刷新页面后再录入步数。
      </p> */}
    </div>
  )
}
