
'use client';

import { useState, useEffect, useActionState } from 'react';
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
import { Trash2, Upload, GripVertical, Loader2, ShieldOff, Wand2, PlusCircle } from 'lucide-react';
import { moderateImage } from '@/ai/flows/content-moderation-flow';
import { generateCaption } from '@/ai/flows/generate-caption-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import type { Photo, Gallery } from '@/lib/types';
import { uploadPhoto } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
        const [photosSnapshot, galleriesSnapshot] = await Promise.all([
            getDocs(collection(db, 'photos')),
            getDocs(collection(db, 'galleries'))
        ]);
        const photosData = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Photo[];
        const galleriesData = galleriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Gallery[];
        setPhotos(photosData);
        setGalleries(galleriesData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ title: "Error", description: "Could not load photos or galleries.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "photos", photo.id));
      
      // Delete from Storage
      const imageRef = ref(storage, photo.url);
      await deleteObject(imageRef);

      // In a real app, also remove from gallery's photoIds array
      
      toast({ title: "Success", description: "Photo deleted successfully." });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({ title: "Error", description: "Failed to delete photo.", variant: "destructive" });
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    try {
        // Note: This doesn't delete the photos within the gallery from storage.
        // A more robust solution would handle associated photos.
        await deleteDoc(doc(db, "galleries", galleryId));
        toast({ title: "Success", description: "Gallery deleted." });
        fetchData();
    } catch (error) {
        console.error("Error deleting gallery:", error);
        toast({ title: "Error", description: "Failed to delete gallery.", variant: "destructive" });
    }
  };

  const handleCreateGallery = async (title: string, category: string) => {
    try {
      const newGalleryRef = doc(db, "galleries", category);
      await setDoc(newGalleryRef, {
        title: title,
        category: category,
        photoIds: []
      });
      toast({ title: "Success", description: "Gallery created." });
      fetchData();
    } catch (error) {
      console.error("Error creating gallery:", error);
      toast({ title: "Error", description: "Failed to create gallery. Make sure the category slug is unique.", variant: "destructive" });
    }
  };


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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Photo Management</CardTitle>
            <CardDescription>Upload, categorize, and manage your photos and galleries.</CardDescription>
          </div>
          <UploadDialog galleries={galleries} onUploadSuccess={fetchData} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Photos</TabsTrigger>
              {galleries.map(g => (
                <TabsTrigger key={g.id} value={g.id}>{g.category}</TabsTrigger>
              ))}
              <TabsTrigger value="manage-galleries">Galleries</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <PhotosTable photos={photos} galleries={galleries} onDelete={handleDeletePhoto} />
            </TabsContent>

            {galleries.map(g => {
                const galleryPhotos = photos.filter(p => g.photoIds?.includes(p.id))
                return (
                    <TabsContent key={g.id} value={g.id} className="mt-4">
                        <PhotosTable photos={galleryPhotos} galleries={galleries} onDelete={handleDeletePhoto} />
                    </TabsContent>
                )
            })}
            
            <TabsContent value="manage-galleries" className="mt-4">
              <ManageGalleries
                galleries={galleries}
                onCreate={handleCreateGallery}
                onDelete={handleDeleteGallery}
              />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function PhotosTable({ photos, galleries, onDelete }: { photos: Photo[], galleries: Gallery[], onDelete: (photo: Photo) => void }) {
  const findPhotoCategory = (photoId: string) => {
    const gallery = galleries.find(g => g.photoIds?.includes(photoId));
    return gallery?.category || 'Uncategorized';
  }

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
                {findPhotoCategory(photo.id)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the photo from your storage and database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(photo)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ManageGalleries({ galleries, onCreate, onDelete }: { galleries: Gallery[], onCreate: (title: string, category: string) => void, onDelete: (id: string) => void }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category) return;
        onCreate(title, category.toLowerCase().replace(/\s+/g, '-'));
        setTitle('');
        setCategory('');
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gallery-title">Gallery Title</Label>
                            <Input id="gallery-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Wedding Moments" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gallery-category">Category Slug</Label>
                            <Input id="gallery-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. weddings (unique)" />
                        </div>
                        <Button type="submit">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Gallery
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Galleries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {galleries.map(gallery => (
                                <TableRow key={gallery.id}>
                                    <TableCell>{gallery.title}</TableCell>
                                    <TableCell><Badge variant="secondary">{gallery.id}</Badge></TableCell>
                                    <TableCell className="text-right">
                                       <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Gallery?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will delete the gallery but not the photos inside it. Are you sure?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => onDelete(gallery.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function UploadDialog({ galleries, onUploadSuccess }: { galleries: Gallery[], onUploadSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);

  const { toast } = useToast();
  
  const [state, formAction] = useActionState(uploadPhoto, { message: '', success: false, photo: null });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Upload Successful!', description: state.message });
        onUploadSuccess();
        setIsOpen(false);
        resetDialogState();
      } else {
        toast({ title: "Upload Failed", description: state.message, variant: "destructive" });
      }
    }
  }, [state, onUploadSuccess, toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    resetDialogState(true);
    setFile(selectedFile);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const uri = reader.result as string;
      setFileDataUri(uri);

      try {
        const moderationPromise = moderateImage({ photoDataUri: uri });
        const captionPromise = generateCaption({ photoDataUri: uri });

        const [moderationResult, captionResult] = await Promise.all([
          moderationPromise,
          captionPromise,
        ]);
        
        if (!moderationResult.isAppropriate) {
          setModerationError(moderationResult.reason || 'The image was flagged as inappropriate.');
        } else {
          toast({ title: 'Image approved', description: 'The image passed moderation.' });
        }
        
        setTitle(captionResult.title);
        toast({ title: 'Caption Generated!', description: 'An AI-powered title has been created.' });

      } catch (error) {
        console.error("Processing failed:", error);
        toast({ title: "Error", description: "An error occurred during image processing.", variant: "destructive" });
        setModerationError('An error occurred during processing.');
      } finally {
        setIsProcessing(false);
      }
    };
  };

  const getImageDimensions = (uri: string): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
        const img = document.createElement('img');
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.src = uri;
    });
  }

  const resetDialogState = (keepOpen: boolean = false) => {
    setIsProcessing(false);
    setModerationError(null);
    setTitle('');
    setCategory('');
    setFile(null);
    setFileDataUri(null);
    if (!keepOpen) {
      setIsOpen(false);
    }
  }
  
  const handleFormSubmit = async (formData: FormData) => {
    if (!file || !category || !!moderationError) {
      toast({ title: "Save Failed", description: "Please ensure a file and category are selected, and the image is appropriate.", variant: "destructive" });
      return;
    }

    if(fileDataUri) {
      const dimensions = await getImageDimensions(fileDataUri);
      formData.set('width', dimensions.width.toString());
      formData.set('height', dimensions.height.toString());
    }
    
    formData.set('file', file);
    formData.set('title', title);
    formData.set('category', category);

    formAction(formData);
  }

  const isFormDisabled = isProcessing || state.success;
  const isActionDisabled = isProcessing || !file || !!moderationError || state.success;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetDialogState();
    }}>
      <DialogTrigger asChild>
        <Button><Upload className="mr-2 h-4 w-4" />Upload Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Photo</DialogTitle>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo-file" className="text-right">Photo</Label>
              <Input id="photo-file" name="file" type="file" className="col-span-3" onChange={handleFileChange} accept="image/*" disabled={isFormDisabled} />
            </div>

            {isProcessing && (
              <div className="col-span-4 flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Analyzing image with AI...</span>
              </div>
            )}

            {moderationError && (
              <Alert variant="destructive" className="col-span-4">
                <ShieldOff className="h-4 w-4" />
                <AlertTitle>Image Flagged</AlertTitle>
                <AlertDescription>{moderationError}</AlertDescription>
              </Alert>
            )}

            {file && !isProcessing && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Sunset Over The Lake" className="col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isFormDisabled || !!moderationError} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select name="category" onValueChange={setCategory} value={category} disabled={isFormDisabled || !!moderationError}>
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
                </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isActionDisabled}>
              {(isProcessing || state.success) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Photo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
