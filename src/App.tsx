import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { GroupsProvider } from './context/GroupsProvider'
import { Admin } from './pages/Admin'
import { Home } from './pages/Home'
import { MapPage } from './pages/MapPage'

const offlineSingle = import.meta.env.VITE_OFFLINE_SINGLE === '1'
const Router = offlineSingle ? HashRouter : BrowserRouter

/** 与 vite.config base 一致；GitHub Pages 子路径部署时必须带 basename。离线单文件用 HashRouter，不设 basename。 */
const routerBasename =
  offlineSingle || import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <GroupsProvider>
      <div className="app-root">
        <div className="app-bg-layers" aria-hidden />
        <div className="app-content">
          <Router basename={routerBasename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="map" element={<MapPage />} />
              <Route path="admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          </Router>
        </div>
      </div>
    </GroupsProvider>
  )
}
