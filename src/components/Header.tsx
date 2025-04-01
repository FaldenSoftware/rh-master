
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-4 md:px-6 lg:px-8 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
            RH Mentor
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#funcionalidades" className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors">
            Funcionalidades
          </a>
          <a href="#planos" className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors">
            Planos
          </a>
          <a href="#depoimentos" className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors">
            Depoimentos
          </a>
          <a href="#contato" className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors">
            Contato
          </a>
          <Button variant="outline" className="text-sm font-medium">
            Login
          </Button>
          <Button className="text-sm font-medium bg-brand-blue hover:bg-brand-blue/90">
            Começar agora
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-50 bg-white border-b shadow-lg">
          <div className="container mx-auto py-4 px-4 space-y-4">
            <a 
              href="#funcionalidades" 
              className="block text-base font-medium text-gray-700 hover:text-brand-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionalidades
            </a>
            <a 
              href="#planos" 
              className="block text-base font-medium text-gray-700 hover:text-brand-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planos
            </a>
            <a 
              href="#depoimentos" 
              className="block text-base font-medium text-gray-700 hover:text-brand-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Depoimentos
            </a>
            <a 
              href="#contato" 
              className="block text-base font-medium text-gray-700 hover:text-brand-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full justify-center">
                Login
              </Button>
              <Button className="w-full justify-center bg-brand-blue hover:bg-brand-blue/90">
                Começar agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
