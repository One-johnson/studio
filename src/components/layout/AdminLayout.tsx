
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth'
import { app } from '@/lib/firebase'
import {
  Camera,
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  LogOut,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/photos', label: 'Photos', icon: ImageIcon },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = getAuth(app)
  const { toast } = useToast()
  
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        title: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!user) {
     return null; // The redirect is handled in the useEffect
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-sidebar-primary" />
              <span className="text-xl font-headline font-semibold text-sidebar-foreground group-data-[state=collapsed]:hidden">
                Clustergh
              </span>
            </div>
            <SidebarTrigger className="md:hidden"/>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'View Public Site', side: 'right' }}>
                <Link href="/" target="_blank">
                  <ExternalLink />
                  <span>View Public Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Logout', side: 'right' }}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="hidden md:flex"/>
          <div className="flex-1">
            <h1 className="text-lg font-semibold font-headline">
              {menuItems.find(item => item.href === pathname)?.label || 'Admin'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
