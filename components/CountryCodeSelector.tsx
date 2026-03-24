
import React from 'react';

export const COUNTRY_CODES = [
    { code: '+225', country: 'CI', name: 'Côte d\'Ivoire' },
    { code: '+221', country: 'SN', name: 'Sénégal' },
    { code: '+223', country: 'ML', name: 'Mali' },
    { code: '+226', country: 'BF', name: 'Burkina Faso' },
    { code: '+228', country: 'TG', name: 'Togo' },
    { code: '+229', country: 'BJ', name: 'Bénin' },
    { code: '+237', country: 'CM', name: 'Cameroun' },
    { code: '+241', country: 'GA', name: 'Gabon' },
    { code: '+242', country: 'CG', name: 'Congo' },
    { code: '+243', country: 'CD', name: 'RDC' },
    { code: '+33', country: 'FR', name: 'France' },
];

interface CountryCodeSelectorProps {
    value: string;
    onChange: (code: string) => void;
    className?: string;
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ value, onChange, className }) => {
    return (
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className={`bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-l-md px-2 text-sm focus:ring-orange-500 focus:border-orange-500 ${className}`}
        >
            {COUNTRY_CODES.map((c) => (
                <option key={c.country} value={c.code}>
                    {c.country} ({c.code})
                </option>
            ))}
        </select>
    );
};

export default CountryCodeSelector;
