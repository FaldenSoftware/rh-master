import React, { useState } from 'react';
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Questions for the proactivity test
const questions = [
  // Exemplo de estrutura correta para cada pergunta:
  // {
  //   id: 'q1',
  //   text: 'Exemplo de pergunta',
  //   options: [
  //     { id: 'q1o1', text: 'Nunca', value: 1 },
  //     { id: 'q1o2', text: 'Às vezes', value: 2 },
  //     { id: 'q1o3', text: 'Sempre', value: 3 }
  {
    id: 'q1',
    question: "Quando identifico um problema no trabalho, prefiro:",
    options: [
      { id: 'a', text: 'Resolvê-lo imediatamente, mesmo que não seja minha responsabilidade', value: 3 },
      { id: 'b', text: 'Informar meu supervisor e aguardar instruções', value: 2 },
      { id: 'c', text: 'Analisar o problema e propor possíveis soluções ao meu supervisor', value: 3 },
      { id: 'd', text: 'Aguardar para ver se o problema se resolve sozinho', value: 1 }
    ]
  },
  {
    id: 'q2',
    question: "Em relação a novas habilidades profissionais, eu geralmente:",
    options: [
      { id: 'a', text: 'Espero que a empresa ofereça treinamentos quando necessário', value: 1 },
      { id: 'b', text: 'Busco constantemente aprender novas habilidades por conta própria', value: 3 },
      { id: 'c', text: 'Aprendo apenas o necessário para cumprir minhas funções atuais', value: 2 },
      { id: 'd', text: 'Prefiro me especializar profundamente em uma única área', value: 2 }
    ]
  },
  {
    id: 'q3',
    question: "Quando surge uma oportunidade de liderar um projeto:",
    options: [
      { id: 'a', text: 'Me voluntario imediatamente, mesmo que seja desafiador', value: 3 },
      { id: 'b', text: 'Espero ser convidado para assumir a responsabilidade', value: 2 },
      { id: 'c', text: 'Avalio se tenho as habilidades necessárias antes de me oferecer', value: 2 },
      { id: 'd', text: 'Prefiro trabalhar como parte da equipe sem responsabilidade de liderança', value: 1 }
    ]
  },
  {
    id: 'q4',
    question: "Quando a empresa implementa uma mudança significativa, eu:",
    options: [
      { id: 'a', text: 'Resisto inicialmente e depois me adapto gradualmente', value: 1 },
      { id: 'b', text: 'Aceito passivamente e sigo as novas diretrizes', value: 2 },
      { id: 'c', text: 'Abraço a mudança e busco maneiras de contribuir para o sucesso', value: 3 },
      { id: 'd', text: 'Analiso criticamente os prós e contras antes de me posicionar', value: 2 }
    ]
  },
  {
    id: 'q5',
    question: "Em relação ao estabelecimento de metas pessoais:",
    options: [
      { id: 'a', text: 'Estabeleço regularmente metas desafiadoras e monitoro meu progresso', value: 3 },
      { id: 'b', text: 'Prefiro trabalhar com as metas estabelecidas pela empresa', value: 2 },
      { id: 'c', text: 'Estabeleço metas apenas quando necessário para projetos específicos', value: 2 },
      { id: 'd', text: 'Trabalho melhor sem metas formalmente estabelecidas', value: 1 }
    ]
  },
  {
    id: 'q6',
    question: "Quando vejo uma oportunidade de melhoria em um processo de trabalho:",
    options: [
      { id: 'a', text: 'Implemento a melhoria por conta própria se estiver ao meu alcance', value: 3 },
      { id: 'b', text: 'Sugiro a melhoria ao meu supervisor e aguardo feedback', value: 2 },
      { id: 'c', text: 'Discuto com colegas para refinar a ideia antes de apresentá-la formalmente', value: 2 },
      { id: 'd', text: 'Não interfiro em processos já estabelecidos', value: 1 }
    ]
  },
  {
    id: 'q7',
    question: "Em situações de crise ou pressão no trabalho:",
    options: [
      { id: 'a', text: 'Tomo a iniciativa de organizar e coordenar as ações necessárias' },
      { id: 'b', text: 'Aguardo orientações claras antes de agir' },
      { id: 'c', text: 'Mantenho a calma e foco nas minhas responsabilidades específicas' },
      { id: 'd', text: 'Prefiro dar suporte a quem está liderando a resolução da crise' }
    ]
  },
  {
    id: 'q8',
    question: "Quando recebo feedback negativo sobre meu trabalho:",
    options: [
      { id: 'a', text: 'Aceito e busco imediatamente maneiras de melhorar', value: 3 },
      { id: 'b', text: 'Analiso cuidadosamente se o feedback é válido antes de agir', value: 2 },
      { id: 'c', text: 'Fico frustrado inicialmente, mas eventualmente trabalho nas melhorias', value: 1 },
      { id: 'd', text: 'Tendo a questionar a validade do feedback', value: 0 }
    ]
  },
  {
    id: 'q9',
    question: "Em relação às minhas responsabilidades no trabalho:",
    options: [
      { id: 'a', text: 'Frequentemente vou além do que é esperado da minha função', value: 3 },
      { id: 'b', text: 'Cumpro exatamente o que é esperado, nem mais nem menos', value: 2 },
      { id: 'c', text: 'Foco em fazer um trabalho excelente dentro das minhas atribuições definidas', value: 1 },
      { id: 'd', text: 'Priorizo as tarefas conforme orientação dos superiores', value: 0 }
    ]
  },
  {
    id: 'q10',
    question: "Quando enfrento um obstáculo no trabalho:",
    options: [
      { id: 'a', text: 'Persisto até encontrar uma solução por conta própria', value: 3 },
      { id: 'b', text: 'Busco ajuda imediatamente de colegas ou superiores', value: 2 },
      { id: 'c', text: 'Tento algumas abordagens e, se não funcionarem, busco orientação', value: 1 },
      { id: 'd', text: 'Reavario se vale a pena continuar ou mudar para outra tarefa', value: 0 }
    ]
  }
];


import QuestionCard from './proactivity/QuestionCard';
import ResultsCard from './proactivity/ResultsCard';

const ProactivityTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (!currentAnswer) return;
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: currentAnswer
    }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentAnswer(null);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setShowResults(true);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const calculateProactivityScore = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option) {
          totalScore += option.value;
        }
      }
      maxPossibleScore += 3; // 3 é o valor máximo por pergunta
    });
    const percentScore = Math.round((totalScore / maxPossibleScore) * 100);
    const proactivityLevels = [
      { min: 85, level: 'Altamente Proativo', description: 'Você é altamente proativo.' },
      { min: 70, level: 'Proativo', description: 'Você é proativo.' },
      { min: 50, level: 'Moderadamente Proativo', description: 'Você é moderadamente proativo.' },
      { min: 30, level: 'Reativo', description: 'Você é reativo.' },
      { min: 0, level: 'Altamente Reativo', description: 'Você é altamente reativo.' }
    ];
    const level = proactivityLevels.find(l => percentScore >= l.min) || proactivityLevels[proactivityLevels.length - 1];
    return {
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: percentScore,
      level: level.level,
      description: level.description
    };
  };

  const handleRetake = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (showResults) {
    const result = calculateProactivityScore();
    return (
      <ResultsCard
        result={result}
        totalQuestions={questions.length}
        answeredQuestions={Object.keys(answers).length}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <QuestionCard
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      question={questions[currentQuestion]}
      currentAnswer={currentAnswer}
      isSubmitting={isSubmitting}
      onAnswer={setCurrentAnswer}
      onNext={handleNext}
    />
  );
};

export default ProactivityTest;
