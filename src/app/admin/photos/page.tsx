
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Upload, Loader2, ShieldOff, Wand2, PlusCircle, Image as ImageIcon, Pencil, MoreHorizontal } from 'lucide-react';
import { moderateImage } from '@/ai/flows/content-moderation-flow';
import { generateCaption } from '@/ai/flows/generate-caption-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayUnion, setDoc, arrayRemove, writeBatch } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Photo, Gallery } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setSelectedPhotos([]);
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
    setIsProcessing(true);
    try {
      await deleteDoc(doc(db, "photos", photo.id));
      const imageRef = ref(storage, photo.url);
      await deleteObject(imageRef);
      
      const batch = writeBatch(db);
      for (const gallery of galleries) {
        if (gallery.photoIds?.includes(photo.id)) {
          const galleryRef = doc(db, 'galleries', gallery.id);
          batch.update(galleryRef, { photoIds: arrayRemove(photo.id) });
        }
      }
      await batch.commit();

      toast({ title: "Success", description: "Photo deleted successfully." });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({ title: "Error", description: "Failed to delete photo.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    const batch = writeBatch(db);
    
    try {
      for(const photoId of selectedPhotos) {
          const photoToDelete = photos.find(p => p.id === photoId);
          if (photoToDelete) {
            // Delete from firestore
            const photoRef = doc(db, "photos", photoToDelete.id);
            batch.delete(photoRef);
            
            // Delete from storage
            const imageRef = ref(storage, photoToDelete.url);
            await deleteObject(imageRef);
            
            // Remove from any gallery that contains it
            for (const gallery of galleries) {
              if (gallery.photoIds?.includes(photoToDelete.id)) {
                const galleryRef = doc(db, 'galleries', gallery.id);
                batch.update(galleryRef, { photoIds: arrayRemove(photoToDelete.id) });
              }
            }
          }
      }
      
      await batch.commit();
      
      toast({ title: "Success", description: `${selectedPhotos.length} photos deleted.` });
      fetchData();
    } catch (error) {
        console.error("Error deleting photos:", error);
        toast({ title: "Error", description: "Failed to delete photos.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleUpdatePhoto = async (photoId: string, newTitle: string, newCategory: string) => {
    setIsProcessing(true);
    try {
        const batch = writeBatch(db);
        
        // Update the photo title
        const photoRef = doc(db, 'photos', photoId);
        batch.update(photoRef, { title: newTitle });

        // Find the current and new galleries
        const currentGallery = galleries.find(g => g.photoIds?.includes(photoId));
        const newGallery = galleries.find(g => g.id === newCategory);

        // If the category has changed, update the galleries
        if (currentGallery?.id !== newGallery?.id) {
            if (currentGallery) {
                const currentGalleryRef = doc(db, 'galleries', currentGallery.id);
                batch.update(currentGalleryRef, { photoIds: arrayRemove(photoId) });
            }
            if (newGallery) {
                const newGalleryRef = doc(db, 'galleries', newGallery.id);
                batch.update(newGalleryRef, { photoIds: arrayUnion(photoId) });
            }
        }

        await batch.commit();
        toast({ title: "Success", description: "Photo updated." });
        fetchData();
    } catch(error) {
        console.error("Error updating photo:", error);
        toast({ title: "Error", description: "Failed to update photo.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }

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

  const handleTabChange = () => {
    setSelectedPhotos([]);
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
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Photo Management</CardTitle>
            <CardDescription>Upload, categorize, and manage your photos and galleries.</CardDescription>
             {selectedPhotos.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedPhotos.length} selected</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isProcessing}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedPhotos.length} photos. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <UploadDialog galleries={galleries} onUploadSuccess={fetchData} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Photos</TabsTrigger>
              {galleries.map(g => (
                <TabsTrigger key={g.id} value={g.id}>{g.category}</TabsTrigger>
              ))}
              <TabsTrigger value="manage-galleries">Galleries</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <PhotosTable 
                photos={photos} 
                galleries={galleries} 
                onDelete={handleDeletePhoto} 
                onEdit={handleUpdatePhoto} 
                selectedPhotos={selectedPhotos}
                onSelectionChange={setSelectedPhotos}
                isProcessing={isProcessing}
                onUpdatePhoto={fetchData}
              />
            </TabsContent>

            {galleries.map(g => {
                const galleryPhotos = photos.filter(p => g.photoIds?.includes(p.id))
                return (
                    <TabsContent key={g.id} value={g.id} className="mt-4">
                        <PhotosTable 
                          photos={galleryPhotos} 
                          galleries={galleries} 
                          onDelete={handleDeletePhoto} 
                          onEdit={handleUpdatePhoto}
                          selectedPhotos={selectedPhotos}
                          onSelectionChange={setSelectedPhotos}
                          isProcessing={isProcessing}
                          onUpdatePhoto={fetchData}
                        />
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

interface PhotosTableProps {
  photos: Photo[];
  galleries: Gallery[];
  selectedPhotos: string[];
  onSelectionChange: (ids: string[]) => void;
  onDelete: (photo: Photo) => void;
  onEdit: (photoId: string, newTitle: string, newCategory: string) => void;
  isProcessing: boolean;
  onUpdatePhoto: () => void;
}

function PhotosTable({ photos, galleries, selectedPhotos, onSelectionChange, onDelete, onEdit, isProcessing, onUpdatePhoto }: PhotosTableProps) {
  const findPhotoCategoryInfo = (photoId: string) => {
    const gallery = galleries.find(g => g.photoIds?.includes(photoId));
    return { category: gallery?.category || 'Uncategorized', galleryId: gallery?.id || '' };
  }

  const { toast } = useToast();
  const [generatingTitleId, setGeneratingTitleId] = useState<string | null>(null);
  
  const imageUrlToDataUri = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleGenerateTitle = async (photo: Photo) => {
    setGeneratingTitleId(photo.id);
    try {
        // To avoid API size limits, we fetch the image client-side and convert to a data URI.
        // This is effectively a proxy that also resizes/compresses the image in the browser.
        const dataUri = await imageUrlToDataUri(photo.url);
        const { title } = await generateCaption({ photoDataUri: dataUri });
        
        await updateDoc(doc(db, 'photos', photo.id), { title });
        toast({ title: "Success", description: "AI-generated title has been saved." });
        onUpdatePhoto();
    } catch(err) {
        console.error("Failed to generate title", err);
        toast({ title: "Error", description: "Could not generate title. The image may be too large.", variant: "destructive" });
    } finally {
        setGeneratingTitleId(null);
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(photos.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  }

  const handleRowSelect = (photoId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPhotos, photoId]);
    } else {
      onSelectionChange(selectedPhotos.filter(id => id !== photoId));
    }
  }

  const allSelected = photos.length > 0 && selectedPhotos.length === photos.length;
  
  if (photos.length === 0) {
    return (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No photos in this gallery</h3>
            <p className="mt-1 text-sm">Upload photos to see them here.</p>
        </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
             <Checkbox 
                onCheckedChange={handleSelectAll}
                checked={allSelected}
                aria-label="Select all"
             />
          </TableHead>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {photos.map(photo => {
           const { category, galleryId } = findPhotoCategoryInfo(photo.id);
           const isSelected = selectedPhotos.includes(photo.id);
           return (
             <TableRow key={photo.id} data-state={isSelected && "selected"}>
                <TableCell>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleRowSelect(photo.id, !!checked)}
                        aria-label="Select photo"
                    />
                </TableCell>
                <TableCell>
                  <Image src={photo.url} alt={photo.title} width={64} height={64} className="rounded-md object-cover" data-ai-hint="thumbnail" />
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {photo.title}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6" 
                    onClick={() => handleGenerateTitle(photo)} 
                    disabled={generatingTitleId === photo.id}
                  >
                    {generatingTitleId === photo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isProcessing}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <EditPhotoDialog 
                            photo={photo} 
                            currentGalleryId={galleryId} 
                            galleries={galleries} 
                            onSave={onEdit}
                            isProcessing={isProcessing}
                            trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
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
                                <AlertDialogAction onClick={() => onDelete(photo)} disabled={isProcessing}>
                                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
           )
        })}
      </TableBody>
    </Table>
  );
}

function EditPhotoDialog({ photo, currentGalleryId, galleries, onSave, isProcessing, trigger }: { photo: Photo, currentGalleryId: string, galleries: Gallery[], onSave: (photoId: string, newTitle: string, newCategory: string) => void, isProcessing: boolean, trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(photo.title);
    const [category, setCategory] = useState(currentGalleryId);

    const handleSave = () => {
        onSave(photo.id, title, category);
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Photo Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select onValueChange={setCategory} defaultValue={category}>
                          <SelectTrigger id="edit-category">
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
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isProcessing}>Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
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

type UploadableFile = {
    id: number;
    file: File;
    dataUri: string;
    title: string;
    category: string;
    dimensions: { width: number; height: number; };
    moderation: { isAppropriate: boolean; reason: string; };
    status: 'pending' | 'processing' | 'ready' | 'error';
}


function UploadDialog({ galleries, onUploadSuccess }: { galleries: Gallery[], onUploadSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<UploadableFile[]>([]);

  const { toast } = useToast();

  const processFile = async (file: File, id: number) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const uri = reader.result as string;

        try {
            const dimensions = await getImageDimensions(uri);
            
            setFilesToUpload(prev => prev.map(f => f.id === id ? { ...f, dimensions, status: 'processing' } : f));
            
            const moderationResult = await moderateImage({ photoDataUri: uri });

            setFilesToUpload(prev => prev.map(f => f.id === id ? {
                ...f,
                moderation: {
                    isAppropriate: moderationResult.isAppropriate,
                    reason: moderationResult.reason || '',
                },
                status: moderationResult.isAppropriate ? 'ready' : 'error',
            } : f));
            
            if (!moderationResult.isAppropriate) {
                toast({ title: `Image Flagged: ${file.name}`, description: moderationResult.reason, variant: 'destructive'})
            } else {
                 toast({ title: 'Ready to Upload', description: `${file.name} is ready.`})
            }

        } catch (error) {
            console.error("Processing failed:", error);
            setFilesToUpload(prev => prev.map(f => f.id === id ? { ...f, status: 'error', moderation: { isAppropriate: false, reason: 'Processing failed.' } } : f));
        }
    };
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    resetDialogState(true);
    
    const newFiles: UploadableFile[] = Array.from(selectedFiles).map((file, index) => ({
        id: Date.now() + index,
        file,
        dataUri: URL.createObjectURL(file), // For preview
        title: file.name.split('.').slice(0, -1).join('.'), // Use filename as title
        category: galleries[0]?.id || '',
        dimensions: { width: 0, height: 0 },
        moderation: { isAppropriate: true, reason: '' },
        status: 'pending',
    }));
    
    setFilesToUpload(newFiles);

    newFiles.forEach(file => processFile(file.file, file.id));
  };
  
  const getImageDimensions = (uri: string): Promise<{width: number, height: number}> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject('Could not load image');
        img.src = uri;
    });
  }

  const resetDialogState = (keepOpen: boolean = false) => {
    setFilesToUpload([]);
    setIsUploading(false);
    if (!keepOpen) {
      setIsOpen(false);
    }
  }

  const handleUpload = async () => {
    const filesToSave = filesToUpload.filter(f => f.status === 'ready');
    if (filesToSave.length === 0) {
        toast({ title: 'No Files to Upload', description: 'Please select and process files before uploading.', variant: 'destructive' });
        return;
    }
    setIsUploading(true);

    try {
        const batch = writeBatch(db);
        await Promise.all(filesToSave.map(async (fileToSave) => {
            const storageRef = ref(storage, `photos/${Date.now()}-${fileToSave.file.name}`);
            const snapshot = await uploadBytes(storageRef, fileToSave.file, { contentType: fileToSave.file.type });
            const downloadURL = await getDownloadURL(snapshot.ref);

            const photoDocRef = doc(collection(db, 'photos'));
            batch.set(photoDocRef, {
                title: fileToSave.title,
                url: downloadURL,
                width: fileToSave.dimensions.width,
                height: fileToSave.dimensions.height,
                createdAt: new Date(),
            });

            if (fileToSave.category) {
              const galleryRef = doc(db, 'galleries', fileToSave.category);
              batch.update(galleryRef, {
                  photoIds: arrayUnion(photoDocRef.id)
              });
            }
        }));
        
        await batch.commit();

        toast({ title: 'Upload Successful!', description: `${filesToSave.length} photo(s) have been saved.` });
        onUploadSuccess();
        resetDialogState();
        
    } catch(error) {
        console.error("Upload failed:", error);
        toast({ title: 'Upload Failed', description: 'An error occurred while uploading photos.', variant: 'destructive'});
        setIsUploading(false);
    }
  }
  
  const handleSingleFileUpdate = (id: number, field: 'title' | 'category', value: string) => {
      setFilesToUpload(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  }

  const isActionDisabled = filesToUpload.some(f => f.status === 'processing') || isUploading || filesToUpload.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetDialogState();
    }}>
      <DialogTrigger asChild>
        <Button><Upload className="mr-2 h-4 w-4" />Upload Photos</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload New Photos</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo-file" className="text-right">Photo(s)</Label>
              <Input id="photo-file" name="file" type="file" className="col-span-3" onChange={handleFileChange} accept="image/*" disabled={isUploading} multiple />
            </div>

            {filesToUpload.length > 0 && (
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="space-y-4">
                        {filesToUpload.map((file) => (
                            <div key={file.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <Image src={file.dataUri} alt="preview" width={100} height={100} className="rounded-md object-cover" />
                                <div className="col-span-2 space-y-2">
                                    {file.status === 'pending' && <p className="text-sm text-muted-foreground">Waiting to process...</p>}
                                    {file.status === 'processing' && <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</div>}
                                    {file.status === 'error' && (
                                        <Alert variant="destructive">
                                          <ShieldOff className="h-4 w-4" />
                                          <AlertTitle>Image Flagged</AlertTitle>
                                          <AlertDescription>{file.moderation.reason}</AlertDescription>
                                        </Alert>
                                    )}
                                    {file.status === 'ready' && (
                                        <div className="grid gap-2">
                                            <Input 
                                                value={file.title} 
                                                onChange={(e) => handleSingleFileUpdate(file.id, 'title', e.target.value)} 
                                                placeholder="Enter title"
                                            />
                                            <Select 
                                                defaultValue={file.category} 
                                                onValueChange={(val) => handleSingleFileUpdate(file.id, 'category', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Uncategorized</SelectItem>
                                                    {galleries.map(g => (
                                                      <SelectItem key={g.id} value={g.id}>{g.category}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUpload} disabled={isActionDisabled}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Upload ${filesToUpload.filter(f=> f.status === 'ready').length} Photos` }
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
