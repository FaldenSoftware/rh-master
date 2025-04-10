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

export const animalProfiles = {
  tubarao: {
    name: "Tubarão",
    title: "Executor",
    emoji: "🦈",
    icon: "/lovable-uploads/047ea0ab-847f-4d2a-bf9b-95a9c43dae11.png",
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
    icon: "/lovable-uploads/047ea0ab-847f-4d2a-bf9b-95a9c43dae11.png",
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
    icon: "/lovable-uploads/047ea0ab-847f-4d2a-bf9b-95a9c43dae11.png",
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
    icon: "/lovable-uploads/047ea0ab-847f-4d2a-bf9b-95a9c43dae11.png",
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

export const fetchAnimalProfileQuestions = async (): Promise<AnimalProfileQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_questions')
      .select('*');
      
    if (error) {
      console.error("Error fetching questions:", error);
      return getMockedQuestions();
    }
    
    if (!data || data.length === 0) {
      console.info("No questions found, using mocked data");
      return getMockedQuestions();
    }
    
    return data as AnimalProfileQuestion[];
  } catch (error) {
    console.error("Error in fetchAnimalProfileQuestions:", error);
    return getMockedQuestions();
  }
};

const getMockedQuestions = (): AnimalProfileQuestion[] => {
  return [
    {
      id: "1",
      pergunta: "Como você toma decisões importantes?",
      animal_tubarao: "Decido rapidamente com base nos resultados práticos que quero alcançar.",
      animal_gato: "Considero como a decisão afetará as pessoas envolvidas e busco consenso.",
      animal_lobo: "Analiso todas as possibilidades metodicamente antes de decidir.",
      animal_aguia: "Visualizo o quadro geral e as possibilidades futuras que essa decisão abrirá."
    },
    {
      id: "2",
      pergunta: "Como você prefere trabalhar em projetos?",
      animal_tubarao: "Com objetivos claros, prazos definidos e foco em resultados rápidos.",
      animal_gato: "Colaborando com uma equipe onde todos podem contribuir com suas ideias.",
      animal_lobo: "Seguindo um processo organizado e estruturado, com etapas bem definidas.",
      animal_aguia: "Com liberdade para explorar ideias inovadoras e diferentes abordagens."
    },
    {
      id: "3",
      pergunta: "Como você lida com conflitos?",
      animal_tubarao: "Enfrento-os diretamente e busco uma resolução rápida e objetiva.",
      animal_gato: "Busco entender todos os pontos de vista e encontrar uma solução harmoniosa.",
      animal_lobo: "Analiso cuidadosamente todas as opções antes de decidir o melhor caminho.",
      animal_aguia: "Vejo o conflito como uma oportunidade para novas ideias e mudanças positivas."
    },
    {
      id: "4",
      pergunta: "O que mais te motiva no trabalho?",
      animal_tubarao: "Alcançar resultados, superar desafios e ver o impacto imediato das minhas ações.",
      animal_gato: "Construir relacionamentos positivos e fazer parte de um time que trabalha bem junto.",
      animal_lobo: "Estabelecer processos eficientes e ver tudo funcionando conforme o planejado.",
      animal_aguia: "Explorar novas possibilidades e implementar ideias inovadoras."
    },
    {
      id: "5",
      pergunta: "Como você se comporta em reuniões?",
      animal_tubarao: "Vou direto ao ponto, foco nos objetivos e evito discussões prolongadas.",
      animal_gato: "Incentivo a participação de todos e busco construir consenso no grupo.",
      animal_lobo: "Sigo a agenda estabelecida, tomo notas e garanto que todos os detalhes sejam discutidos.",
      animal_aguia: "Trago novas perspectivas e desafio o grupo a pensar além do convencional."
    },
    {
      id: "6",
      pergunta: "Ao enfrentar um problema inesperado, você geralmente:",
      animal_tubarao: "Age rapidamente para resolver o problema antes que se agrave.",
      animal_gato: "Consulta a equipe para encontrar uma solução que acomode todos.",
      animal_lobo: "Analisa cuidadosamente todas as opções antes de decidir o melhor caminho.",
      animal_aguia: "Procura soluções inovadoras e não convencionais."
    },
    {
      id: "7",
      pergunta: "Em um ambiente de trabalho, o que mais te incomoda?",
      animal_tubarao: "Processos lentos e falta de decisões objetivas.",
      animal_gato: "Ambiente hostil e falta de colaboração entre as pessoas.",
      animal_lobo: "Desorganização e falta de planejamento estruturado.",
      animal_aguia: "Limitações à criatividade e excesso de regras rígidas."
    },
    {
      id: "8",
      pergunta: "Qual abordagem você prefere para aprender algo novo?",
      animal_tubarao: "Aprender fazendo, com foco nos aspectos práticos e resultados imediatos.",
      animal_gato: "Aprender em grupo, compartilhando ideias e experiências com outros.",
      animal_lobo: "Seguir um roteiro estruturado, dominando cada etapa antes de avançar.",
      animal_aguia: "Explorar livremente diferentes conceitos e fazer conexões inovadoras."
    },
    {
      id: "9",
      pergunta: "Como você prefere receber feedback?",
      animal_tubarao: "Direto e objetivo, focado em como melhorar o desempenho.",
      animal_gato: "De forma construtiva e empática, considerando o impacto emocional.",
      animal_lobo: "Detalhado e estruturado, com exemplos específicos e plano de ação.",
      animal_aguia: "Que explore possibilidades de crescimento e novas direções."
    },
    {
      id: "10",
      pergunta: "O que você mais valorizaria em uma promoção?",
      animal_tubarao: "Maior autoridade para tomar decisões e implementar mudanças.",
      animal_gato: "Oportunidade de liderar e desenvolver uma equipe unida.",
      animal_lobo: "Responsabilidade para criar sistemas e processos mais eficientes.",
      animal_aguia: "Liberdade para inovar e implementar uma visão de longo prazo."
    }
  ];
};

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
      return "temp-" + Math.random().toString(36).substring(2, 15);
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createAnimalProfileResult:", error);
    return "temp-" + Math.random().toString(36).substring(2, 15);
  }
};

