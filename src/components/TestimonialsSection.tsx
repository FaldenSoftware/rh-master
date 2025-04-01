
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const testimonials = [
  {
    name: "Maria Silva",
    position: "Diretora de RH, Empresa ABC",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    testimonial: "O RH Mentor transformou completamente nossa abordagem para desenvolvimento de líderes. Conseguimos identificar talentos ocultos e desenvolver habilidades comportamentais que impactaram diretamente nos resultados."
  },
  {
    name: "Carlos Mendes",
    position: "Gerente de Pessoas, Empresa XYZ",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    testimonial: "A plataforma é extremamente intuitiva e os testes comportamentais são precisos. Conseguimos reduzir a rotatividade em 30% depois que começamos a usar o RH Mentor para selecionar e desenvolver nossos líderes."
  },
  {
    name: "Ana Costa",
    position: "CEO, Startup Innovation",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    testimonial: "Como uma startup em crescimento acelerado, precisávamos de uma solução que nos ajudasse a identificar e desenvolver talentos rapidamente. O RH Mentor excedeu nossas expectativas."
  },
  {
    name: "Roberto Almeida",
    position: "Diretor de Operações, Multinacional Corp",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    testimonial: "A gamificação do RH Mentor criou um ambiente de desenvolvimento contínuo em nossa empresa. Os colaboradores agora buscam ativamente aprimorar suas habilidades comportamentais."
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  
  useEffect(() => {
    // Show controls only on desktop
    const handleResize = () => {
      setShowControls(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="depoimentos" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-brand-light/30 -z-10"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-brand-purple/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">O Que Nossos Clientes Dizem</span>
            <div className="absolute -bottom-3 left-0 right-0 h-3 bg-brand-light -z-10 transform -rotate-1"></div>
          </h2>
          <p className="text-xl text-gray-600">
            Centenas de empresas já transformaram suas equipes com o RH Mentor.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Desktop Testimonials */}
          <div className="hidden lg:grid grid-cols-2 gap-10" ref={containerRef}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-10 rounded-xl shadow-sm border testimonial-card hover:shadow-lg transition-all duration-300 animate-fade-in" 
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-8 relative">"{testimonial.testimonial}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 border-2 border-brand-light" 
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Testimonials */}
          <div className="lg:hidden relative">
            <div className="bg-white p-8 rounded-xl shadow-sm border testimonial-card">
              <Quote className="absolute top-8 left-8 h-20 w-20 text-brand-blue/5" />
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-8">"{testimonials[activeIndex].testimonial}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-14 h-14 rounded-full mr-4 border-2 border-brand-light" 
                />
                <div>
                  <h4 className="font-bold">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[activeIndex].position}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? 'bg-brand-blue scale-125' : 'bg-gray-300'
                  }`}
                  aria-label={`Ver depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop Controls */}
          {showControls && (
            <>
              <button 
                onClick={prevTestimonial} 
                className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <button 
                onClick={nextTestimonial} 
                className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
