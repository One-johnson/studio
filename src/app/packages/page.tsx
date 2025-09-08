
import PublicLayout from '@/components/layout/PublicLayout';
import { getPackages } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-headline mb-4">
            Our Packages
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from one of our thoughtfully crafted packages, designed to provide comprehensive coverage and exceptional value for your most important moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {packages.map((pkg, index) => (
            <Card key={pkg.id} className="flex flex-col fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{pkg.title}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold font-headline">{pkg.price}</span>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
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
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
