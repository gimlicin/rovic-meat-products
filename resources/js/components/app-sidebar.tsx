import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Package2, BarChart3, Settings, GlobeIcon, HomeIcon, LogOut, ShoppingCart, User, History, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

// Admin navigation items
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package2,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: BarChart3,
    },
    {
        title: 'Payment Settings',
        href: '/admin/payment-settings',
        icon: Wallet,
    },
    {
        title: 'Go to Website',
        href: '/',
        icon: GlobeIcon,
    },
];

// Customer navigation items
const customerNavItems: NavItem[] = [
    {
        title: 'My Orders',
        href: '/my-orders',
        icon: ShoppingCart,
    },
    {
        title: 'Order History',
        href: '/my-orders',
        icon: History,
    },
    {
        title: 'Go to Shop',
        href: '/',
        icon: GlobeIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: User;
    };
}

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    
    // Determine navigation items based on user role
    const getNavItems = () => {
        if (user?.role === 'admin') {
            return adminNavItems;
        } else {
            return customerNavItems;
        }
    };

    // Determine home link based on user role
    const getHomeLink = () => {
        if (user?.role === 'admin') {
            return '/admin/dashboard';
        } else {
            return '/';
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getHomeLink()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={getNavItems()} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
