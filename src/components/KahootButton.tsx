import { type ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface KahootButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  children: ReactNode;
  className?: string;
}

export function KahootButton({ variant = 'primary', children, className, ...props }: KahootButtonProps) {
  const variants = {
    primary: 'bg-blue-500 border-blue-700 text-white hover:bg-blue-400',
    secondary: 'bg-slate-500 border-slate-700 text-white hover:bg-slate-400',
    success: 'bg-green-500 border-green-700 text-white hover:bg-green-400',
    danger: 'bg-red-500 border-red-700 text-white hover:bg-red-400',
    warning: 'bg-yellow-400 border-yellow-600 text-black hover:bg-yellow-300',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, y: 4 }}
      className={twMerge(
        'px-6 py-3 rounded-xl font-bold text-lg transition-colors relative',
        'border-b-4 active:border-b-0 active:mt-1',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
