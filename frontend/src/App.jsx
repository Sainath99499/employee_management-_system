import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import ListEmployeeComponent from './components/ListEmployeeComponent'
import EmployeeComponent from './components/EmployeeComponent'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <HeaderComponent />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ListEmployeeComponent />} />
            <Route path="/employees" element={<ListEmployeeComponent />} />
            <Route path="/add-employee" element={<EmployeeComponent />} />
            <Route path="/edit-employee/:id" element={<EmployeeComponent />} />
          </Routes>
        </main>

        <FooterComponent />
      </div>
    </BrowserRouter>
  )
}

export default App
