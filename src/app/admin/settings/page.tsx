'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Terminal, Copy, ExternalLink } from 'lucide-react';
import { firebaseConfig } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const corsFileName = 'cors.json';
    const cloudShellLink = `https://console.cloud.google.com/cloudshell/editor?shellonly=true&project=${firebaseConfig.projectId}`;
    const corsConfig = `[
    {
      "origin": ["https://app.studio.dev"],
      "method": ["GET", "PUT", "POST", "DELETE"],
      "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
      "maxAgeSeconds": 3600
    }
]`;
    const gcloudCommand = `gcloud storage buckets update gs://${firebaseConfig.storageBucket} --cors-file=${corsFileName}`;

    const handleCopyToClipboard = (text: string, name: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: `${name} copied to clipboard.` });
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
                            <AlertTitle>Why is this necessary?</AlertTitle>
                            <AlertDescription>
                                To allow your website to upload photos directly from the browser, you must grant it permission by configuring CORS (Cross-Origin Resource Sharing) on your storage bucket.
                                This is a standard web security measure. The most reliable way to do this is with the command-line steps below.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 1: Open Google Cloud Shell</h3>
                            <p className="text-sm text-muted-foreground">Click the button below to open a command-line terminal for your project in a new browser tab. It may take a moment to start up.</p>
                            <Button asChild variant="outline">
                                <a href={cloudShellLink} target="_blank" rel="noopener noreferrer">
                                    <Terminal className="mr-2"/>
                                    Open Google Cloud Shell
                                </a>
                            </Button>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 2: Create the CORS configuration file</h3>
                            <p className="text-sm text-muted-foreground">First, copy the CORS configuration JSON below. Then, in the Cloud Shell terminal, type <code className="bg-muted px-1 py-0.5 rounded-sm">touch {corsFileName}</code>, press Enter, and paste the contents into the newly created file.</p>
                            <Card className="bg-muted">
                                <CardHeader className="p-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">{corsFileName}</CardTitle>
                                     <Button size="sm" variant="ghost" onClick={() => handleCopyToClipboard(corsConfig, 'Config')}>
                                        <Copy className="mr-2" />
                                        Copy Config
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                        <code>{corsConfig}</code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 3: Apply the CORS configuration to your bucket</h3>
                             <p className="text-sm text-muted-foreground">Copy the command below and paste it into the Cloud Shell terminal, then press Enter. This will apply the rules from your <code className="bg-muted px-1 py-0.5 rounded-sm">{corsFileName}</code> to your storage bucket.</p>
                            <Card className="bg-muted">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <pre className="text-sm font-mono whitespace-pre-wrap">
                                        <code>{gcloudCommand}</code>
                                    </pre>
                                    <Button size="sm" variant="ghost" onClick={() => handleCopyToClipboard(gcloudCommand, 'Command')}>
                                        <Copy className="mr-2" />
                                        Copy Command
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Step 4: Test Your Upload</h3>
                            <p className="text-sm text-muted-foreground">Once the command finishes successfully, close the Cloud Shell tab and return to this page. Navigate to the "Photos" tab and try uploading a photo again. The error should now be gone.</p>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
