import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const route =
    (typeof window !== 'undefined' && (window as any).route) ||
    ((name: string, params?: any, absolute?: boolean) => name);

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    {name}
                </Link>
                <div className="relative z-20 mt-16 flex flex-1 items-center justify-center">
                    <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-zinc-900 via-black to-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.9)] h-72 w-72 sm:h-80 sm:w-80 md:h-88 md:w-88 lg:h-88 lg:w-88">
                        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-zinc-700/60" />
                        <img
                            src="/images/rovic-logo.png"
                            alt={name}
                            className="relative z-10 h-52 w-52 sm:h-60 sm:w-60 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain"
                        />
                    </div>
                </div>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-300">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={route('home')}
                        className="relative z-20 flex items-center justify-center text-lg font-medium lg:hidden"
                    >
                        {name}
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
