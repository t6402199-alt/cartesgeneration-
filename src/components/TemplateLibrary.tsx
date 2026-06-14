/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Heart, Sparkles, Filter, ShieldCheck, CreditCard, Award, HeartHandshake, BookOpen } from 'lucide-react';
import { CardTemplate } from '../types';
import { TEMPLATES, COUNTRY_LOGOS } from '../templatesData';

interface TemplateLibraryProps {
  onSelect: (template: CardTemplate) => void;
  selectedTemplateId: string;
}

export default function TemplateLibrary({ onSelect, selectedTemplateId }: TemplateLibraryProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'id' | 'permit' | 'health' | 'badge' | 'academic'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Tous les modèles', icon: CreditCard },
    { key: 'id', label: "Identité / ID", icon: ShieldCheck },
    { key: 'permit', label: 'Permis', icon: Award },
    { key: 'health', label: 'Santé', icon: HeartHandshake },
    { key: 'badge', label: 'Badges pro', icon: Sparkles },
    { key: 'academic', label: 'Universitaire', icon: BookOpen },
  ];

  const countries = [
    { code: 'all', label: 'Tous les pays', flag: '🗺️' },
    { code: 'FR', label: 'France', flag: '🇫🇷' },
    { code: 'DE', label: 'Allemagne', flag: '🇩🇪' },
    { code: 'ES', label: 'Espagne', flag: '🇪🇸' },
    { code: 'IT', label: 'Italie', flag: '🇮🇹' },
    { code: 'BE', label: 'Belgique', flag: '🇧🇪' },
    { code: 'PT', label: 'Portugal', flag: '🇵🇹' },
    { code: 'CH', label: 'Suisse', flag: '🇨🇭' },
    { code: 'NL', label: 'Pays-Bas', flag: '🇳🇱' },
    { code: 'AT', label: 'Autriche', flag: '🇦🇹' },
    { code: 'PL', label: 'Pologne', flag: '🇵🇱' },
    { code: 'IE', label: 'Irlande', flag: '🇮🇪' },
    { code: 'CA', label: 'Canada', flag: '🇨🇦' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesSearch = 
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tpl.countryName.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
    const matchesCountry = selectedCountry === 'all' || tpl.countryCode === selectedCountry;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  return (
    <div className="space-y-4" id="template-library-section">
      {/* Country Selection Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 shadow-sm">
        <label className="text-xs font-black text-slate-700 block uppercase tracking-wide flex items-center gap-1.5">
          <span>🌍</span> 1. Sélectionner un pays (Seuls les formats administratifs officiels s'affichent)
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelectedCountry(c.code)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                selectedCountry === c.code
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/50'
              }`}
            >
              <span className="text-sm">{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Categories Header */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé (ex: CNI, permis...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Filter categories pill lists */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key as any)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="templates-grid">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((tpl) => {
            const logo = COUNTRY_LOGOS[tpl.countryCode] || { flag: '🗺️' };
            const isSelected = selectedTemplateId === tpl.id;
            const isVertical = tpl.dimensions.height > tpl.dimensions.width;

            return (
              <div
                key={tpl.id}
                onClick={() => onSelect(tpl)}
                className={`group relative overflow-hidden rounded-xl border bg-white p-4 cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Visual Accent Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                  style={{ background: tpl.defaultColors.primary }}
                />

                {/* Country tag and category badge */}
                <div className="flex items-center justify-between pl-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl" role="img" aria-label={tpl.countryName}>
                      {logo.flag}
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                      {tpl.countryCode}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                    {tpl.category}
                  </span>
                </div>

                {/* Main description */}
                <div className="pl-2 flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition truncate">
                    {tpl.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                {/* Visual miniature representation */}
                <div className="pl-2 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>Aspect:</span>
                    <span>{isVertical ? 'Portrait (Badge)' : 'Paysage (Carte)'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                    isSelected 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                  }`}>
                    {isSelected ? 'Sélectionné' : 'Choisir ce modèle'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 border border-slate-200/50 rounded-xl">
            <p className="text-slate-500 text-xs">Aucun modèle de carte ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); }}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Effacer tous les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
