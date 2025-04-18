
export type ProactivityLevel = {
  min: number;
  level: string;
  description: string;
};

export const proactivityLevels: ProactivityLevel[] = [
  {
    min: 85,
    level: 'Altamente Proativo',
    description: 'Você demonstra níveis excepcionais de iniciativa e proatividade. Continua buscando oportunidades para melhorar e inovar, frequentemente liderando mudanças.'
  },
  {
    min: 70,
    level: 'Proativo',
    description: 'Você demonstra boa iniciativa na maioria das situações, identificando oportunidades e agindo sem necessidade de incentivo constante.'
  },
  {
    min: 50,
    level: 'Moderadamente Proativo',
    description: 'Você demonstra iniciativa em algumas áreas, mas pode esperar por orientação ou aprovação em outras situações antes de agir.'
  },
  {
    min: 30,
    level: 'Reativo',
    description: 'Você tende a responder a situações em vez de antecipá-las, geralmente esperando por direcionamento antes de tomar ações.'
  },
  {
    min: 0,
    level: 'Altamente Reativo',
    description: 'Você geralmente espera por instruções claras e direcionamento antes de agir, preferindo seguir estruturas estabelecidas.'
  }
];
