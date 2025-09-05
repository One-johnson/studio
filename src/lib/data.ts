export type Photo = {
  id: number;
  url: string;
  title: string;
  width: number;
  height: number;
};

export type Gallery = {
  id: string;
  title: string;
  category: string;
  photos: Photo[];
};

export const photos: Photo[] = [
  { id: 1, url: 'https://picsum.photos/800/1200', title: 'Whispering Woods', width: 800, height: 1200 },
  { id: 2, url: 'https://picsum.photos/1200/800', title: 'City at Dusk', width: 1200, height: 800 },
  { id: 3, url: 'https://picsum.photos/800/1000', title: 'Joyful Union', width: 800, height: 1000 },
  { id: 4, url: 'https://picsum.photos/1000/800', title: 'Mountain Majesty', width: 1000, height: 800 },
  { id: 5, url: 'https://picsum.photos/800/1200', title: 'Candid Smile', width: 800, height: 1200 },
  { id: 6, url: 'https://picsum.photos/1200/800', title: 'Ocean\'s Breath', width: 1200, height: 800 },
  { id: 7, url: 'https://picsum.photos/800/1000', title: 'First Dance', width: 800, height: 1000 },
  { id: 8, url: 'https://picsum.photos/1000/800', title: 'Urban Explorer', width: 1000, height: 800 },
  { id: 9, url: 'https://picsum.photos/800/1200', title: 'Golden Hour Glow', width: 800, height: 1200 },
  { id: 10, url: 'https://picsum.photos/1200/800', title: 'Silent Forest', width: 1200, height: 800 },
  { id: 11, url: 'https://picsum.photos/800/1000', title: 'The Vows', width: 800, height: 1000 },
  { id: 12, url: 'https://picsum.photos/1000/800', title: 'Corporate Headshot', width: 1000, height: 800 },
];

export const galleries: Gallery[] = [
  {
    id: 'weddings',
    title: 'Wedding Moments',
    category: 'Weddings',
    photos: photos.filter((_, i) => [2, 6, 10].includes(i)),
  },
  {
    id: 'portraits',
    title: 'Expressive Portraits',
    category: 'Portraits',
    photos: photos.filter((_, i) => [4, 7, 11].includes(i)),
  },
  {
    id: 'nature',
    title: 'Nature\'s Wonders',
    category: 'Nature',
    photos: photos.filter((_, i) => [0, 3, 5, 9].includes(i)),
  },
  {
    id: 'urban',
    title: 'Urban Landscapes',
    category: 'Urban',
    photos: photos.filter((_, i) => [1, 7, 8].includes(i)),
  },
];

export const featuredGalleries = [
  { id: 1, title: 'Weddings', category: 'Weddings', image: 'https://picsum.photos/600/400?random=1', description: 'Timeless memories of your special day.' },
  { id: 2, title: 'Portraits', category: 'Portraits', image: 'https://picsum.photos/600/400?random=2', description: 'Capturing the essence of individuals.' },
  { id: 3, title: 'Nature', category: 'Nature', image: 'https://picsum.photos/600/400?random=3', description: 'The beauty of the great outdoors.' },
];

export const aboutContent = {
  name: "Alex Doe",
  bio: "Alex Doe is an award-winning photographer with a passion for capturing the beauty in everyday moments. With over a decade of experience, Alex specializes in wedding, portrait, and nature photography, bringing a unique artistic vision to every project. Alex believes that a great photograph is more than just an image; it's a story, a feeling, and a memory preserved in time. My goal is to create timeless art that my clients will cherish for a lifetime.",
  mission: "To create authentic, beautiful, and timeless photographs that tell your unique story. I strive to provide a comfortable and enjoyable experience, resulting in images that are both stunning and deeply personal.",
  awards: [
    "International Photographer of the Year, 2023",
    "Golden Lens Award, Weddings, 2022",
    "Nature's Best Photography, 2020",
  ],
  imageUrl: "https://picsum.photos/800/1000",
};

export const services = [
  {
    id: 'portrait-session',
    title: 'Portrait Session',
    price: '$450',
    description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.',
    features: [
      '90-minute photo shoot',
      '1-2 locations',
      '50 high-resolution edited images',
      'Online gallery for viewing and sharing',
    ],
  },
  {
    id: 'wedding-package',
    title: 'The Essential Wedding',
    price: '$3,200',
    description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.',
    features: [
      '8 hours of coverage',
      'Two photographers',
      '400+ high-resolution edited images',
      'Online gallery and print release',
      'Engagement session included',
    ],
  },
  {
    id: 'event-photography',
    title: 'Event Photography',
    price: 'Starting at $750',
    description: 'Professional photography for corporate events, parties, and other special occasions.',
    features: [
      'Minimum 2 hours of coverage',
      '75+ images per hour',
      'Fast turnaround time',
      'Custom quotes available',
    ],
  },
];
