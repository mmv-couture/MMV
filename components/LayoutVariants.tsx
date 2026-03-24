import React from 'react';
import NavigationBar from './NavigationBar';

/**
 * Collection de layout variants réutilisables
 * Pour des besoins spécifiques (modal, fullscreen, etc.)
 */

// Modal Layout - pour modals et overlays
export interface ModalLayoutProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
    children,
    isOpen,
    onClose,
    title,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'max-w-xs sm:max-w-sm',
        md: 'max-w-xs sm:max-w-md',
        lg: 'max-w-xs sm:max-w-lg',
        xl: 'max-w-xs sm:max-w-xl'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`bg-white dark:bg-stone-800 rounded-lg shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
                {title && (
                    <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h2>
                        <button
                            onClick={onClose}
                            className={`p-1 rounded-lg transition-colors ${
                                document.documentElement.classList.contains('dark')
                                    ? 'hover:bg-stone-700 text-stone-400'
                                    : 'hover:bg-stone-100 text-stone-600'
                            }`}
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Sidebar Layout - Layout avec sidebar à gauche
export interface SidebarLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    sidebarWidth?: 'narrow' | 'normal' | 'wide';
    collapsible?: boolean;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
    children,
    sidebar,
    sidebarWidth = 'normal',
    collapsible = false
}) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const widthClasses = {
        narrow: 'w-48',
        normal: 'w-64',
        wide: 'w-80'
    };

    return (
        <div className="flex h-screen gap-0">
            <aside className={`${!collapsed ? widthClasses[sidebarWidth] : 'w-20'} bg-stone-100 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 overflow-y-auto transition-all duration-300`}>
                {collapsible && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full p-3 text-center hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                )}
                {!collapsed && sidebar}
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

// Full Width Layout - layout sans restrictions de largeur
export interface FullWidthLayoutProps {
    children: React.ReactNode;
    title: string;
    onBack?: () => void;
}

export const FullWidthLayout: React.FC<FullWidthLayoutProps> = ({
    children,
    title,
    onBack
}) => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            <NavigationBar
                title={title}
                onBack={onBack}
                showBackButton={!!onBack}
            />
            <div className="pt-16 md:pt-20 w-full">
                {children}
            </div>
        </div>
    );
};

// Centered Content Layout - contenu centré avec max-width
export interface CenteredLayoutProps {
    children: React.ReactNode;
    title: string;
    onBack?: () => void;
    maxWidth?: number; // en pixels
}

export const CenteredLayout: React.FC<CenteredLayoutProps> = ({
    children,
    title,
    onBack,
    maxWidth = 600
}) => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            <NavigationBar
                title={title}
                onBack={onBack}
                showBackButton={!!onBack}
            />
            <div className="pt-16 md:pt-20 px-4 md:px-8 py-8">
                <div style={{ maxWidth: `${maxWidth}px` }} className="mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
