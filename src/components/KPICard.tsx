import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  href?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const KPICard = ({ 
  icon, 
  label, 
  value, 
  subtitle, 
  href, 
  variant = 'default',
  className 
}: KPICardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  const iconColorClass = {
    default: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
  }[variant];

  return (
    <button
      onClick={handleClick}
      disabled={!href}
      className={cn(
        'kpi-card w-full text-left group relative overflow-hidden',
        href && 'cursor-pointer hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors", 
          variant === 'success' ? 'bg-success/15 text-success' :
          variant === 'warning' ? 'bg-warning/15 text-warning' :
          variant === 'error' ? 'bg-destructive/15 text-destructive' :
          'bg-primary/10 text-primary'
        )}>
          {icon}
        </div>
        {href && <ChevronRight size={18} className="text-muted-foreground/50 transition-transform group-hover:translate-x-1" />}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
        <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
      </div>
      
      {subtitle && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className={cn(
            "text-xs font-medium flex items-center gap-1",
            variant === 'success' ? 'text-success' : 
            variant === 'error' ? 'text-destructive' : 
            'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        </div>
      )}
    </button>
  );
};

export default KPICard;
