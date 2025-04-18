export type AnimalProfile = {
  name: string;
  primaryTraits: string[];
  description: string;
  strengths: string;
  challenges: string;
  color: string;
};

export const profiles: Record<string, AnimalProfile> = {
  águia: {
    name: "Águia",
    primaryTraits: ["dinâmico", "expressivo"],
    description: "Você é orientado para resultados, direto, decisivo e competitivo. Gosta de desafios, assume riscos calculados e toma decisões rapidamente. Prefere liderar a seguir e valoriza a independência.",
    strengths: "Liderança, iniciativa, foco em resultados, eficiência",
    challenges: "Pode ser impaciente, dominante ou insensível às necessidades dos outros",
    color: "bg-red-600"
  },
  lobo: {
    name: "Lobo",
    primaryTraits: ["analítico", "preciso"],
    description: "Você é metódico, detalhista e lógico. Valoriza a precisão, a qualidade e a organização. Prefere analisar todas as opções antes de tomar decisões e busca perfeição em tudo que faz.",
    strengths: "Precisão, qualidade, pensamento crítico, resolução de problemas complexos",
    challenges: "Pode ser perfeccionista, crítico demais ou resistente a mudanças",
    color: "bg-blue-600"
  },
  golfinho: {
    name: "Golfinho",
    primaryTraits: ["expressivo", "amigável"],
    description: "Você é sociável, entusiasta e comunicativo. Valoriza relacionamentos e interações sociais. Gosta de trabalhar em equipe, é criativo e motiva os outros com seu otimismo.",
    strengths: "Comunicação, entusiasmo, criatividade, habilidades sociais",
    challenges: "Pode ser desorganizado, impulsivo ou falar demais",
    color: "bg-yellow-500"
  },
  coruja: {
    name: "Coruja",
    primaryTraits: ["estável", "cauteloso"],
    description: "Você é paciente, confiável e equilibrado. Valoriza a harmonia, a estabilidade e a cooperação. É um bom ouvinte, leal e prefere ambientes previsíveis e seguros.",
    strengths: "Paciência, diplomacia, consistência, trabalho em equipe",
    challenges: "Pode ser resistente a mudanças, indeciso ou evitar conflitos necessários",
    color: "bg-green-600"
  }
};
