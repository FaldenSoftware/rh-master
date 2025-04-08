
import { supabase } from "@/integrations/supabase/client";

export interface AnimalProfileQuestion {
  id: string;
  pergunta: string;
  animal_tubarao: string;
  animal_gato: string;
  animal_lobo: string;
  animal_aguia: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnimalProfileResult {
  id: string;
  user_id: string;
  score_tubarao: number;
  score_gato: number;
  score_lobo: number;
  score_aguia: number;
  animal_predominante: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnimalProfileAnswer {
  id?: string;
  result_id: string;
  question_id: string;
  animal_chosen: string;
  created_at?: string;
}

// Animal profile information for display
export const animalProfiles = {
  tubarao: {
    name: "Tubarão",
    title: "Executor",
    emoji: "🦈",
    description: "Você é determinado, orientado a resultados e tem uma forte inclinação para a ação rápida. Suas decisões são práticas e baseadas na eficiência.",
    characteristics: [
      "Focado em resultados",
      "Direto e objetivo",
      "Decisivo e rápido",
      "Prático e eficiente",
      "Orientado a metas"
    ],
    strengths: [
      "Capacidade de tomar decisões difíceis",
      "Eficiência na execução de tarefas",
      "Determinação para alcançar objetivos",
      "Abordagem pragmática para resolver problemas",
      "Alto nível de produtividade"
    ],
    challenges: [
      "Pode ser visto como impaciente",
      "Às vezes ignora detalhes importantes",
      "Pode ter dificuldade em considerar o impacto emocional das decisões",
      "Tendência a dominar conversas e reuniões",
      "Pode priorizar velocidade em detrimento da qualidade"
    ],
    recommendations: [
      "Dedique tempo para ouvir outras perspectivas antes de tomar decisões",
      "Pratique a empatia ao se comunicar com pessoas de perfis diferentes",
      "Aprenda a equilibrar velocidade com atenção aos detalhes",
      "Desenvolva habilidades de comunicação mais inclusivas",
      "Cultive a paciência em processos que exigem análise mais profunda"
    ]
  },
  gato: {
    name: "Gato",
    title: "Comunicador",
    emoji: "🐱",
    description: "Você é sociável, expressivo e tem excelentes habilidades interpessoais. Sua abordagem é colaborativa e você valoriza relacionamentos.",
    characteristics: [
      "Comunicativo e eloquente",
      "Empático e atencioso",
      "Focado em relacionamentos",
      "Adaptável a diferentes situações sociais",
      "Persuasivo e influente"
    ],
    strengths: [
      "Excelentes habilidades de comunicação",
      "Capacidade de construir e manter relacionamentos",
      "Sensibilidade às necessidades dos outros",
      "Talento para resolver conflitos interpessoais",
      "Habilidade para motivar e inspirar equipes"
    ],
    challenges: [
      "Pode evitar confrontos necessários",
      "Às vezes prioriza harmonia em detrimento de decisões difíceis",
      "Tendência a se distrair em conversas",
      "Pode ter dificuldade com tarefas solitárias",
      "Sensibilidade excessiva a críticas"
    ],
    recommendations: [
      "Desenvolva habilidades para lidar com conversas difíceis",
      "Pratique a objetividade em suas comunicações",
      "Estabeleça momentos de foco sem distrações sociais",
      "Aprenda a equilibrar empatia com pragmatismo",
      "Cultive a resiliência emocional diante de feedback crítico"
    ]
  },
  lobo: {
    name: "Lobo",
    title: "Organizador",
    emoji: "🐺",
    description: "Você é estruturado, metódico e atento aos detalhes. Sua abordagem é sistemática e você valoriza planejamento e ordem.",
    characteristics: [
      "Organizado e metódico",
      "Analítico e detalhista",
      "Confiável e consistente",
      "Focado em processos",
      "Planejador estratégico"
    ],
    strengths: [
      "Excelente capacidade de planejamento",
      "Atenção aos detalhes e precisão",
      "Habilidade para estabelecer sistemas eficientes",
      "Confiabilidade em cumprir prazos",
      "Pensamento estruturado e lógico"
    ],
    challenges: [
      "Pode ser visto como inflexível",
      "Tendência ao perfeccionismo",
      "Dificuldade em lidar com mudanças repentinas",
      "Às vezes foca demais nos detalhes e perde a visão geral",
      "Pode ter dificuldade em delegar tarefas"
    ],
    recommendations: [
      "Pratique flexibilidade diante de situações imprevistas",
      "Desenvolva tolerância para imperfeições em situações apropriadas",
      "Cultive habilidades de adaptação a mudanças",
      "Exercite a visão estratégica junto com a atenção aos detalhes",
      "Aprenda técnicas de delegação efetiva"
    ]
  },
  aguia: {
    name: "Águia",
    title: "Idealizador",
    emoji: "🦅",
    description: "Você é visionário, criativo e orientado para o futuro. Sua abordagem é inovadora e você valoriza novas ideias e possibilidades.",
    characteristics: [
      "Visionário e criativo",
      "Pensador estratégico",
      "Inovador e original",
      "Orientado para o futuro",
      "Entusiasta por novas ideias"
    ],
    strengths: [
      "Capacidade de visualizar possibilidades futuras",
      "Pensamento inovador e fora da caixa",
      "Habilidade para inspirar outros com visões",
      "Abordagem criativa para resolver problemas",
      "Facilidade em adaptar-se a novos conceitos"
    ],
    challenges: [
      "Pode parecer desconectado da realidade atual",
      "Dificuldade em transformar ideias em planos concretos",
      "Tendência a iniciar projetos sem concluí-los",
      "Às vezes subestima detalhes práticos",
      "Pode se entediar com rotinas e processos"
    ],
    recommendations: [
      "Desenvolva habilidades de execução e implementação prática",
      "Aprenda a equilibrar visão com realidade operacional",
      "Cultive disciplina para concluir projetos iniciados",
      "Busque parcerias com pessoas de perfil mais estruturado",
      "Pratique atenção aos detalhes em momentos críticos"
    ]
  }
};

// Fetch all animal profile questions from the database
export const fetchAnimalProfileQuestions = async (): Promise<AnimalProfileQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_questions')
      .select('*');
      
    if (error) {
      console.error("Error fetching questions:", error);
      throw new Error(error.message);
    }
    
    return data as AnimalProfileQuestion[];
  } catch (error) {
    console.error("Error in fetchAnimalProfileQuestions:", error);
    throw error;
  }
};

