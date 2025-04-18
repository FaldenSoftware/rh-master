
import React, { useState } from 'react';
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Sample animal data
const sampleAnimal = {
  id: '1',
  name: 'Buddy',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  gender: 'Male',
  description: 'A friendly and playful dog looking for a loving home.',
  image_url: 'https://example.com/buddy.jpg',
  is_adopted: false,
  created_at: '2023-01-01T00:00:00.000Z',
};

// Questions for the animal profile test
const questions = [
  // Exemplo de estrutura correta para cada pergunta:
  // {
  //   id: 'q1',
  //   text: 'Exemplo de pergunta',
  //   options: [
  //     { id: 'q1o1', text: 'Opção 1', traits: { dinâmico: 2, expressivo: 1 } },
  //     { id: 'q1o2', text: 'Opção 2', traits: { analítico: 2, preciso: 1 } },
  //     { id: 'q1o3', text: 'Opção 3', traits: { amigável: 2, estável: 1 } }
  //   ]
  // },

  {
    id: 'q1',
    question: "What type of home environment would be best for Buddy?",
    options: [
      { id: 'a', text: 'A small apartment in the city' },
      { id: 'b', text: 'A suburban home with a yard' },
      { id: 'c', text: 'A rural farm with lots of space' },
      { id: 'd', text: 'Any environment with loving owners' }
    ]
  },
  {
    id: 'q2',
    question: "How much exercise does Buddy need daily?",
    options: [
      { id: 'a', text: 'Minimal exercise' },
      { id: 'b', text: 'A short walk once a day' },
      { id: 'c', text: 'Multiple walks and playtime' },
      { id: 'd', text: 'Constant activity throughout the day' }
    ]
  },
  {
    id: 'q3',
    question: "How would Buddy likely interact with other pets?",
    options: [
      { id: 'a', text: 'Would be aggressive toward other animals' },
      { id: 'b', text: 'Would be fearful and hide' },
      { id: 'c', text: 'Would be friendly and sociable' },
      { id: 'd', text: 'Would be indifferent to other animals' }
    ]
  },
  {
    id: 'q4',
    question: "What type of training would Buddy respond to best?",
    options: [
      { id: 'a', text: 'Strict, discipline-based training' },
      { id: 'b', text: 'Reward-based positive reinforcement' },
      { id: 'c', text: 'No training needed' },
      { id: 'd', text: 'Professional training only' }
    ]
  },
  {
    id: 'q5',
    question: "How would Buddy likely behave around children?",
    options: [
      { id: 'a', text: 'Would be cautious and reserved' },
      { id: 'b', text: 'Would be playful but gentle' },
      { id: 'c', text: 'Would be too energetic for small children' },
      { id: 'd', text: 'Would prefer homes without children' }
    ]
  },
  {
    id: 'q6',
    question: "What is Buddy's likely energy level?",
    options: [
      { id: 'a', text: 'Very low - prefers lounging all day' },
      { id: 'b', text: 'Moderate - active but also enjoys relaxing' },
      { id: 'c', text: 'High - needs constant stimulation' },
      { id: 'd', text: 'Variable - energetic at times, calm at others' }
    ]
  },
  {
    id: 'q7',
    question: "What special care might Buddy need?",
    options: [
      { id: 'a', text: 'Regular grooming for his coat', traits: { dinâmico: 1, expressivo: 0, analítico: 2, preciso: 2, amigável: 0, estável: 0, cauteloso: 1 } },
      { id: 'b', text: 'Special dietary considerations', traits: { dinâmico: 0, expressivo: 0, analítico: 2, preciso: 2, amigável: 0, estável: 1, cauteloso: 1 } },
      { id: 'c', text: 'Extra attention for separation anxiety', traits: { dinâmico: 0, expressivo: 2, analítico: 0, preciso: 0, amigável: 2, estável: 2, cauteloso: 1 } },
      { id: 'd', text: 'Minimal special care needed', traits: { dinâmico: 2, expressivo: 1, analítico: 1, preciso: 1, amigável: 1, estável: 1, cauteloso: 0 } }
    ]
  },
  {
    id: 'q8',
    question: "How easily would Buddy adapt to new environments?",
    options: [
      { id: 'a', text: 'Very easily - adaptable and flexible', traits: { dinâmico: 2, expressivo: 2, analítico: 0, preciso: 0, amigável: 1, estável: 0, cauteloso: 0 } },
      { id: 'b', text: 'Slowly - needs time to adjust', traits: { dinâmico: 0, expressivo: 0, analítico: 1, preciso: 2, amigável: 0, estável: 2, cauteloso: 2 } },
      { id: 'c', text: 'Difficulty adapting to change', traits: { dinâmico: 0, expressivo: 0, analítico: 2, preciso: 1, amigável: 0, estável: 2, cauteloso: 2 } },
      { id: 'd', text: 'Depends on the presence of familiar objects', traits: { dinâmico: 1, expressivo: 1, analítico: 1, preciso: 1, amigável: 1, estável: 2, cauteloso: 1 } }
    ]
  },
  {
    id: 'q9',
    question: "What would be Buddy's ideal daily routine?",
    options: [
      { id: 'a', text: 'Structured with consistent activities', traits: { dinâmico: 1, expressivo: 0, analítico: 2, preciso: 2, amigável: 0, estável: 2, cauteloso: 1 } },
      { id: 'b', text: 'Flexible with plenty of downtime', traits: { dinâmico: 1, expressivo: 1, analítico: 1, preciso: 1, amigável: 2, estável: 2, cauteloso: 0 } },
      { id: 'c', text: 'Active mornings and evenings with rest mid-day', traits: { dinâmico: 2, expressivo: 2, analítico: 0, preciso: 1, amigável: 1, estável: 1, cauteloso: 0 } },
      { id: 'd', text: 'No particular routine needed', traits: { dinâmico: 2, expressivo: 1, analítico: 0, preciso: 0, amigável: 1, estável: 0, cauteloso: 0 } }
    ]
  },
  {
    id: 'q10',
    question: "What type of enrichment would Buddy enjoy most?",
    options: [
      { id: 'a', text: 'Interactive toys and puzzles', traits: { dinâmico: 2, expressivo: 1, analítico: 2, preciso: 1, amigável: 0, estável: 0, cauteloso: 0 } },
      { id: 'b', text: 'Running and outdoor activities', traits: { dinâmico: 2, expressivo: 2, analítico: 0, preciso: 0, amigável: 1, estável: 0, cauteloso: 0 } },
      { id: 'c', text: 'Social interaction with other dogs', traits: { dinâmico: 1, expressivo: 2, analítico: 0, preciso: 0, amigável: 2, estável: 1, cauteloso: 0 } },
      { id: 'd', text: 'Quiet time with human companions', traits: { dinâmico: 0, expressivo: 0, analítico: 1, preciso: 1, amigável: 2, estável: 2, cauteloso: 1 } }
    ]
  }
];

