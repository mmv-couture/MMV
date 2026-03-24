import React, { useState } from 'react';
import type { Modele, UserMode, Page } from '../types';
import PageLayout from '../components/PageLayout';
import ModelCard from '../components/ModelCard';
import { FavorisIcon } from '../components/icons';
import ModelDetail from './ModelDetail';
import ImageLightbox from '../components/ImageLightbox';

interface FavorisProps {
    models: Modele[];
    favoriteIds: string[];
    onToggleFavorite: (modelId: string) => void;
    userMode: UserMode;
    onStartOrder: (model: Modele) => void;
    setCurrentPage?: (page: Page) => void;
}

const Favoris: React.FC<FavorisProps> = ({ models, favoriteIds, onToggleFavorite, userMode, onStartOrder, setCurrentPage }) => {
    const [selectedModel, setSelectedModel] = useState<Modele | null>(null);
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    const favoritedModels = models.filter(model => favoriteIds.includes(model.id));

    return (
        <PageLayout
          title="Modèles Favoris"
          subtitle="Retrouvez ici toutes vos inspirations sauvegardées."
          onBack={() => setCurrentPage?.('accueil')}
          showBackButton={true}
          maxWidth="2xl"
        >
            <div className="space-y-6">
                {favoritedModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoritedModels.map(model => (
                            <ModelCard
                                key={model.id}
                                model={model}
                                onClick={() => setSelectedModel(model)}
                                isFavorite={true}
                                onToggleFavorite={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(model.id);
                                }}
                                onViewLarger={(e) => {
                                    e.stopPropagation();
                                    if (model.imageUrls && model.imageUrls.length > 0) {
                                        setLightboxData({ images: model.imageUrls, startIndex: 0 });
                                    }
                                }}
                                userMode={userMode}
                                onStartOrder={(e) => {
                                    e.stopPropagation();
                                    onStartOrder(model);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                        <FavorisIcon className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500" />
                        <h3 className="mt-4 text-lg font-medium text-stone-900 dark:text-stone-100">Aucun favori pour le moment</h3>
                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Cliquez sur le cœur sur un modèle pour l'ajouter ici.</p>
                    </div>
                )}
            </div>

            {selectedModel && (
                <ModelDetail 
                    model={selectedModel} 
                    onClose={() => setSelectedModel(null)} 
                    isFavorite={favoriteIds.includes(selectedModel.id)}
                    onToggleFavorite={() => onToggleFavorite(selectedModel.id)}
                    userMode={userMode}
                    onStartOrder={() => onStartOrder(selectedModel)}
                />
            )}
             {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}
        </PageLayout>
    );
};

export default Favoris;
