import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function FederatedResults({ data }: { data: any }) {
  // Hardcoded illustrative data for Precision/Recall since demo.py doesn't log per-round metrics
  const illustrativePR = [
    { round: 1, precision: 0.81, recall: 0.82 },
    { round: 5, precision: 0.86, recall: 0.85 },
    { round: 10, precision: 0.88, recall: 0.86 },
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Federated Learning Results</h2>
        <p className="text-slate-500 mt-1">Convergence analysis over {data.metadata.numClients} decentralized edge clients.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Panel 1: Accuracy & F1 (Real Data) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Model Convergence</h3>
            <p className="text-xs text-slate-500">Source: Actual logged telemetry from federated.py</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.federatedRounds}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="round" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis domain={[0.8, 0.9]} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: any) => [(Number(value)*100).toFixed(2) + '%']}
                />
                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#2563eb" strokeWidth={2} dot={{r: 4, fill: '#2563eb'}} />
                <Line type="monotone" dataKey="f1" name="F1 Score" stroke="#0ea5e9" strokeWidth={2} dot={{r: 4, fill: '#0ea5e9'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 2: Precision vs Recall (Illustrative Placeholder) */}
        <div className="bg-white p-6 rounded-xl border border-dashed border-amber-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
            Illustrative — Replace with actual logged values
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Precision vs Recall</h3>
            <p className="text-xs text-amber-600 font-medium">Placeholder representation based on final 87.5% baseline</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={illustrativePR}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="round" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `Round ${val}`} />
                <YAxis domain={[0.7, 1.0]} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #fcd34d', backgroundColor: '#fffbeb'}}
                  formatter={(value: any) => [(Number(value)*100).toFixed(1) + '%']}
                />
                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Bar dataKey="precision" name="Precision" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="Recall" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
