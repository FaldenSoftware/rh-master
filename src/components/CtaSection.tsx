
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-brand-blue to-brand-purple rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para transformar sua equipe?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Comece hoje mesmo e veja resultados em sua equipe em menos de 30 dias.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-white text-brand-blue hover:bg-white/90 h-12 px-6 text-base">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6 text-base">
                Agendar demonstração
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
