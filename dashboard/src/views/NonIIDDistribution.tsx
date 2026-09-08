import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function NonIIDDistribution({ data }: { data: any }) {
  // Format data for stacked bar chart
  const chartData = data.clientPartitions.map((client: any) => ({
    name: client.clientId,
    Positive: client.classDistribution['2'] ?? client.classDistribution['positive'] ?? 0,
    Neutral: client.classDistribution['1'] ?? client.classDistribution['neutral'] ?? 0,
    Negative: client.classDistribution['0'] ?? client.classDistribution['negative'] ?? 0,
    total: client.totalSamples
  }))

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Non-IID Data Distribution</h2>
        <p className="text-slate-500 mt-1">Class imbalance analysis resulting from strict label-sorted partitioning across the federated edge.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Partition Class Skew</h3>
          <p className="text-xs text-slate-500 mt-1">Source: True allocation sizes logged during execution of `data_loader.py`</p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} label={{ value: 'Sample Count', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#64748b', fontSize: 12} }} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{fill: '#f8fafc'}}
              />
              <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
              
              <Bar dataKey="Negative" stackId="a" fill="#ef4444" name="Negative (Distress)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Neutral" stackId="a" fill="#cbd5e1" name="Neutral" />
              <Bar dataKey="Positive" stackId="a" fill="#10b981" name="Positive" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {chartData.map((client: any) => (
          <div key={client.name} className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">{client.name}</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{client.total}</div>
            <div className="text-[10px] text-slate-400 mt-1">Total Records</div>
          </div>
        ))}
      </div>
    </div>
  )
}
