import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NavigationHistoryContextType {
  history: string[];
  currentIndex: number;
  push: (path: string) => void;
  back: () => string | null;
  goBack: () => string | null;
  forward: () => string | null;
  goForward: () => string | null;
  canGoBack: boolean;
  canGoForward: boolean;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

export const NavigationHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>(['/']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const push = useCallback((path: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, path];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const back = useCallback((): string | null => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const forward = useCallback((): string | null => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <NavigationHistoryContext.Provider value={{ 
      history, 
      currentIndex, 
      push, 
      back, 
      goBack: back,
      forward, 
      goForward: forward,
      canGoBack, 
      canGoForward 
    }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = (): NavigationHistoryContextType => {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
};
