import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Applications from './pages/Applications'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/applications" element={<Applications />} />
      </Routes>
    </Layout>
  )
}

export default App

