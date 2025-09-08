
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { Loader2, Wand2, Plus, Trash2 } from 'lucide-react';
import { generateServiceDescription } from '@/ai/flows/generate-service-description-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

type PackagesFormData = {
  services: Service[];
};

export default function AdminPackagesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const packagesForm = useForm<PackagesFormData>({
    defaultValues: {
      services: [],
    },
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: packagesForm.control,
    name: "services",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        let servicesData: Service[] = [];
        if (servicesSnapshot.empty) {
            servicesData = [
                { id: 'portrait-session', title: 'Portrait Session', price: '$450', description: 'A 90-minute session at a location of your choice. Perfect for individuals, couples, or families.', features: [] },
                { id: 'wedding-package', title: 'The Essential Wedding', price: '$3,200', description: 'Comprehensive coverage for your special day, from getting ready to the grand exit.', features: []},
                { id: 'event-photography', title: 'Event Photography', price: 'Starting at $750', description: 'Professional photography for corporate events, parties, and other special occasions.', features: [] },
            ];
            // Optionally, save these defaults to firestore
            for (const service of servicesData) {
                await setDoc(doc(db, 'services', service.id), service);
            }
        } else {
            servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        }
        packagesForm.reset({ services: servicesData });

      } catch (error) {
        console.error("Error fetching services:", error);
        toast({ title: "Error", description: "Failed to load services.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast, packagesForm]);
  
  const handleServiceSubmit = async (serviceIndex: number) => {
    const serviceData = packagesForm.getValues().services[serviceIndex];
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

  const handleAddNewService = () => {
    const newId = `new-service-${Date.now()}`;
    appendService({
      id: newId,
      title: 'New Service Package',
      price: '$0',
      description: 'A great new service.',
      features: ['Feature 1', 'Feature 2'],
    });
  }

  const handleRemoveService = async (index: number) => {
    // This currently only removes from the form state. 
    // To delete from Firestore, you'd need an ID and a separate delete handler.
    removeService(index);
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
          <CardTitle>Package Management</CardTitle>
          <CardDescription>Edit the service packages offered on your website.</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={packagesForm.handleSubmit(() => {})}>
                <div className="space-y-8">
                  {serviceFields.map((service, index) => (
                    <Card key={service.id}>
                      <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>
                            {packagesForm.watch(`services.${index}.title`)}
                            </CardTitle>
                            <CardDescription>ID: {service.id}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveService(index)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                           <div className="space-y-2">
                            <Label htmlFor={`service-id-${index}`}>ID (Cannot be changed after creation)</Label>
                            <Input
                              id={`service-id-${index}`}
                              {...packagesForm.register(`services.${index}.id`)}
                              disabled // Prevent editing existing IDs
                            />
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor={`service-title-${index}`}>Title</Label>
                            <Input
                              id={`service-title-${index}`}
                              {...packagesForm.register(`services.${index}.title`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`service-price-${index}`}>Price</Label>
                            <Input
                              id={`service-price-${index}`}
                              {...packagesForm.register(`services.${index}.price`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`service-desc-${index}`}>Description</Label>
                            <Textarea
                              id={`service-desc-${index}`}
                              {...packagesForm.register(`services.${index}.description`)}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                              <Label>Features</Label>
                              {packagesForm.watch(`services.${index}.features`, []).map((_, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2">
                                  <Input
                                    {...packagesForm.register(`services.${index}.features.${featureIndex}`)}
                                  />
                                  <Button variant="ghost" size="icon" onClick={() => {
                                      const currentFeatures = packagesForm.getValues(`services.${index}.features`);
                                      currentFeatures.splice(featureIndex, 1);
                                      packagesForm.setValue(`services.${index}.features`, currentFeatures);
                                  }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button type="button" variant="outline" size="sm" onClick={() => {
                                const currentFeatures = packagesForm.getValues(`services.${index}.features`);
                                packagesForm.setValue(`services.${index}.features`, [...currentFeatures, '']);
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
                                serviceTitle={packagesForm.watch(`services.${index}.title`)} 
                                onGenerate={(data) => {
                                  packagesForm.setValue(`services.${index}.description`, data.description);
                                  packagesForm.setValue(`services.${index}.features`, data.features);
                                }}
                              />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddNewService}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Package
                  </Button>
                </div>
              </form>
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
