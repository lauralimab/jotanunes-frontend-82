import { Navigate, Route, Routes } from 'react-router-dom'

import InternalLayout from './layouts/InternalLayout'
import CompaniesPage from '../pages/empresas/Companies'
import DashboardPage from '../pages/inicio/Dashboard'
import NotFoundPage from '../pages/erros/NaoEncontrado'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<InternalLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes