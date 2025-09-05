'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customizeTheme, type ThemeCustomizationOutput } from '@/ai/flows/ai-theme-customization';
import { applyTheme } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Wand2, Loader2, Paintbrush } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fAF]{6}$/, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  headlineFont: z.string().min(1, "Cannot be empty"),
  bodyFont: z.string().min(1, "Cannot be empty"),
  styleDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ThemeCustomizationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [result, setResult] = useState<ThemeCustomizationOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: '#4B0082',
      backgroundColor: '#F0F0F0',
      accentColor: '#D8B4FE',
      headlineFont: 'Belleza',
      bodyFont: 'Alegreya',
      styleDescription: 'A clean, modern, and visually engaging design for a photography portfolio.',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setResult(null);
    try {
      const response = await customizeTheme(data);
      setResult(response);
    } catch (error) {
      console.error("Theme customization failed:", error);
      toast({ title: 'Error', description: 'Failed to generate theme suggestions.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTheme = async () => {
    if (!result) return;
    setIsApplying(true);
    try {
      await applyTheme({
        primaryColor: result.updatedPrimaryColor,
        backgroundColor: result.updatedBackgroundColor,
        accentColor: result.updatedAccentColor,
        headlineFont: result.updatedHeadlineFont,
        bodyFont: result.updatedBodyFont,
      });
      toast({ title: 'Theme Applied!', description: 'Your new theme is now live. The page will reload.' });
      router.refresh();
    } catch (error) {
        console.error("Failed to apply theme:", error);
        toast({ title: 'Error', description: 'Could not apply the new theme.', variant: 'destructive'});
    } finally {
        setIsApplying(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input id="primaryColor" {...register('primaryColor')} />
            {errors.primaryColor && <p className="text-sm text-destructive">{errors.primaryColor.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input id="backgroundColor" {...register('backgroundColor')} />
            {errors.backgroundColor && <p className="text-sm text-destructive">{errors.backgroundColor.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <Input id="accentColor" {...register('accentColor')} />
            {errors.accentColor && <p className="text-sm text-destructive">{errors.accentColor.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="headlineFont">Headline Font</Label>
                <Input id="headlineFont" {...register('headlineFont')} />
                {errors.headlineFont && <p className="text-sm text-destructive">{errors.headlineFont.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="bodyFont">Body Font</Label>
                <Input id="bodyFont" {...register('bodyFont')} />
                {errors.bodyFont && <p className="text-sm text-destructive">{errors.bodyFont.message}</p>}
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="styleDescription">Style Description (Optional)</Label>
          <Textarea id="styleDescription" {...register('styleDescription')} rows={4} placeholder="e.g., minimalist, brutalist, elegant..." />
        </div>
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Suggestions
        </Button>
      </form>

      <div className="lg:border-l lg:pl-8">
        <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
        {isGenerating && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {result && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Generated Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">New Color Palette</h4>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-md border" style={{ backgroundColor: result.updatedPrimaryColor }}></div>
                    <p className="text-xs mt-1">Primary</p>
                    <p className="text-xs font-mono">{result.updatedPrimaryColor}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-md border" style={{ backgroundColor: result.updatedBackgroundColor }}></div>
                    <p className="text-xs mt-1">Background</p>
                     <p className="text-xs font-mono">{result.updatedBackgroundColor}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-md border" style={{ backgroundColor: result.updatedAccentColor }}></div>
                    <p className="text-xs mt-1">Accent</p>
                     <p className="text-xs font-mono">{result.updatedAccentColor}</p>
                  </div>
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="font-semibold mb-2">New Fonts</h4>
                <p><strong>Headline:</strong> {result.updatedHeadlineFont}</p>
                <p><strong>Body:</strong> {result.updatedBodyFont}</p>
              </div>
              <Separator />
               <div>
                <h4 className="font-semibold mb-2">Design Notes</h4>
                <p className="text-sm text-muted-foreground">{result.designNotes}</p>
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleApplyTheme} disabled={isApplying}>
                    {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paintbrush className="mr-2 h-4 w-4" />}
                    Apply Theme
                </Button>
            </CardFooter>
          </Card>
        )}
        {!isGenerating && !result && (
          <div className="flex items-center justify-center h-full border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Suggestions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
