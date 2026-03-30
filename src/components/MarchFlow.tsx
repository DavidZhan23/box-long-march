import { useMemo } from 'react'
import { MARCH_KEY_NODES, furthestKeyNodeOrderForSteps } from '../data/longMarchRoute'
import { useGroups } from '../hooks/useGroups'

function compareGroupIdOrder(a: string, b: string): number {
  const na = parseInt(a.replace(/\D/g, ''), 10) || 0
  const nb = parseInt(b.replace(/\D/g, ''), 10) || 0
  return na - nb
}

export function MarchFlow() {
  const { groups } = useGroups()
  const groupsInOrder = useMemo(
    () => [...groups].sort((a, b) => compareGroupIdOrder(a.id, b.id)),
    [groups],
  )
  const furthestById = new Map(
    groups.map((g) => [g.id, furthestKeyNodeOrderForSteps(g.steps)] as const),
  )

  return (
    <section className="march-flow" aria-labelledby="march-flow-title">
      <div className="march-flow-header">
        <h2 id="march-flow-title" className="march-flow-title">
          中央红军长征 · 十八处关键节点
        </h2>
        <p className="march-flow-sub">
          圆点变为彩色表示已走过该节点， <strong> 外圈高亮</strong>表示该小组处于当前节点。
        </p>
        {groupsInOrder.length > 0 && (
          <div className="march-flow-legend" aria-label="党小组图例（按第一至第六顺序）">
            {groupsInOrder.map((g) => (
              <span key={g.id} className="march-flow-legend-item">
                <span
                  className="march-flow-legend-dot"
                  style={{ background: g.color }}
                  aria-hidden
                />
                <span className="march-flow-legend-name">{g.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <ol className="march-flow-list">
        {MARCH_KEY_NODES.map((node) => {
          const allGroupsReached =
            groupsInOrder.length > 0 &&
            groupsInOrder.every((g) => (furthestById.get(g.id) ?? 1) >= node.order)

          return (
          <li
            key={node.order}
            className={[
              'march-flow-item',
              allGroupsReached && 'march-flow-item--all-complete',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="march-flow-track" aria-hidden>
              <span
                className={[
                  'march-flow-dot',
                  allGroupsReached && 'march-flow-dot--milestone',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              <span className="march-flow-line" />
            </div>
            <div className="march-flow-body">
              <div className="march-flow-top">
                <span className="march-flow-num">{node.order}</span>
                <h3 className="march-flow-name">{node.name}</h3>
              </div>
              {allGroupsReached && (
                <div
                  className="march-flow-reward"
                  role="status"
                  aria-live="polite"
                >
                  <span className="march-flow-reward-icon" aria-hidden>
                    🏅
                  </span>
                  <div className="march-flow-reward-text">
                    <span className="march-flow-reward-title">全员会师</span>
                    <span className="march-flow-reward-desc">
                      各党小组均已到达此节点
                    </span>
                  </div>
                </div>
              )}
              <p className="march-flow-desc">{node.description}</p>
              {groupsInOrder.length > 0 && (
                <div
                  className={[
                    'march-flow-groups',
                    allGroupsReached && 'march-flow-groups--all-complete',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={`${node.name}：各党小组进度（第一至第六顺序）`}
                >
                  {groupsInOrder.map((g) => {
                    const furthest = furthestById.get(g.id) ?? 1
                    const passed = furthest >= node.order
                    const current = furthest === node.order
                    return (
                      <span
                        key={g.id}
                        className={[
                          'march-flow-group-dot',
                          passed && 'march-flow-group-dot--passed',
                          current && 'march-flow-group-dot--current',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          background: passed ? g.color : 'transparent',
                          borderColor: g.color,
                          ...(current
                            ? {
                                boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.98), 0 0 0 5px ${g.color}`,
                              }
                            : {}),
                        }}
                        title={
                          current
                            ? `${g.name}：当前约在此节点`
                            : passed
                              ? `${g.name}：已走过此处（当前约在第 ${furthest} 站）`
                              : `${g.name}：尚未到达（当前约在第 ${furthest} 站）`
                        }
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </li>
          )
        })}
      </ol>
    </section>
  )
}
