
import React, { useState } from 'react';
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Questions for the egogram test
const questions = [
  {
    id: 'q1',
    question: "Quando tenho um problema, eu geralmente analiso todas as possibilidades antes de agir.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q2',
    question: "Eu normalmente sigo as regras e procedimentos à risca.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q3',
    question: "Eu frequentemente priorizo as necessidades dos outros acima das minhas próprias.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q4',
    question: "Eu prefiro situações estruturadas e previsíveis.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q5',
    question: "Eu me expresso de forma livre e espontânea.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q6',
    question: "Eu tento entender os sentimentos dos outros antes de emitir opiniões.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q7',
    question: "Eu sou bom em estabelecer e seguir planos detalhados.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q8',
    question: "Eu me sinto confortável tomando decisões rapidamente quando necessário.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q9',
    question: "Eu estabeleço padrões elevados para mim e para os outros.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  },
  {
    id: 'q10',
    question: "Eu gosto de explorar novas ideias e possibilidades.",
    options: [
      { id: 'a', text: 'Concordo totalmente' },
      { id: 'b', text: 'Concordo parcialmente' },
      { id: 'c', text: 'Não concordo nem discordo' },
      { id: 'd', text: 'Discordo parcialmente' },
      { id: 'e', text: 'Discordo totalmente' }
    ]
  }
];

const EgogramaTest: React.FC = () => {
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

  const calculateResults = () => {
    // Simple calculation based on answer patterns
    const results = {
      pc: 0, // Pai Crítico
      pn: 0, // Pai Nutritivo
      a: 0,  // Adulto
      cl: 0, // Criança Livre
      ca: 0  // Criança Adaptada
    };
    
    // Map questions to ego states (simple demonstration)
    Object.entries(answers).forEach(([qId, answer]) => {
      const value = answer === 'a' ? 4 : answer === 'b' ? 3 : answer === 'c' ? 2 : answer === 'd' ? 1 : 0;
      
      if (['q2', 'q9'].includes(qId)) {
        results.pc += value;
      } else if (['q3', 'q6'].includes(qId)) {
        results.pn += value;
      } else if (['q1', 'q7', 'q8'].includes(qId)) {
        results.a += value;
      } else if (['q5', 'q10'].includes(qId)) {
        results.cl += value;
      } else if (['q4'].includes(qId)) {
        results.ca += value;
      }
    });
    
    // Normalize scores (simple approach)
    results.pc = Math.min(Math.round(results.pc * 1.25), 10);
    results.pn = Math.min(Math.round(results.pn * 2), 10);
    results.a = Math.min(Math.round(results.a * 1.67), 10);
    results.cl = Math.min(Math.round(results.cl * 2), 10);
    results.ca = Math.min(Math.round(results.ca * 5), 10);
    
    // Find dominant ego state
    const dominant = Object.entries(results).reduce((max, [key, val]) => 
      val > results[max] ? key : max, 'a');
    
    return {
      scores: results,
      dominant
    };
  };

  if (showResults) {
    const results = calculateResults();
    const dominantLabel = {
      'pc': 'Pai Crítico',
      'pn': 'Pai Nutritivo',
      'a': 'Adulto',
      'cl': 'Criança Livre',
      'ca': 'Criança Adaptada'
    }[results.dominant] || 'Adulto';

    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultados do Egograma</CardTitle>
          <CardDescription>Seu perfil de estados de ego</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold mb-2">Estado de ego dominante: <span className="text-brand-teal">{dominantLabel}</span></div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Distribuição dos seus estados de ego:</h3>
            
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
          disabled={!currentAnswer}
        >
          {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EgogramaTest;
