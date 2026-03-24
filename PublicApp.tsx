
import React, { useState, useEffect } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { ToastContainer } from './components';
import PublicHome from './pages/PublicHome';
import About from './pages/About';
import Showroom from './pages/Showroom';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import Legal from './pages/Legal';
import WorkshopsList from './pages/WorkshopsList';
import PublicAtelierView from './pages/PublicAtelierView';
import type { Page } from './types';

const PublicApp: React.FC = () => {
    const [page, setPage] = useState<Page>('publicHome');
    const [pageParams, setPageParams] = useState<any>(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'admin' || hash === 'login') {
                setPage('login');
            } else if (hash === 'legal') {
                setPage('legal');
            } else if (hash === 'register') {
                setPage('register');
            } else if (hash === 'workshops') {
                setPage('workshops');
            }
        };
        
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleNavigate = (newPage: Page, params?: any) => {
        setPage(newPage);
        setPageParams(params);
        
        // Update hash for basic history support
        if (newPage === 'publicHome') window.location.hash = '';
        else if (newPage === 'login') window.location.hash = 'login';
        else if (newPage === 'register') window.location.hash = 'register';
        else if (newPage === 'workshops') window.location.hash = 'workshops';
        
        window.scrollTo(0, 0);
    };

    const renderContent = () => {
        switch (page) {
            case 'about':
                return <About />;
            case 'showroom':
                return <Showroom />;
            case 'reviews':
                return <Reviews />;
            case 'workshops':
                return <WorkshopsList onNavigate={handleNavigate} />;
            case 'publicAtelier':
                return <PublicAtelierView atelierId={pageParams?.atelierId} onBack={() => handleNavigate('workshops')} />;
            case 'login':
                return <Login onNavigate={handleNavigate} />;
            case 'register':
                return <Register onNavigate={handleNavigate} />;
            case 'legal':
                return <Legal />;
            case 'publicHome':
            default:
                return <PublicHome onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200">
            <PublicHeader currentPage={page} onNavigate={handleNavigate} />
            <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {renderContent()}
            </main>
            <PublicFooter onNavigate={handleNavigate} />
            <ToastContainer />
        </div>
    );
};

export default PublicApp;
