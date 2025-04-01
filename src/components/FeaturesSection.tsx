
import { Activity, BarChart3, Brain, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-10 h-10 text-brand-blue" />,
    title: "Testes de Inteligência Emocional",
    description: "Avalie a capacidade dos colaboradores de reconhecer, entender e gerenciar emoções em diversos contextos profissionais."
  },
  {
    icon: <Activity className="w-10 h-10 text-brand-blue" />,
    title: "Avaliação de Proatividade",
    description: "Mensure o nível de iniciativa, antecipação de problemas e capacidade de implementar soluções sem supervisão constante."
  },
  {
    icon: <Users className="w-10 h-10 text-brand-blue" />,
    title: "Perfil Comportamental",
    description: "Mapeie as características individuais e descubra como cada colaborador se comunica, toma decisões e trabalha em equipe."
  },
  {
    icon: <LayoutDashboard className="w-10 h-10 text-brand-blue" />,
    title: "Dashboard Individual",
    description: "Ofereça a cada colaborador uma visão clara de seu desempenho, pontos fortes e áreas de desenvolvimento."
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-brand-blue" />,
    title: "Gamificação e Rankings",
    description: "Estimule o engajamento com elementos de competição saudável e reconhecimento de conquistas e melhorias."
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-brand-blue" />,
    title: "Feedback Contínuo",
    description: "Facilite a comunicação entre líderes e equipes com ferramentas de feedback estruturado e construtivo."
  }
];

const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Funcionalidades Completas para Desenvolvimento de Talentos</h2>
          <p className="text-lg text-gray-600">
            Nossa plataforma oferece todas as ferramentas necessárias para transformar equipes comuns em times de alta performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
