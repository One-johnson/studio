
'use server';

import { z } from 'zod';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { promises as fs } from 'fs';
import path from 'path';
import convert from 'color-convert';

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      message: firstError || "Validation failed.",
      success: false,
    };
  }

  try {
    // Save the new contact message to Firestore
    await addDoc(collection(db, 'contact-messages'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
      archived: false,
    });

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      success: true,
    };
  } catch (error) {
    console.error("Error saving message to Firestore:", error);
    return {
      message: 'There was an an error saving your message. Please try again.',
      success: false,
    }
  }
}

const themeSchema = z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    accentColor: z.string(),
    headlineFont: z.string(),
    bodyFont: z.string(),
});

export async function applyTheme(theme: z.infer<typeof themeSchema>) {
    const validatedTheme = themeSchema.safeParse(theme);
    if (!validatedTheme.success) {
        throw new Error('Invalid theme data provided.');
    }
    
    const { primaryColor, backgroundColor, accentColor, headlineFont, bodyFont } = validatedTheme.data;
    
    try {
        // --- 1. Update globals.css ---
        const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
        const originalCss = await fs.readFile(cssPath, 'utf-8');

        const primaryHsl = convert.hex.hsl(primaryColor);
        const backgroundHsl = convert.hex.hsl(backgroundColor);
        const accentHsl = convert.hex.hsl(accentColor);
        
        let updatedCss = originalCss
            .replace(/--primary:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g, `--primary: ${primaryHsl[0]} ${primaryHsl[1]}% ${primaryHsl[2]}%;`)
            .replace(/--background:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g, `--background: ${backgroundHsl[0]} ${backgroundHsl[1]}% ${backgroundHsl[2]}%;`)
            .replace(/--accent:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g, `--accent: ${accentHsl[0]} ${accentHsl[1]}% ${accentHsl[2]}%;`)
            .replace(/--ring:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g, `--ring: ${primaryHsl[0]} ${primaryHsl[1]}% ${primaryHsl[2]}%;`);

        await fs.writeFile(cssPath, updatedCss, 'utf-8');

        // --- 2. Update Firestore theme document ---
        const themeDocRef = doc(db, 'theme', 'config');
        await setDoc(themeDocRef, {
            headlineFont,
            bodyFont,
        }, { merge: true });

        return { success: true, message: 'Theme applied successfully.' };

    } catch(error) {
        console.error("Error applying theme:", error);
        throw new Error('Failed to apply theme files.');
    }
}
