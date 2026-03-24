import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { useToast } from '../context/ToastContext';
import type { Tutoriel } from '../types';

const AdminTutorialsManager: React.FC = () => {
  const { success, error } = useToast();
  const [tutorials, setTutorials] = useState<Tutoriel[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Techniques de couture' as const,
    duration: '10 min',
    description: '',
    imageUrl: '',
    videoUrl: '',
  });

  // Load tutorials from localStorage (shared across all ateliers)
  useEffect(() => {
    const stored = localStorage.getItem('mmv_tutorials');
    if (stored) {
      try {
        setTutorials(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading tutorials:', e);
      }
    }
  }, []);

  // Save tutorials to localStorage
  const saveTutorials = (updatedTutorials: Tutoriel[]) => {
    localStorage.setItem('mmv_tutorials', JSON.stringify(updatedTutorials));
    setTutorials(updatedTutorials);
  };

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

    let updatedTutorials: Tutoriel[];

    if (editingId) {
      // Edit existing
      updatedTutorials = tutorials.map(t =>
        t.id === editingId
          ? { ...t, ...formData, createdAt: t.createdAt }
          : t
      );
      success('Tutoriel modifié avec succès!');
      setEditingId(null);
    } else {
      // Add new
      const newTutorial: Tutoriel = {
        id: `tutorial-${Date.now()}`,
        ...formData,
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
      };
      updatedTutorials = [...tutorials, newTutorial];
      success('Tutoriel ajouté avec succès!');
    }

    saveTutorials(updatedTutorials);

    // Reset form
    setFormData({
      title: '',
      category: 'Techniques de couture',
      duration: '10 min',
      description: '',
      imageUrl: '',
      videoUrl: '',
    });
    setIsFormOpen(false);
    setIsSubmitting(false);
  };

  const handleEdit = (tutorial: Tutoriel) => {
    setFormData({
      title: tutorial.title,
      category: tutorial.category,
      duration: tutorial.duration,
      description: tutorial.description,
      imageUrl: tutorial.imageUrl,
      videoUrl: tutorial.videoUrl,
    });
    setEditingId(tutorial.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tutoriel?')) {
      const updated = tutorials.filter(t => t.id !== id);
      saveTutorials(updated);
      success('Tutoriel supprimé');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Techniques de couture',
      duration: '10 min',
      description: '',
      imageUrl: '',
      videoUrl: '',
    });
  };

  return (
    <PageLayout 
      title="Gestion des Tutoriels" 
      subtitle="Ajoutez et gérez les tutoriels vidéo accessibles à tous les ateliers"
    >
      <div className="space-y-8">
        {/* Add Button */}
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>➕</span> Ajouter un Tutoriel
          </button>
        )}

        {/* Form */}
        {isFormOpen && (
          <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
              {editingId ? 'Modifier le Tutoriel' : 'Ajouter un Nouveau Tutoriel'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Comment prendre des mesures"
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

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Lien YouTube *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtu.be/VIDEO_ID"
                    className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    URL Miniature *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
                    className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg dark:bg-stone-700 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
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

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Sauvegarde...' : editingId ? '✏️ Modifier' : '➕ Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tutorials List */}
        <div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
            Tutoriels en Ligne ({tutorials.length})
          </h2>

          {tutorials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tutorials.map(tutorial => (
                <div
                  key={tutorial.id}
                  className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={tutorial.imageUrl}
                      alt={tutorial.title}
                      className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                        {tutorial.category} • {tutorial.duration}
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                        {tutorial.description}
                      </p>
                      {tutorial.createdAt && (
                        <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                          Ajouté: {new Date(tutorial.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                    <button
                      onClick={() => handleEdit(tutorial)}
                      className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(tutorial.id)}
                      className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 dark:bg-stone-800/50 p-8 rounded-lg text-center">
              <p className="text-stone-600 dark:text-stone-400">
                Aucun tutoriel pour le moment. Cliquez sur "Ajouter un Tutoriel" pour commencer.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            ℹ️ <strong>Les tutoriels ajoutés ici sont automatiquement visibles par tous les ateliers</strong> dans la page "Tutoriels & Guides".
          </p>
          <p className="text-blue-700 dark:text-blue-400 text-sm mt-2">
            Les données sont synchronisées via le navigateur. Tous les ateliers accèdent à la même liste.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminTutorialsManager;
