
type ProactivityOption = {
  id: string;
  text: string;
  value: number;
};

export type ProactivityQuestion = {
  id: string;
  question: string;
  options: ProactivityOption[];
};

export const questions: ProactivityQuestion[] = [
  {
    id: 'q1',
    question: 'Numa situação de estresse, mantenho a calma para resolver o problema.',
    options: [
      { id: 'sempre', text: 'Sempre', value: 3 },
      { id: 'frequentemente', text: 'Frequentemente', value: 2 },
      { id: 'algumas_vezes', text: 'Algumas vezes', value: 1 },
      { id: 'muito_raramente', text: 'Muito raramente', value: 0 }
    ]
  },
  // ... all other questions from the original array
];
