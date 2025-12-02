import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MemoryPage from './pages/MemoryPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminMemoryCreate from './pages/AdminMemoryCreate'
import AdminMemoryEdit from './pages/AdminMemoryEdit'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/memory/:id" element={<MemoryPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/memory/create"
          element={
            <ProtectedRoute>
              <AdminMemoryCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/memory/:id"
          element={
            <ProtectedRoute>
              <AdminMemoryEdit />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