const AnimalProfileTest: React.FC = () => {
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

  // Novo cálculo preciso do Perfil Comportamental
  // Cálculo preciso do Perfil Comportamental
  // Função de cálculo precisa do Perfil Comportamental
  const calculateProfile = () => {
    const traits = {
      dinâmico: 0,
      expressivo: 0,
      analítico: 0,
      preciso: 0,
      amigável: 0,
      estável: 0,
      cauteloso: 0
    };
    let totalPoints = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && option.traits) {
          Object.entries(option.traits).forEach(([trait, score]) => {
            traits[trait as keyof typeof traits] += score as number;
            totalPoints += score as number;
          });
        }
      }
    });
    const profileScores = {
      águia: (traits.dinâmico + traits.expressivo) / 2,
      lobo: (traits.analítico + traits.preciso) / 2,
      golfinho: (traits.expressivo + traits.amigável) / 2,
      coruja: (traits.estável + traits.cauteloso) / 2
    };
    let dominantProfile = Object.entries(profileScores).reduce(
      (max, [profile, score]) => score > max.score ? { profile, score } : max,
      { profile: '', score: 0 }
    );
    const maxPossibleScore = Object.values(traits).length * 3 * (Object.keys(answers).length / Object.values(traits).length); // 3 pontos máx por trait por pergunta
    const percentageScore = Math.round((totalPoints / maxPossibleScore) * 100);
    const sortedProfiles = Object.entries(profileScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([profile, score]) => ({
        profile,
        score,
        percentage: Math.round((score / (Object.values(profileScores).reduce((a, b) => a + b, 0))) * 100)
      }));
    return {
      dominantProfile: dominantProfile.profile,
      percentageScore: Math.min(percentageScore, 100),
      profileScores: sortedProfiles,
      traits
    };
  };

    const traits = {
      dinâmico: 0,
      expressivo: 0,
      analítico: 0,
      preciso: 0,
      amigável: 0,
      estável: 0,
      cauteloso: 0
    };
    let totalPoints = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && option.traits) {
          Object.entries(option.traits).forEach(([trait, score]) => {
            traits[trait as keyof typeof traits] += score as number;
            totalPoints += score as number;
          });
        }
      }
    });
    const profileScores = {
      águia: (traits.dinâmico + traits.expressivo) / 2,
      lobo: (traits.analítico + traits.preciso) / 2,
      golfinho: (traits.expressivo + traits.amigável) / 2,
      coruja: (traits.estável + traits.cauteloso) / 2
    };
    let dominantProfile = Object.entries(profileScores).reduce(
      (max, [profile, score]) => score > max.score ? { profile, score } : max,
      { profile: '', score: 0 }
    );
    const maxPossibleScore = Object.values(traits).length * 3 * (Object.keys(answers).length / Object.values(traits).length); // 3 pontos máx por trait por pergunta
    const percentageScore = Math.round((totalPoints / maxPossibleScore) * 100);
    const sortedProfiles = Object.entries(profileScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([profile, score]) => ({
        profile,
        score,
        percentage: Math.round((score / (Object.values(profileScores).reduce((a, b) => a + b, 0))) * 100)
      }));
    return {
      dominantProfile: dominantProfile.profile,
      percentageScore: Math.min(percentageScore, 100),
      profileScores: sortedProfiles,
      traits
    };
  };

    const traits = {
      dinâmico: 0,
      expressivo: 0,
      analítico: 0,
      preciso: 0,
      amigável: 0,
      estável: 0,
      cauteloso: 0
    };
    let totalPoints = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && option.traits) {
          Object.entries(option.traits).forEach(([trait, score]) => {
            traits[trait as keyof typeof traits] += score as number;
            totalPoints += score as number;
          });
        }
      }
    });
    const profileScores = {
      águia: (traits.dinâmico + traits.expressivo) / 2,
      lobo: (traits.analítico + traits.preciso) / 2,
      golfinho: (traits.expressivo + traits.amigável) / 2,
      coruja: (traits.estável + traits.cauteloso) / 2
    };
    let dominantProfile = Object.entries(profileScores).reduce(
      (max, [profile, score]) => score > max.score ? { profile, score } : max,
      { profile: '', score: 0 }
    );
    const maxPossibleScore = 30; // Considerando 10 perguntas com média de 3 pontos cada
    const percentageScore = Math.round((totalPoints / maxPossibleScore) * 100);
    const sortedProfiles = Object.entries(profileScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([profile, score]) => ({
        profile,
        score,
        percentage: Math.round((score / (Object.values(profileScores).reduce((a, b) => a + b, 0))) * 100)
      }));
    return {
      dominantProfile: dominantProfile.profile,
      percentageScore: Math.min(percentageScore, 100),
      profileScores: sortedProfiles,
      traits
    };
  };


  if (showResults) {
    const compatibility = calculateCompatibility();
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultados do Perfil Comportamental</CardTitle>
          <CardDescription>Veja sua compatibilidade com o perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-brand-teal mb-2">{compatibility}%</div>
            <p className="text-xl">Pontuação de Compatibilidade</p>
          </div>

          <Alert variant={compatibility > 80 ? "default" : "destructive"} className="mt-4 bg-brand-beige border-brand-gold text-brand-teal">
            {compatibility > 80 
              ? "Você tem um perfil altamente compatível!" 
              : "Você pode melhorar alguns aspectos do seu perfil comportamental."}
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-brand-teal hover:bg-brand-teal/90" onClick={() => {
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
            <CardTitle className="text-2xl">Perfil Comportamental</CardTitle>
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
          <RadioGroup value={currentAnswer || ""} onValueChange={setCurrentAnswer}>
            <div className="space-y-3">
              {questions[currentQuestion].options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/90" 
          onClick={handleNext} 
          disabled={!currentAnswer}
        >
          {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalProfileTest;
