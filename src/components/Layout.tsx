import { Link, Outlet, useLocation } from 'react-router-dom'

const nav = [
  { to: '/', label: '排行榜' },
  { to: '/map', label: '长征地图' },
  { to: '/admin', label: '数据录入' },
]

export function Layout() {
  const loc = useLocation()

  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">重走长征路</span>
        </Link>
        <nav className="nav-links" aria-label="主导航">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={loc.pathname === to ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  )
}
