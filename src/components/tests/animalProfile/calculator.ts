
import { AnimalProfileQuestion } from './questions';
import { profiles } from './profiles';

export type ProfileResult = {
  dominantProfile: string;
  percentageScore: number;
  profileScores: {
    profile: string;
    score: number;
    percentage: number;
  }[];
  traits: Record<string, number>;
};

export const calculateAnimalProfile = (
  answers: Record<string, string>,
  questions: AnimalProfileQuestion[]
): ProfileResult => {
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
          traits[trait as keyof typeof traits] += score;
          totalPoints += score;
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
  
  const dominantProfile = Object.entries(profileScores).reduce(
    (max, [profile, score]) => score > max.score ? { profile, score } : max,
    { profile: '', score: 0 }
  );
  
  const maxPossibleScore = 30;
  const percentageScore = Math.min(Math.round((totalPoints / maxPossibleScore) * 100), 100);
  
  const sortedProfiles = Object.entries(profileScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([profile, score]) => ({
      profile,
      score,
      percentage: Math.round((score / (Object.values(profileScores).reduce((a, b) => a + b, 0))) * 100)
    }));
  
  return {
    dominantProfile: dominantProfile.profile,
    percentageScore,
    profileScores: sortedProfiles,
    traits
  };
};
