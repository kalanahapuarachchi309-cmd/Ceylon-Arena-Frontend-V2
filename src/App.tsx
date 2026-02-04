import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import Register from './components/Register'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Payment from './components/Payment'
import CosplayRegistration from './components/CosplayRegistration';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cosplay" element={<CosplayRegistration />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  )
}

export default App
