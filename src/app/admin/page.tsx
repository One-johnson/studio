import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { galleries, photos, contactMessages } from '@/lib/data';
import { ImageIcon, BookImage, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const recentPhotos = photos.slice(0, 5);

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
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactMessages.length}</div>
              <p className="text-xs text-muted-foreground">Unread inquiries</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
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
                {recentPhotos.map((photo) => {
                  const category = galleries.find(g => g.photos.some(p => p.id === photo.id))?.category || 'Uncategorized';
                  return (
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
                        <Badge variant="outline">{category}</Badge>
                      </TableCell>
                      <TableCell>{photo.width}x{photo.height}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
