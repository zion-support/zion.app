/** Performance Metrics & Lead Generation Stats for Client Visibility */
export function MonitoringStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-purple-400">52</div>
        <div className="text-xs text-slate-400">Total Services</div>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-emerald-400">16</div>
        <div className="text-xs text-slate-400">Ready Leads</div>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-blue-400">10</div>
        <div className="text-xs text-slate-400">Agents Fleet</div>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-pink-400">926</div>
        <div className="text-xs text-slate-400">Pages Built</div>
      </div>
    </div>
  );
}