export const saveAnimalProfileAnswer = async (
  resultId: string,
  questionId: string,
  animalChosen: string
): Promise<void> => {
  if (resultId.startsWith("temp-")) {
    console.info("Using temporary result ID, skipping database save");
    return;
  }
  
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

export const finalizeAnimalProfileResult = async (
  resultId: string,
  scores: { tubarao: number, gato: number, lobo: number, aguia: number },
  predominantAnimal: string = ''
): Promise<AnimalProfileResult> => {
  try {
    console.log("Finalizing result with predominant animal:", predominantAnimal);
    
    if (resultId.startsWith("temp-")) {
      console.info("Using temporary result ID, returning mocked result");
      return {
        id: resultId,
        user_id: "temp-user",
        score_tubarao: scores.tubarao,
        score_gato: scores.gato,
        score_lobo: scores.lobo,
        score_aguia: scores.aguia,
        animal_predominante: predominantAnimal,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('animal_profile_results')
      .update({
        score_tubarao: scores.tubarao,
        score_gato: scores.gato,
        score_lobo: scores.lobo,
        score_aguia: scores.aguia,
        animal_predominante: predominantAnimal,
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

export const getAnimalProfileResult = async (resultId: string): Promise<AnimalProfileResult> => {
  try {
    if (resultId.startsWith("temp-")) {
      return getMockedResult(resultId);
    }
    
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('id', resultId)
      .single();
      
    if (error) {
      console.error("Error getting result:", error);
      return getMockedResult(resultId);
    }
    
    return data as AnimalProfileResult;
  } catch (error) {
    console.error("Error in getAnimalProfileResult:", error);
    return getMockedResult(resultId);
  }
};

const getMockedResult = (resultId: string): AnimalProfileResult => {
  return {
    id: resultId,
    user_id: "temp-user",
    score_tubarao: 3,
    score_gato: 2,
    score_lobo: 2,
    score_aguia: 3,
    animal_predominante: "tubarao",
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const getUserLatestAnimalProfileResult = async (userId: string): Promise<AnimalProfileResult | null> => {
  try {
    const { data, error } = await supabase
      .from('animal_profile_results')
      .select('*')
      .eq('user_id', userId)
      .not('animal_predominante', 'is', null)
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

export const markClientTestCompleted = async (userId: string): Promise<boolean> => {
  console.log("[markClientTestCompleted] Attempting to mark test as completed for user:", userId);
  
  try {
    // Find the animal profile test
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('id')
      .ilike('title', '%Animal%')
      .single();
      
    if (testError || !testData) {
      console.error("[markClientTestCompleted] Error finding animal profile test:", testError);
      return false;
    }
    
    console.log("[markClientTestCompleted] Found test with ID:", testData.id);
    
    // Update the client test record to mark it as completed
    const { data: clientTestData, error: updateError } = await supabase
      .from('client_tests')
      .update({ 
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('client_id', userId)
      .eq('test_id', testData.id)
      .select('id')
      .single();
      
    if (updateError || !clientTestData) {
      console.error("[markClientTestCompleted] Error marking test as completed:", updateError);
      return false;
    }
    
    console.log("[markClientTestCompleted] Successfully marked test as completed, client_test_id:", clientTestData.id);
    
    // Find the latest test result to save in the test_results table
    try {
      const { data: resultData, error: resultError } = await supabase
        .from('animal_profile_results')
        .select('*')
        .eq('user_id', userId)
        .not('animal_predominante', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
        
      if (resultError || !resultData) {
        console.error("[markClientTestCompleted] Error finding animal profile result:", resultError);
        return false;
      }
      
      console.log("[markClientTestCompleted] Found latest result:", resultData);
      
      // Check if a result already exists for this client test
      const { data: existingResult, error: existingError } = await supabase
        .from('test_results')
        .select('id')
        .eq('client_test_id', clientTestData.id)
        .maybeSingle();
        
      if (existingError) {
        console.error("[markClientTestCompleted] Error checking for existing results:", existingError);
      }

      // If no result exists, create one
      if (!existingResult) {
        const result = {
          client_test_id: clientTestData.id,
          data: {
            score: calculateTotalScore(resultData),
            profile: [
              { name: "Tubarão", value: resultData.score_tubarao },
              { name: "Gato", value: resultData.score_gato },
              { name: "Lobo", value: resultData.score_lobo },
              { name: "Águia", value: resultData.score_aguia }
            ],
            category: "comportamental",
            predominant: resultData.animal_predominante
          }
        };
        
        console.log("[markClientTestCompleted] Creating test result with data:", result);
        
        const { error: resultInsertError } = await supabase
          .from('test_results')
          .insert(result);
          
        if (resultInsertError) {
          console.error("[markClientTestCompleted] Error creating test result:", resultInsertError);
          return false;
        } else {
          console.log("[markClientTestCompleted] Successfully created test result for client test");
        }
      } else {
        console.log("[markClientTestCompleted] Test result already exists, skipping creation");
      }
    } catch (error) {
      console.error("[markClientTestCompleted] Error processing test result:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("[markClientTestCompleted] General error:", error);
    return false;
  }
};

const calculateTotalScore = (result: AnimalProfileResult): number => {
  const total = result.score_tubarao + result.score_gato + result.score_lobo + result.score_aguia;
  const maxPossible = 10;
  return Math.round((total / maxPossible) * 100);
};

export const createDefaultAnimalProfileTest = async (): Promise<string | null> => {
  try {
    const { data: existingTest, error: testError } = await supabase
      .from('tests')
      .select('id')
      .ilike('title', '%Animal%')
      .maybeSingle();
    
    if (testError) {
      console.error("Error checking existing tests:", testError);
      return null;
    }
    
    if (existingTest) {
      return existingTest.id;
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    
    if (!session) {
      console.error("User not authenticated");
      return null;
    }
    
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (userError || !userData) {
      console.error("Error getting user profile:", userError);
      return null;
    }
    
    const { data: newTest, error: createError } = await supabase
      .from('tests')
      .insert({
        title: 'Teste de Perfil - Animais',
        description: 'Descubra seu perfil comportamental através de nossa metáfora de animais.',
        mentor_id: userData.role === 'mentor' ? session.user.id : session.user.id
      })
      .select('id')
      .single();
    
    if (createError) {
      console.error("Error creating test:", createError);
      return null;
    }
    
    return newTest.id;
  } catch (error) {
    console.error("Error in createDefaultAnimalProfileTest:", error);
    return null;
  }
};

export const assignAnimalProfileTestToClient = async (userId: string): Promise<boolean> => {
  try {
    const testId = await createDefaultAnimalProfileTest();
    
    if (!testId) {
      console.error("Failed to get or create animal profile test");
      return false;
    }
    
    const { data: existingAssignment, error: checkError } = await supabase
      .from('client_tests')
      .select('id')
      .eq('client_id', userId)
      .eq('test_id', testId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing assignment:", checkError);
      return false;
    }
    
    if (existingAssignment) {
      return true;
    }
    
    const { error: assignError } = await supabase
      .from('client_tests')
      .insert({
        client_id: userId,
        test_id: testId,
        is_completed: false
      });
    
    if (assignError) {
      console.error("Error assigning test to client:", assignError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in assignAnimalProfileTestToClient:", error);
    return false;
  }
};

export const shuffleAnswers = (question: AnimalProfileQuestion): Array<{text: string, animal: string}> => {
  const options = [
    { text: question.animal_tubarao, animal: "tubarao" },
    { text: question.animal_gato, animal: "gato" },
    { text: question.animal_lobo, animal: "lobo" },
    { text: question.animal_aguia, animal: "aguia" }
  ];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
};
