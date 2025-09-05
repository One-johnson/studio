
'use server';

import { z } from 'zod';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
