import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Building2, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const landlordNavItems: NavItem[] = [
    { icon: <Home size={22} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={22} />, label: 'Tenants', path: '/tenants' },
    { icon: <Building2 size={22} />, label: 'Units', path: '/units' },
    { icon: <Settings size={22} />, label: 'Settings', path: '/settings' },
  ];

  const caretakerNavItems: NavItem[] = [
    { icon: <Home size={22} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={22} />, label: 'Tenants', path: '/tenants' },
    { icon: <Building2 size={22} />, label: 'Units', path: '/units' },
    { icon: <UserCircle size={22} />, label: 'Profile', path: '/profile' },
  ];

  const navItems = user?.role === 'landlord' ? landlordNavItems : caretakerNavItems;

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn('nav-item flex-1', isActive && 'active')}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
