'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Upload, GripVertical } from 'lucide-react';
import { galleries, photos as initialPhotos } from '@/lib/data';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would handle file upload to a storage service
    // and update the database.
    console.log('Uploading photo...');
    setIsUploadDialogOpen(false);
    // Here you would add the new photo to the `photos` state.
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Photo Management</CardTitle>
            <CardDescription>Upload, categorize, and manage your photos.</CardDescription>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Photo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo-file" className="text-right">
                      Photo
                    </Label>
                    <Input id="photo-file" type="file" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" placeholder="e.g., Sunset Over The Lake" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {galleries.map(g => (
                          <SelectItem key={g.id} value={g.id}>{g.category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Upload</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Photos</TabsTrigger>
              {galleries.map(g => (
                <TabsTrigger key={g.id} value={g.id}>{g.category}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <PhotosTable photos={photos} />
            </TabsContent>
            {galleries.map(g => (
              <TabsContent key={g.id} value={g.id} className="mt-4">
                <PhotosTable photos={g.photos} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function PhotosTable({ photos }: { photos: typeof initialPhotos }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {photos.map(photo => (
           <TableRow key={photo.id}>
            <TableCell className="cursor-grab"><GripVertical className="h-5 w-5 text-muted-foreground" /></TableCell>
            <TableCell>
              <Image src={photo.url} alt={photo.title} width={64} height={64} className="rounded-md object-cover" data-ai-hint="thumbnail" />
            </TableCell>
            <TableCell className="font-medium">{photo.title}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {galleries.find(g => g.photos.some(p => p.id === photo.id))?.category || 'Uncategorized'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
