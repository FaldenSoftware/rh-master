
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActionsCard = () => {
  const actions = [
    {
      label: "Convidar Cliente",
      icon: <UserPlus className="h-4 w-4" />,
      link: "/leader/clients"
    },
    {
      label: "Ver Relatórios",
      icon: <FileText className="h-4 w-4" />,
      link: "/leader/reports"
    },
    {
      label: "Gerenciar Clientes",
      icon: <Users className="h-4 w-4" />,
      link: "/leader/clients"
    },
    {
      label: "Configurações",
      icon: <Settings className="h-4 w-4" />,
      link: "/leader/settings"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col h-auto py-4 justify-center"
              asChild
            >
              <Link to={action.link}>
                {action.icon}
                <span className="mt-2 text-xs">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
