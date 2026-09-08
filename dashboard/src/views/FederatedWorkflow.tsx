export default function FederatedWorkflow() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Federated Learning Workflow</h2>
        <p className="text-slate-500 mt-1">
          Custom FedAvg implementation (scikit-learn SGDClassifier), algorithmically equivalent to Flower's FedAvg. 
          <br/><span className="text-xs text-amber-600 font-medium">Note: Training occurs in-process for this simulation, without real network transport.</span>
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
        
        {/* Central Server */}
        <div className="w-64 h-32 bg-slate-800 border-4 border-slate-900 rounded-xl shadow-lg flex flex-col items-center justify-center relative z-10">
          <span className="text-white font-bold text-lg">Aggregation Server</span>
          <span className="text-slate-300 text-xs mt-2 font-mono">Global Model W(t)</span>
          <span className="text-blue-300 text-[10px] mt-1">Weighted Averaging</span>
        </div>

        {/* Arrows Container */}
        <div className="flex w-full max-w-3xl justify-around relative -mt-4 -mb-4 z-0">
          {/* Down Arrows */}
          <div className="flex flex-col items-center justify-center h-24">
            <div className="w-0.5 h-full bg-blue-400 opacity-50 relative"></div>
            <span className="text-[10px] text-blue-600 bg-white px-1 absolute mt-[-20px] font-bold tracking-widest">BROADCAST</span>
          </div>
          <div className="flex flex-col items-center justify-center h-24">
            <div className="w-0.5 h-full bg-emerald-400 opacity-50 relative"></div>
            <span className="text-[10px] text-emerald-600 bg-white px-1 absolute mt-[-20px] font-bold tracking-widest">UPLOAD Δw</span>
          </div>
        </div>

        {/* Edge Clients */}
        <div className="flex gap-8 w-full justify-center z-10">
          
          <div className="w-48 h-32 bg-slate-50 border-2 border-slate-300 rounded-lg flex flex-col items-center justify-center shadow-sm">
            <span className="font-semibold text-slate-700">Client 1</span>
            <span className="text-xs text-slate-500 mt-1 font-mono">Local Training</span>
            <span className="text-[10px] text-slate-400 mt-1">Extract coef_ / intercept_</span>
          </div>

          <div className="w-48 h-32 bg-slate-50 border-2 border-slate-300 rounded-lg flex flex-col items-center justify-center shadow-sm">
            <span className="font-semibold text-slate-700">Client ... N</span>
            <span className="text-xs text-slate-500 mt-1 font-mono">Local Training</span>
            <span className="text-[10px] text-slate-400 mt-1">Extract coef_ / intercept_</span>
          </div>

        </div>

      </div>
    </div>
  )
}
