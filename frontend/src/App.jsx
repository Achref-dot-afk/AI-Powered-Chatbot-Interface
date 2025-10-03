import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/authPage.jsx'
import Index from './pages/index.jsx'
import LandingPage from './pages/landingPage.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/chat" element={<Index />} />
    </Routes>
  )
}

export default App
