import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MarchFlow } from '../components/MarchFlow'
import { MarchReadingSection } from '../components/MarchReadingSection'
import { ROUTE_TOTAL_LI, ROUTE_TOTAL_METERS, storedStepsToLogicalMeters } from '../data/longMarchRoute'
import { useGroups } from '../hooks/useGroups'

function medal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}`
}

export function Home() {
  const { sortedGroups, loading, error } = useGroups()
  const totalLogicalMeters = useMemo(
    () => sortedGroups.reduce((sum, g) => sum + storedStepsToLogicalMeters(g.steps), 0),
    [sortedGroups],
  )

  if (loading) {
    return (
      <div className="page home-page">
        <p className="muted">正在加载数据…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page home-page">
        <p className="error-text">{error}</p>
      </div>
    )
  }

  return (
    <div className="page home-page">
      <header className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-left">
            <p className="eyebrow home-hero-eyebrow">重走长征路 · 主题活动</p>
            <div className="home-hero-title-wrap">
              <h1 className="home-hero-title">北中心重走长征路</h1>
              <p className="home-hero-lede"></p>
            </div>
            <div className="home-hero-actions">
              <Link to="/map" className="btn-primary">
                打开长征大地图
              </Link>
              <a href="#march-route" className="btn-ghost home-hero-scroll">
                浏览十八处关键节点
              </a>
            </div>
          </div>
          <div className="home-hero-panel">
            <span className="home-hero-panel-label">长征总里程</span>
            <span className="home-hero-panel-value">{ROUTE_TOTAL_LI.toLocaleString()}</span>
            <span className="home-hero-panel-unit">里</span>
            <span className="home-hero-panel-sub">
              约 {(ROUTE_TOTAL_METERS / 1000).toLocaleString()} 千米
            </span>
          </div>
        </div>
      </header>

      <section className="home-rank" aria-labelledby="home-rank-title">
        <div className="home-rank-intro">
          <div className="home-rank-intro-text">
            <h2 id="home-rank-title" className="home-section-title">
              各铁军小组实时排行
            </h2>
          </div>
          <ul className="home-stat-pills" aria-label="数据概览">
            <li className="home-stat-pill">
              <span className="home-stat-pill-value">{sortedGroups.length}</span>
              <span className="home-stat-pill-label">参与小组</span>
            </li>
            <li className="home-stat-pill">
              <span className="home-stat-pill-value">
                {Math.round(totalLogicalMeters).toLocaleString()}
              </span>
              <span className="home-stat-pill-label">累计折合里程（米）</span>
            </li>
            <li className="home-stat-pill home-stat-pill--accent">
              <span className="home-stat-pill-value">{ROUTE_TOTAL_METERS.toLocaleString()}</span>
              <span className="home-stat-pill-label">长征总长度（米）</span>
            </li>
          </ul>
        </div>

        <div className="rank-card home-rank-card">
          <div className="rank-table-wrap">
            <table className="rank-table">
              <thead>
                <tr>
                  <th scope="col" className="rank-th rank-th--medal">
                    排名
                  </th>
                  <th scope="col" className="rank-th rank-th--name">
                    铁军小组
                  </th>
                  <th scope="col" className="rank-th rank-th--num">
                    累计步数
                  </th>
                  <th scope="col" className="rank-th rank-th--num">
                    折合里程（米）
                  </th>
                  <th scope="col" className="rank-th rank-th--progress">
                    路线进度
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedGroups.map((g, i) => {
                  const rank = i + 1
                  const logicalM = storedStepsToLogicalMeters(g.steps)
                  const pct =
                    ROUTE_TOTAL_METERS > 0
                      ? Math.min(100, (logicalM / ROUTE_TOTAL_METERS) * 100)
                      : 0
                  const trClass = [
                    'rank-tr',
                    rank <= 3 && 'rank-tr--top',
                    rank === 1 && 'rank-tr--first',
                  ]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <tr key={g.id} className={trClass}>
                      <td className="rank-td rank-td--medal">
                        <span className="rank-medal" title={`第 ${rank} 名`}>
                          {medal(rank)}
                        </span>
                      </td>
                      <td className="rank-td rank-td--name">
                        <div className="rank-name-col">
                          <span className="rank-name">
                            <span className="name-dot" style={{ background: g.color }} />
                            {g.name}
                          </span>
                          {g.members && g.members.length > 0 ? (
                            <span className="rank-members" aria-label={`${g.name}成员`}>
                              {g.members.join('、')}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="rank-td rank-td--num rank-td--steps" title="录入的原始步数">
                        {g.steps.toLocaleString()}
                      </td>
                      <td className="rank-td rank-td--num rank-td--meters">
                        {Math.round(logicalM).toLocaleString()}
                      </td>
                      <td className="rank-td rank-td--progress">
                        <div className="rank-progress">
                          <span className="progress-bar" aria-hidden>
                            <span className="progress-fill" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="progress-label">{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="march-route" className="home-march-wrap" aria-labelledby="march-flow-title">
        <div className="home-march-anchor">
          <span className="home-march-kicker">延伸阅读</span>
          <p className="home-march-lead muted small">
            以下为中央红军长征十八处关键节点
          </p>
        </div>
        <MarchFlow />
      </section>

      <MarchReadingSection />
    </div>
  )
}
