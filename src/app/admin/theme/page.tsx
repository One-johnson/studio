import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ThemeCustomizationForm from '@/components/admin/ThemeCustomizationForm';

export default function AdminThemePage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Theme Customization</CardTitle>
            <CardDescription>
              Adjust your site's color palette and fonts using AI. Enter your current theme details and a style description to get AI-powered suggestions based on modern design trends.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeCustomizationForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
