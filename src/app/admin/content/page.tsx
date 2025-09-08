
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
import type { AboutContent, Service, Package, HomepageContent, TeamMember, Testimonial } from '@/lib/types';
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import { generateServiceDescription } from '@/ai/flows/generate-service-description-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

type AboutFormData = {
  about: AboutContent;
};

type TestimonialsFormData = {
  testimonials: Testimonial[];
};

type ServicesFormData = {
  services: Service[];
};

type PackagesFormData = {
    packages: Package[];
}

export default function AdminContentPage() {
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const aboutForm = useForm<AboutFormData>({
    defaultValues: {
      about: { name: '', bio: '', mission: '', awards: [], imageUrl: '', teamMembers: [] }
    }
  });

  const testimonialsForm = useForm<TestimonialsFormData>({
    defaultValues: { testimonials: [] },
  });
  
  const servicesForm = useForm<ServicesFormData>({
    defaultValues: { services: [] },
  });

  const packagesForm = useForm<PackagesFormData>({
    defaultValues: { packages: [] },
  })

  const { fields: teamMemberFields, append: appendTeamMember, remove: removeTeamMember } = useFieldArray({
    control: aboutForm.control, name: "about.teamMembers",
  });
  
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial, update: updateTestimonial } = useFieldArray({
    control: testimonialsForm.control, name: "testimonials",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: servicesForm.control, name: "services",
  });

  const { fields: packageFields, append: appendPackage, remove: removePackage } = useFieldArray({
    control: packagesForm.control, name: "packages",
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

        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        servicesForm.reset({ services: servicesData });

        const packagesSnapshot = await getDocs(collection(db, 'packages'));
        const packagesData = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        packagesForm.reset({ packages: packagesData });


      } catch (error) {
        console.error("Error fetching content:", error);
        toast({ title: "Error", description: "Failed to load content.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast, aboutForm, testimonialsForm, servicesForm, packagesForm]);

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

  const handleServiceSave = async (index: number) => {
    const service = servicesForm.getValues().services[index];
    setSaving(true);
    try {
      await setDoc(doc(db, 'services', service.id), service, { merge: true });
      toast({ title: "Success", description: "Service saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePackageSave = async (index: number) => {
    const pkg = packagesForm.getValues().packages[index];
    setSaving(true);
    try {
      await setDoc(doc(db, 'packages', pkg.id), pkg, { merge: true });
      toast({ title: "Success", description: "Package saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save package.", variant: "destructive" });
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
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
            
             <TabsContent value="services" className="mt-6">
                <div className="space-y-4">
                    {serviceFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                            <ServicePackageForm type="service" form={servicesForm} index={index} onSave={handleServiceSave} saving={saving} />
                        </Card>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendService({ id: `new-service-${Date.now()}`, title: 'New Service', price: '', description: '', features: [] })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                </div>
            </TabsContent>

             <TabsContent value="packages" className="mt-6">
                <div className="space-y-4">
                    {packageFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                            <ServicePackageForm type="package" form={packagesForm} index={index} onSave={handlePackageSave} saving={saving} />
                        </Card>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendPackage({ id: `new-package-${Date.now()}`, title: 'New Package', price: '', description: '', features: [] })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Package
                    </Button>
                </div>
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

function ServicePackageForm({ type, form, index, onSave, saving }: { type: 'service' | 'package', form: any, index: number, onSave: (index: number) => void, saving: boolean }) {
    const name = type === 'service' ? 'services' : 'packages';
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>ID (Cannot be changed)</Label>
                <Input {...form.register(`${name}.${index}.id`)} disabled />
            </div>
            <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register(`${name}.${index}.title`)} />
            </div>
            <div className="space-y-2">
                <Label>Price</Label>
                <Input {...form.register(`${name}.${index}.price`)} />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register(`${name}.${index}.description`)} rows={3}/>
            </div>
            <div className="space-y-2">
                <Label>Features</Label>
                {form.watch(`${name}.${index}.features`, []).map((_: any, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                        <Input {...form.register(`${name}.${index}.features.${featureIndex}`)} />
                        <Button variant="ghost" size="icon" onClick={() => {
                            const currentFeatures = form.getValues(`${name}.${index}.features`);
                            currentFeatures.splice(featureIndex, 1);
                            form.setValue(`${name}.${index}.features`, currentFeatures);
                        }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => {
                    const currentFeatures = form.getValues(`${name}.${index}.features`);
                    form.setValue(`${name}.${index}.features`, [...currentFeatures, '']);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
            </div>
            <div className="flex gap-2">
                 <Button type="button" size="sm" disabled={saving} onClick={() => onSave(index)}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save {type === 'service' ? 'Service' : 'Package'}
                </Button>
                <GenerateDescriptionDialog
                    serviceTitle={form.watch(`${name}.${index}.title`)}
                    onGenerate={(data) => {
                        form.setValue(`${name}.${index}.description`, data.description);
                        form.setValue(`${name}.${index}.features`, data.features);
                    }}
                />
            </div>
        </div>
    );
}


function GenerateDescriptionDialog({ serviceTitle, onGenerate }: { serviceTitle: string, onGenerate: (data: { description: string, features: string[] }) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [keywords, setKeywords] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateServiceDescription({ title: serviceTitle, keywords });
            onGenerate(result);
            toast({ title: "Success", description: "AI-generated content has been added to the form." });
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to generate description:", error);
            toast({ title: "Error", description: "Could not generate content.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" size="sm" variant="outline">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate with AI
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Content</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p>
                        Generate a new description and feature list for: <strong>{serviceTitle}</strong>
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords (optional)</Label>
                        <Input 
                            id="keywords" 
                            placeholder="e.g., candid, natural light, outdoor"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
