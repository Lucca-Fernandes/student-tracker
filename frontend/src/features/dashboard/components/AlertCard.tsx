import { SpotlightCard } from "../../../components/SpotlightCard";
import { Monitor } from 'lucide-react';

interface AlertCardProps {
  studentName: string;
  daysInactive: number;
  onClick: () => void;
}

export function AlertCard({ studentName, onClick }: AlertCardProps) {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      <SpotlightCard className="p-6 transition-all group-hover:border-blue-500/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500/20 transition-colors">
            <Monitor size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 group-hover:text-white">{studentName}</h3>
            <p className="text-xs text-slate-500 lowercase">Host Monitorado</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}