import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import EditorDemo from './pages/EditorDemo'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 border-b bg-white">
        <nav className="container mx-auto flex gap-4">
          <Link to="/" className="font-semibold">Home</Link>
          <Link to="/editor" className="font-semibold">Editor Demo</Link>
        </nav>
      </header>
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<EditorDemo />} />
        </Routes>
      </main>
    </div>
  )
}
