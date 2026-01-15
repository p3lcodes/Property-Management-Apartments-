import { Wallet, Users, Building2, AlertCircle, FileText, ArrowRight, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '@/lib/store';
import PageHeader from '@/components/PageHeader';
import KPICard from '@/components/KPICard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandlordDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeTenants: 0,
    rentCollected: 0,
    rentTarget: 0,
    occupancy: 0,
    totalUnits: 0,
    overdueCount: 0,
  });

  useEffect(() => {
    const tenants = db.getTenants();
    const totalTenants = tenants.length;
    const overdueCount = tenants.filter(t => t.balance > 0).length;
    const totalCollected = tenants.reduce((sum, t) => sum + (t.rentAmount - t.balance), 0);
    const totalTarget = tenants.reduce((sum, t) => sum + t.rentAmount, 0);
    
    setStats({
      activeTenants: totalTenants,
      rentCollected: totalCollected,
      rentTarget: totalTarget,
      occupancy: totalTenants,
      totalUnits: 30,
      overdueCount: overdueCount,
    });
  }, []);

  // Mock Recent Activities
  const recentActivities = [
      { id: 1, type: 'payment', title: 'Rent Received', desc: 'KES 25,000 from Unit A2 (James Omondi)', time: '2 hours ago', amount: '+25,000' },
      { id: 2, type: 'issue', title: 'Maintenance Request', desc: 'Leaking tap reported in Unit B1', time: '5 hours ago', status: 'Pending' },
      { id: 3, type: 'tenant', title: 'New Tenant', desc: 'Mary Wanjiku moved into Unit A1', time: '1 day ago', status: 'Active' },
      { id: 4, type: 'payment', title: 'Rent Received', desc: 'KES 18,000 from Unit C3', time: '1 day ago', amount: '+18,000' },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background/50">
      {/* Mobile Header */}
      <div className="md:hidden">
        <PageHeader
          title="Home"
          subtitle={`Welcome, ${user?.fullName?.split(' ')[0] || 'Landlord'}`}
          rightContent={
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                  <SettingsIcon size={20} />
              </Button>
          }
        />
      </div>

      <div className="content-area max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col gap-1 mb-8">
             <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {user?.fullName || 'Landlord'}</h1>
             <p className="text-muted-foreground">Here is what is happening with your property today.</p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-9 gap-2 shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={() => navigate('/tenants')}>
                <Users size={14} /> Manage Tenants
            </Button>
            <Button size="sm" variant="outline" className="h-9 gap-2 shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={() => navigate('/units')}>
                <Building2 size={14} /> Manage Units
            </Button>
            <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={() => navigate('/reports')}>
                <FileText size={14} /> Generate Report
            </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Wallet size={24} className="text-primary" />}
            label="Rent Collected"
            value={`KES ${(stats.rentCollected / 1000).toFixed(0)}K`}
            subtitle={`Target: KES ${(stats.rentTarget / 1000).toFixed(0)}K`}
            href="/payments"
            variant="success" 
          />
          <KPICard
            icon={<Users size={24} className="text-blue-600" />}
            label="Active Tenants"
            value={stats.activeTenants.toString()}
            subtitle="Total Tenants"
            href="/tenants"
            variant="default"
          />
          <KPICard
            icon={<Building2 size={24} className="text-emerald-600" />}
            label="Occupancy"
            value={`${stats.occupancy}/${stats.totalUnits}`}
            subtitle={`${Math.round((stats.occupancy / stats.totalUnits) * 100)}% Occupied`}
            href="/units"
            variant="default"
          />
          <KPICard
            icon={<AlertCircle size={24} className="text-red-500" />}
            label="Overdue"
            value={stats.overdueCount.toString()}
            subtitle="Tenants in Arrears"
            href="/tenants?filter=arrears"
            variant="error" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
                    <Button variant="link" className="text-primary p-0 h-auto">View All</Button>
                </div>
                
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                    activity.type === 'payment' ? 'bg-green-100/50 text-green-700' :
                                    activity.type === 'issue' ? 'bg-orange-100/50 text-orange-700' :
                                    'bg-blue-100/50 text-blue-700'
                                }`}>
                                    {activity.type === 'payment' ? <Wallet size={18} /> : 
                                     activity.type === 'issue' ? <AlertCircle size={18} /> : 
                                     <Users size={18} />}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{activity.title}</p>
                                    <p className="text-sm text-muted-foreground">{activity.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {activity.amount && <p className="font-bold text-green-700">{activity.amount}</p>}
                                {activity.status && <Badge variant="outline" className="font-normal">{activity.status}</Badge>}
                                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Column */}
            <div className="space-y-6">
                 {/* Mini Stats or Info */}
                 <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-5 border border-primary/10">
                    <h3 className="font-semibold text-primary mb-2">Did you know?</h3>
                    <p className="text-sm text-muted-foreground">You can automate rent reminders in Settings to reduce overdue payments by upto 40%.</p>
                    <Button variant="link" onClick={() => navigate('/settings')} className="px-0 text-primary mt-2 h-auto text-xs font-bold">Configure Reminders &rarr;</Button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
