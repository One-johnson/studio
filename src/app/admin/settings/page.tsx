'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/lib/firebase';
import { ClipboardCopy } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const gcsBucketLink = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/storage/rules`;
    const rulesToCopy = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to everyone
    match /{allPaths=**} {
      allow read;
    }
    // Allow write access only to authenticated users (i.e., you, the admin)
    match /photos/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}`;

    const handleCopyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard!",
            description: `${type} has been copied.`,
        });
    };

    return (
        <AdminLayout>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Firebase Storage Setup</CardTitle>
                        <CardDescription>
                            To allow photo uploads, you need to update your Firebase Storage security rules. This is a one-time setup.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Step 1: Go to your Firebase Storage Rules</h3>
                            <p className="text-muted-foreground">
                                Click the button below to open your Firebase project's storage rules directly.
                            </p>
                            <Button asChild variant="outline">
                                <a href={gcsBucketLink} target="_blank" rel="noopener noreferrer">
                                    Open Firebase Storage Rules
                                </a>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Step 2: Copy and Paste the Rules</h3>
                            <p className="text-muted-foreground">
                                Completely replace the existing content in the rules editor with the following text. This will make your images publicly readable (so visitors can see them) but only allow you (as an authenticated user) to upload.
                            </p>
                            <div className="relative p-4 rounded-md bg-muted font-mono text-sm whitespace-pre-wrap">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => handleCopyToClipboard(rulesToCopy, 'Rules')}
                                >
                                    <ClipboardCopy className="h-4 w-4" />
                                </Button>
                                {rulesToCopy}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Step 3: Publish Your Changes</h3>
                            <p className="text-muted-foreground">
                                Click the "Publish" button in the Firebase console to save the new rules. After that, your photo uploads should work correctly.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
