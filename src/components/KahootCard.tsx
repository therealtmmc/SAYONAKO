import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface KahootCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  color?: 'white' | 'purple' | 'blue';
}

export function KahootCard({ children, className, title, color = 'white' }: KahootCardProps) {
  const colors = {
    white: 'bg-white border-slate-200',
    purple: 'bg-purple-100 border-purple-300',
    blue: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={twMerge(
      'rounded-2xl p-6 shadow-sm border-b-4',
      colors[color],
      className
    )}>
      {title && (
        <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
