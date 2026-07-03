import React from 'react';

interface OrderEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const OrderEmptyState: React.FC<OrderEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-600 mb-1">{title}</p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
