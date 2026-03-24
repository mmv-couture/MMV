
import React, { useState } from 'react';
import type { Modele, UserMode } from '../types';
import { ExpandIcon } from './icons';
import { useDoubleTap, useLongPress } from '../utils/navigationHooks';
import ContextMenu from './ContextMenu';

interface ModelCardProps {
    model: Modele;
    onClick: () => void;
    isModelOfTheMonth?: boolean;
    onSetModelOfTheMonth?: (event: React.MouseEvent) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (event: React.MouseEvent) => void;
    onViewLarger?: (event: React.MouseEvent) => void;
    userMode: UserMode;
    onStartOrder?: (event: React.MouseEvent) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick, isModelOfTheMonth, onSetModelOfTheMonth, isFavorite, onToggleFavorite, onViewLarger, userMode, onStartOrder }) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [localFavorite, setLocalFavorite] = useState(isFavorite || false);

    // Double-tap to toggle favorite
    const { onTap: handleDoubleTap } = useDoubleTap({
        onDoubleTap: () => {
            setLocalFavorite(!localFavorite);
            if (onToggleFavorite) {
                onToggleFavorite({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
            }
        }
    });

    // Long-press to show context menu
    const { onTouchStart, onTouchEnd, onTouchMove } = useLongPress({
        duration: 500,
        onLongPress: () => {
            // Get element position for menu
            const rect = document.getElementById(`model-${model.id}`)?.getBoundingClientRect();
            if (rect) {
                setContextMenu({ x: rect.left + rect.width / 2, y: rect.top });
            }
        }
    });

    const contextMenuOptions = [
        {
            label: localFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris',
            icon: localFavorite ? '❤️' : '🤍',
            action: () => {
                setLocalFavorite(!localFavorite);
                if (onToggleFavorite) {
                    onToggleFavorite({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
                }
            }
        },
        {
            label: 'Partager',
            icon: '📤',
            action: () => {
                if (navigator.share) {
                    navigator.share({
                        title: model.title,
                        text: `Découvrez ce design: ${model.title}`,
                        url: window.location.href
                    });
                }
            }
        },
        ...(userMode === 'client' && onStartOrder ? [
            {
                label: 'Commander',
                icon: '🛍️',
                action: () => {
                    if (onStartOrder) {
                        onStartOrder({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
                    }
                }
            }
        ] : [])
    ];

    return (
        <>
            <div 
                className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden group transition-all hover:shadow-lg flex flex-col cursor-pointer h-full"
                id={`model-${model.id}`}
                onClick={handleDoubleTap}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
            >
                {/* Image Container - Aspect ratio fixe pour éviter les coupures */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={model.imageUrls?.[0] || 'https://placehold.co/400x500/e2e8f0/1e3a8a?text=Design'}
                      alt={model.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Double-tap indicator */}
                    <div className="absolute top-4 right-4 text-xs bg-blue-500/90 text-white px-2 py-1 rounded-full opacity-0 group-active:opacity-100 transition-opacity">
                        ❤️ Double-tap
                    </div>
                    
                    {/* Star Button */}
                    {onSetModelOfTheMonth && (
                        <button
                            onClick={onSetModelOfTheMonth}
                            className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all transform hover:scale-110 ${isModelOfTheMonth ? 'bg-brand-orange text-white shadow-lg' : 'bg-white/90 text-slate-700 shadow-sm hover:bg-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </button>
                    )}
                    
                    {/* Expand Button */}
                    {onViewLarger && (
                      <button onClick={onViewLarger} className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <div className="bg-white/90 p-3 rounded-full shadow-lg">
                          <ExpandIcon className="w-6 h-6 text-slate-900" />
                        </div>
                      </button>
                    )}
                </div>
                
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="text-[11px] font-black text-brand-slate uppercase tracking-tighter line-clamp-1 mb-1 italic">{model.title}</h3>
                  <div className="flex justify-between items-center mt-auto">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{model.genre}</span>
        <span className="text-[9px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded font-black border border-slate-100 uppercase">{model.difficulty}</span>
      </div>
    </div>
    {userMode === 'client' && onStartOrder && (
        <div className="px-3 pb-3">
            <button onClick={onStartOrder} className="w-full py-2 bg-brand-navy text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-brand-slate transition-colors shadow-sm">COMMANDER</button>
        </div>
    )}
            </div>

            {/* Heart feedback animation */}
            {localFavorite && (
                <div className="fixed pointer-events-none text-4xl animate-bounce" style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    ❤️
                </div>
            )}

            {/* Context Menu */}
            <ContextMenu
                isOpen={!!contextMenu}
                position={contextMenu || { x: 0, y: 0 }}
                options={contextMenuOptions}
                onClose={() => setContextMenu(null)}
            />
        </>
    );
};

export default ModelCard;
