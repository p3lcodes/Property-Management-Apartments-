import { Users, Building2, Home, AlertCircle, LogOut, Phone, UserMinus, MessageSquareWarning, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';
/* BottomNav removed as it is handled by Layout */
import KPICard from '@/components/KPICard';
import { Button } from '@/components/ui/button';

const CaretakerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContactLandlord = () => {
    // In production, this would open WhatsApp or call
    window.open('tel:+254712345678', '_self');
  };

  return (
    <div className="min-h-screen pb-20 bg-background/50">
      <div className="md:hidden">
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.fullName}`}
          rightContent={
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-all active:scale-95"
            >
              <LogOut size={20} />
            </button>
          }
        />
      </div>

      <div className="content-area max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight hidden md:block">Caretaker Portal</h1>
             <p className="text-muted-foreground hidden md:block">Manage building operations and tenant requests, {user?.fullName}.</p>
           </div>
        </div>

        {/* Quick Actions (Simple Buttons) */}
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-4 pl-1">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate('/tenants/add')}
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Users size={18} className="mr-2" />
              Add Tenant
            </Button>

            <Button
              onClick={() => navigate('/tenants')}
              variant="outline"
              className="h-12 px-6 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-sm"
            >
              <UserMinus size={18} className="mr-2" />
              Remove Tenant
            </Button>

            <Button
              onClick={() => window.location.href = 'mailto:owner@example.com?subject=Issue Report - P3L Property'}
              variant="outline"
              className="h-12 px-6 border-warning/30 text-warning-600 hover:bg-warning/10 hover:text-warning-700 shadow-sm"
            >
              <MessageSquareWarning size={18} className="mr-2" />
              Report Issue
            </Button>
            
            <Button
              onClick={handleContactLandlord}
              variant="outline"
              className="h-12 px-6 border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary shadow-sm"
            >
              <Phone size={18} className="mr-2" />
              Contact Owner
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Users size={24} strokeWidth={2.5} />}
            label="Active Tenants"
            value="24"
            href="/tenants"
          />
          <KPICard
            icon={<Building2 size={24} strokeWidth={2.5} />}
            label="Occupied Units"
            value="24 out of 30"
            href="/units"
          />
          <KPICard
            icon={<Home size={24} strokeWidth={2.5} />}
            label="Vacant Units"
            value="6"
            href="/units?filter=vacant"
            variant="warning"
          />
          <KPICard
            icon={<AlertCircle size={24} strokeWidth={2.5} />}
            label="Overdue Tenants"
            value="3"
            href="/tenants?filter=overdue"
            variant="error"
          />
        </div>

        {/* Maintenance / Alerts List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-8">
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border/10 flex items-center justify-between bg-muted/20">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">Alerts & Maintenance</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-destructive/10 text-destructive rounded-full">3 Critical</span>
                    </div>
                    <div className="divide-y divide-border/10">
                        {[
                            { task: 'Leaking faucet', priority: 'High', unit: 'Unit A4', date: 'Today' },
                            { task: 'Hallway light replacement', priority: 'Medium', unit: 'Floor 2', date: 'Yesterday' },
                            { task: 'Fire extinguisher check', priority: 'Low', unit: 'All Units', date: 'Next Week' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${
                                        item.priority === 'High' ? 'bg-destructive' : 
                                        item.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                                    }`} />
                                    <div>
                                        <p className="font-medium text-foreground text-sm">{item.task}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-foreground">{item.unit}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.priority}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                        <ChevronRight size={16} className="text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CaretakerDashboard;
