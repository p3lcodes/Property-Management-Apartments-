import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="md:hidden">
        {children}
        <BottomNav />
      </div>
      <Sidebar>
        {children}
      </Sidebar>
    </>
  );
};

export default Layout;
