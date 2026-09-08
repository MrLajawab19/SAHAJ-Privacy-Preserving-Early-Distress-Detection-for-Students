import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import FederatedResults from './views/FederatedResults'
import LongitudinalAnalysis from './views/LongitudinalAnalysis'
import NonIIDDistribution from './views/NonIIDDistribution'
import ArchitectureDiagram from './views/ArchitectureDiagram'
import FederatedWorkflow from './views/FederatedWorkflow'

function App() {
  const [activeView, setActiveView] = useState('federated-results')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(d => setData(d))
      .catch(e => setError("Failed to load data.json: " + e.message))
  }, [])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center font-sans">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200 shadow-sm max-w-lg text-center">
          <h2 className="text-lg font-bold mb-2">Data Fetch Error</h2>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4 opacity-75">Ensure export_dashboard_data.py has been run and data.json exists in the public directory.</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center font-mono">Loading telemetry data...</div>
  }

  const renderView = () => {
    switch (activeView) {
      case 'federated-results':
        return <FederatedResults data={data} />
      case 'longitudinal-analysis':
        return <LongitudinalAnalysis data={data} />
      case 'non-iid-distribution':
        return <NonIIDDistribution data={data} />
      case 'architecture-diagram':
        return <ArchitectureDiagram />
      case 'federated-workflow':
        return <FederatedWorkflow />
      default:
        return <FederatedResults data={data} />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-8 bg-slate-50 border-l border-slate-200">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  )
}

export default App
