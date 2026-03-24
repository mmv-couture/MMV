
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { SiteContent, PageBlock, BlockType, HeroBlock, ContentBlock } from '../types';
import { compressImage } from '../utils/image';
import { EditIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, SettingsIcon, ExpandIcon } from './icons';

const HeroEditor: React.FC<{ block: HeroBlock, onChange: (b: HeroBlock) => void }> = ({ block, onChange }) => {
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = await compressImage(file, { maxWidth: 1920, quality: 0.8 });
            onChange({ ...block, imageUrl });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Titre Impactant</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-5 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-black text-xl" />
            </div>
            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Sous-titre descriptif</label>
                <textarea value={block.subtitle} onChange={e => onChange({ ...block, subtitle: e.target.value })} className="w-full p-5 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 text-stone-500 font-medium" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black uppercase text-stone-400 mb-2">Alignement du texte</label>
                    <select value={block.align} onChange={e => onChange({ ...block, align: e.target.value as any })} className="w-full p-4 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-bold">
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-black uppercase text-stone-400 mb-2">Texte du Bouton</label>
                    <input type="text" value={block.buttonText} onChange={e => onChange({ ...block, buttonText: e.target.value })} className="w-full p-4 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-bold" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Image de fond (Pleine résolution)</label>
                <div className="flex gap-6 items-center p-6 bg-stone-50 dark:bg-stone-900 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800">
                    <input type="file" onChange={handleImageChange} className="text-xs" />
                    {block.imageUrl && <img src={block.imageUrl} className="h-24 w-44 object-cover rounded-xl shadow-2xl border-4 border-white" alt="Preview" />}
                </div>
            </div>
        </div>
    );
};

