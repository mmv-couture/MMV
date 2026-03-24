
import React, { useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import PageLayout from '../components/PageLayout';
import { LogoutIcon } from '../components/icons';
import EditProfileModal from '../components/EditProfileModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PaymentModal } from '../components/PaymentModal';
import CountryCodeSelector from '../components/CountryCodeSelector';
import type { SubscriptionPlan, ManagerProfile, Page } from '../types';

const Settings: React.FC<{ setCurrentPage?: (page: Page) => void }> = ({ setCurrentPage }) => {
    const { atelier, user, isSubscriptionActive, resetAtelierData, updateManagerProfile, updateAtelierData, logout, upgradeClientSubscription } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [phone, setPhone] = useState(atelier?.data.managerProfile.phone || '');
    const [phonePrefix, setPhonePrefix] = useState(atelier?.data.managerProfile.phonePrefix || '+225');
    
    if (!atelier || !user) return null;

    const handleSavePhone = () => {
        const updatedProfile: ManagerProfile = {
            ...atelier.data.managerProfile,
            phone,
            phonePrefix
        };
        updateManagerProfile(updatedProfile);
        alert("Coordonnées téléphoniques enregistrées.");
    };

    return (
        <PageLayout
          title="Paramètres de l'Atelier"
          subtitle="Gérez vos préférences et configurations."
          onBack={() => setCurrentPage?.('accueil')}
          showBackButton={true}
          maxWidth="4xl"
        >
            <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-fade-in">
            
            {/* Contact Client Section */}
            <div className="bg-white dark:bg-stone-800 rounded-[30px] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-700">
                <div className="p-8 border-b border-stone-100 dark:border-stone-700">
                    <h2 className="text-xl font-black uppercase tracking-widest">Lien WhatsApp Client</h2>
                    <p className="text-stone-500 text-sm mt-1">Numéro utilisé pour notifier vos clients quand leur commande est prête.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase text-stone-400 mb-2">Numéro WhatsApp de l'Atelier</label>
                        <div className="flex shadow-sm">
                            <CountryCodeSelector value={phonePrefix} onChange={setPhonePrefix} className="h-14" />
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)}
                                placeholder="07 00 00 00 00"
                                className="flex-1 h-14 p-4 bg-stone-50 dark:bg-stone-700 border border-l-0 border-stone-300 dark:border-stone-600 rounded-r-xl outline-none focus:border-orange-500 transition-all font-bold text-lg"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleSavePhone}
                        className="w-full py-4 bg-stone-900 text-white dark:bg-white dark:text-stone-900 rounded-2xl font-black hover:bg-orange-600 hover:text-white transition-all"
                    >
                        ENREGISTRER LE CONTACT
                    </button>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-stone-800 rounded-[30px] shadow-xl overflow-hidden">
                <div className="p-10 flex flex-col md:flex-row items-center gap-10">
                    <img src={atelier.data.managerProfile.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-3xl object-cover border-4 border-orange-500/20 shadow-2xl" />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-black tracking-tight">{atelier.name}</h3>
                        <p className="text-stone-500 font-bold uppercase tracking-widest text-sm mt-2">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
                            <span className="px-4 py-1.5 bg-orange-100 text-orange-900 rounded-full text-xs font-black uppercase tracking-widest">{atelier.data.managerProfile.atelierType}</span>
                            <span className="px-4 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-full text-xs font-black uppercase tracking-widest">{atelier.data.managerProfile.specialization}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ... reste des paramètres */}
            </div>
        </PageLayout>
    );
};

export default Settings;
