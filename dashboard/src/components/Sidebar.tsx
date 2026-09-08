import { Activity, Database, Network, LayoutTemplate, Workflow } from 'lucide-react'

const views = [
  { id: 'federated-results', name: 'Federated Results', icon: Activity },
  { id: 'longitudinal-analysis', name: 'Longitudinal Analysis', icon: Network },
  { id: 'non-iid-distribution', name: 'Non-IID Distribution', icon: Database },
  { id: 'architecture-diagram', name: 'Architecture Diagram', icon: LayoutTemplate },
  { id: 'federated-workflow', name: 'Federated Workflow', icon: Workflow },
]

export default function Sidebar({ activeView, setActiveView }: { activeView: string, setActiveView: (v: string) => void }) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">SAHAJ Internal</h1>
        <p className="text-xs text-slate-500 font-mono mt-1">RESEARCH DASHBOARD</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {views.map((view) => {
          const Icon = view.icon
          const isActive = activeView === view.id
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
              {view.name}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Simulation Env</div>
        <div className="text-xs text-slate-500 font-mono space-y-1">
          <div>Clients: 5 (Non-IID)</div>
          <div>Records: 800</div>
          <div>Model: SGDClassifier</div>
        </div>
      </div>
    </div>
  )
}
