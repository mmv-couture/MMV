import React from 'react';
import { ChevronLeftIcon } from './icons';

interface Breadcrumb {
    label: string;
    action: () => void;
}

interface PageHeaderProps {
    title: string;
    onBack: () => void;
    breadcrumbs?: Breadcrumb[];
    subtitle?: string;
    rightContent?: React.ReactNode;
    sticky?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    onBack, 
    breadcrumbs,
    subtitle,
    rightContent,
    sticky = false
}) => {
    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onBack]);

    const headerClass = sticky 
        ? 'fixed top-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-md'
        : '';

    const contentClass = sticky ? 'px-6 py-4' : '';

    return (
        <div className={headerClass}>
            <div className={`space-y-3 ${contentClass}`}>
                {/* Breadcrumb Navigation */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <button
                                    onClick={crumb.action}
                                    className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors font-medium underline"
                                >
                                    {crumb.label}
                                </button>
                                {idx < breadcrumbs.length - 1 && (
                                    <span className="text-stone-400 dark:text-stone-600">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}

                {/* Back Button & Title */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Back Button - LARGE and VISIBLE */}
                        <button
                            onClick={onBack}
                            className="flex-shrink-0 mt-0 p-3 -m-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all rounded-lg touch-action-manipulation"
                            aria-label="Retour"
                            title="Retour (Esc)"
                        >
                            <ChevronLeftIcon className="w-8 h-8 md:w-7 md:h-7" />
                        </button>

                        {/* Title */}
                        <div className="flex-1 min-w-0 pt-1">
                            <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight uppercase break-words">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-stone-500 dark:text-stone-400 mt-1 text-xs md:text-sm">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Content Slot */}
                    {rightContent && (
                        <div className="flex-shrink-0">
                            {rightContent}
                        </div>
                    )}
                </div>

                {/* Keyboard hint on desktop */}
                {!sticky && (
                    <div className="text-xs text-stone-400 hidden md:block">
                        💡 Appuyez sur <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">Esc</kbd> pour retourner
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
