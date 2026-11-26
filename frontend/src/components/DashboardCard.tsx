import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  color?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  isPositive = true,
  color = '#3b82f6',
}) => {
  return (
    <div className="dashboard-card">
      <div className="card-top">
        <span className="card-title">{title}</span>
        <div className="card-icon-wrap" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={22} />
        </div>
      </div>
      <div className="card-bottom">
        <h3 className="card-value">{value}</h3>
        {change && (
          <span className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
};
