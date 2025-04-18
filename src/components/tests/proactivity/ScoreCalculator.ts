
import { proactivityLevels } from './levels';
import type { ProactivityQuestion } from './questions';

export const calculateProactivityScore = (answers: Record<string, string>, questions: ProactivityQuestion[]) => {
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
    maxPossibleScore += 3;
  });
  
  const percentScore = Math.round((totalScore / maxPossibleScore) * 100);
  const level = proactivityLevels.find(l => percentScore >= l.min) || proactivityLevels[proactivityLevels.length - 1];
  
  return {
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage: percentScore,
    level: level.level,
    description: level.description
  };
};
