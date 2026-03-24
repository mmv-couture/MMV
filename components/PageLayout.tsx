import React from 'react';
import NavigationBar from './NavigationBar';
import { useNavigationHistory } from '../context/NavigationHistoryContext';

type LayoutVariant = 'standard' | 'withSidebar' | 'fullWidth' | 'modal' | 'authenticated';

interface PageLayoutProps {
    title: string;
    onBack?: () => void;
    showBackButton?: boolean;
    children: React.ReactNode;
    variant?: LayoutVariant;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: 'compact' | 'normal' | 'spacious';
    showHeader?: boolean;
    subtitle?: string;
    actions?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    onBack,
    showBackButton = true,
    children,
    variant = 'standard',
    maxWidth = 'lg',
    padding = 'normal',
    showHeader = true,
    subtitle,
    actions
}) => {
    let navHistory;
    let handleBack: (() => void) | undefined;
    let shouldShowBack = false;
    
    // Try to use navigation history, but don't fail if not available
    try {
        navHistory = useNavigationHistory();
        handleBack = onBack || (() => navHistory.goBack?.() || navHistory.back?.());
        shouldShowBack = showBackButton && (!!onBack || navHistory.canGoBack);
    } catch {
        // If NavigationHistoryContext is not available (e.g., in AuthenticatedApp)
        handleBack = onBack;
        shouldShowBack = !!onBack;
    }

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        '2xl': 'max-w-7xl',
        full: 'w-full'
    };

    const paddingClasses = {
        compact: 'px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6',
        normal: 'px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8',
        spacious: 'px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12'
    };

    const topPaddingClasses = {
        standard: 'pt-16 md:pt-20',
        withSidebar: 'pt-16 md:pt-20 md:pl-72',
        fullWidth: 'pt-16 md:pt-20',
        modal: 'pt-0',
        authenticated: 'pt-0'
    };

    const isAuthenticatedVariant = variant === 'authenticated';

    return (
        <div className={`min-h-screen bg-stone-50 dark:bg-stone-900 ${isAuthenticatedVariant ? '' : ''}`}>
            {/* Sticky Navigation Bar - hidden si modal ou authenticated */}
            {variant !== 'modal' && variant !== 'authenticated' && (
                <NavigationBar 
                    title={title}
                    onBack={shouldShowBack ? handleBack : undefined}
                    showBackButton={shouldShowBack}
                />
            )}

            {/* Main Content */}
            <div className={`${topPaddingClasses[variant]} ${paddingClasses[padding]}`}>
                <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
                    {/* Header - caché en mode authenticated si demandé */}
                    {showHeader && (
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-stone-600 dark:text-stone-400 mt-2 text-base">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            {actions && (
                                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                    {actions}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLayout;
