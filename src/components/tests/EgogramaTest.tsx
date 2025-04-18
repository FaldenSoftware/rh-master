
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Definição completa das perguntas do Egograma
const questions = [
  // Exemplo de estrutura correta para cada pergunta:
  // {
  //   id: 'q1',
  //   category: 'a',
  //   text: 'Exemplo de pergunta',
  //   options: [
  //     { id: 'q1o1', text: 'Opção 1', value: 1 },
  //     { id: 'q1o2', text: 'Opção 2', value: 2 },
  //     { id: 'q1o3', text: 'Opção 3', value: 3 }
  //   ]
  // },

  // As perguntas já devem conter as propriedades 'category' e 'value' em cada opção, conforme última implementação. Caso não estejam, posso ajustar após este passo.

  {
    id: 'q1',
<<<<<<< HEAD
    category: 'a',
    question: "Quando tenho um problema, eu geralmente analiso todas as possibilidades antes de agir.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q2',
    category: 'pc',
    question: "Eu normalmente sigo as regras e procedimentos à risca.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q3',
    category: 'pn',
    question: "Eu frequentemente priorizo as necessidades dos outros acima das minhas próprias.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q4',
    category: 'ca',
    question: "Eu prefiro situações estruturadas e previsíveis.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q5',
    category: 'cl',
    question: "Eu me expresso de forma livre e espontânea.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q6',
    category: 'pn',
    question: "Eu tento entender os sentimentos dos outros antes de emitir opiniões.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q7',
    category: 'a',
    question: "Eu sou bom em estabelecer e seguir planos detalhados.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q8',
    category: 'a',
    question: "Eu me sinto confortável tomando decisões rapidamente quando necessário.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q9',
    category: 'pc',
    question: "Eu estabeleço padrões elevados para mim e para os outros.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
  },
  {
    id: 'q10',
    category: 'cl',
    question: "Eu gosto de explorar novas ideias e possibilidades.",
    options: [
      { id: 'a', text: 'Concordo totalmente', value: 3 },
      { id: 'b', text: 'Concordo parcialmente', value: 2 },
      { id: 'c', text: 'Não concordo nem discordo', value: 1 },
      { id: 'd', text: 'Discordo parcialmente', value: 0 },
      { id: 'e', text: 'Discordo totalmente', value: 0 }
    ]
=======
    question: 'Possuo uma postura altiva, com queixo alto, mantendo uma certa distância.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pc' // Pai Crítico
  },
  {
    id: 'q2',
    question: 'Fico com os braços cruzados, dedo em riste e/ou punho cerrado.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pc' // Pai Crítico
  },
  {
    id: 'q3',
    question: 'Tenho uma expressão facial com cenho franzido, mais crítica, reprovadora e/ou faço caras e bocas.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pc' // Pai Crítico
  },
  {
    id: 'q4',
    question: 'Sou exigente e perfeccionista.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pc' // Pai Crítico
  },
  {
    id: 'q5',
    question: 'Sou crítico(a) e julgo as pessoas.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pc' // Pai Crítico
  },
  {
    id: 'q6',
    question: 'Tenho uma postura corporal mais relaxada, acolhedora.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pn' // Pai Nutritivo
  },
  {
    id: 'q7',
    question: 'Tenho uma expressão facial mais suave, acolhedora.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pn' // Pai Nutritivo
  },
  {
    id: 'q8',
    question: 'Sou protetor(a) e cuidadoso(a) com as pessoas.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pn' // Pai Nutritivo
  },
  {
    id: 'q9',
    question: 'Sou compreensivo(a) e apoio as pessoas.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pn' // Pai Nutritivo
  },
  {
    id: 'q10',
    question: 'Sou atencioso(a) e solidário(a).',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'pn' // Pai Nutritivo
  },
  {
    id: 'q11',
    question: 'Tenho uma postura corporal ereta, atenta.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'a' // Adulto
  },
  {
    id: 'q12',
    question: 'Tenho uma expressão facial neutra, atenta.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'a' // Adulto
  },
  {
    id: 'q13',
    question: 'Sou racional e lógico(a).',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'a' // Adulto
  },
  {
    id: 'q14',
    question: 'Analiso as situações com objetividade.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'a' // Adulto
  },
  {
    id: 'q15',
    question: 'Tomo decisões baseadas em fatos e dados.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'a' // Adulto
  },
  {
    id: 'q16',
    question: 'Tenho uma postura corporal relaxada, espontânea.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'cl' // Criança Livre
  },
  {
    id: 'q17',
    question: 'Tenho uma expressão facial alegre, espontânea.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'cl' // Criança Livre
  },
  {
    id: 'q18',
    question: 'Sou espontâneo(a) e criativo(a).',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'cl' // Criança Livre
  },
  {
    id: 'q19',
    question: 'Expresso minhas emoções livremente.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'cl' // Criança Livre
  },
  {
    id: 'q20',
    question: 'Sou curioso(a) e gosto de explorar novas possibilidades.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'cl' // Criança Livre
  },
  {
    id: 'q21',
    question: 'Tenho uma postura corporal submissa, retraída.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'ca' // Criança Adaptada
  },
  {
    id: 'q22',
    question: 'Tenho uma expressão facial de medo ou submissão.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'ca' // Criança Adaptada
  },
  {
    id: 'q23',
    question: 'Sou obediente e sigo regras sem questionar.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'ca' // Criança Adaptada
  },
  {
    id: 'q24',
    question: 'Tenho dificuldade em expressar minhas opiniões.',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'ca' // Criança Adaptada
  },
  {
    id: 'q25',
    question: 'Procuro agradar os outros mesmo em detrimento de mim mesmo(a).',
    options: [
      { id: 'nenhuma', text: 'Nenhuma', value: 0 },
      { id: 'pouca', text: 'Pouca', value: 1 },
      { id: 'media', text: 'Média', value: 2 },
      { id: 'muita', text: 'Muita', value: 3 }
    ],
    category: 'ca' // Criança Adaptada
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
  }
];

