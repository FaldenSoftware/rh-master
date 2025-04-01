
import { Activity, BarChart3, Brain, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-12 h-12 text-brand-blue" />,
    title: "Testes de Inteligência Emocional",
    description: "Avalie a capacidade dos colaboradores de reconhecer, entender e gerenciar emoções em diversos contextos profissionais."
  },
  {
    icon: <Activity className="w-12 h-12 text-brand-blue" />,
    title: "Avaliação de Proatividade",
    description: "Mensure o nível de iniciativa, antecipação de problemas e capacidade de implementar soluções sem supervisão constante."
  },
  {
    icon: <Users className="w-12 h-12 text-brand-blue" />,
    title: "Perfil Comportamental",
    description: "Mapeie as características individuais e descubra como cada colaborador se comunica, toma decisões e trabalha em equipe."
  },
  {
    icon: <LayoutDashboard className="w-12 h-12 text-brand-blue" />,
    title: "Dashboard Individual",
    description: "Ofereça a cada colaborador uma visão clara de seu desempenho, pontos fortes e áreas de desenvolvimento."
  },
  {
    icon: <BarChart3 className="w-12 h-12 text-brand-blue" />,
    title: "Gamificação e Rankings",
    description: "Estimule o engajamento com elementos de competição saudável e reconhecimento de conquistas e melhorias."
  },
  {
    icon: <MessageSquare className="w-12 h-12 text-brand-blue" />,
    title: "Feedback Contínuo",
    description: "Facilite a comunicação entre líderes e equipes com ferramentas de feedback estruturado e construtivo."
  }
];

const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">Funcionalidades Completas para Desenvolvimento de Talentos</span>
            <div className="absolute -bottom-3 left-0 right-0 h-3 bg-brand-light -z-10 transform -rotate-1"></div>
          </h2>
          <p className="text-xl text-gray-600">
            Nossa plataforma oferece todas as ferramentas necessárias para transformar equipes comuns em times de alta performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 feature-card-hover animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="mb-6 p-4 bg-brand-light inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-50 to-transparent -z-10"></div>
    </section>
  );
};

export default FeaturesSection;
