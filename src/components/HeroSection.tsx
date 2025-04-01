
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, CheckCircle, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light/50 to-white -z-10"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-md border border-brand-blue/10">
              <Award className="h-5 w-5 text-brand-blue mr-2" />
              <span className="text-sm font-semibold text-brand-blue">Plataforma líder em treinamento comportamental</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Transforme líderes em <span className="gradient-text">alta performance</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Uma plataforma completa para avaliar, acompanhar e desenvolver 
              habilidades comportamentais da sua equipe com precisão e resultados comprovados.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Testes de proatividade e inteligência emocional</p>
                  <p className="text-sm text-gray-600">Métricas precisas para entender o perfil de cada colaborador</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Mapeamento de perfil comportamental</p>
                  <p className="text-sm text-gray-600">Compreenda como cada colaborador atua em diferentes situações</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Gamificação para engajamento contínuo</p>
                  <p className="text-sm text-gray-600">Rankings e recompensas que mantêm sua equipe motivada</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 h-14 px-8 text-base button-glow shadow-lg shadow-brand-blue/30">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-14 px-8 text-base border-2 hover:bg-gray-50">
                Agendar demonstração
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <div className="text-sm text-gray-500">
                <span className="font-semibold">+500 empresas</span> já transformaram seus líderes com o RH Mentor
              </div>
            </div>
          </div>
          
          <div className="relative lg:ml-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 animate-float-slow">
              <div className="bg-white rounded-2xl shadow-xl p-6 border">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Dashboard do Líder</h3>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="h-52 bg-gradient-to-b from-gray-50 to-white rounded-lg flex items-center justify-center border">
                      <div className="text-center">
                        <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple flex items-center justify-center shadow-lg">
                          <div className="bg-white bg-opacity-20 w-24 h-24 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-3xl">85%</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-medium">Performance Média</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-light rounded-lg p-4 border border-brand-blue/10">
                      <p className="text-xs text-gray-600">Proatividade</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-brand-dark">92%</p>
                        <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white transform rotate-45" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-brand-light rounded-lg p-4 border border-brand-blue/10">
                      <p className="text-xs text-gray-600">Intel. Emocional</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-brand-dark">78%</p>
                        <div className="h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white transform rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-brand-light rounded-lg p-4 border border-brand-blue/10">
                      <p className="text-xs text-gray-600">Engajamento</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-brand-dark">85%</p>
                        <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white transform rotate-45" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-brand-light rounded-lg p-4 border border-brand-blue/10">
                      <p className="text-xs text-gray-600">Desempenho</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-brand-dark">90%</p>
                        <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-white transform rotate-45" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 blur-3xl"></div>
            <div className="absolute top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
