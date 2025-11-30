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
            <div
                className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r"
                style={{
                    backgroundImage: "url('/images/rovic-logo.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                        className="absolute inset-0 backdrop-blur-md"
                        style={{
                            WebkitMaskImage:
                                'radial-gradient(circle at center, transparent 50%, black 100%)',
                            maskImage:
                                'radial-gradient(circle at center, transparent 50%, black 100%)',
                        }}
                    />
                </div>
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    {name}
                </Link>
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
