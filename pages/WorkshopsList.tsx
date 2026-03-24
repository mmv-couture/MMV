
import React, { useState, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Page } from '../types';
import { ChevronRightIcon } from '../components/icons';

interface WorkshopsListProps {
    onNavigate: (page: Page, params?: any) => void;
}

const WorkshopsList: React.FC<WorkshopsListProps> = ({ onNavigate }) => {
    const { getAllAteliersWithManager } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const ateliers = getAllAteliersWithManager();

    const filteredAteliers = useMemo(() => {
        return ateliers.filter(a => 
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.data.managerProfile.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [ateliers, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-16">
            <div className="text-center space-y-4 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Artisans Partenaires</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">Découvrez l'élite de la couture africaine, digitalisée pour votre confort.</p>
                
                <div className="relative max-w-lg mx-auto mt-10">
                    <input 
                        type="text" 
                        placeholder="Chercher un atelier (ex: Broderie, Dakar...)" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full p-4 pl-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 font-medium"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {filteredAteliers.map(atelier => (
                    <div 
                        key={atelier.id} 
                        onClick={() => onNavigate('publicAtelier', { atelierId: atelier.id })}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-slate-100 dark:border-slate-800 flex flex-col group h-full"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <img 
                                src={atelier.data.managerProfile.avatarUrl} 
                                className="w-16 h-16 rounded-xl object-cover border border-slate-50 dark:border-slate-700" 
                                alt={atelier.name} 
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{atelier.name}</h3>
                                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{atelier.data.managerProfile.specialization || 'Mode Mixte'}</p>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                            "{atelier.data.managerProfile.description || "Un atelier dédié à l'élégance et au sur-mesure pour sublimer votre style."}"
                        </p>
                        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {atelier.data.managerProfile.atelierType || 'Professionnel'}
                            </span>
                            <div className="flex items-center gap-1 text-blue-700 font-bold text-xs uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                                Visiter <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkshopsList;
