
import { Star } from 'lucide-react';
import { useState } from 'react';

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

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="depoimentos" className="py-16 md:py-24 px-4 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-lg text-gray-600">
            Centenas de empresas já transformaram suas equipes com o RH Mentor.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Desktop Testimonials */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6">"{testimonial.testimonial}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4" 
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
          <div className="lg:hidden">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-6">"{testimonials[activeIndex].testimonial}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                  <h4 className="font-bold">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[activeIndex].position}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? 'bg-brand-blue' : 'bg-gray-300'
                  }`}
                  aria-label={`Ver depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
