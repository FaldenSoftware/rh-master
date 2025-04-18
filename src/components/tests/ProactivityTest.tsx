
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
  //   ]
  // },

  {
    id: 'q1',
    question: "Quando identifico um problema no trabalho, prefiro:",
    options: [
      { id: 'a', text: 'Resolvê-lo imediatamente, mesmo que não seja minha responsabilidade' },
      { id: 'b', text: 'Informar meu supervisor e aguardar instruções' },
      { id: 'c', text: 'Analisar o problema e propor possíveis soluções ao meu supervisor' },
      { id: 'd', text: 'Aguardar para ver se o problema se resolve sozinho' }
    ]
  },
  {
    id: 'q2',
    question: "Em relação a novas habilidades profissionais, eu geralmente:",
    options: [
      { id: 'a', text: 'Espero que a empresa ofereça treinamentos quando necessário' },
      { id: 'b', text: 'Busco constantemente aprender novas habilidades por conta própria' },
      { id: 'c', text: 'Aprendo apenas o necessário para cumprir minhas funções atuais' },
      { id: 'd', text: 'Prefiro me especializar profundamente em uma única área' }
    ]
  },
  {
    id: 'q3',
    question: "Quando surge uma oportunidade de liderar um projeto:",
    options: [
      { id: 'a', text: 'Me voluntario imediatamente, mesmo que seja desafiador' },
      { id: 'b', text: 'Espero ser convidado para assumir a responsabilidade' },
      { id: 'c', text: 'Avalio se tenho as habilidades necessárias antes de me oferecer' },
      { id: 'd', text: 'Prefiro trabalhar como parte da equipe sem responsabilidade de liderança' }
    ]
  },
  {
    id: 'q4',
    question: "Quando a empresa implementa uma mudança significativa, eu:",
    options: [
      { id: 'a', text: 'Resisto inicialmente e depois me adapto gradualmente' },
      { id: 'b', text: 'Aceito passivamente e sigo as novas diretrizes' },
      { id: 'c', text: 'Abraço a mudança e busco maneiras de contribuir para o sucesso' },
      { id: 'd', text: 'Analiso criticamente os prós e contras antes de me posicionar' }
    ]
  },
  {
    id: 'q5',
    question: "Em relação ao estabelecimento de metas pessoais:",
    options: [
      { id: 'a', text: 'Estabeleço regularmente metas desafiadoras e monitoro meu progresso' },
      { id: 'b', text: 'Prefiro trabalhar com as metas estabelecidas pela empresa' },
      { id: 'c', text: 'Estabeleço metas apenas quando necessário para projetos específicos' },
      { id: 'd', text: 'Trabalho melhor sem metas formalmente estabelecidas' }
    ]
  },
  {
    id: 'q6',
    question: "Quando vejo uma oportunidade de melhoria em um processo de trabalho:",
    options: [
      { id: 'a', text: 'Implemento a melhoria por conta própria se estiver ao meu alcance' },
      { id: 'b', text: 'Sugiro a melhoria ao meu supervisor e aguardo feedback' },
      { id: 'c', text: 'Discuto com colegas para refinar a ideia antes de apresentá-la formalmente' },
      { id: 'd', text: 'Não interfiro em processos já estabelecidos' }
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

const ProactivityTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

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
        setShowResults(true);
      }
    }
  };

  // Novo cálculo preciso da Proatividade
  // Cálculo preciso de Proatividade
  // Função de cálculo precisa de Proatividade
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
      maxPossibleScore += 3; // 3 é a pontuação máxima por questão
    });
    const percentScore = Math.round((totalScore / maxPossibleScore) * 100);
    // Definir níveis de proatividade
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


  if (showResults) {
    const result = calculateProactivityScore();

    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultados do Formulário de Proatividade</CardTitle>
          <CardDescription>Avaliação do seu perfil de proatividade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-brand-teal mb-2">{result.percentage}%</div>
            <p className="text-xl">Pontuação de Proatividade</p>
            <p className="mt-2 text-lg font-semibold text-brand-gold">{result.level}</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-brand-teal h-3 rounded-full" style={{ width: `${result.percentage}%` }}></div>
          </div>

          <Alert className="bg-brand-beige border-brand-gold text-brand-teal mt-4">
            <p>
              {result.level === 'Altamente Proativo' && 'Você demonstra níveis excepcionais de iniciativa e proatividade. Continua buscando oportunidades para melhorar e inovar, frequentemente liderando mudanças.'}
              {result.level === 'Proativo' && 'Você demonstra boa iniciativa na maioria das situações, identificando oportunidades e agindo sem necessidade de incentivo constante.'}
              {result.level === 'Moderadamente Proativo' && 'Você demonstra iniciativa em algumas áreas, mas pode esperar por orientação ou aprovação em outras situações antes de agir.'}
              {result.level === 'Reativo' && 'Você tende a responder a situações em vez de antecipá-las, geralmente esperando por direcionamento antes de tomar ações.'}
              {result.level === 'Altamente Reativo' && 'Você geralmente espera por instruções claras e direcionamento antes de agir, preferindo seguir estruturas estabelecidas.'}
            </p>
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
            <CardTitle className="text-2xl">Formulário de Proatividade</CardTitle>
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
          disabled={!currentAnswer}
        >
          {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProactivityTest;
