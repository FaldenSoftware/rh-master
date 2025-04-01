
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contato" className="bg-gray-50 py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text mb-4">
              RH Mentor
            </h3>
            <p className="text-gray-600 mb-4">
              Transformando líderes comuns em profissionais de alta performance através de ciência comportamental.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Início</a>
              </li>
              <li>
                <a href="#funcionalidades" className="text-gray-600 hover:text-brand-blue transition-colors">Funcionalidades</a>
              </li>
              <li>
                <a href="#planos" className="text-gray-600 hover:text-brand-blue transition-colors">Planos</a>
              </li>
              <li>
                <a href="#depoimentos" className="text-gray-600 hover:text-brand-blue transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Termos de Uso</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Cookies</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">LGPD</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mr-2 mt-0.5" />
                <span className="text-gray-600">Av. Paulista, 1000, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <a href="mailto:contato@rhmentor.com.br" className="text-gray-600 hover:text-brand-blue transition-colors">
                  contato@rhmentor.com.br
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                <a href="tel:+551198765-4321" className="text-gray-600 hover:text-brand-blue transition-colors">
                  (11) 98765-4321
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RH Mentor. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
