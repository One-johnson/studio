
'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getServices } from '@/lib/data';
import type { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const getFeatures = (features: string | string[]) => {
    if (Array.isArray(features)) {
      return features;
    }
    if (typeof features === 'string') {
      return features.split('\n');
    }
    return [];
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center items-center h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </PublicLayout>
    );
  }
  
  return (
    <PublicLayout>
      <div className="bg-card">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-3xl md:text-5xl font-headline mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We offer a range of photography packages to suit your needs. Each package is designed to provide you with beautiful, high-quality images that you'll treasure for a lifetime.
            </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
             <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader className="p-6">
                  <CardTitle className="font-headline text-3xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <div className="mb-4">
                    <span className="text-4xl font-bold font-headline">{service.price}</span>
                    {service.id === 'event-photography' && <span className="text-sm text-muted-foreground"></span>}
                  </div>
                  <ul className="space-y-3">
                    {getFeatures(service.features).map((feature, i) => (
                      feature && <li key={i} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6">
                  <Button asChild className="w-full font-headline py-6 text-lg">
                    <Link href="/contact">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
