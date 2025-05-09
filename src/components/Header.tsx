import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 w-full py-4 px-4 md:px-6 lg:px-8 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/bf811017-0b0d-4522-85c1-87f3ff294221.png" alt="RH Master Logo" className="h-12" />
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-gold text-transparent bg-clip-text">
              RH Master
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#funcionalidades" className="text-sm font-semibold text-gray-700 hover:text-brand-teal transition-colors">
            Funcionalidades
          </a>
          <a href="#planos" className="text-sm font-semibold text-gray-700 hover:text-brand-teal transition-colors">
            Planos
          </a>
          <a href="#depoimentos" className="text-sm font-semibold text-gray-700 hover:text-brand-teal transition-colors">
            Depoimentos
          </a>
          <a href="#contato" className="text-sm font-semibold text-gray-700 hover:text-brand-teal transition-colors">
            Contato
          </a>
          <Link to="/client/login">
            <Button variant="ghost" className="text-sm font-medium hover:bg-gray-100">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="text-sm font-medium bg-brand-teal hover:bg-brand-teal/90 shadow-md shadow-brand-teal/20 button-glow">
              Começar grátis
            </Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white" style={{ paddingTop: '4rem' }}>
          <div className="container mx-auto py-8 px-4 flex flex-col h-full">
            <div className="space-y-6 flex-1">
              <a 
                href="#funcionalidades" 
                className="block text-xl font-medium text-gray-700 hover:text-brand-teal transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#planos" 
                className="block text-xl font-medium text-gray-700 hover:text-brand-teal transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </a>
              <a 
                href="#depoimentos" 
                className="block text-xl font-medium text-gray-700 hover:text-brand-teal transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Depoimentos
              </a>
              <a 
                href="#contato" 
                className="block text-xl font-medium text-gray-700 hover:text-brand-teal transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </a>
            </div>
            <div className="flex flex-col space-y-4 mt-auto">
              <Link to="/client/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center h-14 text-base">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center h-14 text-base bg-brand-teal hover:bg-brand-teal/90 shadow-md">
                  Começar grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
