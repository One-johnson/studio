import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getAboutContent } from '@/lib/data';
import { CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function AboutPage() {
  const aboutContent = await getAboutContent();
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-headline text-center mb-12">
          About The Artist
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={aboutContent.imageUrl}
                  alt={`Portrait of ${aboutContent.name}`}
                  width={800}
                  height={1000}
                  className="object-cover w-full h-full"
                  data-ai-hint="photographer portrait"
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="font-headline text-3xl text-primary">{aboutContent.name}</h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/80 font-body">{aboutContent.bio}</p>
            </div>

            <div>
              <h3 className="font-headline text-2xl">My Mission</h3>
              <p className="mt-2 text-lg leading-relaxed text-foreground/80 font-body">{aboutContent.mission}</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {aboutContent.awards.map((award, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="font-body text-base">{award}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {aboutContent.teamMembers && aboutContent.teamMembers.length > 0 && (
          <section className="mt-24">
             <h2 className="text-3xl md:text-4xl font-headline text-center mb-12 flex items-center justify-center gap-4">
                <Users className="h-8 w-8" />
                Meet the Team
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aboutContent.teamMembers.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-0">
                       <Image
                          src={member.imageUrl || 'https://picsum.photos/400/400'}
                          alt={`Portrait of ${member.name}`}
                          width={400}
                          height={400}
                          className="object-cover w-full h-auto aspect-square rounded-t-lg"
                          data-ai-hint="team member portrait"
                        />
                    </CardContent>
                     <CardHeader>
                        <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </CardHeader>
                  </Card>
                ))}
             </div>
          </section>
        )}

      </div>
    </PublicLayout>
  );
}
