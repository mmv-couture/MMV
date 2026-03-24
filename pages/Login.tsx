import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Page } from '../types';

interface LoginProps {
    onNavigate: (page: Page) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Email ou mot de passe incorrect.');
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotMessage('');
        if (!forgotEmail) {
            setForgotMessage('Veuillez entrer votre email.');
            return;
        }
        // Simulation - en production, appeler une API
        setForgotMessage(`Un lien de réinitialisation a été envoyé à ${forgotEmail}. Vérifiez votre boîte mail.`);
        setTimeout(() => {
            setShowForgotPassword(false);
            setForgotEmail('');
            setForgotMessage('');
        }, 3000);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-orange-50 dark:bg-orange-900 p-4">
            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-orange-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in border border-orange-100 dark:border-orange-700">
                        <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-50 mb-2">Réinitialiser le mot de passe</h3>
                        <p className="text-sm text-orange-700 dark:text-orange-200 mb-4">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label htmlFor="forgot-email" className="block text-sm font-medium text-orange-800 dark:text-orange-100">Email</label>
                                <input
                                    type="email"
                                    id="forgot-email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="mt-2 block w-full px-4 py-2 bg-white dark:bg-orange-700 border-2 border-orange-200 dark:border-orange-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-900"
                                    placeholder="votre@email.com"
                                    autoFocus
                                />
                            </div>
                            {forgotMessage && (
                                <p className={`text-sm ${forgotMessage.includes('envoyé') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {forgotMessage}
                                </p>
                            )}
                            <div className="flex gap-3">
                                <button 
                                    type="submit"
                                    className="flex-1 py-2 px-4 text-sm font-bold text-white bg-orange-900 dark:bg-orange-700 rounded-xl hover:bg-orange-800 transition-colors"
                                >
                                    Envoyer le lien
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotEmail('');
                                        setForgotMessage('');
                                    }}
                                    className="flex-1 py-2 px-4 text-sm font-bold text-orange-800 dark:text-orange-100 bg-orange-100 dark:bg-orange-700/30 rounded-xl hover:bg-orange-200 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-md w-full bg-white dark:bg-orange-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-700">
                <h2 className="text-3xl font-bold text-center text-orange-900 dark:text-orange-50 mb-2">Connexion</h2>
                <p className="text-center text-orange-700 dark:text-orange-200 mb-6 text-sm">Accédez à votre espace de travail.</p>

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-orange-800 dark:text-orange-100">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 block w-full px-4 py-2 bg-white dark:bg-orange-700 border-2 border-orange-200 dark:border-orange-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-900 focus:border-transparent dark:focus:ring-orange-400"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-orange-800 dark:text-orange-100">Mot de passe</label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 hover:underline"
                            >
                                Oublié ?
                            </button>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full px-4 py-2 bg-white dark:bg-orange-700 border-2 border-orange-200 dark:border-orange-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-900 focus:border-transparent dark:focus:ring-orange-400"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    <button type="submit" className="w-full py-3 px-4 text-sm font-bold text-white bg-orange-900 dark:bg-orange-700 rounded-xl hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors duration-200 shadow-sm hover:shadow-md">
                        Se connecter
                    </button>
                </form>

                <p className="text-center text-sm text-orange-700 dark:text-orange-200 mt-6">
                    Pas encore d'atelier ?{' '}
                    <button onClick={() => onNavigate('register')} className="font-bold text-orange-900 dark:text-orange-100 hover:text-orange-700 dark:hover:text-orange-300 underline">
                        Inscrivez-vous
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;