
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, getDocs, collection, addDoc, deleteDoc } from 'firebase/firestore';
import type { AboutContent, Service, HomepageContent, TeamMember, Testimonial } from '@/lib/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type AboutFormData = {
  about: AboutContent;
}

type TestimonialsFormData = {
  testimonials: Testimonial[];
};


export default function AdminContentPage() {
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const aboutForm = useForm<AboutFormData>({
    defaultValues: {
      about: {
        name: '', bio: '', mission: '', awards: [], imageUrl: '', teamMembers: []
      }
    }
  });

  const testimonialsForm = useForm<TestimonialsFormData>({
    defaultValues: {
      testimonials: [],
    },
  });
  
  const { fields: teamMemberFields, append: appendTeamMember, remove: removeTeamMember } = useFieldArray({
    control: aboutForm.control,
    name: "about.teamMembers",
  });
  
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial, update: updateTestimonial } = useFieldArray({
    control: testimonialsForm.control,
    name: "testimonials",
  });


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) {
          aboutForm.reset({ about: aboutDoc.data() as AboutContent });
        } else {
          aboutForm.reset({ about: {
              name: "Alex Doe",
              bio: "Alex Doe is an award-winning photographer with a passion for capturing the beauty in everyday moments. With over a decade of experience, Alex specializes in wedding, portrait, and nature photography, bringing a unique artistic vision to every project. Alex believes that a great photograph is more than just an image; it's a story, a feeling, and a memory preserved in time. My goal is to create timeless art that my clients will cherish for a lifetime.",
              mission: "To create authentic, beautiful, and timeless photographs that tell your unique story. I strive to provide a comfortable and enjoyable experience, resulting in images that are both stunning and deeply personal.",
              awards: [
                "International Photographer of the Year, 2023",
                "Golden Lens Award, Weddings, 2022",
                "Nature's Best Photography, 2020",
              ],
              imageUrl: "https://picsum.photos/800/1000",
              teamMembers: []
          }});
        }

        const homepageDoc = await getDoc(doc(db, 'content', 'homepage'));
        if (homepageDoc.exists()) {
          setHomepageContent(homepageDoc.data() as HomepageContent);
        } else {
          setHomepageContent({ heroTagline: "Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens." });
        }

        const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
        const testimonialsData = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        testimonialsForm.reset({ testimonials: testimonialsData });

      } catch (error) {
        console.error("Error fetching content:", error);
        toast({ title: "Error", description: "Failed to load content.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast, aboutForm, testimonialsForm]);

  const handleAboutSubmit = async (data: AboutFormData) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'about'), data.about, { merge: true });
      toast({ title: "Success", description: "About page content saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save content.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleHomepageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!homepageContent) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'homepage'), homepageContent, { merge: true });
      toast({ title: "Success", description: "Homepage content saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save homepage content.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestimonialSave = async (index: number) => {
    const testimonial = testimonialsForm.getValues().testimonials[index];
    setSaving(true);
    try {
      if (testimonial.id.startsWith('new-')) {
        const { id, ...newTestimonial } = testimonial;
        const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
        updateTestimonial(index, { ...newTestimonial, id: docRef.id });
      } else {
        await setDoc(doc(db, 'testimonials', testimonial.id), testimonial, { merge: true });
      }
      toast({ title: "Success", description: "Testimonial saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save testimonial.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestimonialDelete = async (index: number) => {
    const testimonialId = testimonialsForm.getValues().testimonials[index].id;
    if (testimonialId.startsWith('new-')) {
      removeTestimonial(index);
      return;
    }
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'testimonials', testimonialId));
      removeTestimonial(index);
      toast({ title: "Success", description: "Testimonial deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete testimonial.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleHomepageChange = (field: keyof HomepageContent, value: string) => {
    if (homepageContent) {
        setHomepageContent({ ...homepageContent, [field]: value });
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Edit the text content for your public-facing pages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>
            <TabsContent value="homepage" className="mt-6">
              {homepageContent && (
                <form onSubmit={handleHomepageSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="hero-tagline">Hero Tagline</Label>
                    <Textarea id="hero-tagline" value={homepageContent.heroTagline} onChange={(e) => handleHomepageChange('heroTagline', e.target.value)} rows={3} />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Homepage Content
                  </Button>
                </form>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <form onSubmit={aboutForm.handleSubmit(handleAboutSubmit)} className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="about-name">Name</Label>
                    <Input id="about-name" {...aboutForm.register('about.name')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-bio">Biography</Label>
                    <Textarea id="about-bio" {...aboutForm.register('about.bio')} rows={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-mission">Mission Statement</Label>
                    <Textarea id="about-mission" {...aboutForm.register('about.mission')} rows={4} />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {teamMemberFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input placeholder="Name" {...aboutForm.register(`about.teamMembers.${index}.name`)} />
                             <Input placeholder="Role" {...aboutForm.register(`about.teamMembers.${index}.role`)} />
                             <Input placeholder="Image URL" {...aboutForm.register(`about.teamMembers.${index}.imageUrl`)} className="md:col-span-2" />
                          </div>
                           <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={() => removeTeamMember(index)}>
                             <Trash2 className="mr-2 h-4 w-4" /> Remove
                           </Button>
                        </Card>
                      ))}
                       <Button type="button" variant="outline" size="sm" onClick={() => appendTeamMember({ name: '', role: '', imageUrl: '' })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Team Member
                      </Button>
                    </CardContent>
                  </Card>

                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save About Page Content
                  </Button>
              </form>
            </TabsContent>
            <TabsContent value="testimonials" className="mt-6">
                <div className="space-y-4">
                  {testimonialFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-2">
                         <Label htmlFor={`testimonial-name-${index}`}>Client Name</Label>
                         <Input id={`testimonial-name-${index}`} {...testimonialsForm.register(`testimonials.${index}.name`)} />
                         
                         <Label htmlFor={`testimonial-project-${index}`}>Project Type</Label>
                         <Input id={`testimonial-project-${index}`} {...testimonialsForm.register(`testimonials.${index}.project`)} placeholder="e.g. Wedding, Portraits" />
                         
                         <Label htmlFor={`testimonial-quote-${index}`}>Quote</Label>
                         <Textarea id={`testimonial-quote-${index}`} {...testimonialsForm.register(`testimonials.${index}.quote`)} rows={4} />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleTestimonialDelete(index)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                        <Button size="sm" onClick={() => handleTestimonialSave(index)}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendTestimonial({ id: `new-${Date.now()}`, name: '', quote: '', project: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                  </Button>
                </div>
              </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
