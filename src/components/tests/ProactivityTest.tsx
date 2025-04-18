
import React, { useState } from "react";
import { questions } from './proactivity/questions';
import { calculateProactivityScore } from './proactivity/ScoreCalculator';
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

  const handleRetake = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (showResults) {
    const result = calculateProactivityScore(answers, questions);
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
