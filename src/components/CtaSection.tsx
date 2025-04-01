
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Brain } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="relative bg-gradient-to-r from-brand-blue to-brand-purple rounded-3xl p-12 md:p-16 overflow-hidden animate-fade-in">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <Brain className="absolute top-10 left-10 w-20 h-20 text-white/5 transform rotate-12" />
            <BarChart3 className="absolute bottom-10 right-10 w-20 h-20 text-white/5 transform -rotate-12" />
          </div>
          
          <div className="max-w-3xl mx-auto text-center text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para transformar sua equipe?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12">
              Comece hoje mesmo e veja resultados em sua equipe em menos de 30 dias ou seu dinheiro de volta.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-white text-brand-blue hover:bg-white/90 h-14 px-8 text-lg font-medium shadow-xl shadow-brand-blue/20 button-glow">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-medium button-glow">
                Agendar demonstração
              </Button>
            </div>
            <p className="mt-8 text-white/70 text-sm">
              Não é necessário cartão de crédito • Cancelamento a qualquer momento • Suporte personalizado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
