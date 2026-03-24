import React from 'react';

type TabKey = 'catalogue' | 'infos' | 'avis' | 'contact';

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'catalogue', label: 'Catalogue' },
  { key: 'infos', label: "Informations" },
  { key: 'avis', label: 'Avis' },
  { key: 'contact', label: 'Contact' },
];

const PublicAtelierNavigation: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3 overflow-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              active === tab.key
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-navy/80 hover:bg-brand-navy/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="text-sm text-slate-500">Sélectionnez une section de l'atelier</div>
    </div>
  );
};

export default PublicAtelierNavigation;
