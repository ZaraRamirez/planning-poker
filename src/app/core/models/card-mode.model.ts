export interface CardMode {
  id: string;
  label: string;
  values: (string | number)[];
}

export const CARD_MODES: CardMode[] = [
  {
    id: 'fibonacci',
    label: 'Fibonacci',
    values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕']
  },
  {
    id: 'fibonacci-modified',
    label: 'Fib. modificado',
    values: [0, '½', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕']
  },
  {
    id: 'tshirt',
    label: 'T-Shirt',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕']
  }
];