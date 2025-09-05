'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { setupCors } from '@/ai/flows/setup-cors-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { firebaseConfig } from '@/lib/firebase';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('https://app.studio.dev');
  const { toast } = useToast();

  const handleConfigureCORS = async () => {
    if (!origin) {
        toast({ title: "Error", description: "Please enter the origin URL.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      const result = await setupCors({ bucketName: firebaseConfig.storageBucket, origin });
      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("CORS setup failed:", error);
      toast({ title: "CORS Setup Failed", description: error.message || 'An unknown error occurred.', variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>
              Configure technical settings for your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Configure Storage (CORS)</CardTitle>
                    <CardDescription>
                        This is a one-time setup to allow your web app to upload files to Firebase Storage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <ShieldCheck className="h-4 w-4" />
                        <AlertTitle>What is this?</AlertTitle>
                        <AlertDescription>
                            To allow your website to upload photos from the browser, you must grant it permission by configuring CORS (Cross-Origin Resource Sharing). 
                            Since you are using Firebase Studio, the correct URL has been pre-filled for you.
                            You only need to do this once. If you deploy your site to a different URL later, you will need to add that URL in the Google Cloud Console.
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <Label htmlFor="origin-url">Your Website's URL</Label>
                        <Input 
                            id="origin-url" 
                            placeholder="https://example.com" 
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                    </div>
                     <Button onClick={handleConfigureCORS} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Apply CORS Configuration
                    </Button>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
