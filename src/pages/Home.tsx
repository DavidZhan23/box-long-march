import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MarchFlow } from '../components/MarchFlow'
import { MarchReadingSection } from '../components/MarchReadingSection'
import { ROUTE_TOTAL_LI, ROUTE_TOTAL_METERS } from '../data/longMarchRoute'
import { useGroups } from '../hooks/useGroups'

function medal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}`
}

export function Home() {
  const { sortedGroups, loading, error } = useGroups()
  const totalSteps = useMemo(
    () => sortedGroups.reduce((sum, g) => sum + g.steps, 0),
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
              各党小组实时排行
            </h2>
          </div>
          <ul className="home-stat-pills" aria-label="数据概览">
            <li className="home-stat-pill">
              <span className="home-stat-pill-value">{sortedGroups.length}</span>
              <span className="home-stat-pill-label">参与小组</span>
            </li>
            <li className="home-stat-pill">
              <span className="home-stat-pill-value">{totalSteps.toLocaleString()}</span>
              <span className="home-stat-pill-label">累计总步数（米）</span>
            </li>
            <li className="home-stat-pill home-stat-pill--accent">
              <span className="home-stat-pill-value">{ROUTE_TOTAL_METERS.toLocaleString()}</span>
              <span className="home-stat-pill-label">长征总长度（米）</span>
            </li>
          </ul>
        </div>

        <div className="rank-card home-rank-card">
          <header className="rank-head">
            <span>排名</span>
            <span>党小组</span>
            <span>累计步数（米）</span>
            <span>路线进度</span>
          </header>
          <ul className="rank-list">
            {sortedGroups.map((g, i) => {
              const rank = i + 1
              const pct =
                ROUTE_TOTAL_METERS > 0 ? Math.min(100, (g.steps / ROUTE_TOTAL_METERS) * 100) : 0
              const rowClass = ['rank-row', rank <= 3 && 'rank-row--top', rank === 1 && 'rank-row--first']
                .filter(Boolean)
                .join(' ')
              return (
                <li key={g.id} className={rowClass}>
                  <span className="rank-medal" title={`第 ${rank} 名`}>
                    {medal(rank)}
                  </span>
                  <span className="rank-name">
                    <span className="name-dot" style={{ background: g.color }} />
                    {g.name}
                  </span>
                  <span className="rank-steps">{g.steps.toLocaleString()}</span>
                  <span className="rank-progress">
                    <span className="progress-bar" aria-hidden>
                      <span className="progress-fill" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="progress-label">{pct.toFixed(1)}%</span>
                  </span>
                </li>
              )
            })}
          </ul>
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
