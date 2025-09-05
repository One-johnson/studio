
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import type { AboutContent, Service, HomepageContent } from '@/lib/types';
import { Loader2, Wand2, Plus, Trash2 } from 'lucide-react';
import { generateServiceDescription } from '@/ai/flows/generate-service-description-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

type ServicesFormData = {
  services: Service[];
};

export default function AdminContentPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const servicesForm = useForm<ServicesFormData>({
    defaultValues: {
      services: [],
    },
  });

  const { fields: serviceFields, append, remove, update } = useFieldArray({
    control: servicesForm.control,
    name: "services",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) {
          setAbout(aboutDoc.data() as AboutContent);
        } else {
          setAbout({
              name: "Alex Doe",
              bio: "Alex Doe is an award-winning photographer with a passion for capturing the beauty in everyday moments. With over a decade of experience, Alex specializes in wedding, portrait, and nature photography, bringing a unique artistic vision to every project. Alex believes that a great photograph is more than just an image; it's a story, a feeling, and a memory preserved in time. My goal is to create timeless art that my clients will cherish for a lifetime.",
              mission: "To create authentic, beautiful, and timeless photographs that tell your unique story. I strive to provide a comfortable and enjoyable experience, resulting in images that are both stunning and deeply personal.",
              awards: [
                "International Photographer of the Year, 2023",
                "Golden Lens Award, Weddings, 2022",
                "Nature's Best Photography, 2020",
              ],
              imageUrl: "https://picsum.photos/800/1000",
          });
        }

        const homepageDoc = await getDoc(doc(db, 'content', 'homepage'));
        if (homepageDoc.exists()) {
          setHomepageContent(homepageDoc.data() as HomepageContent);
        } else {
          setHomepageContent({ heroTagline: "Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens." });
        }
        
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        let servicesData: Service[] = [];
        if (servicesSnapshot.empty) {
            servicesData = [
                { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.', features: [] },
                { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.', features: []},
                { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events, parties, and other special occasions.', features: [] },
            ];
        } else {
            servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        }

        servicesForm.reset({ services: servicesData });

      } catch (error) {
        console.error("Error fetching content:", error);
        toast({ title: "Error", description: "Failed to load content.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast, servicesForm]);

  const handleAboutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'about'), about, { merge: true });
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
  
  const handleServiceSubmit = async (serviceIndex: number) => {
    const serviceData = servicesForm.getValues().services[serviceIndex];
    if (!serviceData) return;
    setSaving(true);
    try {
        await setDoc(doc(db, 'services', serviceData.id), serviceData, { merge: true });
        toast({ title: "Success", description: `${serviceData.title} saved.` });
    } catch(error) {
        toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const handleAboutChange = (field: keyof AboutContent, value: string) => {
    if (about) {
      setAbout({ ...about, [field]: value });
    }
  }
  
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
              <TabsTrigger value="services">Services</TabsTrigger>
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
              {about && (
                <form onSubmit={handleAboutSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="about-name">Name</Label>
                    <Input id="about-name" value={about.name} onChange={(e) => handleAboutChange('name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-bio">Biography</Label>
                    <Textarea id="about-bio" value={about.bio} onChange={(e) => handleAboutChange('bio', e.target.value)} rows={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-mission">Mission Statement</Label>
                    <Textarea id="about-mission" value={about.mission} onChange={(e) => handleAboutChange('mission', e.target.value)} rows={4} />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save About Page Content
                  </Button>
                </form>
              )}
            </TabsContent>
            <TabsContent value="services" className="mt-6">
              <form onSubmit={servicesForm.handleSubmit(() => {})}>
                <div className="space-y-8">
                  {serviceFields.map((service, index) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <CardTitle>
                          {servicesForm.watch(`services.${index}.title`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                           <div className="space-y-2">
                            <Label htmlFor={`service-title-${index}`}>Title</Label>
                            <Input
                              id={`service-title-${index}`}
                              {...servicesForm.register(`services.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`service-price-${index}`}>Price</Label>
                            <Input
                              id={`service-price-${index}`}
                              {...servicesForm.register(`services.${index}.price`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`service-desc-${index}`}>Description</Label>
                            <Textarea
                              id={`service-desc-${index}`}
                              {...servicesForm.register(`services.${index}.description`)}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                              <Label>Features</Label>
                              {servicesForm.watch(`services.${index}.features`, []).map((_, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2">
                                  <Input
                                    {...servicesForm.register(`services.${index}.features.${featureIndex}`)}
                                  />
                                  <Button variant="ghost" size="icon" onClick={() => {
                                      const currentFeatures = servicesForm.getValues(`services.${index}.features`);
                                      currentFeatures.splice(featureIndex, 1);
                                      servicesForm.setValue(`services.${index}.features`, currentFeatures);
                                  }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button variant="outline" size="sm" onClick={() => {
                                const currentFeatures = servicesForm.getValues(`services.${index}.features`);
                                servicesForm.setValue(`services.${index}.features`, [...currentFeatures, '']);
                              }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Feature
                              </Button>
                          </div>

                          <div className="flex gap-2">
                              <Button type="button" size="sm" disabled={saving} onClick={() => handleServiceSubmit(index)}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Service
                              </Button>
                              <GenerateDescriptionDialog 
                                serviceTitle={servicesForm.watch(`services.${index}.title`)} 
                                onGenerate={(data) => {
                                  servicesForm.setValue(`services.${index}.description`, data.description);
                                  servicesForm.setValue(`services.${index}.features`, data.features);
                                }}
                              />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
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
                    <DialogTitle>Generate Service Content</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p>
                        Generate a new description and feature list for the service: <strong>{serviceTitle}</strong>
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
