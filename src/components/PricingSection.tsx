
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="planos" className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Acessíveis para Todas as Empresas</h2>
          <p className="text-lg text-gray-600">
            Escolha o plano ideal para a sua empresa e comece a transformar seus líderes hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plano Básico */}
          <div className="relative bg-white p-8 rounded-xl border shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2">Básico</h3>
            <p className="text-gray-600 mb-6">Ideal para pequenas equipes</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">R$297</span>
              <span className="text-gray-600">/mês</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Até 5 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Testes de proatividade</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Dashboard básico</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Suporte por e-mail</span>
              </li>
            </ul>
            
            <Button variant="outline" className="mt-auto">
              Começar agora
            </Button>
          </div>
          
          {/* Plano Profissional */}
          <div className="relative bg-white p-8 rounded-xl border-2 border-brand-blue shadow-lg flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-blue text-white text-xs font-bold py-1 px-3 rounded-full">
              MAIS POPULAR
            </div>
            
            <h3 className="text-xl font-bold mb-2">Profissional</h3>
            <p className="text-gray-600 mb-6">Para equipes em crescimento</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">R$497</span>
              <span className="text-gray-600">/mês</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Até 15 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Todos os testes comportamentais</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Dashboard completo + gamificação</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Suporte prioritário</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Relatórios avançados</span>
              </li>
            </ul>
            
            <Button className="mt-auto bg-brand-blue hover:bg-brand-blue/90">
              Escolher este plano
            </Button>
          </div>
          
          {/* Plano Empresarial */}
          <div className="relative bg-white p-8 rounded-xl border shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2">Empresarial</h3>
            <p className="text-gray-600 mb-6">Para grandes organizações</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">R$997</span>
              <span className="text-gray-600">/mês</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Até 50 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Testes customizados</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">API integração</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Suporte 24/7</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <span className="text-gray-600">Consultoria personalizada</span>
              </li>
            </ul>
            
            <Button variant="outline" className="mt-auto">
              Falar com consultor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