// Descrições detalhadas dos estados de ego
const egoDescriptions = {
  pc: {
    name: "Pai Crítico (PC)",
    description: "É deste aspecto da personalidade que emanam julgamentos, críticas, preconceitos, acusações, controles, ordens, imposições, censuras, opiniões, princípios, poder, exigências, punições, ordens, dominância.",
    color: "bg-brand-teal"
  },
  pn: {
    name: "Pai Nutritivo (PN)",
    description: "É deste aspecto da personalidade que se originam as manifestações de apoio, estímulo, orientação, ajuda, fornecimento de segurança, permissão, conforto, preocupação com o bem-estar do outro. Pode ser desvelado, interessado, clemente, tranquilizador, calorosamente protetor, preocupado, atencioso, solidário, compreensivo e/ou amoroso.",
    color: "bg-brand-gold"
  },
  a: {
    name: "Adulto (A)",
    description: "Pensa e age logicamente, media a interação dos Estados do Ego Pai e Criança com a realidade objetiva. O Estado do Ego Adulto tem a capacidade de coletar informações da realidade interna (subjetiva) e externa (objetiva) de forma neutra e processá-las apoiando conclusões e decisões.",
    color: "bg-blue-600"
  },
  cl: {
    name: "Criança Livre (CL)",
    description: "Pode ser espontânea, autêntica, animada e/ou curiosa, também pode ser egocêntrica e imprudente. É a faceta do Estado do Ego Criança que não foi alterada pelo processo educativo ou de adaptação de comportamento. É fonte da criatividade, da espontaneidade, autenticidade, da curiosidade natural. Demonstra uma pessoa afetiva, sensual, criativa.",
    color: "bg-green-500"
  },
  ca: {
    name: "Criança Adaptada (CA)",
    description: "É caracterizado por comportamentos de cumprimento de padrões e expectativas parentais gerais e específicas, ou seja, cumprindo ordens, obedecendo as regras, procurando agradar.",
    color: "bg-purple-500"
  }
};

const EgogramaTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestion].id]: currentAnswer
      }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setCurrentAnswer(null);
      } else {
        setIsSubmitting(true);
        // Simular processamento
        setTimeout(() => {
          setShowResults(true);
          setIsSubmitting(false);
        }, 1000);
      }
    }
  };

