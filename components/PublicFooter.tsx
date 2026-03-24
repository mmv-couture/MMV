
import React, { useState } from 'react';
import type { Page } from '../types';

interface PublicFooterProps {
    onNavigate: (page: Page) => void;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const handleNavClick = (e: React.MouseEvent, page: Page) => {
        e.preventDefault();
        onNavigate(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white dark:bg-orange-900 border-t-4 border-orange-900 dark:border-orange-700 pt-16 pb-8">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-lg font-bold text-orange-900 dark:text-orange-50 tracking-wider mb-4">MMV COUTURE</h3>
                        <p className="text-sm text-orange-700 dark:text-orange-200 mb-4">
                            La plateforme de référence pour digitaliser votre atelier de couture. Simplifiez votre gestion et sublimez vos créations.
                        </p>
                        <div className="flex space-x-4">
                            <span className="text-xs text-orange-600 dark:text-orange-300">© 2024 MMV</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-orange-900 dark:text-orange-50 mb-4">Accès Rapide</h4>
                        <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-200">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'publicHome')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">Accueil</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'showroom')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">Showroom</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">À propos</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'login')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">Espace Manager</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-orange-900 dark:text-orange-50 mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-200">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'legal')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">Mentions Légales</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'legal')} className="hover:text-orange-900 dark:hover:text-orange-50 transition-colors">CGU / Confidentialité</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-1">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-50 mb-4">Newsletter</h4>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input 
                                type="email" 
                                placeholder="Votre email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-orange-200 dark:border-orange-700 rounded-md bg-orange-50 dark:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-900"
                                required
                            />
                            <button 
                                type="submit" 
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800 transition-colors"
                            >
                                S'inscrire
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-orange-100 dark:border-orange-700 pt-8 text-center text-sm text-orange-700 dark:text-orange-300">
                    <p>&copy; {new Date().getFullYear()} MMV Couture. Plateforme SaaS de Gestion pour Tailleurs et Stylistes.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
