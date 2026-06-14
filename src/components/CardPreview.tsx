/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { User, Layers, Move, Shield } from 'lucide-react';
import { CardProject, CardTemplate, DragItemPosition } from '../types';
import { COUNTRY_LOGOS, generateTD1MRZ, SIGNATURE_FONTS } from '../templatesData';

interface CardPreviewProps {
  project: CardProject;
  template: CardTemplate;
  isEditMode: boolean; // Enables the drag-and-drop handles
  activeSide: 'recto' | 'verso'; // Recto or Verso toggle
  onUpdatePosition: (key: string, pos: DragItemPosition) => void;
  onUpdateCustomTextPosition: (id: string, x: number, y: number) => void;
}

export default function CardPreview({
  project,
  template,
  isEditMode,
  activeSide,
  onUpdatePosition,
  onUpdateCustomTextPosition,
}: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeDragItem, setActiveDragItem] = useState<{ type: 'field' | 'custom' | 'system'; id: string } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Get active country configuration or fallback
  const countryConfig = COUNTRY_LOGOS[project.countryCode] || COUNTRY_LOGOS['FR'];

  // Calculate MRZ lines dynamically for TD1 European standard (3 lines of 30 characters each)
  const mrzLines = generateTD1MRZ(
    countryConfig.countryCode3 || 'FRA',
    project.fields.doc_num || project.fields.dni_num || project.fields.cc_num || 'X4RTBPFW4',
    project.fields.nom || project.fields.primer_apellido || 'MARTIN',
    project.fields.prenoms || 'Maëlys-Gaëlle, Marie',
    project.fields.date_naissance || '1990-07-13',
    project.fields.sexe || project.fields.sex || 'F',
    project.fields.date_expiration || '2030-02-11'
  );

  const renderLeftFlag = (code: string) => {
    switch (code) {
      case 'FR':
        return (
          <div className="w-[34px] h-[21px] flex shrink-0 rounded-[2px] overflow-hidden border border-slate-350 relative shadow-sm">
            <div className="w-[38%] bg-[#00209F]" />
            <div className="w-[24%] bg-[#ffffff] relative flex overflow-visible">
              {/* Very high fidelity stylized Marianne face outline in white and blue/red */}
              <svg className="w-6 h-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-[#00209F] overflow-visible" viewBox="0 0 100 100" style={{ transform: 'translate(-50%, -50%) scale(1.18)' }}>
                {/* Silhouette profile face looking right */}
                <path d="M 30,10 C 45,5 55,15 55,25 C 55,30 45,35 48,45 C 50,55 60,52 65,58 C 70,64 68,72 65,75 C 60,80 40,82 35,76 C 30,70 20,55 30,40 C 35,32 20,15 30,10 Z" />
                {/* Phrygian bonnet overlay */}
                <path d="M 22,25 C 18,15 35,2 45,5 C 55,8 52,25 45,28 C 38,30 25,35 22,25 Z" fill="#E1000F" />
              </svg>
            </div>
            <div className="w-[38%] bg-[#E1000F]" />
          </div>
        );
      case 'DE':
        return (
          <div className="w-8 h-5 flex flex-col rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="h-1/3 bg-black" />
            <div className="h-1/3 bg-[#dd0000]" />
            <div className="h-1/3 bg-[#ffce00]" />
          </div>
        );
      case 'ES':
        return (
          <div className="w-8 h-5 flex flex-col rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0 relative">
            <div className="h-[25%] bg-[#c60b1e]" />
            <div className="h-[50%] bg-[#ffc400] relative flex items-center pl-1.5">
              <div className="w-1.5 h-2 bg-[#c60b1e]/60 rounded-sm" />
            </div>
            <div className="h-[25%] bg-[#c60b1e]" />
          </div>
        );
      case 'IT':
        return (
          <div className="w-8 h-5 flex rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="w-1/3 bg-[#009246]" />
            <div className="w-1/3 bg-[#ffffff]" />
            <div className="w-1/3 bg-[#ce2b37]" />
          </div>
        );
      case 'BE':
        return (
          <div className="w-8 h-5 flex rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="w-1/3 bg-[#000000]" />
            <div className="w-1/3 bg-[#ffd100]" />
            <div className="w-1/3 bg-[#ff0000]" />
          </div>
        );
      case 'CH':
        return (
          <div className="w-5.5 h-5.5 bg-[#dc2626] rounded-[2px] flex items-center justify-center shadow-sm shrink-0 border border-white/20">
            <span className="text-white text-[13px] font-black leading-none">+</span>
          </div>
        );
      case 'CA':
        return (
          <div className="w-9 h-4.5 flex rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0 relative">
            <div className="w-1/4 bg-[#ff0000]" />
            <div className="w-2/4 bg-[#ffffff] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-[#ff0000]" viewBox="0 0 24 24">
                <path d="M12 2s-.5 1.5-1.5 2.5a4.3 4.3 0 0 0-2 .5c.2-1.2 0-3-1-3.5a13 13 0 0 0-3 3.5c-.3.7-.3 2 .5 2a3.5 3.5 0 0 1 2.5 1.5 7.5 7.5 0 0 0-2.5-.5h-1a3.4 3.4 0 0 0-2 1.5 10 10 0 0 0 .5 3.5c.3.5 1.5-.2 2.5-.5-1 1-1.5 2-1 3.5 1.2-.2 2.5-.7 3.5-1.5-.7.7-1 1.5-1 2.5s.5 2.5 1.5 2.5h1l.5 2.5c.2.5 1.2.5 1.2 0l.5-2.5h1c1 0 1.5-1.5 1.5-2.5s-.3-1.8-1-2.5c1 .8 2.3 1.3 3.5 1.5.5-1.5 0-2.5-1-3.5 1 .3 2.2 1 2.5.5a10 10 0 0 0 .5-3.5 3.4 3.4 0 0 0-2-1.5h-1a7.5 7.5 0 0 0-2.5.5 3.5 3.5 0 0 1 2.5-1.5c.8 0 .8-1.3.5-2a13 13 0 0 0-3-3.5c-1 .5-1.2 2.3-1 3.5a4.3 4.3 0 0 0-2-.5C12.5 3.5 12 2 12 2z" />
              </svg>
            </div>
            <div className="w-1/4 bg-[#ff0000]" />
          </div>
        );
      case 'PT':
        return (
          <div className="w-8 h-5 flex rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0 relative">
            <div className="w-[40%] bg-[#006600]" />
            <div className="w-[60%] bg-[#ff0000] relative flex items-center justify-start">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 absolute -left-0.5 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-red-600 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'NL':
        return (
          <div className="w-8 h-5 flex flex-col rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="h-1/3 bg-[#ae1c28]" />
            <div className="h-1/3 bg-[#ffffff]" />
            <div className="h-1/3 bg-[#21468b]" />
          </div>
        );
      case 'AT':
        return (
          <div className="w-8 h-5 flex flex-col rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="h-1/3 bg-[#ef3340]" />
            <div className="h-1/3 bg-[#ffffff]" />
            <div className="h-1/3 bg-[#ef3340]" />
          </div>
        );
      case 'PL':
        return (
          <div className="w-8 h-5 flex flex-col rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="h-1/2 bg-[#ffffff] relative flex items-center justify-center">
              <span className="text-[5px] text-red-500 absolute font-sans leading-none">🦅</span>
            </div>
            <div className="h-1/2 bg-[#dc143c]" />
          </div>
        );
      case 'IE':
        return (
          <div className="w-8 h-5 flex rounded-[1px] overflow-hidden shadow-sm border border-slate-350 shrink-0">
            <div className="w-1/3 bg-[#169b62]" />
            <div className="w-1/3 bg-[#ffffff]" />
            <div className="w-1/3 bg-[#ff883e]" />
          </div>
        );
      default:
        return (
          <span className="text-xl shrink-0" role="img">{countryConfig.flag}</span>
        );
    }
  };

  // Mouse drag handler on Card
  const handleMouseDown = (
    e: React.MouseEvent,
    type: 'field' | 'custom' | 'system',
    id: string,
    currentPos: { x: number; y: number }
  ) => {
    if (!isEditMode || !cardRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const rect = cardRef.current.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDragOffset({
      x: clickXPercent - currentPos.x,
      y: clickYPercent - currentPos.y,
    });
    
    setActiveDragItem({ type, id });
  };

  // Touch support for mobile devices
  const handleTouchStart = (
    e: React.TouchEvent,
    type: 'field' | 'custom' | 'system',
    id: string,
    currentPos: { x: number; y: number }
  ) => {
    if (!isEditMode || !cardRef.current) return;
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const clickXPercent = ((touch.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setDragOffset({
      x: clickXPercent - currentPos.x,
      y: clickYPercent - currentPos.y,
    });
    
    setActiveDragItem({ type, id });
  };

  // Global mouse/touch move and up listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeDragItem || !cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      let percentX = ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x;
      let percentY = ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y;
      
      percentX = Math.max(0, Math.min(95, percentX));
      percentY = Math.max(0, Math.min(96, percentY));

      const key = activeDragItem.id;
      if (activeDragItem.type === 'field' || activeDragItem.type === 'system') {
        const currentConfig = project.positions[key] || { x: 50, y: 50, visible: true };
        onUpdatePosition(key, {
          ...currentConfig,
          x: Math.round(percentX * 10) / 10,
          y: Math.round(percentY * 10) / 10,
        });
      } else if (activeDragItem.type === 'custom') {
        onUpdateCustomTextPosition(
          activeDragItem.id,
          Math.round(percentX * 10) / 10,
          Math.round(percentY * 10) / 10
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!activeDragItem || !cardRef.current || e.touches.length === 0) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      let percentX = ((touch.clientX - rect.left) / rect.width) * 100 - dragOffset.x;
      let percentY = ((touch.clientY - rect.top) / rect.height) * 100 - dragOffset.y;
      
      percentX = Math.max(0, Math.min(95, percentX));
      percentY = Math.max(0, Math.min(96, percentY));

      const key = activeDragItem.id;
      if (activeDragItem.type === 'field' || activeDragItem.type === 'system') {
        const currentConfig = project.positions[key] || { x: 50, y: 50, visible: true };
        onUpdatePosition(key, {
          ...currentConfig,
          x: Math.round(percentX * 10) / 10,
          y: Math.round(percentY * 10) / 10,
        });
      } else if (activeDragItem.type === 'custom') {
        onUpdateCustomTextPosition(
          activeDragItem.id,
          Math.round(percentX * 10) / 10,
          Math.round(percentY * 10) / 10
        );
      }
    };

    const handleMouseUp = () => {
      setActiveDragItem(null);
    };

    if (activeDragItem) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [activeDragItem, dragOffset, project.positions, onUpdatePosition, onUpdateCustomTextPosition]);

  // Read positions with default presets based on Recto/Verso and vertical aspect ratios
  const getPos = (key: string, defaultRectoX: number, defaultRectoY: number, defaultVersoX?: number, defaultVersoY?: number): DragItemPosition => {
    const isVerso = activeSide === 'verso';

    // Override with precise default administrative layouts for France CNI biometric card
    if (template.id === 'france-cni') {
      if (!isVerso) {
        // Front (Recto) side specific coordinates
        switch (key) {
          case 'field_nom':               return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 16.5, visible: true };
          case 'field_prenoms':           return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 26.5, visible: true };
          case 'field_sexe':              return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 36.5, visible: true };
          case 'field_nationalite':       return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 49, y: 36.5, visible: true };
          case 'field_date_naissance':    return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 67, y: 36.5, visible: true };
          case 'field_lieu_naissance':    return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 46, visible: true };
          case 'field_nom_usage':         return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 55, visible: true };
          case 'field_doc_num':           return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 38, y: 64, visible: true };
          case 'field_date_expiration':   return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 67, y: 64, visible: true };
          case 'field_doc_code':          return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 66, y: 81.5, visible: true };
          case 'signature_element':       return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 44, y: 73.5, visible: true };
          case 'photo_element':           return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 3.5, y: 14.5, visible: true };
        }
      } else {
        // Back (Verso) side specific coordinates
        switch (key) {
          case 'field_taille':            return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 36, y: 11.5, visible: true };
          case 'field_date_emission':     return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 52, y: 11.5, visible: true };
          case 'field_adresse':           return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 36, y: 22, visible: true };
          case 'code_element':            return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 8.5, y: 7.5, visible: true };
          case 'chip_element':            return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 8.5, y: 35.5, visible: true };
          case 'mrz_element':             return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x: 2.5, y: 76.5, visible: true };
        }
      }
    }

    const x = isVerso && defaultVersoX !== undefined ? defaultVersoX : defaultRectoX;
    const y = isVerso && defaultVersoY !== undefined ? defaultVersoY : defaultRectoY;
    return project.positions[`${key}_${activeSide}`] || project.positions[key] || { x, y, visible: true };
  };

  const isVertical = template.dimensions.height > template.dimensions.width;

  // Custom photograph styles & filters
  const getPhotoFilterStyle = () => {
    const p = project.photo;
    let filterStr = `contrast(${p.contrast}%) brightness(${p.brightness}%)`;
    if (p.filter === 'grayscale' || template.category === 'id') filterStr += ' grayscale(1)';
    if (p.filter === 'security') filterStr += ' grayscale(1) contrast(115%) brightness(102%)';
    if (p.filter === 'sepia') filterStr += ' sepia(0.6)';
    if (p.filter === 'contrast-high') filterStr += ' contrast(135%)';
    return filterStr;
  };

  // Filter templates fields by current side
  const currentSideFields = template.fields.filter((f) => (f.side || 'recto') === activeSide);

  return (
    <div className="flex flex-col items-center">
      {/* Drag notice banner */}
      {isEditMode && (
        <div className="mb-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
          <Move className="w-3.5 h-3.5 text-amber-600" />
          <span>Glissez les champs et les puces d'identité à l'endroit désiré sur cette face ({activeSide === 'recto' ? 'Recto' : 'Verso'}) !</span>
        </div>
      )}

      {/* Main Administrative ID Card Wrapper */}
      <div
        id="print-card-target"
        ref={cardRef}
        style={{
          width: isVertical ? '320px' : '480px',
          height: isVertical ? '480px' : '304px',
          background: project.customColors?.background || template.defaultColors.background,
          color: template.defaultColors.textDark,
        }}
        className={`relative shadow-[0_12px_30px_rgba(0,0,0,0.15)] border border-slate-350 rounded-[14px] overflow-hidden select-none touch-none transition-shadow ${
          isVertical ? 'aspect-[0.63]' : 'aspect-[1.586]'
        } print:border-none print:shadow-none`}
      >
        {/* Background microprint secure pattern layers */}
        {template.securityPattern !== 'none' && (
          <div 
            className={`absolute inset-0 opacity-[0.16] pointer-events-none ${
              template.securityPattern === 'pattern1' 
                ? 'security-pattern-1' 
                : template.securityPattern === 'pattern2' 
                ? 'security-pattern-2' 
                : 'security-pattern-3'
            }`}
          />
        )}

        {/* HIGH-FIDELITY FRANCE CNI GUILLOCHIS LAYER */}
        {template.id === 'france-cni' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35" id="cni-vector-patterns">
            {/* Guillochis wavy security lines */}
            <svg className="absolute inset-0 w-full h-full stroke-indigo-600/30 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 0,20 Q 25,5 50,20 T 100,20" strokeWidth="0.1" />
              <path d="M 0,25 Q 25,10 50,25 T 100,25" strokeWidth="0.1" />
              <path d="M 0,30 Q 25,15 50,30 T 100,30" strokeWidth="0.1" />
              <path d="M 0,35 Q 25,20 50,35 T 100,35" strokeWidth="0.1" />
              <path d="M 0,40 Q 25,25 50,40 T 100,40" strokeWidth="0.1" />
              <path d="M 0,45 Q 25,30 50,45 T 100,45" strokeWidth="0.1" />
              <path d="M 0,50 Q 25,35 50,50 T 100,50" strokeWidth="0.1" />
              <path d="M 0,55 Q 25,40 50,55 T 100,55" strokeWidth="0.1" />
              <path d="M 0,60 Q 25,45 50,60 T 100,60" strokeWidth="0.1" />
              
              {/* Concentric circle guillochis */}
              <circle cx="50" cy="50" r="30" strokeWidth="0.08" strokeDasharray="1 1" />
              <circle cx="50" cy="50" r="35" strokeWidth="0.08" />
              <circle cx="50" cy="50" r="40" strokeWidth="0.08" strokeDasharray="2 1" />
              <circle cx="78" cy="32" r="16" strokeWidth="0.07" />
              <circle cx="78" cy="32" r="20" strokeWidth="0.07" strokeDasharray="1 1" />

              {/* Diagonal secure micro-line hatches */}
              <path d="M -10,110 L 110,-10 M -10,120 L 120,-10 M -10,100 L 100,-10" strokeWidth="0.06" strokeDasharray="2 2" />
            </svg>
            
            {/* Elegant "RF" Republican Monogram in the background */}
            {activeSide === 'recto' ? (
              <div className="absolute right-[14%] top-[28%] text-[68px] font-black font-sans text-sky-800/[0.04] tracking-widest select-none pointer-events-none">
                RF
              </div>
            ) : (
              <div className="absolute left-[38%] top-[25%] text-[75px] font-black font-sans text-sky-800/[0.04] tracking-widest select-none pointer-events-none">
                RF
              </div>
            )}
          </div>
        )}

        {/* Dynamic State Security Watermark Holograms */}
        {project.showSecurityOverlay && (
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.25] bg-gradient-to-tr from-cyan-300 via-transparent to-rose-300" />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* FRONT SIDE (RECTO) DESIGN INTERFACES                               */}
        {/* ------------------------------------------------------------------ */}
        {activeSide === 'recto' && (
          <>
            {/* Template Specific Header Graphics (CNI France, Germany, Spain, Italy etc.) */}
            {template.category === 'id' && (
              <div className="absolute top-0 left-0 right-0 h-[38px] bg-white/75 backdrop-blur-[1px] border-b border-blue-200/40 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  {/* National Tricolor Emblem / Flag */}
                  {renderLeftFlag(project.countryCode)}
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-extrabold tracking-wider text-[#00209F] leading-tight font-sans">
                      {project.countryCode === 'FR' ? "RÉPUBLIQUE FRANÇAISE" : countryConfig.defaultHeaderName}
                    </span>
                    <span className="text-[6.5px] font-bold text-indigo-700/80 leading-none tracking-tight font-mono uppercase mt-0.5">
                      {project.countryCode === 'FR' 
                        ? "CARTE NATIONALE D'IDENTITÉ / IDENTITY CARD" 
                        : project.countryCode === 'DE'
                        ? "PERSONALAUSWEIS / IDENTITY CARD"
                        : project.countryCode === 'ES'
                        ? "DOCUMENTO NACIONAL DE IDENTIDAD / IDENTITY CARD"
                        : project.countryCode === 'IT'
                        ? "CARTA D'IDENTITÀ ELETTRONICA / IDENTITY CARD"
                        : project.countryCode === 'CH'
                        ? "IDENTITÄTSKARTE / CARTE D'IDENTITÉ"
                        : project.countryCode === 'NL'
                        ? "IDENTITEITSKAART / IDENTITY CARD"
                        : project.countryCode === 'PT'
                        ? "CARTÃO DE CIDADÃO / CITIZEN CARD"
                        : project.countryCode === 'CA'
                        ? "CARTE DE CITOYENNETÉ / CITIZENSHIP CARD"
                        : project.countryCode === 'AT'
                        ? "PERSONALAUSWEIS / IDENTITY CARD"
                        : project.countryCode === 'PL'
                        ? "DOWÓD OSOBISTY / IDENTITY CARD"
                        : project.countryCode === 'IE'
                        ? "PASSPORT CARD / CÁRTA PASSPÓIRT"
                        : "CARTE D'IDENTITÉ / IDENTITY CARD"
                      }
                    </span>
                  </div>
                </div>

                {/* EU Stars Flag, Swiss Cross, or Canada Maple Leaf */}
                {project.countryCode === 'CH' ? (
                  <div className="w-5.5 h-5.5 bg-[#dc2626] border border-white/20 rounded-[2px] flex items-center justify-center relative shadow-sm shrink-0">
                    <span className="text-white text-[13px] font-black leading-none">+</span>
                  </div>
                ) : project.countryCode === 'CA' ? (
                  <div className="w-6.5 h-4.5 bg-[#dc2626] border border-white/10 p-0.5 rounded-[2px] flex items-center justify-center relative shadow-sm shrink-0">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2s-.5 1.5-1.5 2.5a4.3 4.3 0 0 0-2 .5c.2-1.2 0-3-1-3.5a13 13 0 0 0-3 3.5c-.3.7-.3 2 .5 2a3.5 3.5 0 0 1 2.5 1.5 7.5 7.5 0 0 0-2.5-.5h-1a3.4 3.4 0 0 0-2 1.5 10 10 0 0 0 .5 3.5c.3.5 1.5-.2 2.5-.5-1 1-1.5 2-1 3.5 1.2-.2 2.5-.7 3.5-1.5-.7.7-1 1.5-1 2.5s.5 2.5 1.5 2.5h1l.5 2.5c.2.5 1.2.5 1.2 0l.5-2.5h1c1 0 1.5-1.5 1.5-2.5s-.3-1.8-1-2.5c1 .8 2.3 1.3 3.5 1.5.5-1.5 0-2.5-1-3.5 1 .3 2.2 1 2.5.5a10 10 0 0 0 .5-3.5 3.4 3.4 0 0 0-2-1.5h-1a7.5 7.5 0 0 0-2.5.5 3.5 3.5 0 0 1 2.5-1.5c.8 0 .8-1.3.5-2a13 13 0 0 0-3-3.5c-1 .5-1.2 2.3-1 3.5a4.3 4.3 0 0 0-2-.5C12.5 3.5 12 2 12 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-[32px] h-[21px] bg-[#003399] border border-white/20 rounded-[2px] flex items-center justify-center relative shadow-sm shrink-0">
                    {/* Ring of 12 stars */}
                    <svg className="absolute inset-x-0 w-full h-full" viewBox="0 0 24 16">
                      <g fill="#FFCC00" transform="translate(12, 8)">
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 * Math.PI) / 180;
                          const r = 5.5; // star ring radius
                          const x = r * Math.cos(angle);
                          const y = r * Math.sin(angle);
                          return (
                            <path
                              key={i}
                              transform={`translate(${x}, ${y}) scale(0.24)`}
                              d="M 0,-4 L 1.2,-1.2 L 4,-1 L 1.8,1 L 2.4,4 Q 0,2.5 -2.4,4 L -1.8,1 L -4,-1 L -1.2,-1.2 Z"
                            />
                          );
                        })}
                      </g>
                    </svg>
                    <span className="relative z-10 text-[7px] font-black text-white font-sans leading-none tracking-tight">
                      {countryConfig.countryCode}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Left margin tricolor decorative bar for France CNI */}
            {template.id === 'france-cni' && (
              <div className="absolute top-[38px] left-0 w-1 bottom-0 bg-gradient-to-b from-blue-600 via-white to-red-600 opacity-60 pointer-events-none" />
            )}

            {/* Custom Background Holograms on the card front */}
            {project.showSecurityOverlay && (
              <>
                {/* France Marianne Emblem overlay */}
                {project.countryCode === 'FR' && (
                  <div className="absolute right-12 top-14 w-20 h-20 rounded-full border border-blue-400/10 bg-radial from-blue-300/5 to-indigo-500/5 flex items-center justify-center opacity-45 pointer-events-none">
                    <div className="w-16 h-16 rounded-full border border-dashed border-red-400/20 flex items-center justify-center">
                      <span className="text-[10px] font-mono font-black text-indigo-900/15 tracking-widest">RF</span>
                    </div>
                  </div>
                )}
                {/* Germany Federal Eagle silhouette */}
                {project.countryCode === 'DE' && (
                  <div className="absolute right-16 top-16 w-16 h-20 opacity-[0.06] pointer-events-none flex justify-center">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 120">
                      <path d="M50 0 L40 30 L10 20 L25 50 L10 70 L38 75 L30 110 L50 95 L70 110 L62 75 L90 70 L75 50 L90 20 L60 30 Z" />
                    </svg>
                  </div>
                )}
                {/* Spain Royal Crown hologram */}
                {project.countryCode === 'ES' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 100">
                      <path d="M20 70 L20 60 Q50 30 80 60 L80 70 Z M20 60 Q50 40 80 60" />
                      <circle cx="50" cy="35" r="5" />
                    </svg>
                  </div>
                )}
                {/* Italy Emblem hologram */}
                {project.countryCode === 'IT' && (
                  <div className="absolute right-16 top-14 w-16 h-16 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="30" stroke="black" strokeWidth="4" />
                      <path d="M50 20 L60 45 L85 50 L65 65 L70 90 L50 75 L30 90 L35 65 L15 50 L40 45 Z" />
                    </svg>
                  </div>
                )}
                {/* Belgium Crown hologram */}
                {project.countryCode === 'BE' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 100">
                      <path d="M10 70 L90 70 L80 40 L50 60 L20 40 Z" />
                      <circle cx="50" cy="30" r="6" />
                    </svg>
                  </div>
                )}
                {/* Switzerland Cross hologram */}
                {project.countryCode === 'CH' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none flex items-center justify-center">
                    <svg className="w-12 h-12 fill-black" viewBox="0 0 100 100">
                      <rect x="40" y="10" width="20" height="80" />
                      <rect x="10" y="40" width="80" height="20" />
                    </svg>
                  </div>
                )}
                {/* Netherlands Crown hologram */}
                {project.countryCode === 'NL' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 100">
                      <path d="M10 70 Q50 40 90 70 L80 50 L50 65 L20 50 Z" />
                    </svg>
                  </div>
                )}
                {/* Portugal Armillary Sphere hologram */}
                {project.countryCode === 'PT' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full fill-black" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="30" fill="none" stroke="black" strokeWidth="3" />
                      <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="4" />
                      <line x1="10" y1="50" x2="90" y2="50" stroke="black" strokeWidth="4" />
                    </svg>
                  </div>
                )}
                {/* Canada Maple Leaf hologram */}
                {project.countryCode === 'CA' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none flex items-center justify-center">
                    <svg className="w-12 h-12 fill-black" viewBox="0 0 24 24">
                      <path d="M12 2s-.5 1.5-1.5 2.5a4.3 4.3 0 0 0-2 .5c.2-1.2 0-3-1-3.5a13 13 0 0 0-3 3.5c-.3.7-.3 2 .5 2a3.5 3.5 0 0 1 2.5 1.5 7.5 7.5 0 0 0-2.5-.5h-1a3.4 3.4 0 0 0-2 1.5 10 10 0 0 0 .5 3.5c.3.5 1.5-.2 2.5-.5-1 1-1.5 2-1 3.5 1.2-.2 2.5-.7 3.5-1.5-.7.7-1 1.5-1 2.5s.5 2.5 1.5 2.5h1l.5 2.5c.2.5 1.2.5 1.2 0l.5-2.5h1c1 0 1.5-1.5 1.5-2.5s-.3-1.8-1-2.5c1 .8 2.3 1.3 3.5 1.5.5-1.5 0-2.5-1-3.5 1 .3 2.2 1 2.5.5a10 10 0 0 0 .5-3.5 3.4 3.4 0 0 0-2-1.5h-1a7.5 7.5 0 0 0-2.5.5 3.5 3.5 0 0 1 2.5-1.5c.8 0 .8-1.3.5-2a13 13 0 0 0-3-3.5c-1 .5-1.2 2.3-1 3.5a4.3 4.3 0 0 0-2-.5C12.5 3.5 12 2 12 2z" />
                    </svg>
                  </div>
                )}
                {/* Austria Eagle hologram */}
                {project.countryCode === 'AT' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none flex items-center justify-center">
                    <svg className="w-12 h-12 fill-black" viewBox="0 0 100 100">
                      <path d="M50 10 L45 30 L20 20 L35 45 L15 55 L40 65 L45 90 L50 75 L55 90 L60 65 L85 55 L65 45 L80 20 L55 30 Z" />
                    </svg>
                  </div>
                )}
                {/* Poland Eagle hologram */}
                {project.countryCode === 'PL' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none flex items-center justify-center">
                    <svg className="w-12 h-12 fill-black" viewBox="0 0 100 100">
                      <path d="M50 15 L52 28 L65 30 L55 42 L67 55 L52 58 L50 85 L48 58 L33 55 L45 42 L35 30 L48 28 Z" />
                    </svg>
                  </div>
                )}
                {/* Ireland Harp hologram */}
                {project.countryCode === 'IE' && (
                  <div className="absolute right-16 top-16 w-16 h-16 opacity-[0.05] pointer-events-none flex items-center justify-center">
                    <svg className="w-12 h-12 fill-none stroke-black" strokeWidth="5" viewBox="0 0 100 100">
                      <path d="M25 15 C35 15, 65 30, 75 25 M75 25 L65 85 C55 85, 35 75, 25 85 M25 15 L25 85" />
                      <line x1="25" y1="30" x2="72" y2="35" />
                      <line x1="25" y1="45" x2="69" y2="50" />
                      <line x1="25" y1="60" x2="66" y2="65" />
                    </svg>
                  </div>
                )}
              </>
            )}

            {/* Europe permits customized headers */}
            {template.category === 'permit' && (
              <div className="absolute top-0 left-0 right-0 h-9 bg-pink-100/40 border-b border-pink-200/40 flex items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                  {project.countryCode === 'CH' ? (
                    <div className="w-5.5 h-5.5 bg-[#dc2626] flex items-center justify-center text-[10px] font-black text-white rounded-[2px] leading-none shrink-0 shadow-sm">
                      🇨🇭
                    </div>
                  ) : project.countryCode === 'CA' ? (
                    <div className="w-5.5 h-5.5 bg-[#dc2626] flex items-center justify-center text-[10px] font-black text-white rounded-[2px] leading-none shrink-0 shadow-sm">
                      🇨🇦
                    </div>
                  ) : (
                    <div className="w-6.5 h-4.5 bg-[#003399] flex items-center justify-center text-[7.5px] font-extrabold text-white rounded-[2px] leading-none font-mono relative overflow-hidden shrink-0 shadow-sm">
                      <span className="absolute text-[11px] text-yellow-300/30 font-bold">★</span>
                      <span className="relative z-10">{countryConfig.countryCode}</span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-black text-pink-950 uppercase tracking-widest leading-none mt-1">{countryConfig.defaultHeaderName}</span>
                    <span className="text-[7px] font-bold text-indigo-900 leading-none">
                      {project.countryCode === 'FR' ? 'PERMIS DE CONDUIRE' :
                       project.countryCode === 'DE' ? 'FÜHRERSCHEIN' :
                       project.countryCode === 'ES' ? 'PERMISO DE CONDUCCIÓN' :
                       project.countryCode === 'IT' ? 'PATENTE DI GUIDA' :
                       project.countryCode === 'BE' ? 'RIJBEWIJS / PERMIS DE CONDUIRE' :
                       project.countryCode === 'CH' ? 'FÜHRERAUSWEIS / PERMIS DE CONDUIRE' :
                       project.countryCode === 'NL' ? 'RIJBEWIJS' :
                       project.countryCode === 'PT' ? 'CARTA DE CONDUÇÃO' :
                       project.countryCode === 'CA' ? 'PERMIS DE CONDUIRE / DRIVER\'S LICENCE' :
                       'PERMIS DE CONDUIRE / DRIVING LICENSE'}
                    </span>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-pink-700 bg-pink-50 border border-pink-100/60 px-1.5 py-0.5 rounded font-black max-w-[90px] truncate">
                  {project.fields.permis_num || 'XXXXXXXXX'}
                </span>
              </div>
            )}

            {/* health card headers (CEAM / Vitale / custom national ones) */}
            {template.category === 'health' && (
              <>
                {template.id === 'france-vitale' ? (
                  <div className="absolute top-0 left-0 right-0 h-8.5 bg-gradient-to-r from-emerald-600 to-emerald-500/90 text-white flex items-center justify-between px-3">
                    <span className="text-[9px] font-sans font-black tracking-widest text-[#fef08a] uppercase flex items-center gap-1">
                      <span>🟢</span> carte vitale
                    </span>
                    <span className="text-[7px] font-mono tracking-tight text-emerald-100 font-bold uppercase">{countryConfig.defaultHeaderName}</span>
                  </div>
                ) : template.id === 'deutschland-egk' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-teal-500/30 flex items-center justify-between px-3 bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-sm">
                    <span className="text-[8px] font-extrabold font-sans tracking-wide uppercase">
                      Elektronische Gesundheitskarte
                    </span>
                    <span className="text-lg">🇩🇪</span>
                  </div>
                ) : template.id === 'espana-health' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-sky-400/30 flex items-center justify-between px-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black font-sans tracking-wide uppercase leading-none mt-1">Tarjeta Sanitaria</span>
                      <span className="text-[6.5px] font-bold text-sky-100">National Health Service</span>
                    </div>
                    <span className="text-lg">🇪🇸</span>
                  </div>
                ) : template.id === 'italia-health' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-cyan-400/30 flex items-center justify-between px-3 bg-gradient-to-r from-cyan-600 via-emerald-600 to-cyan-700 text-white shadow-sm">
                    <span className="text-[8px] font-bold font-sans tracking-tight uppercase">
                      Tessera Sanitaria / Carta Servizi
                    </span>
                    <span className="text-lg shrink-0">🇮🇹</span>
                  </div>
                ) : template.id === 'belgique-health' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-blue-400/30 flex items-center justify-between px-3 bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-sm">
                    <span className="text-[8px] font-black font-sans tracking-wide uppercase text-yellow-300">
                      ASSURANCE MALADIE BELGE / MUTUELLE
                    </span>
                    <span className="text-lg">🇧🇪</span>
                  </div>
                ) : template.id === 'canada-health' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-sky-400/30 flex items-center justify-between px-3 bg-gradient-to-r from-sky-500 via-sky-400 to-teal-500 text-white shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black font-sans tracking-wide uppercase leading-none mt-1">Gouvernement du Québec</span>
                      <span className="text-[6.5px] font-bold text-sky-100">Régie de l'assurance maladie</span>
                    </div>
                    <span className="text-lg">🇨🇦</span>
                  </div>
                ) : template.id === 'portugal-health' ? (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-emerald-500/30 flex items-center justify-between px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-sm">
                    <span className="text-[8px] font-black font-sans tracking-wide uppercase text-white">
                      MINISTÉRIO DA SAÚDE - SNS PORTUGAL
                    </span>
                    <span className="text-lg">🇵🇹</span>
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-indigo-400/30 flex items-center justify-between px-3 bg-blue-50/50">
                    <span className="text-[8.5px] font-black text-sky-950 font-sans tracking-tight">
                      {countryConfig.defaultHeaderName} / CARTE EUROPÉENNE D'ASSURANCE MALADIE
                    </span>
                    <div className="w-6 h-4.5 rounded-[2px] bg-[#003399] flex items-center justify-center text-white text-[7.5px] font-bold relative font-mono shrink-0">
                      <span className="absolute text-[11px] text-yellow-300 opacity-40">★</span>
                      <span className="relative z-10">{countryConfig.countryCode}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Badges and tags */}
            {template.id === 'student-card' && (
              <div className="absolute top-0 left-0 right-10 h-10 border-b border-indigo-100 flex flex-col justify-center pl-3">
                <p className="text-[9.5px] font-black text-indigo-950 truncate tracking-wide uppercase">{project.fields.universite}</p>
                <p className="text-[7px] font-mono text-slate-500 font-bold tracking-wider uppercase">CARTE ÉTUDIANTE EUROPÉENNE / STUDENT CARD</p>
              </div>
            )}

            {template.id === 'press-badge' && (
              <div className="absolute top-0 left-0 right-0 h-11 bg-red-650 bg-red-600 flex items-center justify-center flex-col text-white border-b-2 border-red-700">
                <span className="text-xs font-black tracking-[0.22em] font-sans">PRESSE</span>
                <span className="text-[7.5px] tracking-[0.12em] font-mono uppercase text-white/90">OFFICIAL MEDIA PRESS CARD</span>
              </div>
            )}

            {template.id === 'security-badge' && (
              <div className="absolute top-0 left-0 right-0 h-12 bg-indigo-950 flex flex-col justify-center items-center text-center text-white border-b-2 border-indigo-500">
                <span className="text-[9px] font-extrabold tracking-wide text-indigo-200 truncate w-full max-w-[90%] uppercase">{project.fields.entreprise}</span>
                <span className="text-[7.5px] font-mono tracking-[0.2em] text-red-400 font-bold uppercase mt-0.5">SÉCURITÉ / SECURITY BADGE</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* FRONT (RECTO) PHOTO RENDERING WITH HOLOGRAPHIC SEAL */}
            {/* ---------------------------------------------------- */}
            <div
              onMouseDown={(e) => handleMouseDown(e, 'system', 'photo_element', getPos('photo_element', template.id === 'france-cni' ? 3.5 : 4, template.id === 'france-cni' ? 14.5 : 18))}
              onTouchStart={(e) => handleTouchStart(e, 'system', 'photo_element', getPos('photo_element', template.id === 'france-cni' ? 3.5 : 4, template.id === 'france-cni' ? 14.5 : 18))}
              style={{
                left: `${getPos('photo_element', template.id === 'france-cni' ? 3.5 : 4, template.id === 'france-cni' ? 14.5 : 18).x}%`,
                top: `${getPos('photo_element', template.id === 'france-cni' ? 3.5 : 4, template.id === 'france-cni' ? 14.5 : 18).y}%`,
                width: template.id === 'france-cni' 
                  ? (isVertical ? '92px' : '108px') 
                  : (isVertical ? '80px' : '90px'),
                height: template.id === 'france-cni' 
                  ? (isVertical ? '122px' : '142px') 
                  : (isVertical ? '104px' : '118px'),
              }}
              className={`absolute rounded bg-slate-100 border border-slate-400/80 overflow-hidden flex flex-col items-center justify-center shadow-sm ${
                isEditMode ? 'cursor-move ring-2 ring-indigo-500 ring-offset-2 border-dashed border-indigo-400' : ''
              }`}
            >
              {project.photo.url ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-200">
                  <img
                    src={project.photo.url}
                    alt="Administrative portrait"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{
                      transform: `translate(${project.photo.x / (isVertical ? 1.4 : 1.24)}px, ${project.photo.y / (isVertical ? 1.4 : 1.24)}px) scale(${project.photo.zoom}) rotate(${project.photo.rotation}deg)`,
                      filter: getPhotoFilterStyle(),
                    }}
                    className="absolute w-full h-full object-cover origin-center transition-all duration-100 pointer-events-none"
                  />

                  {/* ------------------------------------------------------------------ */}
                  {/* ADMINISTRATIVE SPECIFIC PHOTO SEALS & OVERLAY HOLOGRAMS           */}
                  {/* TRAIT-POUR-TRAIT EXPERT DUPLICATE                                 */}
                  {/* ------------------------------------------------------------------ */}
                  {project.showSecurityOverlay && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {/* France Holographic monogram seal "RF" and stars overlay */}
                      {project.countryCode === 'FR' && (
                        <div className="absolute inset-0 select-none pointer-events-none">
                          <svg className="w-full h-full stroke-yellow-400 fill-none opacity-60" viewBox="0 0 100 130">
                            {/* Circular seal with stars over bottom-right of photo */}
                            <circle cx="75" cy="98" r="16" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="2 1.5" />
                            <text x="69" y="101.5" fontSize="9.5" fontWeight="900" fill="#4ade80" stroke="none" fontFamily="sans-serif">RF</text>
                            
                            {/* Giant "RF" monogram in green/yellow semi-transparent */}
                            <text x="16" y="65" fontSize="42" fontWeight="900" fill="rgba(74, 222, 128, 0.35)" stroke="rgba(234, 179, 8, 0.2)" strokeWidth="0.5" fontFamily="sans-serif" letterSpacing="0.05em">RF</text>
                            
                            {/* Concentric security waves crossing the face in green and yellow */}
                            <path d="M-10 15 Q35 -5 90 25 T130 75" stroke="#EAB308" strokeWidth="0.6" opacity="0.8" />
                            <path d="M-10 35 Q40 15 85 50 T120 100" stroke="#22C55E" strokeWidth="0.6" opacity="0.8" />
                            <path d="M-10 55 Q45 35 80 75 T110 125" stroke="#EAB308" strokeWidth="0.6" opacity="0.6" />
                            <path d="M-10 75 Q45 55 80 95 T110 145" stroke="#22C55E" strokeWidth="0.8" opacity="0.5" />
                          </svg>
                        </div>
                      )}

                      {/* Germany Eagle hologram seal on photo */}
                      {project.countryCode === 'DE' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-14 h-16 fill-transparent stroke-green-300 opacity-60" viewBox="0 0 100 120">
                            <circle cx="50" cy="55" r="30" strokeWidth="0.7" strokeDasharray="4,2" />
                            <path d="M50 25 L40 45 L20 40 L35 60 L20 75 L42 78 L35 100 L50 90 L65 100 L58 78 L80 75 L65 60 L80 40 L60 45 Z" strokeWidth="1.2" />
                          </svg>
                        </div>
                      )}

                      {/* Spain Royal Crown seal on photo */}
                      {project.countryCode === 'ES' && (
                        <div className="absolute inset-0">
                          <svg className="w-full h-full fill-none stroke-yellow-400 opacity-70" viewBox="0 0 100 130">
                            <rect x="25" y="60" width="50" height="30" rx="3" strokeWidth="0.8" />
                            <path d="M25 60 Q50 35 75 60" strokeWidth="1" />
                            <circle cx="50" cy="45" r="3" fill="yellow" />
                            <text x="35" y="80" fontSize="8" fontWeight="black" fill="yellow" stroke="none">DNI</text>
                          </svg>
                        </div>
                      )}

                      {/* Italy Concentric Stars on photo */}
                      {project.countryCode === 'IT' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full border border-orange-300/40 border-dashed animate-spin-slow flex items-center justify-center">
                            <span className="text-[14px] text-green-300 font-light opacity-60">REPUBBLICA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* France embedded ribbon bottom edge */}
                  {project.countryCode === 'FR' && (
                    <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-white to-red-500 opacity-80 pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="text-center p-2 text-slate-300">
                  <User className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-[7.5px] font-mono leading-tight mt-1 uppercase text-slate-400 font-extrabold">Photo</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* BACK SIDE (VERSO) DESIGN INTERFACES                                */}
        {/* ------------------------------------------------------------------ */}
        {activeSide === 'verso' && (
          <>
            {/* Gold RFID biometric electronic chip placed on left-central-bottom (France style back layout) */}
            {project.showChip && (
              <div
                onMouseDown={(e) => handleMouseDown(e, 'system', 'chip_element', getPos('chip_element', 8.5, 35.5))}
                onTouchStart={(e) => handleTouchStart(e, 'system', 'chip_element', getPos('chip_element', 8.5, 35.5))}
                style={{
                  left: `${getPos('chip_element', 8.5, 35.5).x}%`,
                  top: `${getPos('chip_element', 8.5, 35.5).y}%`,
                }}
                className={`absolute w-[48px] h-[38px] rounded-[6px] bg-gradient-to-br from-amber-300 via-yellow-250 to-amber-600 border border-amber-700/50 p-[1.5px] shadow-sm transition-shadow z-20 ${
                  isEditMode ? 'cursor-move ring-2 ring-indigo-500 ring-offset-1 border-dashed' : ''
                }`}
              >
                {/* Advanced smartcard chip layout conforming to microfiche gold standard */}
                <svg className="w-full h-full opacity-95 fill-none stroke-amber-950/70 stroke-[0.8px]" viewBox="0 0 48 38">
                  {/* Outer border bevel */}
                  <rect x="0.5" y="0.5" width="47" height="37" rx="4.5" stroke="rgba(120, 80, 20, 0.25)" />
                  
                  {/* Central vertical divisions */}
                  <line x1="16" y1="0.5" x2="16" y2="37.5" />
                  <line x1="32" y1="0.5" x2="32" y2="37.5" />
                  
                  {/* Horizontal divisions on left section */}
                  <line x1="0.5" y1="12" x2="16" y2="12" />
                  <line x1="0.5" y1="26" x2="16" y2="26" />

                  {/* Horizontal divisions on right section */}
                  <line x1="32" y1="12" x2="47.5" y2="12" />
                  <line x1="32" y1="26" x2="47.5" y2="26" />

                  {/* Central Island - Rounded internal rectangle */}
                  <rect x="16" y="12" width="16" height="14" rx="2" fill="none" />
                  
                  {/* Authentic horizontal routing connections */}
                  <line x1="16" y1="19" x2="32" y2="19" />
                  
                  {/* Bevel connection micro routing details */}
                  <path d="M 0.5 12 L 6 12 L 10 19 L 16 19" stroke="rgba(120, 80, 20, 0.65)" />
                  <path d="M 0.5 26 L 6 26 L 10 19" stroke="rgba(120, 80, 20, 0.65)" />
                  
                  <path d="M 47.5 12 L 42 12 L 38 19 L 32 19" stroke="rgba(120, 80, 20, 0.65)" />
                  <path d="M 47.5 26 L 42 26 L 38 19" stroke="rgba(120, 80, 20, 0.65)" />
                </svg>
              </div>
            )}

            {/* Vertical serial number on the far left edge of the France CNI */}
            {project.countryCode === 'FR' && (
              <div 
                className="absolute left-[3.2%] top-[14%] h-[68%] flex items-center justify-center font-mono text-[6.8px] md:text-[7.2px] font-black text-slate-700/80 tracking-[0.16em] select-none pointer-events-none"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {project.fields.doc_num ? `${project.fields.doc_num}000001`.substring(0, 12).toUpperCase() : '210291000021'}
              </div>
            )}

            {/* Square 2D Barcode representing 2D-Doc bar digital signature (France style) */}
            {project.showBarcodeOrQR && (
              <div
                onMouseDown={(e) => handleMouseDown(e, 'system', 'code_element', getPos('code_element', 8.5, 7.5))}
                onTouchStart={(e) => handleTouchStart(e, 'system', 'code_element', getPos('code_element', 8.5, 7.5))}
                style={{
                  left: `${getPos('code_element', 8.5, 7.5).x}%`,
                  top: `${getPos('code_element', 8.5, 7.5).y}%`,
                }}
                className={`absolute flex flex-col items-center bg-white p-[3px] rounded-[5px] border border-slate-350 shadow-sm z-20 ${
                  isEditMode ? 'cursor-move ring-2 ring-indigo-500 ring-offset-1 border-dashed' : ''
                }`}
              >
                {/* 2D-Doc / QR-Matrix code pattern clone - Beautifully exact vector reproduction of standard QR codes */}
                <div className="w-[43px] h-[43px] bg-white flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full fill-slate-950 stroke-none" viewBox="0 0 29 29">
                    {/* Top Left Finder Pattern */}
                    <rect x="0" y="0" width="7" height="7" />
                    <rect x="1" y="1" width="5" height="5" fill="white" />
                    <rect x="2" y="2" width="3" height="3" />

                    {/* Top Right Finder Pattern */}
                    <rect x="22" y="0" width="7" height="7" />
                    <rect x="23" y="1" width="5" height="5" fill="white" />
                    <rect x="24" y="2" width="3" height="3" />

                    {/* Bottom Left Finder Pattern */}
                    <rect x="0" y="22" width="7" height="7" />
                    <rect x="1" y="23" width="5" height="5" fill="white" />
                    <rect x="2" y="24" width="3" height="3" />

                    {/* QR Code Random-looking data pixels aligning with the image */}
                    <rect x="8" y="1" width="2" height="1" />
                    <rect x="11" y="0" width="1" height="2" />
                    <rect x="13" y="1" width="3" height="1" />
                    <rect x="18" y="0" width="1" height="3" />
                    <rect x="20" y="1" width="1" height="1" />

                    <rect x="8" y="3" width="1" height="2" />
                    <rect x="10" y="4" width="2" height="1" />
                    <rect x="13" y="3" width="1" height="3" />
                    <rect x="15" y="4" width="2" height="1" />
                    <rect x="18" y="4" width="3" height="1" />

                    <rect x="8" y="7" width="2" height="1" />
                    <rect x="11" y="6" width="3" height="2" />
                    <rect x="15" y="6" width="1" height="1" />
                    <rect x="17" y="7" width="4" height="1" />
                    <rect x="22" y="8" width="1" height="2" />
                    <rect x="24" y="7" width="3" height="1" />

                    <rect x="0" y="8" width="2" height="1" />
                    <rect x="3" y="9" width="3" height="1" />
                    <rect x="7" y="9" width="1" height="3" />
                    <rect x="9" y="8" width="3" height="1" />
                    <rect x="13" y="9" width="2" height="2" />
                    <rect x="16" y="8" width="4" height="1" />
                    <rect x="21" y="10" width="1" height="1" />

                    <rect x="1" y="11" width="2" height="2" />
                    <rect x="4" y="10" width="1" height="4" />
                    <rect x="9" y="11" width="3" height="2" />
                    <rect x="13" y="12" width="1" height="3" />
                    <rect x="15" y="11" width="2" height="1" />
                    <rect x="18" y="10" width="2" height="3" />
                    <rect x="21" y="12" width="3" height="1" />
                    <rect x="25" y="11" width="2" height="2" />

                    <rect x="0" y="14" width="1" height="3" />
                    <rect x="2" y="15" width="2" height="1" />
                    <rect x="5" y="14" width="3" height="2" />
                    <rect x="9" y="14" width="1" height="3" />
                    <rect x="11" y="15" width="2" height="1" />
                    <rect x="14" y="15" width="3" height="2" />
                    <rect x="18" y="14" width="1" height="1" />
                    <rect x="20" y="15" width="4" height="1" />
                    <rect x="25" y="14" width="1" height="3" />

                    <rect x="0" y="18" width="3" height="1" />
                    <rect x="4" y="17" width="2" height="3" />
                    <rect x="7" y="19" width="4" height="1" />
                    <rect x="12" y="18" width="1" height="2" />
                    <rect x="14" y="18" width="3" height="1" />
                    <rect x="19" y="17" width="2" height="2" />
                    <rect x="22" y="19" width="4" height="1" />
                    <rect x="27" y="17" width="1" height="3" />

                    <rect x="8" y="21" width="3" height="1" />
                    <rect x="12" y="21" width="2" height="2" />
                    <rect x="15" y="20" width="2" height="1" />
                    <rect x="18" y="22" width="3" height="1" />
                    <rect x="22" y="21" width="1" height="3" />
                    <rect x="24" y="20" width="2" height="2" />

                    <rect x="8" y="23" width="1" height="2" />
                    <rect x="10" y="24" width="4" height="1" />
                    <rect x="15" y="23" width="1" height="3" />
                    <rect x="17" y="24" width="2" height="1" />
                    <rect x="20" y="23" width="1" height="1" />
                    <rect x="25" y="24" width="3" height="1" />

                    <rect x="8" y="26" width="3" height="1" />
                    <rect x="12" y="25" width="1" height="3" />
                    <rect x="14" y="27" width="4" height="1" />
                    <rect x="19" y="25" width="2" height="2" />
                    <rect x="22" y="26" width="5" height="1" />
                  </svg>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VERSO MINI GHOST PHOTO WITH FRANCE WATERMARK         */}
            {/* PHOTO FANTÔME INTÉGRÉE SELON L'ADMINISTRATION        */}
            {/* ---------------------------------------------------- */}
            {template.category === 'id' && (
              <div
                style={{
                  right: '16px',
                  top: '16px',
                  width: '44px',
                  height: '58px',
                }}
                className="absolute rounded-[4px] border border-slate-350/40 backdrop-blur-[0.5px] bg-white/40 p-0.5 overflow-hidden flex items-end justify-center shadow-inner pointer-events-none animate-pulse-slow font-mono"
              >
                {/* France map path outline behind/around the ghost portrait */}
                {project.countryCode === 'FR' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none z-0">
                    <svg className="w-10 h-10 fill-none stroke-blue-700/80 stroke-[0.8px]" viewBox="0 0 100 100">
                      <path d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" />
                      <path d="M 50 10 L 50 90" strokeDasharray="2,2" />
                      <path d="M 15 30 L 85 70" strokeDasharray="2,2" />
                      <path d="M 15 70 L 85 30" strokeDasharray="2,2" />
                    </svg>
                  </div>
                )}

                {/* Date stamp printed on the ghost photo area to reinforce biometric lock */}
                {project.countryCode === 'FR' && (
                  <div className="absolute top-[4px] left-0 right-0 text-center text-[5.2px] font-mono font-black text-indigo-900/60 z-10 leading-none">
                    {project.fields.date_expiration ? project.fields.date_expiration.split('-').reverse().join(' ') : '11 02 2030'}
                  </div>
                )}

                {project.photo.url ? (
                  <img
                    src={project.photo.url}
                    alt="Ghost portrait"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{
                      transform: `scale(${project.photo.zoom * 0.95}) rotate(${project.photo.rotation}deg)`,
                      filter: 'grayscale(1) contrast(140%) brightness(105%)',
                    }}
                    className="w-full h-[84%] object-cover opacity-25 origin-center transition-opacity pointer-events-none z-10"
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-300 stroke-1 z-10 mb-2" />
                )}
              </div>
            )}

            {/* France CNI contactless RFID purple badge indicator */}
            {project.countryCode === 'FR' && (
              <div 
                className="absolute w-[42px] h-[20px] rounded-[3px] bg-[#6d28d9] flex items-center justify-center border border-indigo-900/10 pointer-events-none shadow-sm"
                style={{
                  right: '17px',
                  top: '128px',
                }}
              >
                <svg className="w-full h-full stroke-white fill-none stroke-[1.8px]" viewBox="0 0 44 22">
                  <line x1="4" y1="11" x2="40" y2="11" opacity="0.9" />
                  <circle cx="22" cy="11" r="5.2" fill="#6d28d9" strokeWidth="2.2" />
                  <circle cx="22" cy="11" r="2" fill="white" stroke="none" />
                </svg>
              </div>
            )}

            {/* Bottom official details for CNI (Tricolor ribbon separating MRZ) */}
            {template.id === 'france-cni' && (
              <div 
                className="absolute left-[4%] right-[4%] flex items-center justify-between"
                style={{ top: '71.5%' }}
              >
                {/* Left blue dashed line of security */}
                <div className="flex-1 h-[1.5px] bg-gradient-to-r from-blue-700/80 to-blue-500/80 opacity-80" />
                
                {/* Central Bold Nation Banner */}
                <span className="mx-3 text-[7.5px] font-black tracking-widest text-[#1e3a8a] uppercase font-sans whitespace-nowrap">
                  RÉPUBLIQUE FRANÇAISE
                </span>
                
                {/* Right red dashed line of security */}
                <div className="flex-1 h-[1.5px] bg-gradient-to-r from-red-500/80 to-red-700/80 opacity-80" />
              </div>
            )}

            {/* Standard Machine Readable Zone (MRZ) bottom segment on the back card */}
            {template.category === 'id' && (
              <div
                onMouseDown={(e) => handleMouseDown(e, 'system', 'mrz_element', getPos('mrz_element', 2.5, 76.5))}
                onTouchStart={(e) => handleTouchStart(e, 'system', 'mrz_element', getPos('mrz_element', 2.5, 76.5))}
                style={{
                  left: `${getPos('mrz_element', 2.5, 76.5).x}%`,
                  top: `${getPos('mrz_element', 2.5, 76.5).y}%`,
                  width: template.id === 'france-cni' ? '95%' : '92%',
                }}
                className={`absolute select-none font-mono flex flex-col font-black text-slate-950 leading-relaxed z-10 ${
                  template.id === 'france-cni'
                    ? 'tracking-[0.22em] text-[8.2px] md:text-[9.2px] bg-[#f8fafc]/10 px-1 py-1 rounded-sm'
                    : 'tracking-[0.14em] text-[7.2px] md:text-[7.8px] bg-[#f8fafc]/30 px-1.5 py-1 rounded-sm'
                } ${
                  isEditMode ? 'cursor-move ring-2 ring-indigo-500 ring-offset-1 border-dashed' : ''
                }`}
              >
                <span className="block w-full text-center tracking-[0.22em]">{mrzLines[0]}</span>
                <span className="block w-full text-center tracking-[0.22em]">{mrzLines[1]}</span>
                <span className="block w-full text-center tracking-[0.22em]">{mrzLines[2]}</span>
              </div>
            )}
          </>
        )}

        {/* ---------------------------------------------------- */}
        {/* DRAGGABLE RENDER FOR ACTIVE SIDE FIELDS              */}
        {/* ---------------------------------------------------- */}
        {currentSideFields.map((f, index) => {
          const val = project.fields[f.key] || '';
          if (!val) return null;

          // Smart coordinates distributed cleanly if user has not customized them yet
          const defaultY = isVertical ? 28 + (index * 6) : 18 + (index * 6);
          // Shift fields offset to prevent left overlapping on photo box
          let defaultX = 35;
          if (activeSide === 'verso' && template.category === 'id') {
            defaultX = 24; // shifts fields columns to the left slightly on the back of cards
          } else if (isVertical) {
            defaultX = 22;
          }

          const pos = getPos(`field_${f.key}`, defaultX, defaultY);
          if (!pos.visible) return null;

          // Split labels for indexes prefixing (e.g. "1. Nom")
          let listLabel = f.label;
          let labelNum = '';
          if (listLabel.match(/^\d+[a-z]?\.\s/)) {
            const matches = listLabel.match(/^(\d+[a-z]?\.)\s(.*)/);
            if (matches) {
              labelNum = matches[1];
              listLabel = matches[2];
            }
          }

          const isFranceCNI = template.id === 'france-cni';
          const isDocCode = f.key === 'doc_code';

          return (
            <div
              key={f.key}
              onMouseDown={(e) => handleMouseDown(e, 'field', `field_${f.key}`, pos)}
              onTouchStart={(e) => handleTouchStart(e, 'field', `field_${f.key}`, pos)}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              className={`absolute flex flex-col font-mono leading-none z-10 ${
                isEditMode ? 'p-1 -m-1 border border-indigo-400 border-dashed rounded cursor-move bg-indigo-50/20' : ''
              }`}
            >
              {/* Hide label completely for French control code in bas droite to match the photo */}
              {!(isFranceCNI && isDocCode) && (
                <div className="flex gap-0.5 items-baseline">
                  {labelNum && <span className={`${isFranceCNI ? 'text-[6.5px]' : 'text-[6px]'} font-black text-indigo-700/80 font-mono leading-none mr-0.5`}>{labelNum}</span>}
                  <span className={`${isFranceCNI ? 'text-[6.2px] tracking-[0.03em]' : 'text-[5.5px] md:text-[6px] tracking-[0.01em]'} text-slate-500 font-extrabold uppercase leading-none block whitespace-nowrap`}>
                    {listLabel}
                  </span>
                </div>
              )}
              
              {f.type === 'textarea' ? (
                <div className={`${
                  isFranceCNI 
                    ? 'text-[7px] md:text-[7.6px] font-mono font-black tracking-wide leading-normal mt-[3px]' 
                    : 'text-[7px] md:text-[7.5px] font-sans font-bold mt-[1.5px]'
                } text-slate-900 uppercase whitespace-pre-wrap ${isFranceCNI ? 'max-w-[240px]' : 'max-w-[175px]'}`}>
                  {val}
                </div>
              ) : (
                <span className={`${
                  isFranceCNI 
                    ? isDocCode 
                      ? 'text-[11px] md:text-[11.5px] font-mono tracking-[0.08em] font-black mt-1' 
                      : 'text-[9.2px] md:text-[9.7px] font-sans font-extrabold tracking-wide mt-[2px]'
                      : 'text-[8px] md:text-[8.5px] font-sans font-bold mt-[1.5px]'
                } text-slate-900 uppercase truncate ${isFranceCNI ? 'max-w-[215px]' : 'max-w-[175px]'} leading-tight`}>
                  {f.type === 'date' 
                    ? isFranceCNI 
                      ? val.split('-').reverse().join(' ') 
                      : val.split('-').reverse().join('/') 
                    : val
                  }
                </span>
              )}
            </div>
          );
        })}

        {/* ---------------------------------------------------- */}
        {/* COMMON ELEMENTS ON BOTH RECTO/VERSO SIDES            */}
        {/* SIGNATURES, CUSTOM USER TEXT HOOKS                   */}
        {/* ---------------------------------------------------- */}

        {/* Signature overlay (shown based on side config or on front) */}
        {project.showSignatureOnCard && project.signature.type !== 'none' && activeSide === 'recto' && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'system', 'signature_element', getPos('signature_element', 65, 54))}
            onTouchStart={(e) => handleTouchStart(e, 'system', 'signature_element', getPos('signature_element', 65, 54))}
            style={{
              left: `${getPos('signature_element', 65, 54).x}%`,
              top: `${getPos('signature_element', 65, 54).y}%`,
            }}
            className={`absolute flex flex-col leading-none pointer-events-auto z-10 ${
              isEditMode ? 'p-1 -m-1 border border-indigo-500 border-dashed rounded cursor-move bg-indigo-50/20' : ''
            }`}
          >
            <span className="text-[5px] font-bold text-slate-400 uppercase font-mono block mb-0.5 pointer-events-none">Signature</span>
            <div className="min-w-16 min-h-6 flex items-center justify-center">
              {project.signature.type === 'draw' && project.signature.dataUrl ? (
                <img
                  src={project.signature.dataUrl || ''}
                  alt="Custom signature"
                  crossOrigin="anonymous"
                  className="h-6 object-contain filter max-w-[90px] pointer-events-none"
                  style={{
                    filter: project.signature.color === '#dc2626' ? 'hue-rotate(340deg)' : project.signature.color === '#1e3a8a' ? 'hue-rotate(220deg)' : 'none'
                  }}
                />
              ) : project.signature.type === 'text' ? (
                <span 
                  className={`text-xs block select-none max-w-[110px] truncate print:text-black ${
                    SIGNATURE_FONTS.find((f) => f.key === project.signature.font)?.className || 'font-[cursive] font-semibold italic'
                  }`}
                  style={{ 
                    color: project.signature.color,
                  }}
                >
                  {project.signature.text || 'J. Dupont'}
                </span>
              ) : (
                <span className="text-[6px] text-slate-300 font-mono italic">Sans signature</span>
              )}
            </div>
          </div>
        )}

        {/* Custom text injectors */}
        {project.customTexts.map((txt) => (
          <div
            key={txt.id}
            onMouseDown={(e) => handleMouseDown(e, 'custom', txt.id, { x: txt.x, y: txt.y })}
            onTouchStart={(e) => handleTouchStart(e, 'custom', txt.id, { x: txt.x, y: txt.y })}
            style={{
              left: `${txt.x}%`,
              top: `${txt.y}%`,
              fontSize: `${txt.fontSize}px`,
              color: txt.color,
              fontWeight: txt.bold ? 'bold' : 'normal',
            }}
            className={`absolute tracking-wide leading-none select-none font-sans whitespace-nowrap uppercase z-10 ${
              isEditMode ? 'p-1 -m-1 border border-dashed border-rose-500 rounded cursor-move bg-rose-50/20' : ''
            }`}
          >
            {txt.text}
          </div>
        ))}
      </div>

      {/* Detail bar specifications */}
      <div className="flex gap-4 mt-3 text-[10px] text-slate-500 font-medium select-none">
        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Format standard ID-1 : 85.6 x 53.98 mm • Face active : <strong className="text-indigo-600 uppercase font-bold">{activeSide === 'recto' ? 'Recto (Face)' : 'Verso (Dos)'}</strong></span>
        </div>
      </div>
    </div>
  );
}
