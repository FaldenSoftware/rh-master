
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, FileText, Mail } from 'lucide-react';

interface Activity {
  id: string;
  type: 'new_client' | 'completed_test' | 'invitation';
  title: string;
  description: string;
  timestamp: Date;
}

export const RecentActivityCard = () => {
  // Exemplo de dados de atividades recentes
  const activities: Activity[] = [
    {
      id: '1',
      type: 'new_client',
      title: 'Novo cliente registrado',
      description: 'Maria Silva criou uma conta',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
    },
    {
      id: '2',
      type: 'completed_test',
      title: 'Teste completado',
      description: 'João Santos finalizou o Perfil Animal',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
    },
    {
      id: '3',
      type: 'invitation',
      title: 'Convite aceito',
      description: 'Ana Oliveira aceitou seu convite',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 horas atrás
    }
  ];

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} anos atrás`;
    if (interval === 1) return "1 ano atrás";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} meses atrás`;
    if (interval === 1) return "1 mês atrás";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} dias atrás`;
    if (interval === 1) return "1 dia atrás";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} horas atrás`;
    if (interval === 1) return "1 hora atrás";
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutos atrás`;
    if (interval === 1) return "1 minuto atrás";
    
    return "Agora mesmo";
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'new_client':
        return <UserRound className="h-5 w-5 text-blue-500" />;
      case 'completed_test':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'invitation':
        return <Mail className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-2">
                {getActivityIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
