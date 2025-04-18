type AnimalProfileOption = {
  id: string;
  text: string;
  traits: {
    [key: string]: number;
  };
};

export type AnimalProfileQuestion = {
  id: string;
  question: string;
  options: AnimalProfileOption[];
};

export const questions: AnimalProfileQuestion[] = [
  {
    id: 'q1',
    question: "Como você descreveria seu comportamento em situações novas?",
    options: [
      { id: 'a', text: 'Cauteloso e observador antes de agir', traits: { analítico: 3, cauteloso: 2 } },
      { id: 'b', text: 'Entusiasmado e pronto para explorar', traits: { dinâmico: 3, expressivo: 2 } },
      { id: 'c', text: 'Adaptável, dependendo da situação', traits: { amigável: 2, estável: 2 } },
      { id: 'd', text: 'Prefiro situações familiares e previsíveis', traits: { cauteloso: 3, preciso: 2 } }
    ]
  },
  {
    id: 'q2',
    question: "Como você reage a mudanças inesperadas?",
    options: [
      { id: 'a', text: 'Fico ansioso e preciso de tempo para me adaptar', traits: { cauteloso: 3, analítico: 2 } },
      { id: 'b', text: 'Vejo como uma oportunidade e me adapto rapidamente', traits: { dinâmico: 3, expressivo: 2 } },
      { id: 'c', text: 'Avalio a situação antes de decidir como reagir', traits: { estável: 3, amigável: 1 } },
      { id: 'd', text: 'Prefiro manter minha rotina e evitar mudanças', traits: { preciso: 3, cauteloso: 2 } }
    ]
  },
  {
    id: 'q3',
    question: "Como você prefere trabalhar?",
    options: [
      { id: 'a', text: 'Independentemente, no meu próprio ritmo', traits: { analítico: 3, preciso: 2 } },
      { id: 'b', text: 'Em equipe, com muita interação', traits: { expressivo: 3, dinâmico: 2 } },
      { id: 'c', text: 'Alternando entre trabalho individual e em equipe', traits: { amigável: 3, estável: 2 } },
      { id: 'd', text: 'Em um ambiente estruturado com diretrizes claras', traits: { cauteloso: 3, preciso: 2 } }
    ]
  },
  {
    id: 'q4',
    question: "Como você lida com o estresse?",
    options: [
      { id: 'a', text: 'Preciso de tempo sozinho para processar', traits: { analítico: 3, cauteloso: 2 } },
      { id: 'b', text: 'Busco apoio e converso com outras pessoas', traits: { expressivo: 3, amigável: 2 } },
      { id: 'c', text: 'Mantenho-me ativo e procuro soluções práticas', traits: { dinâmico: 3, estável: 1 } },
      { id: 'd', text: 'Sigo rotinas e procedimentos estabelecidos', traits: { preciso: 3, cauteloso: 2 } }
    ]
  },
  {
    id: 'q5',
    question: "Como você se comporta em grupos sociais?",
    options: [
      { id: 'a', text: 'Observo mais do que participo inicialmente', traits: { analítico: 3, cauteloso: 2 } },
      { id: 'b', text: 'Sou extrovertido e gosto de ser o centro das atenções', traits: { expressivo: 3, dinâmico: 2 } },
      { id: 'c', text: 'Adapto meu comportamento ao grupo', traits: { amigável: 3, estável: 2 } },
      { id: 'd', text: 'Prefiro interações em pequenos grupos ou individuais', traits: { cauteloso: 2, preciso: 2 } }
    ]
  },
  {
    id: 'q6',
    question: "Como você toma decisões importantes?",
    options: [
      { id: 'a', text: 'Analiso cuidadosamente todas as opções antes de decidir', traits: { analítico: 3, preciso: 2 } },
      { id: 'b', text: 'Confio na minha intuição e decido rapidamente', traits: { dinâmico: 3, expressivo: 1 } },
      { id: 'c', text: 'Considero o impacto nas pessoas envolvidas', traits: { amigável: 3, estável: 2 } },
      { id: 'd', text: 'Sigo procedimentos estabelecidos ou busco conselhos', traits: { cauteloso: 3, preciso: 2 } }
    ]
  },
  {
    id: 'q7',
    question: "Como você reage quando está empolgado?",
    options: [
      { id: 'a', text: 'Mantenho a calma externamente, mas sinto internamente', traits: { analítico: 3, cauteloso: 2 } },
      { id: 'b', text: 'Expresso abertamente meu entusiasmo', traits: { expressivo: 3, dinâmico: 2 } },
      { id: 'c', text: 'Compartilho com pessoas próximas', traits: { amigável: 3, estável: 1 } },
      { id: 'd', text: 'Prefiro celebrar de maneira mais contida', traits: { preciso: 2, cauteloso: 2 } }
    ]
  },
  {
    id: 'q8',
    question: "Como você lida com ambientes novos?",
    options: [
      { id: 'a', text: 'Exploro cautelosamente, observando detalhes', traits: { analítico: 3, preciso: 2 } },
      { id: 'b', text: 'Mergulho de cabeça, explorando tudo rapidamente', traits: { dinâmico: 3, expressivo: 2 } },
      { id: 'c', text: 'Adapto-me facilmente a mudanças', traits: { estável: 3, amigável: 2 } },
      { id: 'd', text: 'Prefiro a presença de objetos ou pessoas familiares', traits: { cauteloso: 3, preciso: 1 } }
    ]
  },
  {
    id: 'q9',
    question: "Qual seria sua rotina diária ideal?",
    options: [
      { id: 'a', text: 'Estruturada com atividades consistentes', traits: { preciso: 3, analítico: 2 } },
      { id: 'b', text: 'Flexível com bastante tempo livre', traits: { expressivo: 2, dinâmico: 3 } },
      { id: 'c', text: 'Manhãs e noites ativas com descanso no meio do dia', traits: { estável: 2, amigável: 2 } },
      { id: 'd', text: 'Não preciso de uma rotina específica', traits: { dinâmico: 2, expressivo: 2 } }
    ]
  },
  {
    id: 'q10',
    question: "Que tipo de atividade você mais gosta?",
    options: [
      { id: 'a', text: 'Jogos interativos e quebra-cabeças', traits: { analítico: 3, preciso: 2 } },
      { id: 'b', text: 'Atividades físicas e ao ar livre', traits: { dinâmico: 3, expressivo: 1 } },
      { id: 'c', text: 'Interação social com outras pessoas', traits: { amigável: 3, expressivo: 2 } },
      { id: 'd', text: 'Momentos tranquilos com companhias próximas', traits: { estável: 3, cauteloso: 1 } }
    ]
  }
];
