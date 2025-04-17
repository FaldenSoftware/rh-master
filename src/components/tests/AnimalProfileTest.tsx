
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
      { id: 'a', text: 'Regular grooming for his coat' },
      { id: 'b', text: 'Special dietary considerations' },
      { id: 'c', text: 'Extra attention for separation anxiety' },
      { id: 'd', text: 'Minimal special care needed' }
    ]
  },
  {
    id: 'q8',
    question: "How easily would Buddy adapt to new environments?",
    options: [
      { id: 'a', text: 'Very easily - adaptable and flexible' },
      { id: 'b', text: 'Slowly - needs time to adjust' },
      { id: 'c', text: 'Difficulty adapting to change' },
      { id: 'd', text: 'Depends on the presence of familiar objects' }
    ]
  },
  {
    id: 'q9',
    question: "What would be Buddy's ideal daily routine?",
    options: [
      { id: 'a', text: 'Structured with consistent activities' },
      { id: 'b', text: 'Flexible with plenty of downtime' },
      { id: 'c', text: 'Active mornings and evenings with rest mid-day' },
      { id: 'd', text: 'No particular routine needed' }
    ]
  },
  {
    id: 'q10',
    question: "What type of enrichment would Buddy enjoy most?",
    options: [
      { id: 'a', text: 'Interactive toys and puzzles' },
      { id: 'b', text: 'Running and outdoor activities' },
      { id: 'c', text: 'Social interaction with other dogs' },
      { id: 'd', text: 'Quiet time with human companions' }
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

  const calculateCompatibility = () => {
    // Simple algorithm - each answer has a compatibility score
    // In a real app, this would be more sophisticated
    return Math.floor(Math.random() * 40) + 60; // Returns 60-99% compatibility
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
