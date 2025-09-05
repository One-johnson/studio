import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export type Theme = {
  headlineFont: string;
  bodyFont: string;
};

export async function getTheme(): Promise<Theme> {
  try {
    const docRef = doc(db, 'theme', 'config');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        headlineFont: data.headlineFont || 'Belleza',
        bodyFont: data.bodyFont || 'Alegreya',
      };
    }
  } catch (error) {
    console.error("Error fetching theme from Firestore, returning default:", error);
  }
  
  // Return default theme if not found in Firestore or on error
  return {
    headlineFont: 'Belleza',
    bodyFont: 'Alegreya',
  };
}
