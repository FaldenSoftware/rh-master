
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-light border border-brand-blue/20">
              <Award className="h-4 w-4 text-brand-blue mr-2" />
              <span className="text-sm font-medium text-brand-blue">Plataforma líder em treinamento comportamental</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transforme líderes em <span className="gradient-text">alta performance</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-md">
              Uma plataforma completa para avaliar, acompanhar e desenvolver habilidades comportamentais da sua equipe.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-gray-700">Testes de proatividade e inteligência emocional</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-gray-700">Mapeamento de perfil comportamental</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-gray-700">Gamificação para engajamento contínuo</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 h-12 px-6 text-base">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 px-6 text-base">
                Agendar demonstração
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Mais de 500 empresas já transformaram seus líderes com o RH Mentor
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 animate-float">
              <div className="bg-white rounded-2xl shadow-xl p-6 border">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-center">Dashboard do Líder</h3>
                    <div className="h-44 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">85%</span>
                        </div>
                        <p className="mt-2 text-sm font-medium">Performance Média</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-light rounded-lg p-3">
                      <p className="text-xs text-gray-600">Proatividade</p>
                      <p className="text-xl font-bold text-brand-dark">92%</p>
                    </div>
                    <div className="bg-brand-light rounded-lg p-3">
                      <p className="text-xs text-gray-600">Intel. Emocional</p>
                      <p className="text-xl font-bold text-brand-dark">78%</p>
                    </div>
                    <div className="bg-brand-light rounded-lg p-3">
                      <p className="text-xs text-gray-600">Engajamento</p>
                      <p className="text-xl font-bold text-brand-dark">85%</p>
                    </div>
                    <div className="bg-brand-light rounded-lg p-3">
                      <p className="text-xs text-gray-600">Desempenho</p>
                      <p className="text-xl font-bold text-brand-dark">90%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/4 -right-6 w-28 h-28 bg-brand-purple/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 -left-6 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
