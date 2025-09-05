
'use server';

import { z } from 'zod';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

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
      message: 'There was an error saving your message. Please try again.',
      success: false,
    }
  }
}


const photoUploadSchema = z.object({
  file: z.instanceof(File).refine(file => file.size > 0, 'File is required.'),
  title: z.string().min(1, 'Title is required.'),
  category: z.string().min(1, 'Category is required.'),
  width: z.coerce.number(),
  height: z.coerce.number(),
});

type UploadPhotoState = {
  message: string;
  success: boolean;
  photo: { id: string; url: string } | null;
};

export async function uploadPhoto(
  prevState: UploadPhotoState,
  formData: FormData,
): Promise<UploadPhotoState> {
  const validatedFields = photoUploadSchema.safeParse({
    file: formData.get('file'),
    title: formData.get('title'),
    category: formData.get('category'),
    width: formData.get('width'),
    height: formData.get('height'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.file?.[0] || 'Validation failed.',
      success: false,
      photo: null,
    };
  }

  const { file, title, category, width, height } = validatedFields.data;

  try {
    // 1. Upload to Storage
    const storageRef = ref(storage, `photos/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Save to Firestore 'photos' collection
    const photoDocRef = await addDoc(collection(db, 'photos'), {
      title,
      url: downloadURL,
      width,
      height,
      createdAt: new Date(),
    });

    // 3. Update gallery 'photoIds'
    const galleryRef = doc(db, 'galleries', category);
    await updateDoc(galleryRef, {
      photoIds: arrayUnion(photoDocRef.id)
    });
    
    // 4. Revalidate paths to show new photo
    revalidatePath('/admin/photos');
    revalidatePath('/portfolio');
    revalidatePath('/');
    
    return {
      message: 'Photo has been uploaded and saved.',
      success: true,
      photo: { id: photoDocRef.id, url: downloadURL },
    };
  } catch (error) {
    console.error("Upload failed:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      message: `Upload failed: ${errorMessage}`,
      success: false,
      photo: null,
    };
  }
}
