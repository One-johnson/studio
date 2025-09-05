'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { aboutContent as initialAbout, services as initialServices } from '@/lib/data';

export default function AdminContentPage() {
  const [about, setAbout] = useState(initialAbout);
  const [services, setServices] = useState(initialServices);

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
                  <Textarea id="hero-tagline" defaultValue="Capturing life's moments, one frame at a time. Explore stunning visual stories through my lens." rows={3} />
                </div>
                <Button type="submit">Save Homepage Content</Button>
              </form>
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="about-name">Name</Label>
                  <Input id="about-name" defaultValue={about.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-bio">Biography</Label>
                  <Textarea id="about-bio" defaultValue={about.bio} rows={6} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-mission">Mission Statement</Label>
                  <Textarea id="about-mission" defaultValue={about.mission} rows={4} />
                </div>
                <Button type="submit">Save About Page Content</Button>
              </form>
            </TabsContent>
            <TabsContent value="services" className="mt-6">
              <div className="space-y-8">
                {services.map((service, index) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`service-price-${index}`}>Price</Label>
                          <Input id={`service-price-${index}`} defaultValue={service.price} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`service-desc-${index}`}>Description</Label>
                          <Textarea id={`service-desc-${index}`} defaultValue={service.description} rows={3} />
                        </div>
                        <Button type="submit" size="sm">Save Service</Button>
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
