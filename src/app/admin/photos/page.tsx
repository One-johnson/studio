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
import { Trash2, Upload, GripVertical, Loader2, ShieldOff } from 'lucide-react';
import { galleries, photos as initialPhotos } from '@/lib/data';
import { moderateImage } from '@/ai/flows/content-moderation-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsModerating(true);
    setModerationError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        const result = await moderateImage({ photoDataUri: dataUri });
        
        if (!result.isAppropriate) {
          setModerationError(result.reason || 'The image was flagged as inappropriate.');
        } else {
          // In a real app, you might want to proceed with a preview
          // or enable the upload button here.
          toast({
            title: 'Image approved',
            description: 'The image passed moderation and is ready for upload.',
          });
        }
      } catch (error) {
        console.error("Moderation failed:", error);
        setModerationError('An error occurred during moderation. Please try again.');
      } finally {
        setIsModerating(false);
      }
    };
    reader.onerror = (error) => {
        console.error("File reading failed:", error);
        setModerationError('Failed to read the image file.');
        setIsModerating(false);
    };
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (moderationError) {
      toast({
        title: 'Upload Failed',
        description: 'Cannot upload an image that has been flagged.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, this would handle file upload to a storage service
    // and update the database.
    console.log('Uploading photo...');
    toast({
        title: 'Upload Successful!',
        description: 'Your photo has been added to the gallery.',
    })
    setIsUploadDialogOpen(false);
    setModerationError(null);
    // Here you would add the new photo to the `photos` state.
  };
  
  const resetDialog = () => {
    setModerationError(null);
    setIsModerating(false);
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Photo Management</CardTitle>
            <CardDescription>Upload, categorize, and manage your photos.</CardDescription>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={(isOpen) => {
            setIsUploadDialogOpen(isOpen);
            if (!isOpen) resetDialog();
          }}>
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
                    <Input id="photo-file" type="file" className="col-span-3" onChange={handleFileChange} accept="image/*" />
                  </div>
                   {isModerating && (
                    <div className="col-span-4 flex items-center justify-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Analyzing image...</span>
                    </div>
                  )}
                  {moderationError && (
                    <Alert variant="destructive" className="col-span-4">
                      <ShieldOff className="h-4 w-4" />
                      <AlertTitle>Image Flagged</AlertTitle>
                      <AlertDescription>
                        {moderationError}
                      </AlertDescription>
                    </Alert>
                  )}
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
                  <Button type="submit" disabled={isModerating || !!moderationError}>
                    {isModerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload
                  </Button>
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
