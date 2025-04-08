
import { supabase } from "@/integrations/supabase/client";

export interface AnimalProfileQuestion {
  id: string;
  pergunta: string;
  animal_tubarao: string;
  animal_gato: string;
  animal_lobo: string;
  animal_aguia: string;
}

export interface AnimalProfileAnswer {
  questionId: string;
  animalChosen: string;
}

export interface AnimalProfileResult {
  id: string;
  userId: string;
  scoreTubarao: number;
  scoreGato: number;
  scoreLobo: number;
  scoreAguia: number;
  animalPredominante: string;
  completedAt: string;
}

// Animal characteristics for results display
export const animalProfiles = {
  tubarao: {
    name: "Tubarão",
    title: "Executor",
    description: "Você é orientado a resultados, decidido e direto. Prefere ação rápida e eficiência em tudo o que faz.",
    characteristics: [
      "Foco em resultados e metas",
      "Tomada de decisão rápida e assertiva",
      "Preferência por eficiência e objetividade",
      "Determinação e persistência"
    ],
    strengths: [
      "Capacidade de liderar em momentos decisivos",
      "Foco no que realmente importa",
      "Eficiência na execução de tarefas",
      "Coragem para enfrentar desafios difíceis"
    ],
    challenges: [
      "Pode parecer impaciente ou autoritário",
      "Às vezes ignora detalhes importantes",
      "Pode não considerar o impacto emocional de suas decisões",
      "Tende a assumir controle mesmo quando não é necessário"
    ],
    recommendations: [
      "Pratique a escuta ativa",
      "Dedique tempo para considerar diferentes perspectivas",
      "Desenvolva paciência para processos mais detalhados",
      "Busque feedback sobre como suas ações afetam os outros"
    ],
    emoji: "🦈"
  },
  gato: {
    name: "Gato",
    title: "Comunicador",
    description: "Você é sociável, empático e excelente em construir relacionamentos. Valoriza a harmonia e a boa comunicação.",
    characteristics: [
      "Habilidades sociais e de comunicação excelentes",
      "Empatia e compreensão das necessidades alheias",
      "Valorização dos relacionamentos interpessoais",
      "Capacidade de criar harmonia em grupos"
    ],
    strengths: [
      "Talento para conectar pessoas diferentes",
      "Habilidade para resolver conflitos",
      "Capacidade de criar ambientes positivos",
      "Sensibilidade às necessidades da equipe"
    ],
    challenges: [
      "Pode evitar confrontos necessários",
      "Às vezes prioriza harmonia sobre resultados",
      "Pode ter dificuldade com tarefas solitárias",
      "Tende a levar críticas de forma muito pessoal"
    ],
    recommendations: [
      "Pratique dar feedback direto quando necessário",
      "Desenvolva conforto em trabalhar independentemente",
      "Aprenda a equilibrar relacionamentos com resultados",
      "Estabeleça limites claros para evitar sobrecarga"
    ],
    emoji: "🐱"
  },
  lobo: {
    name: "Lobo",
    title: "Organizador",
    description: "Você é metódico, detalhista e extremamente confiável. Valoriza ordem, estrutura e processos bem definidos.",
    characteristics: [
      "Atenção excepcional aos detalhes",
      "Alta capacidade de organização e planejamento",
      "Valorização da precisão e qualidade",
      "Confiabilidade e consistência"
    ],
    strengths: [
      "Habilidade para criar sistemas eficientes",
      "Excelência em gerenciar projetos complexos",
      "Capacidade de antecipar problemas potenciais",
      "Comprometimento com a qualidade"
    ],
    challenges: [
      "Pode ter dificuldade com ambiguidade ou mudanças",
      "Às vezes é percebido como inflexível",
      "Pode se perder em detalhes e perder a visão geral",
      "Tendência ao perfeccionismo excessivo"
    ],
    recommendations: [
      "Pratique adaptabilidade em situações de mudança",
      "Desenvolva conforto com algum grau de ambiguidade",
      "Busque equilíbrio entre detalhes e visão geral",
      "Aprenda a priorizar o que realmente importa"
    ],
    emoji: "🐺"
  },
  aguia: {
    name: "Águia",
    title: "Idealizador",
    description: "Você é visionário, estratégico e inovador. Sempre pensando no futuro e em novas possibilidades.",
    characteristics: [
      "Pensamento visionário e estratégico",
      "Criatividade e capacidade de inovação",
      "Foco no quadro geral e tendências futuras",
      "Capacidade de inspirar e motivar os outros"
    ],
    strengths: [
      "Habilidade para identificar oportunidades futuras",
      "Pensamento fora da caixa e solução criativa de problemas",
      "Capacidade de inspirar equipes com visões ambiciosas",
      "Talento para conectar ideias aparentemente não relacionadas"
    ],
    challenges: [
      "Pode perder interesse em detalhes da implementação",
      "Às vezes propõe ideias pouco práticas",
      "Pode parecer desconectado das necessidades imediatas",
      "Tendência a iniciar muitos projetos sem terminá-los"
    ],
    recommendations: [
      "Desenvolva habilidades de implementação prática",
      "Aprenda a avaliar a viabilidade de suas ideias",
      "Busque parcerias com pessoas orientadas a detalhes",
      "Pratique a conclusão de projetos antes de iniciar novos"
    ],
    emoji: "🦅"
  }
};

