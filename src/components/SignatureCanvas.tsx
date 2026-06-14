/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Edit2, Type, Slash, Briefcase } from 'lucide-react';
import { SIGNATURE_FONTS } from '../templatesData';

export const ADMINISTRATIVE_PRESETS = [
  {
    id: 'prefet',
    name: "Le Préfet de Police",
    text: "P. Lallement",
    title: "Préfet de Police",
    color: "#1e3a8a",
    font: "cursive1",
    paths: [
      "M 25 45 C 50 15, 70 20, 85 45 C 100 65, 120 55, 150 30 C 170 15, 160 75, 185 65 C 210 55, 230 35, 255 50",
      "M 55 60 C 100 62, 150 64, 225 58",
      "M 135 25 C 140 55, 120 85, 150 80 C 170 75, 190 40, 175 30"
    ]
  },
  {
    id: 'ministre',
    name: "Le Ministre de l'Intérieur",
    text: "G. Darmanin",
    title: "Cabinet du Ministre",
    color: "#0f172a",
    font: "cursive4",
    paths: [
      "M 30 30 C 45 70, 55 75, 75 40 C 95 0, 80 90, 105 70 C 130 50, 155 30, 175 50 C 195 70, 205 25, 225 30 C 245 35, 255 60, 265 45",
      "M 90 55 L 235 47"
    ]
  },
  {
    id: 'etat_civil',
    name: "L'Officier d'État Civil",
    text: "M. Delarue",
    title: "Officier d'État Civil",
    color: "#3b82f6",
    font: "cursive2",
    paths: [
      "M 20 55 C 50 50, 70 25, 90 40 C 110 55, 120 80, 150 55 C 180 30, 200 20, 215 50 C 230 75, 245 65, 260 40",
      "M 35 40 C 80 35, 155 53, 240 45"
    ]
  },
  {
    id: 'maire',
    name: "Le Maire d'Arrondissement",
    text: "H. de Vignaud",
    title: "Le Maire Adjoint",
    color: "#dc2626",
    font: "cursive1",
    paths: [
      "M 30 40 C 55 20, 80 85, 90 50 C 100 15, 125 10, 140 45 C 155 80, 170 75, 190 40 C 210 10, 220 85, 235 70 C 250 55, 255 40, 260 50",
      "M 65 60 C 125 55, 185 57, 245 63"
    ]
  },
  {
    id: 'secretaire',
    name: "Le Secrétaire Général",
    text: "A. de Montgolfier",
    title: "Secrétariat Général",
    color: "#1e3a8a",
    font: "cursive4",
    paths: [
      "M 20 35 C 40 15, 55 75, 75 55 C 95 35, 115 25, 135 65 C 155 105, 175 35, 195 45 C 215 55, 225 80, 245 35",
      "M 110 50 C 160 45, 210 47, 260 53"
    ]
  },
  {
    id: 'ambassadeur',
    name: "L'Ambassadeur Consulaire",
    text: "V. Saxenberg",
    title: "Le Consul Général",
    color: "#0f172a",
    font: "cursive2",
    paths: [
      "M 35 25 C 50 50, 65 75, 90 60 C 115 45, 135 20, 150 50 C 165 80, 180 65, 195 40 C 210 15, 225 85, 250 55",
      "M 25 65 L 255 50"
    ]
  }
];

const generatePresetDataUrl = (paths: string[], color: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 260;
  canvas.height = 85;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, 260, 85);
    
    paths.forEach(pStr => {
      if (typeof Path2D !== 'undefined') {
        const p2d = new Path2D(pStr);
        ctx.stroke(p2d);
      }
    });
    return canvas.toDataURL();
  }
  return '';
};

interface SignatureCanvasProps {
  signature: {
    type: 'draw' | 'text' | 'none';
    dataUrl: string | null;
    text: string;
    font: string;
    color: string;
  };
  onChange: (sig: any) => void;
}

