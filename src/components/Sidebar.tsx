import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Building2, Settings, UserCircle, LogOut, PanelLeft, CreditCard, Wrench } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const landlordNavItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Tenants', path: '/tenants', badge: 8 },
    { icon: <Building2 size={20} />, label: 'Units', path: '/units', badge: 12 },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/payments' },
    { icon: <Wrench size={20} />, label: 'Maintenance', path: '/maintenance' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const caretakerNavItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Tenants', path: '/tenants', badge: 8 },
    { icon: <Building2 size={20} />, label: 'Units', path: '/units', badge: 12 },
    { icon: <Wrench size={20} />, label: 'Maintenance', path: '/maintenance' },
    { icon: <UserCircle size={20} />, label: 'Profile', path: '/profile' },
  ];

  const navItems = user?.role === 'landlord' ? landlordNavItems : caretakerNavItems;

  return (
    <div className="hidden md:flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-20",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">P</div>
              P3L Prop
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            <PanelLeft size={20} />
          </Button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className={cn(
                  "transition-colors",
                )}>
                  {item.icon}
                </div>
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!collapsed && item.badge && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
                        {item.badge}
                    </span>
                )}
                {!collapsed && isActive && !item.badge && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium",
              collapsed && "justify-center px-0"
            )}
            title="Logout"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <div className="max-w-7xl mx-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
