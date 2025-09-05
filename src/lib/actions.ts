'use server';

import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';

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

  // In a real application, you would save this to a database
  // or send an email. For this demo, we'll just simulate success.
  console.log('New contact form submission:');
  console.log(validatedFields.data);

  return {
    message: 'Thank you for your message! We will get back to you shortly.',
    success: true,
  };
}
