interface AppStat {
  name: string;
  timeDisplay: string;
}

interface AppReportProps {
  totalTime: string;
  ranking: AppStat[];
  onPeriodChange: (periodo: string) => void;
}

export function AppReport({ totalTime, ranking, onPeriodChange }: AppReportProps) {
  return (
    <div className="space-y-6">
      {/* Filtros de Período */}
      <div className="flex gap-2">
        {['dia', 'semana', 'mes'].map((p) => (
          <button 
            key={p}
            onClick={() => onPeriodChange(p)}
            className="px-3 py-1 bg-slate-800 rounded text-[10px] font-bold uppercase hover:bg-blue-600 transition-colors"
          >
            {p === 'dia' ? 'Hoje' : p === 'semana' ? '7 Dias' : '30 Dias'}
          </button>
        ))}
      </div>

      <div className="bg-blue-600/20 p-6 rounded-2xl border border-blue-500/30">
        <p className="text-[10px] font-black uppercase mb-1">Tempo Ativo Total</p>
        <p className="text-5xl font-mono font-bold">{totalTime}</p>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-slate-500 font-black uppercase">Ranking de Apps</p>
        {ranking.map((app, i) => (
          <div key={i} className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="font-bold text-sm">#{i + 1} {app.name}</span>
            <span className="text-blue-400 font-mono">{app.timeDisplay}</span>
          </div>
        ))}
      </div>
    </div>
  );
}