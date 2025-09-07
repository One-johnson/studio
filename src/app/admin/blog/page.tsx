
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, PenSquare, Trash2, Wand2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
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
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';


export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'blog-posts'));
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
           createdAt: (doc.data().createdAt as Timestamp).toDate(),
        } as unknown as BlogPost));
        setPosts(fetchedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({ title: "Error", description: "Failed to load blog posts.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [toast]);

  const handleDelete = async (postId: string, imageUrl: string) => {
    try {
      await deleteDoc(doc(db, 'blog-posts', postId));
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: "Success", description: "Blog post deleted." });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
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
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>Create, edit, and manage your blog posts.</CardDescription>
          </div>
          <PostEditorDialog onSave={() => router.refresh()} />
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <PenSquare className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No blog posts yet</h3>
                <p className="mt-1 text-sm">Click 'Create Post' to start writing.</p>
            </div>
          ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Image src={post.imageUrl} alt={post.title} width={80} height={45} className="rounded-md object-cover" data-ai-hint="thumbnail" />
                      </TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell><Badge variant="outline">/blog/{post.slug}</Badge></TableCell>
                      <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                         <PostEditorDialog post={post} onSave={() => router.refresh()}>
                            <Button variant="ghost" size="icon">
                                <PenSquare className="h-4 w-4" />
                            </Button>
                         </PostEditorDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the blog post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post.id, post.imageUrl)}>
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
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

// PostEditorDialog Component
type PostEditorDialogProps = {
  post?: BlogPost;
  children?: React.ReactNode;
  onSave: () => void;
};

function PostEditorDialog({ post, children, onSave }: PostEditorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || null);
  const [aiTopic, setAiTopic] = useState('');
  const [aiInspirationPhoto, setAiInspirationPhoto] = useState<File | null>(null);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!aiTopic) {
        toast({ title: "Topic required", description: "Please enter a topic for the AI to write about.", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    try {
        let photoDataUri: string | undefined = undefined;
        if (aiInspirationPhoto) {
            const reader = new FileReader();
            reader.readAsDataURL(aiInspirationPhoto);
            photoDataUri = await new Promise(resolve => {
                reader.onload = () => resolve(reader.result as string);
            });
        }
        
        const result = await generateBlogPost({ topic: aiTopic, photoDataUri });
        setTitle(result.title);
        setSlug(result.slug);
        setExcerpt(result.excerpt);
        setContent(result.content);
        toast({ title: "Content Generated", description: "AI has drafted the post. Please review and save." });

    } catch (error) {
        console.error("AI generation failed:", error);
        toast({ title: "Generation Failed", description: "The AI could not generate the post.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content || (!imageFile && !post)) {
        toast({ title: "Missing Fields", description: "Title, slug, content, and an image are required.", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    try {
        let imageUrl = post?.imageUrl || '';
        if (imageFile) {
            if (post?.imageUrl) {
                // Delete old image if a new one is uploaded
                try {
                    await deleteObject(ref(storage, post.imageUrl));
                } catch (err) {
                    console.warn("Old image not found, skipping delete:", err);
                }
            }
            const storageRef = ref(storage, `blog/${Date.now()}-${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const postData = {
            title,
            slug,
            excerpt,
            content,
            imageUrl,
            createdAt: post ? post.createdAt : serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        if (post) {
            await updateDoc(doc(db, 'blog-posts', post.id), postData);
            toast({ title: "Success", description: "Post updated successfully." });
        } else {
            await addDoc(collection(db, 'blog-posts'), postData);
            toast({ title: "Success", description: "Post created successfully." });
        }
        
        onSave();
        setIsOpen(false);
        
    } catch(error) {
        console.error("Error saving post:", error);
        toast({ title: "Error", description: "Failed to save the post.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button><PlusCircle className="mr-2 h-4 w-4" />Create Post</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit' : 'Create'} Blog Post</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8 overflow-y-auto p-1">
            {/* AI Generation Column */}
            <div className="space-y-4 pr-4 border-r">
              <h3 className="text-lg font-semibold text-primary flex items-center"><Wand2 className="mr-2" />AI Content Generator</h3>
              <div className="space-y-2">
                <Label htmlFor="ai-topic">Topic or Idea</Label>
                <Textarea id="ai-topic" placeholder="e.g., 'The Art of Sunset Photography'" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="ai-photo">Inspiration Photo (optional)</Label>
                <Input id="ai-photo" type="file" accept="image/*" onChange={e => setAiInspirationPhoto(e.target.files ? e.target.files[0] : null)} />
              </div>
              <Button onClick={handleGenerate} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Content
              </Button>
            </div>
            
            {/* Form Column */}
            <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} required/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={8} required/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                 {imagePreview && <Image src={imagePreview} alt="preview" width={160} height={90} className="rounded-md object-cover" />}
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </form>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>Cancel</Button>
          <Button type="submit" form="post-form" disabled={isProcessing}>
             {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
