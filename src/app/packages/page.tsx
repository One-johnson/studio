
'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPackages } from '@/lib/data';
import type { Package } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const extras = [
    { title: 'Additional Individual to the package (one outfit only)', price: 'GHC 300.00' },
    { title: 'Additional OUTFIT change - comes with 2 extra pro edited images', price: 'GHC 250.00' },
    { title: 'Additional (Pro edited digital images) Single image', price: 'GHC 50.00' },
    { title: 'Home/Location Service', price: 'GHC 500+' },
    { title: '1 Day delivery', price: 'GHC 400' },
    { title: '2 Days delivery', price: 'GHC 250' },
    { title: '3 Days delivery', price: 'GHC 150' },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const packagesData = await getPackages();
        setPackages(packagesData);
      } catch (error) {
        console.error("Failed to fetch packages", error);
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
            Our Packages
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from one of our thoughtfully crafted packages, designed to provide comprehensive coverage and exceptional value for your most important moments.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{pkg.title}</CardTitle>
                  {pkg.description && <CardDescription>{pkg.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold font-headline">{pkg.price}</span>
                  </div>
                  <ul className="space-y-3">
                    {getFeatures(pkg.features).map((feature, i) => (
                      feature && <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-headline">
                    <Link href="/contact">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-24">
            <h2 className="text-3xl font-headline text-center mb-12">Extras & Add-ons</h2>
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <ul className="divide-y divide-border">
                        {extras.map((extra, index) => (
                            <li key={index} className="flex justify-between items-center py-4">
                                <span className="font-medium text-foreground/90">{extra.title}</span>
                                <span className="font-semibold font-headline text-lg text-primary">{extra.price}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </section>
      </div>
    </PublicLayout>
  );
}
