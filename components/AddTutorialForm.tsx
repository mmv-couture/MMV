import React, { useState } from 'react';
import PageLayout from './PageLayout';
import { useToast } from '../context/ToastContext';
import type { Tutoriel } from '../types';

interface AddTutorialFormProps {
  onAdd: (tutorial: Tutoriel) => void;
  existingTutorials?: Tutoriel[];
}

const AddTutorialForm: React.FC<AddTutorialFormProps> = ({ onAdd, existingTutorials = [] }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Techniques de couture' as const,
    duration: '10 min',
    description: '',
    imageUrl: '',
    videoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('youtube.com') || 
             urlObj.hostname.includes('youtu.be') ||
             url.includes('/embed/');
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.title.trim()) {
      error('Le titre est requis');
      setIsSubmitting(false);
      return;
    }

    if (!formData.videoUrl.trim()) {
      error('L\'URL YouTube est requise');
      setIsSubmitting(false);
      return;
    }

    if (!validateYouTubeUrl(formData.videoUrl)) {
      error('Veuillez entrer une URL YouTube valide');
      setIsSubmitting(false);
      return;
    }

    if (!formData.imageUrl.trim()) {
      error('L\'URL de l\'image est requise');
      setIsSubmitting(false);
      return;
    }

    // Create tutorial
    const newTutorial: Tutoriel = {
      id: `tutorial-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    onAdd(newTutorial);
    success('Tutoriel ajouté avec succès!');
    
    // Reset form
    setFormData({
      title: '',
      category: 'Techniques de couture',
      duration: '10 min',
      description: '',
      imageUrl: '',
      videoUrl: '',
    });
    setIsSubmitting(false);
  };

  return (
    <PageLayout title="Ajouter un Tutoriel" subtitle="Partagez une nouvelle vidéo de tutoriel avec tous les ateliers">
      <div className="max-w-full sm:max-w-2xl mx-auto px-4 sm:px-0">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Titre du Tutoriel *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Comment prendre des mesures précises"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="Prise de mesures">Prise de mesures</option>
              <option value="Découpe">Découpe</option>
              <option value="Techniques de couture">Techniques de couture</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Durée *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 15 min"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez le contenu du tutoriel..."
              rows={4}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Lien YouTube *
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtu.be/VIDEO_ID ou https://youtube.com/watch?v=VIDEO_ID"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              💡 Copie l'URL de la page YouTube ou du lien court youtu.be
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              URL de la Miniature *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://exemple.com/image.jpg"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              💡 YouTube génère automatiquement : https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Ajout en cours...' : '➕ Ajouter le Tutoriel'}
            </button>
          </div>
        </form>

        {/* Recent tutorials */}
        {existingTutorials.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              Tutoriels Récents ({existingTutorials.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {existingTutorials.slice(-4).map(tut => (
                <div key={tut.id} className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-stone-800 dark:text-stone-100">{tut.title}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{tut.category} • {tut.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AddTutorialForm;
