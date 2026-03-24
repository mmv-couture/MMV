import React from 'react';
import { ChevronLeftIcon } from './icons';

interface NavBarProps {
    title: string;
    onBack?: () => void;
    showBackButton?: boolean;
}

/**
 * Sticky Navigation Bar - toujours visible au top
 * Grande flèche retour + titre page
 * Pour desktop et mobile
 */
const NavigationBar: React.FC<NavBarProps> = ({
    title,
    onBack,
    showBackButton = true
}) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onBack) {
                onBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onBack]);

    return (
        <div className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white dark:bg-stone-900 border-b-2 border-orange-900 dark:border-orange-700 shadow-lg z-40">
            <div className="max-w-full mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
                {/* Left: Back Button - Only show if onBack handler is provided AND showBackButton is true */}
                {showBackButton && onBack ? (
                    <button
                        onClick={onBack}
                        className="flex-shrink-0 p-2.5 -m-2 rounded-xl hover:bg-orange-50 dark:hover:bg-stone-800 transition-all active:scale-95"
                        aria-label="Retour"
                        title="Retour (Esc)"
                    >
                        <ChevronLeftIcon className="w-9 h-9 md:w-10 md:h-10 text-orange-900 dark:text-orange-400 font-black" />
                    </button>
                ) : (
                    <div className="flex-shrink-0 w-10 md:w-12" />
                )}

                {/* Center: Title */}
                <h1 className="flex-1 text-lg md:text-2xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight truncate">
                    {title}
                </h1>

                {/* Right: Spacer */}
                <div className="flex-shrink-0 w-10 md:w-12" />
            </div>
        </div>
    );
};

export default NavigationBar;
