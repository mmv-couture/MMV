/**
 * Responsive Components Library
 * Export all mobile-optimized components from here
 */

// Mobile Detection Hooks
export { useResponsive, usePageVisibility, useOrientation, useDynamicViewportHeight, useHasNotch, useBatteryStatus } from '../../hooks/useMobileDetection';

// Responsive Components
export { ResponsiveImage, ResponsiveContainer, ResponsiveGrid, ResponsiveStack, TouchButton } from './ResponsiveComponents';

// Mobile Components
export { BottomNavigation, BottomSheet, MobileMenu } from './MobileComponents';

// Layout Components
export { MobileFirstLayout, ScrollableArea, ResponsiveContent, MobileDialog } from './MobileFirstLayout';

// Types
export type { BottomNavigationItem } from './MobileComponents';
