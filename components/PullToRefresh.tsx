import React, { useState, useRef, useCallback } from 'react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    threshold?: number;
    tension?: number;
}

const REFRESH_HEIGHT = 80;

/**
 * Composant Pull-to-Refresh (tirer vers le bas pour rafraîchir)
 * Inspiration: iOS UIRefreshControl
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    threshold = 100,
    tension = 0.5
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const touchStartRef = useRef<{ y: number } | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const scrollTop = scrollContainerRef.current?.scrollTop || 0;
        // Only start pull if at top of page
        if (scrollTop === 0) {
            touchStartRef.current = { y: e.touches[0].clientY };
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current || isRefreshing) return;

        const scrollTop = scrollContainerRef.current?.scrollTop || 0;
        if (scrollTop !== 0) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - touchStartRef.current.y;

        if (distance > 0) {
            e.preventDefault();
            // Apply tension curve to feel more natural
            const tensioned = distance * tension;
            setPullDistance(Math.min(tensioned, REFRESH_HEIGHT * 1.5));
        }
    }, [isRefreshing, tension]);

    const handleTouchEnd = useCallback(async () => {
        if (pullDistance > threshold && !isRefreshing) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
        touchStartRef.current = null;
    }, [pullDistance, threshold, isRefreshing, onRefresh]);

    // Calculate rotation for spinner
    const spinnerRotation = Math.min((pullDistance / REFRESH_HEIGHT) * 360, 360);
    const isReadyToRefresh = pullDistance > threshold;

    return (
        <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-y-auto"
        >
            {/* Pull to Refresh indicator */}
            <div
                className="overflow-hidden transition-all duration-200"
                style={{ height: `${Math.max(0, pullDistance - 20)}px` }}
            >
                <div className="flex items-center justify-center h-20 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950">
                    <div className="text-center">
                        <div
                            className="inline-block w-8 h-8 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 transition-all"
                            style={{
                                transform: `rotate(${isRefreshing ? 360 : spinnerRotation}deg)`,
                                animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none'
                            }}
                        />
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                            {isRefreshing ? '⏳ Chargement...' : isReadyToRefresh ? '👆 Relâchez !' : '⬇️ Tirez'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {children}

            {/* Spinner animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PullToRefresh;
