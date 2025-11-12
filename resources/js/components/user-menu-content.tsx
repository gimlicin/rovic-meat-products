import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
const route = (window as any).route || ((name: string) => name);

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    // Handle logout - exempt from CSRF so it always works
    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        cleanup();
        
        try {
            // Use fetch instead of Inertia router to avoid conflicts with pending requests
            await fetch(route('logout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin', // Include cookies for session
            });
        } catch (error) {
            // Ignore errors - we're logging out anyway
            console.log('Logout request completed');
        }
        
        // Small delay to ensure logout completes before reload
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
}
