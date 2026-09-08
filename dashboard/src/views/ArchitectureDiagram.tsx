export default function ArchitectureDiagram() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">SAHAJ Architecture Diagram</h2>
        <p className="text-slate-500 mt-1">Conceptual 4-stage processing pipeline for edge deployment.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center min-h-[500px]">
        
        {/* Diagram Container */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
          
          {/* Stage 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-48 h-32 bg-slate-50 border-2 border-slate-300 rounded-lg flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 w-full bg-slate-200 py-1 text-center text-xs font-bold text-slate-700 uppercase tracking-widest">Stage 1</div>
              <span className="font-semibold text-slate-800 text-center mt-4 px-2">On-Device Capture</span>
              <span className="text-[10px] text-slate-500 mt-1 text-center">Telemetry & Messaging</span>
            </div>
          </div>

          <div className="hidden md:block w-8 h-1 bg-slate-300 relative">
            <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>

          {/* Stage 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-48 h-32 bg-blue-50 border-2 border-blue-300 rounded-lg flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 w-full bg-blue-200 py-1 text-center text-xs font-bold text-blue-800 uppercase tracking-widest">Stage 2</div>
              <span className="font-semibold text-blue-900 text-center mt-4 px-2">Hinglish NLP Processing</span>
              <span className="text-[10px] text-blue-600 mt-1 text-center">TF-IDF Feature Extraction</span>
            </div>
          </div>

          <div className="hidden md:block w-8 h-1 bg-slate-300 relative">
            <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>

          {/* Stage 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-48 h-32 bg-indigo-50 border-2 border-indigo-300 rounded-lg flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 w-full bg-indigo-200 py-1 text-center text-xs font-bold text-indigo-800 uppercase tracking-widest">Stage 3</div>
              <span className="font-semibold text-indigo-900 text-center mt-4 px-2">Longitudinal Aggregation</span>
              <span className="text-[10px] text-indigo-600 mt-1 text-center">8-Week Moving Average</span>
            </div>
          </div>

          <div className="hidden md:block w-8 h-1 bg-slate-300 relative">
            <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>

          {/* Stage 4 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-48 h-32 bg-red-50 border-2 border-red-300 rounded-lg flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 w-full bg-red-200 py-1 text-center text-xs font-bold text-red-800 uppercase tracking-widest">Stage 4</div>
              <span className="font-semibold text-red-900 text-center mt-4 px-2">Consent-Gated Escalation</span>
              <span className="text-[10px] text-red-600 mt-1 text-center">Intervention Trigger</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