// Fetch all questions for the animal profile test
export const fetchAnimalProfileQuestions = async (): Promise<AnimalProfileQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_questions')
      .select('*')
      .order('id');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching animal profile questions:', error);
    throw error;
  }
};

// Create a new result record at the beginning of the test
export const createAnimalProfileResult = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .insert([
        { user_id: userId }
      ])
      .select('id')
      .single();
      
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating animal profile result:', error);
    throw error;
  }
};

// Save a user's answer
export const saveAnimalProfileAnswer = async (
  resultId: string, 
  questionId: string, 
  animalChosen: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('animal_profile_answers')
      .insert([
        { 
          result_id: resultId, 
          question_id: questionId, 
          animal_chosen: animalChosen 
        }
      ]);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving animal profile answer:', error);
    throw error;
  }
};

// Calculate and update final results
export const finalizeAnimalProfileResult = async (
  resultId: string, 
  scores: { 
    tubarao: number; 
    gato: number; 
    lobo: number; 
    aguia: number; 
  }
): Promise<AnimalProfileResult> => {
  try {
    // Determine the predominant animal
    const { tubarao, gato, lobo, aguia } = scores;
    let animalPredominante = '';
    
    const maxScore = Math.max(tubarao, gato, lobo, aguia);
    
    // Check if there's a tie
    const tiedAnimals = [];
    if (tubarao === maxScore) tiedAnimals.push('tubarao');
    if (gato === maxScore) tiedAnimals.push('gato');
    if (lobo === maxScore) tiedAnimals.push('lobo');
    if (aguia === maxScore) tiedAnimals.push('aguia');
    
    if (tiedAnimals.length > 1) {
      animalPredominante = tiedAnimals.join('-');
    } else {
      animalPredominante = tiedAnimals[0];
    }
    
    // Update the result record
    const { data, error } = await supabase
      .from('animal_profile_results')
      .update({
        score_tubarao: tubarao,
        score_gato: gato,
        score_lobo: lobo,
        score_aguia: aguia,
        animal_predominante: animalPredominante,
        completed_at: new Date().toISOString()
      })
      .eq('id', resultId)
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      scoreTubarao: data.score_tubarao,
      scoreGato: data.score_gato,
      scoreLobo: data.score_lobo,
      scoreAguia: data.score_aguia,
      animalPredominante: data.animal_predominante,
      completedAt: data.completed_at
    };
  } catch (error) {
    console.error('Error finalizing animal profile result:', error);
    throw error;
  }
};

// Get result by ID
export const getAnimalProfileResult = async (resultId: string): Promise<AnimalProfileResult | null> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('id', resultId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      scoreTubarao: data.score_tubarao,
      scoreGato: data.score_gato,
      scoreLobo: data.score_lobo,
      scoreAguia: data.score_aguia,
      animalPredominante: data.animal_predominante,
      completedAt: data.completed_at
    };
  } catch (error) {
    console.error('Error getting animal profile result:', error);
    throw error;
  }
};

// Get user's latest result
export const getUserLatestAnimalProfileResult = async (userId: string): Promise<AnimalProfileResult | null> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('user_id', userId)
      .eq('animal_predominante', 'is not', null)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      scoreTubarao: data.score_tubarao,
      scoreGato: data.score_gato,
      scoreLobo: data.score_lobo,
      scoreAguia: data.score_aguia,
      animalPredominante: data.animal_predominante,
      completedAt: data.completed_at
    };
  } catch (error) {
    console.error('Error getting user latest animal profile result:', error);
    throw error;
  }
};

// Update the client_test as completed
export const markClientTestCompleted = async (clientId: string): Promise<void> => {
  try {
    // Find the test with the title "Teste de Perfil - Animais"
    const { data: tests, error: testError } = await supabase
      .from('tests')
      .select('id')
      .eq('title', 'Teste de Perfil - Animais')
      .single();
      
    if (testError) throw testError;
    
    if (!tests) throw new Error('Teste não encontrado');
    
    // Update the client_test record
    const { error } = await supabase
      .from('client_tests')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('client_id', clientId)
      .eq('test_id', tests.id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error marking client test as completed:', error);
    throw error;
  }
};

// Functions to handle test flow
export const shuffleAnswers = (question: AnimalProfileQuestion): Array<{text: string, animal: string}> => {
  const options = [
    { text: question.animal_tubarao, animal: "tubarao" },
    { text: question.animal_gato, animal: "gato" },
    { text: question.animal_lobo, animal: "lobo" },
    { text: question.animal_aguia, animal: "aguia" }
  ];
  
  // Fisher-Yates shuffle algorithm
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
};