// Create a new animal profile result record
export const createAnimalProfileResult = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .insert([{ 
        user_id: userId 
      }])
      .select('id')
      .single();
      
    if (error) {
      console.error("Error creating result:", error);
      throw new Error(error.message);
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createAnimalProfileResult:", error);
    throw error;
  }
};

// Save an answer for a specific question
export const saveAnimalProfileAnswer = async (
  resultId: string,
  questionId: string,
  animalChosen: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('animal_profile_answers')
      .insert([{
        result_id: resultId,
        question_id: questionId,
        animal_chosen: animalChosen
      }]);
      
    if (error) {
      console.error("Error saving answer:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in saveAnimalProfileAnswer:", error);
    throw error;
  }
};

// Finalize the test result with scores
export const finalizeAnimalProfileResult = async (
  resultId: string,
  scores: { tubarao: number, gato: number, lobo: number, aguia: number }
): Promise<AnimalProfileResult> => {
  try {
    // Determine the predominant animal profile(s)
    const { tubarao, gato, lobo, aguia } = scores;
    const maxScore = Math.max(tubarao, gato, lobo, aguia);
    
    let predominante = "";
    
    if (tubarao === maxScore) predominante += "tubarao";
    if (gato === maxScore) predominante += predominante ? "-gato" : "gato";
    if (lobo === maxScore) predominante += predominante ? "-lobo" : "lobo";
    if (aguia === maxScore) predominante += predominante ? "-aguia" : "aguia";
    
    // Update the result with scores and predominant animal
    const { data, error } = await supabase
      .from('animal_profile_results')
      .update({
        score_tubarao: tubarao,
        score_gato: gato,
        score_lobo: lobo,
        score_aguia: aguia,
        animal_predominante: predominante,
        completed_at: new Date().toISOString()
      })
      .eq('id', resultId)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error finalizing result:", error);
      throw new Error(error.message);
    }
    
    return data as AnimalProfileResult;
  } catch (error) {
    console.error("Error in finalizeAnimalProfileResult:", error);
    throw error;
  }
};

// Get a specific animal profile result
export const getAnimalProfileResult = async (resultId: string): Promise<AnimalProfileResult> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('id', resultId)
      .single();
      
    if (error) {
      console.error("Error getting result:", error);
      throw new Error(error.message);
    }
    
    return data as AnimalProfileResult;
  } catch (error) {
    console.error("Error in getAnimalProfileResult:", error);
    throw error;
  }
};

// Fetch user's latest animal profile result
export const getUserLatestAnimalProfileResult = async (userId: string): Promise<AnimalProfileResult | null> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('user_id', userId)
      .is('animal_predominante', 'not.null' as any)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error("Error getting latest result:", error);
      throw new Error(error.message);
    }
    
    return data as AnimalProfileResult;
  } catch (error) {
    console.error("Error in getUserLatestAnimalProfileResult:", error);
    throw error;
  }
};

// Mark a test as completed in client_tests table
export const markClientTestCompleted = async (userId: string): Promise<void> => {
  try {
    // Find the animal profile test
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('id')
      .ilike('title', '%Animal%')
      .single();
      
    if (testError) {
      console.error("Error finding animal profile test:", testError);
      throw new Error(testError.message);
    }
    
    // Update client_tests record to mark it as completed
    const { error: updateError } = await supabase
      .from('client_tests')
      .update({ 
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('client_id', userId)
      .eq('test_id', testData.id);
      
    if (updateError) {
      console.error("Error marking test as completed:", updateError);
      throw new Error(updateError.message);
    }
  } catch (error) {
    console.error("Error in markClientTestCompleted:", error);
    throw error;
  }
};

// Helper function to shuffle the answer options
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
