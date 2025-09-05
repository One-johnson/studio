import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Photo, Gallery, Service, AboutContent } from '@/lib/types';

// In a real app, you would fetch this from a database.
// For now, we use static data.

export async function getPhotos(): Promise<Photo[]> {
  const photosCollection = collection(db, 'photos');
  const photoSnapshot = await getDocs(photosCollection);
  return photoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
}

export async function getGalleries(): Promise<Gallery[]> {
    const galleriesCollection = collection(db, 'galleries');
    const gallerySnapshot = await getDocs(galleriesCollection);
    const photos = await getPhotos();

    return gallerySnapshot.docs.map(doc => {
        const galleryData = doc.data();
        return {
            id: doc.id,
            title: galleryData.title,
            category: galleryData.category,
            photos: photos.filter(p => galleryData.photoIds.includes(p.id))
        } as Gallery
    });
}


export async function getFeaturedGalleries() {
    return [
      { id: 'weddings', title: 'Weddings', category: 'Weddings', image: 'https://picsum.photos/600/400?random=1', description: 'Timeless memories of your special day.' },
      { id: 'portraits', title: 'Portraits', category: 'Portraits', image: 'https://picsum.photos/600/400?random=2', description: 'Capturing the essence of individuals.' },
      { id: 'nature', title: 'Nature', category: 'Nature', image: 'https://picsum.photos/600/400?random=3', description: 'The beauty of the great outdoors.' },
    ];
}


export async function getAboutContent(): Promise<AboutContent> {
  const docRef = doc(db, 'content', 'about');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AboutContent;
  } else {
    // Return a default object if the document doesn't exist
    return {
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
  }
}

export async function getServices(): Promise<Service[]> {
  const servicesCollection = collection(db, 'services');
  const servicesSnapshot = await getDocs(servicesCollection);
  return servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)).sort((a, b) => a.id.localeCompare(b.id)); // Assuming IDs are portrait-session, wedding-package, etc.
}
