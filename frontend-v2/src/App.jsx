import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { HeroDashboard } from './Dashboard/dashboard';
import { SettingsPage } from './Dashboard/setting';
import AddBalancePage from './pages/AddBalancePage';
import { DashboardMain } from './pages/DashboardMain';
import Hero from './pages/hero';
import { SendMoney } from './pages/SendMoney';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import Transactions from './pages/transactions';
function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/setting" element={<SettingsPage />} />
        {/* //TODO: remove it after test */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/dashboard" element={<HeroDashboard />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/transfer" element={<DashboardMain />} />
        <Route path="/addBalance" element={<AddBalancePage />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/" element={<Hero />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App