
export type Photo = {
  id: string;
  url: string;
  title: string;
  width: number;
  height: number;
  createdAt?: any;
};

export type Gallery = {
  id: string;
  title: string;
  category: string;
  photoIds: string[];
  photos?: Photo[];
};

export type AboutContent = {
  name: string;
  bio: string;
  mission: string;
  awards: string[];
  imageUrl: string;
};

export type HomepageContent = {
  heroTagline: string;
};

export type Service = {
    id: string;
    title: string;
    price: string;
    description: string;
    features: string[];
}
