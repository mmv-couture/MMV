
import React, { useState, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Modele, AtelierWithManager } from '../types';
import ModelCard from '../components/ModelCard';
import ImageLightbox from '../components/ImageLightbox';
import ShowroomOrderModal from '../components/ShowroomOrderModal';
import PublicAtelierNavigation from '../components/PublicAtelierNavigation';
import PageHeader from '../components/PageHeader';
import { useSwipeGestures } from '../utils/navigationHooks';

interface PublicAtelierViewProps {
    atelierId: string;
    onBack: () => void;
}

const PublicAtelierView: React.FC<PublicAtelierViewProps> = ({ atelierId, onBack }) => {
    const { getAllAteliersWithManager, registerClientAndOrderFromShowroom } = useAuth();
    const atelier = useMemo(() => getAllAteliersWithManager().find(a => a.id === atelierId) as AtelierWithManager | undefined, [atelierId]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [orderingModel, setOrderingModel] = useState<Modele | null>(null);
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'catalogue'|'infos'|'avis'|'contact'>('catalogue');

    // Enable swipe right to go back
    useSwipeGestures({
        onSwipeRight: onBack,
        threshold: 50
    });

    const filteredModels = useMemo(() => {
        if (!atelier?.data?.models) return [];
        return atelier.data.models.filter(model => 
            model.showcaseStatus === 'approved' &&
            model.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [atelier, searchQuery]);

    if (!atelier) return <div className="p-20 text-center font-bold">Atelier introuvable.</div>;

    const handlePlaceOrder = async (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => {
        const success = await registerClientAndOrderFromShowroom(model, clientInfo);
        if (success) {
            setOrderingModel(null);
            setConfirmationMessage(`Merci ${clientInfo.name} ! Votre commande a été transmise à l'atelier ${atelier.name}.`);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <PageHeader 
                title={atelier.name}
                onBack={onBack}
                breadcrumbs={[
                    { label: 'Accueil', action: onBack },
                    { label: 'Ateliers', action: onBack },
                    { label: atelier.name, action: () => {} }
                ]}
                subtitle="👈 Glissez vers la droite pour retourner"
            />

            {/* Atelier Profile Header */}
            <div className="bg-white dark:bg-stone-800 rounded-[50px] shadow-2xl overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-900 to-amber-900 relative">
                     <div className="absolute -bottom-16 left-12">
                        <img src={atelier.data.managerProfile.avatarUrl} className="w-40 h-40 rounded-[40px] border-8 border-white dark:border-stone-800 shadow-2xl object-cover" alt={atelier.name} />
                     </div>
                </div>
                <div className="pt-20 pb-12 px-12 space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tighter uppercase">{atelier.name}</h1>
                        <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-sm mt-2">{atelier.data.managerProfile.specialization || 'Mode & Haute Couture'}</p>
                    </div>
                    <p className="text-xl text-stone-500 dark:text-stone-400 max-w-3xl leading-relaxed italic">
                        "{atelier.data.managerProfile.description || "Nous mettons notre savoir-faire au service de votre élégance unique."}"
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <span className="px-6 py-2 bg-stone-100 dark:bg-stone-700 rounded-full text-xs font-black uppercase tracking-widest text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-600">
                             {atelier.data.managerProfile.atelierType || 'Atelier Professionnel'}
                        </span>
                        <span className="px-6 py-2 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-full text-xs font-black uppercase tracking-widest border border-orange-200 dark:border-orange-800">
                             {atelier.data.models?.length || 0} Créations
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation for Atelier sections */}
            <div className="space-y-6">
                <PublicAtelierNavigation active={activeTab} onChange={(t) => setActiveTab(t)} />

                {activeTab === 'catalogue' && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter">Catalogue de l'Atelier</h2>
                            <input 
                                type="text" 
                                placeholder="Chercher un modèle de cet atelier..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="p-4 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 outline-none focus:border-brand-navy w-full md:w-96 text-sm shadow-sm font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredModels.map(model => (
                                <ModelCard
                                    key={model.id}
                                    model={model}
                                    onClick={() => {}}
                                    userMode="client"
                                    onViewLarger={(e) => { e.stopPropagation(); setLightboxData({ images: model.imageUrls, startIndex: 0 }); }}
                                    onStartOrder={(e) => { e.stopPropagation(); setOrderingModel(model); }}
                                />
                            ))}
                        </div>

                        {filteredModels.length === 0 && (
                            <div className="text-center py-32 bg-stone-50 dark:bg-stone-900/50 rounded-[50px] border-4 border-dashed border-stone-200 dark:border-stone-800">
                                <p className="text-stone-400 font-black text-2xl uppercase tracking-tighter">Aucune création exposée pour le moment</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'infos' && (
                    <div className="bg-white dark:bg-stone-800 rounded-[24px] p-8 shadow-sm">
                        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-4">À propos de l'atelier</h3>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{atelier.data.managerProfile.description || 'Description non disponible.'}</p>
                        <div className="mt-6 text-sm text-stone-500">Type: {atelier.data.managerProfile.atelierType || '—'}</div>
                    </div>
                )}

                {activeTab === 'avis' && (
                    <div className="bg-white dark:bg-stone-800 rounded-[24px] p-8 shadow-sm">
                        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-4">Avis</h3>
                        <p className="text-stone-500">Pas encore d'avis publics pour cet atelier.</p>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="bg-white dark:bg-stone-800 rounded-[24px] p-8 shadow-sm">
                        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-4">Contact</h3>
                        <p className="text-stone-600">Responsable: {atelier.data.managerProfile.name || atelier.name}</p>
                        <p className="text-stone-600">Email: {atelier.managerEmail || 'Non renseigné'}</p>
                    </div>
                )}
            </div>

            {orderingModel && (
                <ShowroomOrderModal
                    model={orderingModel}
                    onClose={() => setOrderingModel(null)}
                    onPlaceOrder={(clientInfo) => handlePlaceOrder(orderingModel, clientInfo)}
                />
            )}

            {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}
            
            {confirmationMessage && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={() => setConfirmationMessage(null)}>
                     <div className="bg-white dark:bg-stone-800 rounded-[40px] p-12 text-center max-w-md shadow-2xl border-4 border-green-500/20">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter">C'est envoyé !</h3>
                        <p className="mt-4 text-stone-500 dark:text-stone-400 font-medium leading-relaxed">{confirmationMessage}</p>
                        <button onClick={() => setConfirmationMessage(null)} className="mt-10 w-full px-8 py-4 bg-stone-900 text-white dark:bg-white dark:text-stone-900 rounded-2xl font-black transition-transform hover:scale-105">FERMER</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicAtelierView;
