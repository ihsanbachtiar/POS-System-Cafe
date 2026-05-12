import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import POS from './pages/POS'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<POS />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
