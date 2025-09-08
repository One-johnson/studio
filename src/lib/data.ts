
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, limit, orderBy, where, Timestamp } from 'firebase/firestore';
import type { Photo, Gallery, Service, AboutContent, HomepageContent, Testimonial, Package } from '@/lib/types';

export async function getPhotos(): Promise<Photo[]> {
  const photosCollection = collection(db, 'photos');
  const photoSnapshot = await getDocs(photosCollection);
  return photoSnapshot.docs.map(doc => {
      const { createdAt, ...data } = doc.data();
      return { id: doc.id, ...data } as Photo
  });
}

export async function getRecentPhotos(count: number): Promise<Photo[]> {
  const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), limit(count));
  const photoSnapshot = await getDocs(q);
  // Omit createdAt to avoid serialization issues between server and client components
  return photoSnapshot.docs.map(doc => {
      const { createdAt, ...data } = doc.data();
      return { id: doc.id, ...data } as Photo;
  });
}

export async function getGalleries(): Promise<Gallery[]> {
    const galleriesCollection = collection(db, 'galleries');
    const gallerySnapshot = await getDocs(galleriesCollection);
    const photos = await getPhotos();

    return gallerySnapshot.docs.map(doc => {
        const galleryData = doc.data();
        const photoIds = galleryData.photoIds || [];
        return {
            id: doc.id,
            title: galleryData.title,
            category: galleryData.category,
            photoIds: photoIds,
            photos: photos.filter(p => photoIds.includes(p.id))
        } as Gallery
    });
}


export async function getFeaturedGalleries(): Promise<Gallery[]> {
    const q = query(collection(db, 'galleries'), limit(3));
    const querySnapshot = await getDocs(q);
    const photos = await getPhotos();

    return querySnapshot.docs.map(doc => {
        const galleryData = doc.data();
        const photoIds = galleryData.photoIds || [];
        return {
            id: doc.id,
            title: galleryData.title,
            category: galleryData.category,
            photoIds: photoIds,
            photos: photos.filter(p => photoIds.includes(p.id))
        } as Gallery;
    });
}


export async function getAboutContent(): Promise<AboutContent> {
  const docRef = doc(db, 'content', 'about');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AboutContent;
  } else {
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
      teamMembers: [
        { name: "Jane Smith", role: "Lead Assistant & Second Shooter", imageUrl: "https://picsum.photos/400/400" },
        { name: "Mike Johnson", role: "Studio Manager & Editor", imageUrl: "https://picsum.photos/400/400" },
        { name: "Emily White", role: "Client Relations & Booking", imageUrl: "https://picsum.photos/400/400" },
      ]
    };
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const docRef = doc(db, 'content', 'homepage');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as HomepageContent;
  } else {
    return {
      heroTagline: "Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens.",
    };
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const servicesCollection = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCollection);
    
    if (servicesSnapshot.empty) {
      // If there are no services in the database, return default/mock data.
      return [
        { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.', features: "Feature 1\nFeature 2" },
        { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.', features: "Feature 1\nFeature 2"},
        { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events, parties, and other special occasions.', features: "Feature 1\nFeature 2" },
      ];
    }
    
    return servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)).sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error("Error fetching services: ", error);
    // Fallback to default data in case of an error
    return [
        { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice.', features: "Feature 1\nFeature 2" },
        { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day.', features: "Feature 1\nFeature 2"},
        { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events.', features: "Feature 1\nFeature 2" },
    ];
  }
}

export async function getPackages(): Promise<Package[]> {
  try {
    const packagesCollection = collection(db, 'packages');
    const packagesSnapshot = await getDocs(packagesCollection);
    
    if (packagesSnapshot.empty) {
      return [
        { id: 'regular', title: 'Regular', price: 'GHC500.00', description: '', features: 'Photoshoot session (up to 30mins)\nUse of ONE Outfit only\n20 plus standard digital images\n5 retouched images ONLY' },
        { id: 'bronze', title: 'Bronze', price: 'GHC 700.00', description: '', features: 'Photoshoot session (up to 1hr)\nUse of ONE-TWO Outfit\n40 plus standard digital images\n8 retouched images ONLY' },
        { id: 'silver', title: 'Silver', price: 'GHC 900.00', description: '', features: 'Photoshoot session (up to 1.3hrs)\nUse of TWO-THREE Outfits\n50 plus standard digital images\n10 retouched images ONLY' },
        { id: 'gold', title: 'Gold', price: 'GHC 1200.00', description: '', features: 'Photoshoot session (up to 2hrs)\nUse of TWO-FOUR Outhits\n100 plus standard digital images\n15 retouched images ONLY' },
        { id: 'diamond', title: 'Diamond', price: 'GHC 1700.00', description: '', features: 'Photoshoot session (up to 3hrs)\nUse of TWO-FOUR Outhits\n200 plus standard digital images\n20 retouched images ONLY' },
      ];
    }
    
    return packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package)).sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error("Error fetching packages: ", error);
    return [
        { id: 'regular', title: 'Regular', price: 'GHC500.00', description: '', features: 'Photoshoot session (up to 30mins)\nUse of ONE Outfit only\n20 plus standard digital images\n5 retouched images ONLY' },
        { id: 'bronze', title: 'Bronze', price: 'GHC 700.00', description: '', features: 'Photoshoot session (up to 1hr)\nUse of ONE-TWO Outfit\n40 plus standard digital images\n8 retouched images ONLY' },
        { id: 'silver', title: 'Silver', price: 'GHC 900.00', description: '', features: 'Photoshoot session (up to 1.3hrs)\nUse of TWO-THREE Outfits\n50 plus standard digital images\n10 retouched images ONLY' },
        { id: 'gold', title: 'Gold', price: 'GHC 1200.00', description: '', features: 'Photoshoot session (up to 2hrs)\nUse of TWO-FOUR Outhits\n100 plus standard digital images\n15 retouched images ONLY' },
        { id: 'diamond', title: 'Diamond', price: 'GHC 1700.00', description: '', features: 'Photoshoot session (up to 3hrs)\nUse of TWO-FOUR Outhits\n200 plus standard digital images\n20 retouched images ONLY' },
    ];
  }
}


export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonialsCollection = collection(db, 'testimonials');
  const snapshot = await getDocs(testimonialsCollection);
  if (snapshot.empty) {
    return [
      { id: '1', name: 'Emily & John', project: 'Wedding Photography', quote: "Choosing this photographer was the best decision we made for our wedding. The photos are absolutely breathtaking and capture the joy of our day perfectly. We couldn't be happier!" },
      { id: '2', name: 'The Davis Family', project: 'Family Portraits', quote: "An amazing experience from start to finish! They made our family feel so comfortable, and the resulting photos are cherished treasures. Highly recommend!" },
      { id: '3', name: 'Sarah L.', project: 'Headshot Session', quote: "Incredibly professional and talented. I needed new headshots for my business, and the results exceeded all my expectations. The quality and style are top-notch." },
    ];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}
