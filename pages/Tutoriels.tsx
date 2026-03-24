import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import type { Tutoriel } from '../types';

const TutorialCard: React.FC<{ tutorial: Tutoriel; onClick: () => void }> = ({ tutorial, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl flex flex-col cursor-pointer hover:scale-[1.02]"
  >
    <div className="relative aspect-video">
      <img 
        className="w-full h-full object-cover group-hover:brightness-75 transition-all" 
        src={tutorial.imageUrl} 
        alt={tutorial.title}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/e2e8f0/78350f?text=Tutoriel'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-orange-600 rounded-full p-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <span className="absolute top-3 right-3 bg-orange-900 text-white text-xs font-bold px-2 py-1 rounded">
        {tutorial.duration}
      </span>
    </div>
    <div className="p-5 flex-grow flex flex-col">
      <p className="text-sm font-semibold text-orange-800 dark:text-orange-400 uppercase tracking-wider">{tutorial.category}</p>
      <h3 className="mt-1 text-lg font-bold text-stone-800 dark:text-stone-100 leading-tight flex-grow">{tutorial.title}</h3>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 line-clamp-2">{tutorial.description}</p>
      
      {tutorial.createdAt && (
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
          Ajouté: {new Date(tutorial.createdAt).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  </div>
);

interface TutorielsProps {
  tutoriels: Tutoriel[];
}

const Tutoriels: React.FC<TutorielsProps> = ({ tutoriels: propTutoriels }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutoriel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [allTutoriels, setAllTutoriels] = useState<Tutoriel[]>(propTutoriels || []);

  // Load shared tutorials from localStorage
  useEffect(() => {
    try {
      const fromStorage = localStorage.getItem('mmv_tutorials');
      if (fromStorage) {
        const sharedTutoriels = JSON.parse(fromStorage) as Tutoriel[];
        const allTutorials = [...(propTutoriels || []), ...sharedTutoriels];
        const uniqueMap = new Map<string, Tutoriel>();
        allTutorials.forEach(t => {
          if (!uniqueMap.has(t.id)) {
            uniqueMap.set(t.id, t);
          }
        });
        setAllTutoriels(Array.from(uniqueMap.values()));
      }
    } catch (err) {
      console.warn('Error loading shared tutorials:', err);
      setAllTutoriels(propTutoriels || []);
    }
  }, [propTutoriels]);

  // Check for pending tutorial from notification
  useEffect(() => {
    try {
      const pendingTutorial = localStorage.getItem('mmv_pending_tutorial');
      if (pendingTutorial) {
        const tutorialData = JSON.parse(pendingTutorial);
        // Find the tutorial in the list
        const tutorial = allTutoriels.find(t => t.videoUrl === tutorialData.videoUrl || t.id === tutorialData.tutorialId);
        if (tutorial) {
          setSelectedTutorial(tutorial);
          setIsFullscreen(true);
        }
        // Clear the pending tutorial
        localStorage.removeItem('mmv_pending_tutorial');
      }
    } catch (err) {
      console.warn('Error loading pending tutorial:', err);
    }
  }, [allTutoriels]);

  const tutoriels = allTutoriels;

  const categories = ['Prise de mesures', 'Découpe', 'Techniques de couture'];
  const filteredTutoriels = filterCategory 
    ? tutoriels.filter(t => t.category === filterCategory)
    : tutoriels;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Guides & Tutoriels</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Perfectionnez vos techniques avec nos guides vidéo pas-à-pas.</p>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            filterCategory === null
              ? 'bg-orange-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          Tous ({tutoriels.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {cat} ({tutoriels.filter(t => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredTutoriels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTutoriels.map(tutorial => (
            <TutorialCard 
              key={tutorial.id} 
              tutorial={tutorial}
              onClick={() => {
                setSelectedTutorial(tutorial);
                setIsFullscreen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-500 dark:text-stone-400 text-lg">
            Aucun tutoriel trouvé dans cette catégorie.
          </p>
        </div>
      )}

      {/* Video Modal */}
      {selectedTutorial && isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">{selectedTutorial.title}</h2>
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setSelectedTutorial(null);
                }}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VideoPlayer 
              videoUrl={selectedTutorial.videoUrl}
              title={selectedTutorial.title}
              fullscreen={true}
              onClose={() => {
                setIsFullscreen(false);
                setSelectedTutorial(null);
              }}
            />
            <div className="mt-4 bg-white dark:bg-stone-800 p-4 rounded-lg">
              <p className="text-stone-800 dark:text-stone-200">{selectedTutorial.description}</p>
              <div className="mt-3 flex gap-4 text-sm text-stone-600 dark:text-stone-400">
                <span>📁 {selectedTutorial.category}</span>
                <span>⏱️ {selectedTutorial.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutoriels;