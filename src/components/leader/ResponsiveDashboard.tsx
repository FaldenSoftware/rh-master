
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus as PlusIcon, Users, ClipboardCheck, Mail } from 'lucide-react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuth } from '@/context/AuthContext';
import MetricCard from '../dashboard/MetricCard';
import RecentActivityCard from '../dashboard/RecentActivityCard';
import QuickActionsCard from '../dashboard/QuickActionsCard';

export const ResponsiveDashboard = () => {
  const breakpoint = useBreakpoint();
  const { user } = useAuth();
  
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        
        <div className="w-full md:w-auto">
          <Button className="w-full md:w-auto">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Ação
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total de Clientes"
          value="12"
          icon={<Users className="h-8 w-8 text-blue-500" />}
        />
        <MetricCard
          title="Testes Realizados"
          value="48"
          icon={<ClipboardCheck className="h-8 w-8 text-green-500" />}
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Convites Pendentes"
          value="3"
          icon={<Mail className="h-8 w-8 text-amber-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityCard />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDashboard;
