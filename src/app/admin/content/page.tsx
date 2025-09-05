'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AboutContent, Service, HomepageContent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function AdminContentPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if(aboutDoc.exists()) setAbout(aboutDoc.data() as AboutContent);

        const homepageDoc = await getDoc(doc(db, 'content', 'homepage'));
        if (homepageDoc.exists()) {
          setHomepageContent(homepageDoc.data() as HomepageContent);
        } else {
           setHomepageContent({ heroTagline: "Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens." });
        }
        
        // For services, we would fetch from a 'services' collection in a real app.
        // For now, it's managed here and saved individually.
        const servicesData: Service[] = [
          { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.', features: [] },
          { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.', features: []},
          { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events, parties, and other special occasions.', features: [] },
        ];
        setServices(servicesData);

      } catch (error) {
        console.error("Error fetching content:", error);
        toast({ title: "Error", description: "Failed to load content.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

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
  
  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>, serviceId: string) => {
    e.preventDefault();
    const serviceData = services.find(s => s.id === serviceId);
    if (!serviceData) return;
    setSaving(true);
    try {
        await setDoc(doc(db, 'services', serviceId), serviceData, { merge: true });
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

  const handleServiceChange = (id: string, field: keyof Service, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
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
              <div className="space-y-8">
                {services.map((service, index) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => handleServiceSubmit(e, service.id)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`service-price-${index}`}>Price</Label>
                          <Input id={`service-price-${index}`} value={service.price} onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`service-desc-${index}`}>Description</Label>
                          <Textarea id={`service-desc-${index}`} value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} rows={3} />
                        </div>
                        <Button type="submit" size="sm" disabled={saving}>
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Service
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
