
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const pricingPlans = {
    basic: {
      monthly: 99,
      annual: 950 // ~20% discount (99 * 12 * 0.8 rounded)
    },
    professional: {
      monthly: 197,
      annual: 1890 // ~20% discount (197 * 12 * 0.8 rounded)
    },
    enterprise: {
      monthly: 297,
      annual: 2850 // ~20% discount (297 * 12 * 0.8 rounded)
    }
  };

  return (
    <section id="planos" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-brand-purple/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">Planos Acessíveis para Todas as Empresas</span>
            <div className="absolute -bottom-3 left-0 right-0 h-3 bg-brand-light -z-10 transform -rotate-1"></div>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Escolha o plano ideal para a sua empresa e comece a transformar seus líderes hoje mesmo.
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <RadioGroup 
                defaultValue="monthly" 
                value={billingCycle}
                onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}
                className="flex gap-1"
              >
                <div className={`relative px-4 py-2 rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}>
                  <RadioGroupItem value="monthly" id="monthly" className="absolute opacity-0" />
                  <Label htmlFor="monthly" className="cursor-pointer font-medium">Mensal</Label>
                </div>
                <div className={`relative px-4 py-2 rounded-full transition-all ${billingCycle === 'annual' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}>
                  <RadioGroupItem value="annual" id="annual" className="absolute opacity-0" />
                  <Label htmlFor="annual" className="cursor-pointer font-medium">Anual</Label>
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">-20%</span>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plano Básico */}
          <div className="relative bg-white p-10 rounded-xl border shadow-sm flex flex-col animate-fade-in hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-bold mb-2">Básico</h3>
            <p className="text-gray-600 mb-6">Ideal para pequenas equipes</p>
            
            <div className="mb-6">
              <span className="text-5xl font-bold">R${pricingPlans.basic[billingCycle]}</span>
              <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
              {billingCycle === 'annual' && (
                <div className="text-green-600 text-sm font-medium mt-1">
                  Economize R${pricingPlans.basic.monthly * 12 - pricingPlans.basic.annual} por ano
                </div>
              )}
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Até 5 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Testes de proatividade</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Dashboard básico</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Suporte por e-mail</span>
              </li>
            </ul>
            
            <Button variant="outline" className="mt-auto h-14 border-2 hover:bg-gray-50 font-medium button-glow">
              Começar agora
            </Button>
          </div>
          
          {/* Plano Profissional */}
          <div className="relative bg-white p-10 rounded-xl border-2 border-brand-blue shadow-xl flex flex-col z-10 animate-fade-in lg:scale-105 lg:-translate-y-2" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              MAIS POPULAR
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Profissional</h3>
            <p className="text-gray-600 mb-6">Para equipes em crescimento</p>
            
            <div className="mb-6">
              <span className="text-5xl font-bold">R${pricingPlans.professional[billingCycle]}</span>
              <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
              {billingCycle === 'annual' && (
                <div className="text-green-600 text-sm font-medium mt-1">
                  Economize R${pricingPlans.professional.monthly * 12 - pricingPlans.professional.annual} por ano
                </div>
              )}
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Até 15 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Todos os testes comportamentais</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Dashboard completo + gamificação</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Suporte prioritário</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Relatórios avançados</span>
              </li>
            </ul>
            
            <Button className="mt-auto bg-brand-blue hover:bg-brand-blue/90 h-14 font-medium shadow-lg shadow-brand-blue/20 button-glow">
              Escolher este plano
            </Button>
          </div>
          
          {/* Plano Empresarial */}
          <div className="relative bg-white p-10 rounded-xl border shadow-sm flex flex-col animate-fade-in hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
            <p className="text-gray-600 mb-6">Para grandes organizações</p>
            
            <div className="mb-6">
              <span className="text-5xl font-bold">R${pricingPlans.enterprise[billingCycle]}</span>
              <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
              {billingCycle === 'annual' && (
                <div className="text-green-600 text-sm font-medium mt-1">
                  Economize R${pricingPlans.enterprise.monthly * 12 - pricingPlans.enterprise.annual} por ano
                </div>
              )}
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Até 50 colaboradores</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Testes customizados</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">API integração</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Suporte 24/7</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-brand-blue shrink-0 mr-3" />
                <span className="text-gray-600">Consultoria personalizada</span>
              </li>
            </ul>
            
            <Button variant="outline" className="mt-auto h-14 border-2 hover:bg-gray-50 font-medium button-glow">
              Falar com consultor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
