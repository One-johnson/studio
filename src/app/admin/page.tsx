'use client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, BookImage, MessageSquare, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Photo, Gallery, Message } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Line, LineChart, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, format } from 'date-fns';

export default function AdminDashboardPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const messagesQuery = query(
            collection(db, 'contact-messages'),
            where('createdAt', '>=', thirtyDaysAgo)
        );

        const [photosSnapshot, galleriesSnapshot, messagesSnapshot] = await Promise.all([
          getDocs(collection(db, 'photos')),
          getDocs(collection(db, 'galleries')),
          getDocs(messagesQuery)
        ]);
        
        const photosData = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Photo[];
        const galleriesData = galleriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Gallery[];
        const messagesData = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];

        setPhotos(photosData);
        setGalleries(galleriesData);
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const galleryChartData = useMemo(() => {
    if (galleries.length === 0) return [];
    return galleries.map(gallery => ({
      name: gallery.category,
      photos: gallery.photoIds?.length || 0,
    })).sort((a,b) => b.photos - a.photos);
  }, [galleries]);

  const messageChartData = useMemo(() => {
    const dailyMessages = new Map<string, number>();
    const today = new Date();

    // Initialize the map with 0s for the last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const formattedDate = format(date, 'MMM d');
        dailyMessages.set(formattedDate, 0);
    }
    
    messages.forEach(msg => {
        if (msg.createdAt instanceof Timestamp) {
            const date = msg.createdAt.toDate();
            const formattedDate = format(date, 'MMM d');
            if (dailyMessages.has(formattedDate)) {
                dailyMessages.set(formattedDate, (dailyMessages.get(formattedDate) || 0) + 1);
            }
        }
    });

    return Array.from(dailyMessages.entries()).map(([date, count]) => ({ date, messages: count }));

  }, [messages]);

  const recentPhotos = photos.slice(0, 5);
  
  const findPhotoCategory = (photoId: string) => {
    const gallery = galleries.find(g => g.photoIds?.includes(photoId));
    return gallery?.category || 'Uncategorized';
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photos.length}</div>
              <p className="text-xs text-muted-foreground">in {galleries.length} galleries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Galleries</CardTitle>
              <BookImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{galleries.length}</div>
              <p className="text-xs text-muted-foreground">Categories of photos</p>
            </CardContent>
          </card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">in the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Photos Per Gallery</CardTitle>
                    <CardDescription>A breakdown of photo distribution across your galleries.</CardDescription>
                </CardHeader>
                <CardContent>
                  {galleryChartData.length > 0 ? (
                    <ChartContainer config={{}} className="w-full h-[250px]">
                      <BarChart data={galleryChartData} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Bar dataKey="photos" fill="hsl(var(--primary))" radius={8} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                      <p>No gallery data available.</p>
                    </div>
                  )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Messages received over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                  {messageChartData.length > 0 ? (
                    <ChartContainer config={{}} className="w-full h-[250px]">
                      <LineChart data={messageChartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Line type="monotone" dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                     <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                      <p>No message data available.</p>
                    </div>
                  )}
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPhotos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dimensions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPhotos.map((photo) => (
                      <TableRow key={photo.id}>
                        <TableCell>
                          <Image
                            src={photo.url}
                            alt={photo.title}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                            data-ai-hint="thumbnail"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{photo.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{findPhotoCategory(photo.id)}</Badge>
                        </TableCell>
                        <TableCell>{photo.width}x{photo.height}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No recent photos to display.</p>
                    <p className="text-sm">Upload some photos in the 'Photos' tab to see them here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
