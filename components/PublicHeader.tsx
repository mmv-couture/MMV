
import React, { useState, useEffect } from 'react';
import type { Page } from '../types';
import { HamburgerIcon, LogoutIcon } from './icons';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface PublicHeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPage, onNavigate }) => {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems: { label: string, page: Page }[] = [
        { label: t('nav.home'), page: 'publicHome' },
        { label: 'Artisans', page: 'workshops' },
        { label: t('nav.showroom'), page: 'showroom' },
        { label: t('nav.reviews'), page: 'reviews' },
        { label: t('nav.about'), page: 'about' },
    ];

    const handleLinkClick = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <header className={`sticky top-0 z-[100] transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100' 
                : 'bg-white border-b-4 border-orange-900 shadow-md'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center h-16 sm:h-20">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('publicHome')}>
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:shadow-orange-500/25 group-hover:scale-110 transition-all duration-300">
                            M
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-amber-900 tracking-tighter uppercase leading-none">
                            MMV
                        </h1>
                        <span className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-wider">
                            COUTURE
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, index) => (
                        <button
                            key={item.page}
                            onClick={() => onNavigate(item.page)}
                            className={`relative px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden group ${
                                currentPage === item.page
                                    ? 'text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-500/25'
                                    : 'text-orange-900 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500'
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <span className="relative z-10">{item.label}</span>
                            {currentPage !== item.page && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher className="hidden md:flex" />
                    <button
                        onClick={() => onNavigate('login')}
                        className="group relative px-6 py-3 text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10">ACCÈS PRO</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-amber-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    
                    {/* Burger Button (Tablet & Mobile) */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-3 text-orange-900 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                        <div className={`w-6 h-5 relative transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}>
                            <span className={`absolute w-full h-0.5 bg-orange-900 top-0 left-0 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2' : ''}`}></span>
                            <span className={`absolute w-full h-0.5 bg-orange-900 top-2 left-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`absolute w-full h-0.5 bg-orange-900 top-4 left-0 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Drawer Menu */}
            <div className={`fixed inset-0 bg-gradient-to-br from-orange-900/90 to-amber-900/90 backdrop-blur-lg z-[110] transition-all duration-300 lg:hidden ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
                <div className={`absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl transition-transform duration-300 transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-orange-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                                    M
                                </div>
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-amber-900 uppercase text-sm tracking-widest">
                                    MMV COUTURE
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="text-orange-400 p-2 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <nav className="flex flex-col gap-2 flex-grow">
                            {navItems.map((item, index) => (
                                <button
                                    key={item.page}
                                    onClick={() => handleLinkClick(item.page)}
                                    className={`text-left px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 ${
                                        currentPage === item.page 
                                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25' 
                                            : 'text-orange-900 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50'
                                    }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                        
                        <div className="pt-6 border-t border-orange-100 space-y-4">
                            <button
                                onClick={() => handleLinkClick('login')}
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300"
                            >
                                ACCÈS PRO
                            </button>
                            <div className="flex justify-center">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
