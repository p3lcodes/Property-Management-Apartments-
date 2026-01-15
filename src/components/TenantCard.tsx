import { Phone, Pencil, Trash2, MessageSquare, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  unit: string;
  monthlyRent: number;
  balance: number;
  status: 'paid' | 'partial' | 'overdue';
}

interface TenantCardProps {
  tenant: Tenant;
  isLandlord?: boolean;
  onEdit?: (tenant: Tenant) => void;
  onDelete?: (tenant: Tenant) => void;
  onRequestRent?: (tenant: Tenant) => void;
  onContact?: (tenant: Tenant) => void;
  onClick?: (tenant: Tenant) => void;
}

const TenantCard = ({
  tenant,
  isLandlord = false,
  onEdit,
  onDelete,
  onRequestRent,
  onContact,
  onClick,
}: TenantCardProps) => {
  const statusConfig = {
    paid: { label: 'Paid', className: 'badge-success' },
    partial: { label: 'Partial', className: 'badge-warning' },
    overdue: { label: 'Overdue', className: 'badge-error' },
  };

  const status = statusConfig[tenant.status];

  return (
    <div
      className="kpi-card animate-fade-in"
      onClick={() => onClick?.(tenant)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{tenant.name}</h3>
            <span className={status.className}>{status.label}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <Phone size={14} />
            <span>{tenant.phone}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Unit {tenant.unit} • KES {tenant.monthlyRent.toLocaleString()}/mo
          </p>
        </div>
      </div>

      {(isLandlord || onContact) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          {isLandlord && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tenant);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
          {isLandlord && onRequestRent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestRent(tenant);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm font-medium transition-colors"
            >
              <CreditCard size={14} />
              Request
            </button>
          )}
          {onContact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContact(tenant);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-success text-success-foreground hover:bg-success/90 text-sm font-medium transition-colors"
            >
              <MessageSquare size={14} />
              Contact
            </button>
          )}
          {isLandlord && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tenant);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium transition-colors ml-auto"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantCard;
