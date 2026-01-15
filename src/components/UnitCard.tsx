import { Building2, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Unit {
  id: string;
  number: string;
  tenantName?: string;
  monthlyRent: number;
  arrears: number;
  isOccupied: boolean;
}

interface UnitCardProps {
  unit: Unit;
  onClick?: (unit: Unit) => void;
}

const UnitCard = ({ unit, onClick }: UnitCardProps) => {
  return (
    <button
      onClick={() => onClick?.(unit)}
      className="kpi-card w-full text-left animate-fade-in"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-lg',
            unit.isOccupied ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
          )}>
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Unit {unit.number}</h3>
            {unit.isOccupied ? (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <User size={14} />
                <span>{unit.tenantName}</span>
              </div>
            ) : (
              <span className="text-sm text-warning font-medium">Vacant</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-foreground">
              KES {unit.monthlyRent.toLocaleString()}
            </p>
            {unit.arrears > 0 && (
              <p className="text-xs text-destructive font-medium">
                -{unit.arrears.toLocaleString()} arrears
              </p>
            )}
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </div>
    </button>
  );
};

export default UnitCard;
