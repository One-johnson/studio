import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export type Theme = {
  headlineFont: string;
  bodyFont: string;
};

export async function getTheme(): Promise<Theme> {
  const docRef = doc(db, 'theme', 'config');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Theme;
  } else {
    // Return default theme if not found in Firestore
    return {
      headlineFont: 'Belleza',
      bodyFont: 'Alegreya',
    };
  }
}
