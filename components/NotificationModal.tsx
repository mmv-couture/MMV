
import React, { useState } from 'react';
import type { Order, Client, Modele, ManagerProfile } from '../types';

interface NotificationModalProps {
    order: Order;
    client: Client;
    model: Modele;
    managerProfile: ManagerProfile;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ order, client, model, managerProfile, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    // Construction du message personnalisé
    const message = `Bonjour ${client.name},\n\nVotre commande pour le modèle "${model.title}" (Ticket N°${order.ticketId}) est prête chez ${managerProfile.name} !\n\nVous pouvez passer la récupérer à votre convenance.\n\nMerci de votre confiance ! ✨`;

    const handleCopy = () => {
        navigator.clipboard.writeText(message).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleWhatsApp = () => {
        // Enlever les espaces et caractères non numériques du numéro client
        // Utiliser le préfixe stocké ou par défaut
        const prefix = client.phonePrefix || '+225';
        const cleanPhone = client.phone.replace(/\D/g, '');
        const fullPhone = prefix.replace('+', '') + cleanPhone;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto animate-slide-up border-2 border-green-500/20" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100">Prêt à Envoyer</h2>
                        <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Destinataire : {client.name}</p>
                    </div>
                </div>

                <div className="relative mb-8">
                    <textarea
                        readOnly
                        value={message}
                        rows={6}
                        className="w-full p-6 bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 rounded-2xl focus:outline-none text-lg leading-relaxed shadow-inner"
                    />
                    <button 
                        onClick={handleCopy}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-white dark:bg-stone-800 rounded-xl shadow-md text-xs font-black uppercase hover:bg-orange-500 hover:text-white transition-all"
                    >
                        {isCopied ? 'Copié !' : 'Copier'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                    <button type="button" onClick={onClose} className="px-6 py-4 text-sm font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Annuler</button>
                    
                    <button 
                        type="button" 
                        onClick={handleWhatsApp} 
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                        ENVOYER WHATSAPP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
