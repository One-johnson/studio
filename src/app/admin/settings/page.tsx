'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Terminal } from 'lucide-react';
import { firebaseConfig } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const gcsBucketLink = `https://console.cloud.google.com/storage/browser/${firebaseConfig.storageBucket}`;
    const corsConfig = `[
    {
      "origin": ["https://app.studio.dev"],
      "method": ["GET", "PUT", "POST", "DELETE"],
      "responseHeader": ["Content-Type", "access-control-allow-origin"],
      "maxAgeSeconds": 3600
    }
]`;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(corsConfig);
        toast({ title: 'Copied!', description: 'CORS configuration copied to clipboard.' });
    };

    return (
        <AdminLayout>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Storage (CORS) Configuration</CardTitle>
                        <CardDescription>
                            Follow these one-time setup steps to allow your web app to upload files to Firebase Storage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>What is this?</AlertTitle>
                            <AlertDescription>
                                To allow your website to upload photos directly from the browser, you must grant it permission by configuring CORS (Cross-Origin Resource Sharing) on your storage bucket.
                                This is a standard web security measure. You only need to do this once for the Firebase Studio environment.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 1: Open your Cloud Storage Bucket</h3>
                            <p className="text-sm text-muted-foreground">Click the button below to go directly to the correct bucket in the Google Cloud Console. A new tab will open.</p>
                            <Button asChild variant="outline">
                                <a href={gcsBucketLink} target="_blank" rel="noopener noreferrer">
                                    Open Storage Bucket
                                </a>
                            </Button>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 2: Navigate to Permissions</h3>
                            <p className="text-sm text-muted-foreground">In the Google Cloud Console tab that just opened, click on the <code className="bg-muted px-1 py-0.5 rounded-sm">PERMISSIONS</code> tab.</p>
                        </div>
                        
                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 3: Configure CORS</h3>
                             <p className="text-sm text-muted-foreground">Scroll down to the "Cross-origin resource sharing (CORS)" section and click <code className="bg-muted px-1 py-0.5 rounded-sm">EDIT</code>. In the text area that appears, paste the following configuration:</p>
                            <Card className="bg-muted">
                                <CardContent className="p-4">
                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                        <code>{corsConfig}</code>
                                    </pre>
                                </CardContent>
                            </Card>
                            <Button onClick={handleCopyToClipboard}>
                                <Terminal className="mr-2 h-4 w-4"/>
                                Copy Configuration
                            </Button>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 4: Save and Test</h3>
                            <p className="text-sm text-muted-foreground">Click <code className="bg-muted px-1 py-0.5 rounded-sm">SAVE</code> in the Google Cloud Console. Then come back to this page and try uploading a photo again in the "Photos" tab. The error should now be gone.</p>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
