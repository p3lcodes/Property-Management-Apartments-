import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightContent?: ReactNode;
}

const PageHeader = ({ title, subtitle, showBack = false, rightContent }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm font-medium opacity-80 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
