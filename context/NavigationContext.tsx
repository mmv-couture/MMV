import React, { createContext, useContext, ReactNode } from 'react';
import type { Page } from '../types/index';

interface NavigationContextType {
  currentPage: Page | null;
  navigationHistory: Page[];
  navigate: (page: Page) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = React.useState<Page | null>(null);
  const [navigationHistory, setNavigationHistory] = React.useState<Page[]>([]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setNavigationHistory(prev => [...prev, page]);
    
    // Navigation physique dans le DOM
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', page.path);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Retirer la page actuelle
      const previousPage = newHistory[newHistory.length - 1];
      setCurrentPage(previousPage);
      setNavigationHistory(newHistory);
      
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    }
  };

  const goForward = () => {
    // Implémentation pour la navigation forward
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  };

  const canGoBack = navigationHistory.length > 1;
  const canGoForward = false; // Simplifié pour l'instant

  return (
    <NavigationContext.Provider value={{
      currentPage,
      navigationHistory,
      navigate,
      goBack,
      goForward,
      canGoBack,
      canGoForward
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
