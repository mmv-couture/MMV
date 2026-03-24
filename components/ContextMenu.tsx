import React, { useState, useRef, useEffect } from 'react';

interface ContextMenuOption {
    label: string;
    icon?: React.ReactNode;
    action: () => void;
    danger?: boolean;
}

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    options: ContextMenuOption[];
    onClose: () => void;
}

/**
 * Composant Context Menu (menu long-press)
 * Affiche sur long-press avec options
 * Z-index: 60 (au-dessus de tout)
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
    isOpen,
    position,
    options,
    onClose
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close menu on outside click
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="fixed inset-0"
            style={{ zIndex: 60 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20" />

            {/* Menu */}
            <div
                className="fixed bg-white dark:bg-stone-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-900 dark:border-orange-700 animate-fade-in"
                style={{
                    left: Math.max(12, Math.min(position.x - 80, window.innerWidth - 200)) + 'px',
                    top: Math.max(12, position.y + 12) + 'px',
                    minWidth: '180px',
                    maxWidth: '260px',
                    zIndex: 61
                }}
            >
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            option.action();
                            onClose();
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-bold transition-colors flex items-center gap-3 uppercase tracking-wider ${
                            option.danger
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
                                : 'text-orange-900 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-stone-700'
                        } ${idx < options.length - 1 ? 'border-b border-stone-200 dark:border-stone-600' : ''}`}
                    >
                        {option.icon && <span className="text-xl">{option.icon}</span>}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContextMenu;