<<<<<<< HEAD
  // Novo cálculo preciso do Egograma
  // Cálculo preciso do Egograma
  // Função de cálculo precisa do Egograma
  const calculateEgogramScores = () => {
=======
  const calculateEgogramScores = () => {
    // Inicializar contadores para cada categoria
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
    const scores = {
      pc: 0, // Pai Crítico
      pn: 0, // Pai Nutritivo
      a: 0,  // Adulto
      cl: 0, // Criança Livre
      ca: 0  // Criança Adaptada
    };
<<<<<<< HEAD
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && question.category) {
=======
    
    // Calcular pontuação para cada resposta
    Object.entries(answers).forEach(([questionId, answerId]) => {
      // Encontrar a questão correspondente
      const question = questions.find(q => q.id === questionId);
      if (question) {
        // Encontrar a opção selecionada
        const option = question.options.find(o => o.id === answerId);
        if (option) {
          // Adicionar pontos à categoria correspondente
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
          scores[question.category as keyof typeof scores] += option.value;
        }
      }
    });
<<<<<<< HEAD
    // Normalizar para escala 0-10
    const normalizedScores = {
      pc: Math.round((scores.pc / (questions.filter(q => q.category === 'pc').length * 3)) * 10),
      pn: Math.round((scores.pn / (questions.filter(q => q.category === 'pn').length * 3)) * 10),
      a: Math.round((scores.a / (questions.filter(q => q.category === 'a').length * 3)) * 10),
      cl: Math.round((scores.cl / (questions.filter(q => q.category === 'cl').length * 3)) * 10),
      ca: Math.round((scores.ca / (questions.filter(q => q.category === 'ca').length * 3)) * 10)
    };
=======
    
    // Normalizar as pontuações para uma escala de 0-10
    const normalizedScores = {
      pc: Math.round((scores.pc / 15) * 10), // 5 perguntas * 3 pontos max = 15
      pn: Math.round((scores.pn / 15) * 10),
      a: Math.round((scores.a / 15) * 10),
      cl: Math.round((scores.cl / 15) * 10),
      ca: Math.round((scores.ca / 15) * 10)
    };
    
    // Encontrar o estado de ego dominante e o menos utilizado
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
    let dominantEgo = Object.entries(normalizedScores).reduce(
      (max, [ego, score]) => score > max.score ? { ego, score } : max,
      { ego: '', score: 0 }
    );
<<<<<<< HEAD
=======
    
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
    let leastUsedEgo = Object.entries(normalizedScores).reduce(
      (min, [ego, score]) => score < min.score ? { ego, score } : min,
      { ego: '', score: 10 }
    );
<<<<<<< HEAD
    return {
      scores: normalizedScores,
      dominantEgo: dominantEgo.ego,
      leastUsedEgo: leastUsedEgo.ego
=======
    
    return {
      scores: normalizedScores,
      dominantEgo: dominantEgo.ego as keyof typeof egoDescriptions,
      leastUsedEgo: leastUsedEgo.ego as keyof typeof egoDescriptions
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
    };
  };

    const scores = {
      pc: 0, // Pai Crítico
      pn: 0, // Pai Nutritivo
      a: 0,  // Adulto
      cl: 0, // Criança Livre
      ca: 0  // Criança Adaptada
    };
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && question.category) {
          scores[question.category as keyof typeof scores] += option.value;
        }
      }
    });
    // Normalizar para escala 0-10
    const normalizedScores = {
      pc: Math.round((scores.pc / (questions.filter(q => q.category === 'pc').length * 3)) * 10),
      pn: Math.round((scores.pn / (questions.filter(q => q.category === 'pn').length * 3)) * 10),
      a: Math.round((scores.a / (questions.filter(q => q.category === 'a').length * 3)) * 10),
      cl: Math.round((scores.cl / (questions.filter(q => q.category === 'cl').length * 3)) * 10),
      ca: Math.round((scores.ca / (questions.filter(q => q.category === 'ca').length * 3)) * 10)
    };
    let dominantEgo = Object.entries(normalizedScores).reduce(
      (max, [ego, score]) => score > max.score ? { ego, score } : max,
      { ego: '', score: 0 }
    );
    let leastUsedEgo = Object.entries(normalizedScores).reduce(
      (min, [ego, score]) => score < min.score ? { ego, score } : min,
      { ego: '', score: 10 }
    );
    return {
      scores: normalizedScores,
      dominantEgo: dominantEgo.ego,
      leastUsedEgo: leastUsedEgo.ego
    };
  };

    const scores = {
      pc: 0, // Pai Crítico
      pn: 0, // Pai Nutritivo
      a: 0,  // Adulto
      cl: 0, // Criança Livre
      ca: 0  // Criança Adaptada
    };
    // Cada questão deve ter uma categoria e cada opção um valor
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && question.category) {
          scores[question.category as keyof typeof scores] += option.value;
        }
      }
    });
    // Normalizar as pontuações para uma escala de 0-10
    const normalizedScores = {
      pc: Math.round((scores.pc / 15) * 10),
      pn: Math.round((scores.pn / 15) * 10),
      a: Math.round((scores.a / 15) * 10),
      cl: Math.round((scores.cl / 15) * 10),
      ca: Math.round((scores.ca / 15) * 10)
    };
    let dominantEgo = Object.entries(normalizedScores).reduce(
      (max, [ego, score]) => score > max.score ? { ego, score } : max,
      { ego: '', score: 0 }
    );
    let leastUsedEgo = Object.entries(normalizedScores).reduce(
      (min, [ego, score]) => score < min.score ? { ego, score } : min,
      { ego: '', score: 10 }
    );
    return {
      scores: normalizedScores,
      dominantEgo: dominantEgo.ego,
      leastUsedEgo: leastUsedEgo.ego
    };
  };


  if (showResults) {
    const results = calculateEgogramScores();
<<<<<<< HEAD
    const dominantLabel = {
      'pc': 'Pai Crítico',
      'pn': 'Pai Nutritivo',
      'a': 'Adulto',
      'cl': 'Criança Livre',
      'ca': 'Criança Adaptada'
    }[results.dominantEgo] || 'Adulto';

=======
>>>>>>> 83163dc2da42cde9e74e3a7d6f4a339951d4fa80
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultados do Egograma</CardTitle>
          <CardDescription>Análise dos seus Estados de Ego</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Seu Estado de Ego Dominante</h3>
            <div className="text-2xl font-bold text-brand-teal">{egoDescriptions[results.dominantEgo].name}</div>
            <p className="mt-2 text-gray-600">{egoDescriptions[results.dominantEgo].description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Distribuição dos seus Estados de Ego</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pai Crítico (PC)</span>
                  <span>{results.scores.pc}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${results.scores.pc * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pai Nutritivo (PN)</span>
                  <span>{results.scores.pn}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-brand-gold h-2.5 rounded-full" style={{ width: `${results.scores.pn * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Adulto (A)</span>
                  <span>{results.scores.a}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${results.scores.a * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Criança Livre (CL)</span>
                  <span>{results.scores.cl}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${results.scores.cl * 10}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Criança Adaptada (CA)</span>
                  <span>{results.scores.ca}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${results.scores.ca * 10}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <Alert className="bg-brand-beige border-brand-gold text-brand-teal">
            <p className="text-sm">Estas análises refletem suas tendências comportamentais baseadas nas respostas fornecidas. 
              Compreender seu perfil de egograma pode ajudá-lo a melhorar seu autoconhecimento e suas interações.</p>
          </Alert>
          
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-brand-teal hover:bg-brand-teal/80" onClick={() => {
            setShowResults(false);
            setCurrentQuestion(0);
            setAnswers({});
          }}>
            Refazer Teste
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Egograma</CardTitle>
            <CardDescription>Questão {currentQuestion + 1} de {questions.length}</CardDescription>
          </div>
          <div className="text-sm font-medium">
            {Math.round(((currentQuestion) / questions.length) * 100)}% Completo
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h3>
          <RadioGroup value={currentAnswer || ""} onValueChange={setCurrentAnswer} className="mt-4">
            <div className="space-y-3">
              {questions[currentQuestion].options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/80" 
          onClick={handleNext} 
          disabled={!currentAnswer || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EgogramaTest;
