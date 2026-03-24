import React from 'react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useFormValidation, type FieldValidators } from '../hooks/useFormValidation';
import { useToastNotification } from '../hooks/useToastNotification';
import type { Client } from '../types';

/**
 * Professional Add Client Form Component
 * Uses Flutter-style validation and Material Design
 * 
 * Example of how to use the new form validation system
 */

const measurementLabels: { [key: string]: string } = {
  poitrine: 'Poitrine',
  taille: 'Taille',
  hanche: 'Hanche',
  longueur: 'Longueur',
  epaule: 'Épaule',
  bras: 'Bras',
};

interface AddClientFormValues {
  name: string;
  phone: string;
  email: string;
  poitrine: string;
  taille: string;
  hanche: string;
  longueur: string;
  epaule: string;
  bras: string;
  observation: string;
}

const validators: FieldValidators = {
  name: [
    {
      validate: (value: string) => value.trim().length >= 2,
      message: 'Le nom doit contenir au moins 2 caractères'
    },
    {
      validate: (value: string) => value.trim().length <= 100,
      message: 'Le nom ne doit pas dépasser 100 caractères'
    }
  ],
  phone: [
    {
      validate: (value: string) => /^[0-9+\s-()]*$/.test(value),
      message: 'Numéro de téléphone invalide'
    },
    {
      validate: (value: string) => value.trim().length >= 9,
      message: 'Le téléphone doit contenir au moins 9 chiffres'
    }
  ],
  email: [
    {
      validate: (value: string) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Adresse email invalide'
    }
  ],
  poitrine: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'La poitrine doit être un nombre valide'
    }
  ],
  taille: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'La taille doit être un nombre valide'
    }
  ],
  hanche: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'La hanche doit être un nombre valide'
    }
  ],
  longueur: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'La longueur doit être un nombre valide'
    }
  ],
  epaule: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'L\'épaule doit être un nombre valide'
    }
  ],
  bras: [
    {
      validate: (value: string) => value === '' || /^\d+(\.\d{1,2})?$/.test(value),
      message: 'Le bras doit être un nombre valide'
    }
  ]
};

interface AddClientFormProProps {
  onAddClient: (client: Omit<Client, 'id'>) => Promise<void> | void;
  onCancel: () => void;
}

const AddClientFormPro: React.FC<AddClientFormProProps> = ({ onAddClient, onCancel }) => {
  const toast = useToastNotification();

  const initialValues: AddClientFormValues = {
    name: '',
    phone: '',
    email: '',
    poitrine: '',
    taille: '',
    hanche: '',
    longueur: '',
    epaule: '',
    bras: '',
    observation: ''
  };

  const handleSubmit = async (values: AddClientFormValues) => {
    try {
      const numericMeasurements: { [key: string]: number } = {};
      
      // Convert measurements to numbers
      Object.keys(measurementLabels).forEach(key => {
        const value = values[key as keyof Omit<AddClientFormValues, 'name' | 'phone' | 'email' | 'observation'>];
        if (value) {
          numericMeasurements[key] = Number(value);
        }
      });

      const newClient: Omit<Client, 'id'> = {
        name: values.name,
        phone: values.phone,
        phonePrefix: '+225',
        email: values.email || undefined,
        measurements: {
          ...numericMeasurements,
          observation: values.observation || undefined
        },
        lastSeen: 'Aujourd\'hui'
      };

      await onAddClient(newClient);
      toast.success('Client ajouté avec succès');
      form.resetForm();
      onCancel();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout du client';
      toast.error(message);
    }
  };

  const form = useFormValidation(initialValues, validators, handleSubmit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Ajouter un Client</h2>
          <button
            onClick={onCancel}
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={form.handleSubmit} className="p-6 space-y-6">
          {/* Section: Infos Personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nom complet *"
                placeholder="Jean Dupont"
                hint="Nom et prénoms du client"
                {...form.getFieldProps('name')}
              />
              <FormField
                label="Téléphone *"
                type="tel"
                placeholder="+225 XX XX XX XX"
                hint="Numéro de contact du client"
                {...form.getFieldProps('phone')}
              />
              <FormField
                label="Email"
                type="email"
                placeholder="jean@example.com"
                hint="Adresse email (optionnel)"
                className="md:col-span-2"
                {...form.getFieldProps('email')}
              />
            </div>
          </div>

          {/* Section: Mesures */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              Mesures (en cm)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(measurementLabels).map(([key, label]) => (
                <FormField
                  key={key}
                  label={label}
                  type="number"
                  placeholder="0.00"
                  step="0.1"
                  hint={`${label} en centimètres`}
                  {...form.getFieldProps(key as keyof AddClientFormValues)}
                />
              ))}
            </div>
          </div>

          {/* Section: Observations */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Observations
            </label>
            <textarea
              placeholder="Ajouter des notes spéciales sur ce client..."
              value={(form.formState as any).observation?.value || ''}
              onChange={(e) => form.handleChange('observation', e.target.value)}
              onBlur={() => form.handleBlur('observation')}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 transition-all duration-200"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onCancel}
              type="button"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              isLoading={form.isSubmitting}
              loadingText="Ajout en cours..."
              disabled={!form.isValid || form.isSubmitting}
            >
              Ajouter le client
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientFormPro;
