// src/views/composer/types.ts
export type Item = {
  id: string;
  nom: string;
  image?: string | null;
  images?: Array<string | null | undefined>;
};

export type FondSelection = Item & { variantIndex: number };

export type Selection = {
  fond: FondSelection | null;
  g1: Item | null;
  g2: Item | null;
  g3: Item | null;
};

export type Step = 1 | 2 | 3 | 4 | 5; // 1 fond, 2 g1, 3 g2, 4 g3, 5 résumé/panier
