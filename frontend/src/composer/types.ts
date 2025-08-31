export interface Fond { 
  id: number; 
  nom: string; 
  image?: string | null 
}

export interface Garniture { 
  id: number; 
  nom: string; 
  image?: string | null; 
  images?: (string | null | undefined)[] 
}

export interface Selection {
  fond: Fond | null
  g1: Garniture | null
  g2: Garniture | null
  g3: Garniture | null
}
