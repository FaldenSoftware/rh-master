
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export const MetricCard = ({
  title,
  value,
  icon,
  trend
}: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between py-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span 
                className={`text-xs font-medium ${
                  trend.positive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="rounded-full bg-muted p-3">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