export default function SignatureCanvas({ signature, onChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'draw' | 'text' | 'examples' | 'none'>(() => {
    if (signature.type === 'none') return 'none';
    if (signature.type === 'text') return 'text';
    return 'draw';
  });

  // NEW: Disable default viewport scrolling when dragging/drawing on the canvas on touch screen devices
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeTab]);

  // Initialize and redraw signature if type is "draw"
  useEffect(() => {
    if (signature.type === 'draw' && canvasRef.current && activeTab === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = signature.color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // If there's persistent signature data, load it onto canvas
        if (signature.dataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = signature.dataUrl;
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw subtle watermark placeholder
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('Dessinez ici votre signature / Sign here', 20, 45);
        }
      }
    }
  }, [signature.type, signature.color, signature.dataUrl, activeTab]);

  // Synchronize dynamic preset colors
  useEffect(() => {
    if (activeTab === 'examples' && selectedPresetId) {
      const preset = ADMINISTRATIVE_PRESETS.find(p => p.id === selectedPresetId);
      if (preset) {
        const dataUrl = generatePresetDataUrl(preset.paths, signature.color);
        onChange({
          ...signature,
          dataUrl
        });
      }
    }
  }, [signature.color, selectedPresetId, activeTab]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear placeholder text upon first interaction
    if (!signature.dataUrl) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    
    const dataUrl = canvasRef.current.toDataURL();
    setSelectedPresetId(null); // break preset link since it's custom drawn now
    onChange({
      ...signature,
      dataUrl
    });
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    onChange({
      ...signature,
      dataUrl: null
    });
  };

  const handleTabChange = (tab: 'draw' | 'text' | 'examples' | 'none') => {
    setActiveTab(tab);
    if (tab === 'none') {
      onChange({
        ...signature,
        type: 'none',
        dataUrl: null
      });
    } else if (tab === 'text') {
      onChange({
        ...signature,
        type: 'text'
      });
    } else if (tab === 'draw') {
      onChange({
        ...signature,
        type: 'draw',
        dataUrl: selectedPresetId ? signature.dataUrl : null
      });
    } else if (tab === 'examples') {
      const pId = selectedPresetId || 'prefet';
      setSelectedPresetId(pId);
      const preset = ADMINISTRATIVE_PRESETS.find(p => p.id === pId);
      if (preset) {
        const dataUrl = generatePresetDataUrl(preset.paths, signature.color);
        onChange({
          ...signature,
          type: 'draw',
          dataUrl,
          text: preset.text,
          font: preset.font,
        });
      }
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = ADMINISTRATIVE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      const dataUrl = generatePresetDataUrl(preset.paths, signature.color);
      onChange({
        ...signature,
        type: 'draw',
        dataUrl,
        text: preset.text,
        font: preset.font,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...signature,
      text: e.target.value
    });
  };

  const handleFontChange = (font: string) => {
    onChange({
      ...signature,
      font
    });
  };

  const handleColorChange = (color: string) => {
    onChange({
      ...signature,
      color
    });
  };

  return (
    <div className="space-y-3.5 border border-slate-200 bg-white rounded-xl p-4" id="signature-input-panel">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 md:flex-row md:items-center md:justify-between">
        <span className="text-xs font-semibold text-slate-700">Signature officielle</span>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('draw')}
            className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition ${
              activeTab === 'draw'
                ? 'bg-white shadow text-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit2 className="w-2.5 h-2.5" />
            Dessiner
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('examples')}
            className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition ${
              activeTab === 'examples'
                ? 'bg-white shadow text-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-2.5 h-2.5" />
            Exemples Admin.
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('text')}
            className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition ${
              activeTab === 'text'
                ? 'bg-white shadow text-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-2.5 h-2.5" />
            Texte
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('none')}
            className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition ${
              activeTab === 'none'
                ? 'bg-white shadow text-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Slash className="w-2.5 h-2.5" />
            Sans
          </button>
        </div>
      </div>

      {/* Signature Color selection */}
      {activeTab !== 'none' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-slate-400">Encre:</span>
          <div className="flex gap-1.5">
            {['#0f172a', '#1e3a8a', '#dc2626', '#3b82f6'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                style={{ backgroundColor: color }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  signature.color === color
                    ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                    : 'border-white/25 opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mode Draw Canvas */}
      {activeTab === 'draw' && (
        <div className="space-y-2">
          <div className="relative border border-slate-200 bg-slate-50 rounded-lg overflow-hidden h-24 flex items-center justify-center touch-none">
            <canvas
              ref={canvasRef}
              width={260}
              height={85}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
              className="bg-transparent cursor-crosshair block touch-none"
              id="raw-signature-board"
            />
            {signature.dataUrl && (
              <button
                type="button"
                onClick={clearCanvas}
                className="absolute bottom-1 right-1 p-1 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg"
                title="Effacer la signature"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-[9px] text-slate-400 font-mono text-center">Déplacez la souris ou utilisez le doigt pour signer dans le cadre.</p>
        </div>
      )}

      {/* NEW: Administrative Examples Grid Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-medium text-slate-500">Choisissez un modèle d'autorité administrative :</p>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {ADMINISTRATIVE_PRESETS.map((preset) => {
              const isActive = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all group ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="mb-1 leading-normal">
                    <p className="text-[10px] font-bold text-slate-800 leading-tight truncate">{preset.name}</p>
                    <p className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">{preset.title}</p>
                  </div>
                  
                  {/* Inline SVG Preview of Signature Paths */}
                  <div className="h-10 w-full bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 relative overflow-hidden">
                    <svg
                      viewBox="0 0 280 90"
                      className="w-full h-full object-contain pointer-events-none transition-transform group-hover:scale-105"
                    >
                      {preset.paths.map((pStr, idx) => (
                        <path
                          key={idx}
                          d={pStr}
                          fill="none"
                          stroke={signature.color}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                    <span className="absolute bottom-0 right-1 text-[8px] font-normal text-slate-400 font-[cursive]">
                      {preset.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-slate-400 font-mono leading-normal">
            * L'encre de la signature s'adapte automatiquement à la couleur d'encre sélectionnée ci-dessus.
          </p>
        </div>
      )}

      {/* Mode Styled Text */}
      {activeTab === 'text' && (
        <div className="space-y-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Entrez votre signature</label>
            <input
              type="text"
              value={signature.text}
              onChange={handleTextChange}
              placeholder="J. Dupont"
              maxLength={24}
              className="w-full text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50"
            />
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-500 mb-1.5">Style d'écriture</span>
            <div className="grid grid-cols-2 gap-1.5">
              {SIGNATURE_FONTS.map((font) => (
                <button
                  key={font.key}
                  type="button"
                  onClick={() => handleFontChange(font.key)}
                  className={`px-2 py-1.5 text-left rounded-lg border transition ${
                    signature.font === font.key
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="text-[10px] text-slate-400 uppercase font-mono leading-none mb-1">{font.name}</p>
                  <p className={`text-sm truncate ${font.className}`} style={{ color: signature.color }}>
                    {signature.text || 'Signature'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'none' && (
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center text-slate-400 text-[11px] leading-relaxed">
          Aucune signature ne sera affichée sur la carte d'identité ou le badge.
        </div>
      )}
    </div>
  );
}
