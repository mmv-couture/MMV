import React from 'react';
import { useAuth } from './auth/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AuthenticatedApp from './AuthenticatedApp';
import PublicApp from './PublicApp';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();
    
    // Hide splash screen on first render (Capacitor mobile app)
    React.useEffect(() => {
      // Only try to hide splash screen if on native platform
      const hideSplash = async () => {
        try {
          const { SplashScreen } = await (window as any).CapacitorPlugins;
          if (SplashScreen?.hide) {
            SplashScreen.hide();
          }
        } catch (e) {
          // Silently ignore if not available (browser or older Capacitor)
        }
      };
      
      hideSplash();
    }, []);

    if (isAuthenticated) {
        return (
            <NotificationProvider>
                <AuthenticatedApp />
            </NotificationProvider>
        );
    }

    return (
        <NotificationProvider>
            <PublicApp />
        </NotificationProvider>
    );
};

export default App;
