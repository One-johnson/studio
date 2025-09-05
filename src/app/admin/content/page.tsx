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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { AboutContent, Service } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function AdminContentPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [homepageHero, setHomepageHero] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if(aboutDoc.exists()) setAbout(aboutDoc.data() as AboutContent);

        // For services and homepage, you'd likely fetch from a 'services' collection
        // and a 'homepage' document in a real app.
        // For simplicity, we're mocking some of this.
        const servicesData: Service[] = [
          { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.', features: [] },
          { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.', features: []},
          { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events, parties, and other special occasions.', features: [] },
        ];
        setServices(servicesData);
        setHomepageHero("Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens.")
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
    try {
      await setDoc(doc(db, 'content', 'about'), about, { merge: true });
      toast({ title: "Success", description: "About page content saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save content.", variant: "destructive" });
    }
  };
  
  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>, serviceId: string) => {
    e.preventDefault();
    const serviceData = services.find(s => s.id === serviceId);
    if (!serviceData) return;
    try {
        // In a real app, you would save this to a 'services' collection
        console.log("Saving service:", serviceData);
        await setDoc(doc(db, 'services', serviceId), serviceData, { merge: true });
        toast({ title: "Success", description: `${serviceData.title} saved.` });
    } catch(error) {
        toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
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
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero-tagline">Hero Tagline</Label>
                  <Textarea id="hero-tagline" value={homepageHero} onChange={(e) => setHomepageHero(e.target.value)} rows={3} />
                </div>
                <Button type="submit" disabled>Save Homepage Content</Button>
                 <p className="text-sm text-muted-foreground">Homepage content saving is not yet implemented.</p>
              </form>
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
                  <Button type="submit">Save About Page Content</Button>
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
                        <Button type="submit" size="sm" disabled>Save Service</Button>
                      </form>
                    </CardContent>
                  </Card>
                ))}
                <p className="text-sm text-muted-foreground">Services content saving is not yet fully implemented.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