const ContentEditor: React.FC<{ block: ContentBlock, onChange: (b: ContentBlock) => void }> = ({ block, onChange }) => {
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = await compressImage(file, { maxWidth: 1200, quality: 0.8 });
            onChange({ ...block, imageUrl });
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black uppercase text-stone-400 mb-2">Disposition Image</label>
                    <select value={block.layout} onChange={e => onChange({ ...block, layout: e.target.value as any })} className="w-full p-4 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-bold">
                        <option value="image-left">Image à Gauche</option>
                        <option value="image-right">Image à Droite</option>
                        <option value="image-top">Image en Haut</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-black uppercase text-stone-400 mb-2">Taille de l'Image</label>
                    <select value={block.imageSize} onChange={e => onChange({ ...block, imageSize: e.target.value as any })} className="w-full p-4 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-bold">
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                        <option value="full">Largeur Totale</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Titre de la Section</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-5 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 font-black text-xl" />
            </div>

            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Taille du Texte</label>
                <div className="flex gap-4">
                    <button onClick={() => onChange({...block, textSize: 'normal'})} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs ${block.textSize === 'normal' ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-stone-100'}`}>NORMAL</button>
                    <button onClick={() => onChange({...block, textSize: 'large'})} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs ${block.textSize === 'large' ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-stone-100'}`}>TRÈS GROS</button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Contenu Textuel</label>
                <textarea value={block.text} onChange={e => onChange({ ...block, text: e.target.value })} className="w-full p-5 border-2 border-stone-100 dark:border-stone-700 rounded-2xl dark:bg-stone-900 text-stone-600 font-medium" rows={6} />
            </div>

            <div>
                <label className="block text-xs font-black uppercase text-stone-400 mb-2">Visuel de Section</label>
                <div className="flex gap-6 items-center p-6 bg-stone-50 dark:bg-stone-900 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800">
                    <input type="file" onChange={handleImageChange} className="text-xs" />
                    {block.imageUrl && <img src={block.imageUrl} className="h-24 w-24 object-cover rounded-2xl shadow-xl" alt="Preview" />}
                </div>
            </div>
        </div>
    );
};

const SiteCustomization: React.FC = () => {
    const { getSiteContent, updateSiteContent } = useAuth();
    const [content, setContent] = useState<SiteContent>(getSiteContent());
    const [isSaving, setIsSaving] = useState(false);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

    const handleSave = () => {
        setIsSaving(true);
        updateSiteContent(content);
        setTimeout(() => { setIsSaving(false); alert("Design publié avec succès !"); }, 800);
    };

    const addBlock = (type: BlockType) => {
        const id = crypto.randomUUID();
        let newBlock: any = { id, type };
        
        if (type === 'hero') {
            newBlock = { ...newBlock, title: 'BIENVENUE', subtitle: 'Texte ici...', imageUrl: '', align: 'center', buttonText: 'Démarrer', buttonLink: 'register' };
        } else if (type === 'content') {
            newBlock = { ...newBlock, title: 'Nouvelle Section', text: 'Paragraphe...', imageUrl: '', layout: 'image-left', imageSize: 'medium', textSize: 'normal' };
        } else if (type === 'workshop-search') {
            newBlock = { ...newBlock };
        }

        setContent(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
        setEditingBlockId(id);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...content.blocks];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= newBlocks.length) return;
        [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
        setContent(prev => ({ ...prev, blocks: newBlocks }));
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center p-12 bg-stone-900 rounded-[50px] shadow-[0_20px_80px_rgba(0,0,0,0.3)] gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-white font-black text-4xl tracking-tighter uppercase mb-2">Studio Site Public</h3>
                    <p className="text-orange-400 font-bold uppercase tracking-[0.3em] text-xs">Architecte d'expérience No-Code</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="px-16 py-6 bg-orange-600 text-white rounded-3xl font-black text-xl hover:bg-orange-500 shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? "CHARGEMENT..." : "PUBLIER LE SITE"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-8 px-4">
                        <h4 className="font-black uppercase text-sm tracking-widest text-stone-400">Sections de Page</h4>
                        <div className="flex gap-3">
                             <button onClick={() => addBlock('hero')} className="px-5 py-2 bg-stone-200 dark:bg-stone-800 text-[10px] font-black rounded-2xl hover:bg-orange-600 hover:text-white transition-all">+ HERO</button>
                             <button onClick={() => addBlock('workshop-search')} className="px-5 py-2 bg-stone-200 dark:bg-stone-800 text-[10px] font-black rounded-2xl hover:bg-orange-600 hover:text-white transition-all">+ SEARCH</button>
                             <button onClick={() => addBlock('content')} className="px-5 py-2 bg-stone-200 dark:bg-stone-800 text-[10px] font-black rounded-2xl hover:bg-orange-600 hover:text-white transition-all">+ BLOC IMAGE/TEXTE</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {content.blocks.map((block, idx) => (
                            <div 
                                key={block.id} 
                                className={`p-8 rounded-[35px] border-4 transition-all flex items-center justify-between cursor-pointer ${editingBlockId === block.id ? 'border-orange-500 bg-white dark:bg-stone-800 shadow-2xl scale-[1.03]' : 'border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-900/50 hover:border-stone-200'}`}
                                onClick={() => setEditingBlockId(block.id)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 flex items-center justify-center bg-stone-950 text-white rounded-2xl text-lg font-black">{idx + 1}</div>
                                    <div>
                                        <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">{block.type}</p>
                                        <p className="font-black text-lg text-stone-800 dark:text-stone-100">{'title' in block ? block.title : 'Module Dynamique'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up'); }} className="p-2 text-stone-300 hover:text-orange-500"><ChevronUpIcon className="w-6 h-6"/></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down'); }} className="p-2 text-stone-300 hover:text-orange-500"><ChevronDownIcon className="w-6 h-6"/></button>
                                    <button onClick={(e) => { e.stopPropagation(); setContent(prev => ({...prev, blocks: prev.blocks.filter(b => b.id !== block.id)})); if(editingBlockId === block.id) setEditingBlockId(null); }} className="p-2 text-stone-300 hover:text-red-500"><TrashIcon className="w-6 h-6"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky top-10 h-fit bg-white dark:bg-stone-800 p-12 rounded-[50px] shadow-2xl border-4 border-stone-50 dark:border-stone-700 overflow-y-auto max-h-[85vh]">
                    {editingBlockId ? (
                        <div className="animate-fade-in">
                            <h4 className="font-black text-3xl mb-12 pb-8 border-b-2 border-stone-100 dark:border-stone-700 uppercase tracking-tighter">Paramètres</h4>
                            {(() => {
                                const b = content.blocks.find(x => x.id === editingBlockId);
                                if (!b) return null;
                                const handleChange = (updated: any) => { setContent(prev => ({ ...prev, blocks: prev.blocks.map(bl => bl.id === editingBlockId ? updated : bl) })); };
                                switch(b.type) {
                                    case 'hero': return <HeroEditor block={b} onChange={handleChange} />;
                                    case 'content': return <ContentEditor block={b} onChange={handleChange} />;
                                    default: return <p className="text-stone-400 font-black uppercase text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl">Ce module s'auto-configure.</p>;
                                }
                            })()}
                        </div>
                    ) : (
                        <div className="py-48 text-center space-y-8">
                            <div className="w-32 h-32 bg-stone-100 dark:bg-stone-900 rounded-[40px] flex items-center justify-center mx-auto text-stone-300 shadow-inner"><ExpandIcon className="w-16 h-16" /></div>
                            <h5 className="text-stone-400 font-black uppercase tracking-[0.2em] text-sm">Mode Édition Actif</h5>
                            <p className="text-xl text-stone-500 max-w-sm mx-auto leading-relaxed">Cliquez sur une section à gauche pour débloquer les commandes visuelles.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SiteCustomization;
