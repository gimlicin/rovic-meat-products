import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
}

export default function FlashMessage() {
    const { flash } = usePage<{ flash: FlashMessages }>().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

    useEffect(() => {
        if (flash.success) {
            setMessage({ type: 'success', text: flash.success });
            setVisible(true);
        } else if (flash.error) {
            setMessage({ type: 'error', text: flash.error });
            setVisible(true);
        } else if (flash.info) {
            setMessage({ type: 'info', text: flash.info });
            setVisible(true);
        }

        if (flash.success || flash.error || flash.info) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !message) return null;

    const styles = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: CheckCircle,
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: XCircle,
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: Info,
        },
    };

    const style = styles[message.type];
    const Icon = style.icon;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${style.bg} ${style.border}`}
            >
                <Icon className={`h-5 w-5 flex-shrink-0 ${style.text}`} />
                <p className={`text-sm font-medium ${style.text}`}>{message.text}</p>
                <button
                    onClick={() => setVisible(false)}
                    className={`ml-auto flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
