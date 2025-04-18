import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contato" className="bg-gray-50 pt-20 pb-10 px-4 relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-6">
              <img src="/lovable-uploads/bf811017-0b0d-4522-85c1-87f3ff294221.png" alt="RH Master Logo" className="h-12" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-gold text-transparent bg-clip-text">
                RH Master
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Transformando líderes comuns em profissionais de alta performance através de ciência comportamental e tecnologia de ponta.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white p-2.5 rounded-full text-gray-500 hover:text-brand-teal hover:shadow-md transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2.5 rounded-full text-gray-500 hover:text-brand-teal hover:shadow-md transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2.5 rounded-full text-gray-500 hover:text-brand-teal hover:shadow-md transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2.5 rounded-full text-gray-500 hover:text-brand-teal hover:shadow-md transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Início</a>
              </li>
              <li>
                <a href="#funcionalidades" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Funcionalidades</a>
              </li>
              <li>
                <a href="#planos" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Planos</a>
              </li>
              <li>
                <a href="#depoimentos" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Depoimentos</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Blog</a>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Termos de Uso</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">Cookies</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-teal transition-colors hover:translate-x-1 inline-block">LGPD</a>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-brand-beige p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-brand-teal shrink-0" />
                </div>
                <span className="text-gray-600">Av. Paulista, 1000, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <div className="bg-brand-beige p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-brand-teal shrink-0" />
                </div>
                <a href="mailto:contato@rhmaster.com.br" className="text-gray-600 hover:text-brand-teal transition-colors">
                  contato@rhmaster.com.br
                </a>
              </li>
              <li className="flex items-center">
                <div className="bg-brand-beige p-2 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-brand-teal shrink-0" />
                </div>
                <a href="tel:+551198765-4321" className="text-gray-600 hover:text-brand-teal transition-colors">
                  (11) 98765-4321
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} RH Master. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm">Feito com ❤️ no Brasil</p>
        </div>
      </div>
      
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 bg-brand-teal text-white p-3 rounded-full shadow-lg hover:bg-brand-teal/90 transition-all z-20 animate-bounce"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
