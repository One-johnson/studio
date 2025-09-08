
import { Timestamp } from 'firebase/firestore';

export type Photo = {
  id: string;
  url: string;
  title: string;
  width: number;
  height: number;
};

export type Gallery = {
  id: string;
  title: string;
  category: string;
  photoIds: string[];
  photos?: Photo[];
};

export type TeamMember = {
  name: string;
  role: string;
  imageUrl: string;
}

export type AboutContent = {
  name: string;
  bio: string;
  mission: string;
  awards: string[];
  imageUrl: string;
  teamMembers: TeamMember[];
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

export type Package = {
    id: string;
    title: string;
    price: string;
    description: string;
    features: string[];
}

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
}

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  project: string; // e.g., "Wedding Photography"
}
