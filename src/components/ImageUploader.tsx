/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, RotateCw, ZoomIn, ZoomOut, Sliders, RefreshCw, Eye } from 'lucide-react';
import { PhotoConfig } from '../types';

interface ImageUploaderProps {
  photoConfig: PhotoConfig;
  onChange: (config: PhotoConfig) => void;
}

export default function ImageUploader({ photoConfig, onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMess, setErrorMess] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMess("Veuillez sélectionner un fichier image valide (PNG, JPEG, WEBP).");
      return;
    }
    
    // Check size limit: 5MB for base64 storage limits
    if (file.size > 5 * 1024 * 1024) {
      setErrorMess("Image trop volumineuse. Veuillez choisir une image de moins de 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onChange({
          ...photoConfig,
          url: e.target.result,
          zoom: 1.1,
          rotation: 0,
          x: 0,
          y: 0,
        });
        setErrorMess(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const updateConfig = (key: keyof PhotoConfig, value: any) => {
    onChange({
      ...photoConfig,
      [key]: value,
    });
  };

  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, photoX: 0, photoY: 0 });

  const handlePhotoMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      photoX: photoConfig.x,
      photoY: photoConfig.y
    });
  };

  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingPhoto) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    onChange({
      ...photoConfig,
      x: dragStart.photoX + dx,
      y: dragStart.photoY + dy
    });
  };

  const handlePhotoMouseUp = () => {
    setIsDraggingPhoto(false);
  };

  const handlePhotoTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDraggingPhoto(true);
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        photoX: photoConfig.x,
        photoY: photoConfig.y
      });
    }
  };

  const handlePhotoTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingPhoto || e.touches.length !== 1) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;
    onChange({
      ...photoConfig,
      x: dragStart.photoX + dx,
      y: dragStart.photoY + dy
    });
  };

  const handlePhotoWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomStep = 0.05;
    const zoomDelta = e.deltaY < 0 ? zoomStep : -zoomStep;
    const newZoom = Math.min(Math.max(photoConfig.zoom + zoomDelta, 1.0), 4);
    onChange({
      ...photoConfig,
      zoom: parseFloat(newZoom.toFixed(2))
    });
  };

  const resetPhoto = () => {
    updateConfig('url', null);
  };

  return (
    <div className="space-y-4" id="photo-uploader-section">
      {errorMess && (
        <div id="upload-error" className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs leading-relaxed">
          {errorMess}
        </div>
      )}

      {!photoConfig.url ? (
        <div
          id="dropzone-area"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-50/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-500 mb-3">
            <Upload className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="font-medium text-xs text-slate-700">Déposer la photo policière ou cliquer</p>
          <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP jusqu'à 5 Mo</p>
        </div>
      ) : (
        <div className="space-y-4 border border-slate-200 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Ajustements Photo (Glisser-Déposer ou Molette)</span>
            </div>
            <button
              onClick={resetPhoto}
              className="text-[11px] font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
            >
              Changer d'image
            </button>
          </div>

          {/* Visual Crop Preview / Control Interface */}
          <div 
            className="relative h-44 bg-slate-950 overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center select-none touch-none"
            onMouseDown={handlePhotoMouseDown}
            onMouseMove={handlePhotoMouseMove}
            onMouseUp={handlePhotoMouseUp}
            onMouseLeave={handlePhotoMouseUp}
            onTouchStart={handlePhotoTouchStart}
            onTouchMove={handlePhotoTouchMove}
            onTouchEnd={handlePhotoMouseUp}
            onWheel={handlePhotoWheel}
            style={{ cursor: isDraggingPhoto ? 'grabbing' : 'grab' }}
          >
            <div 
              className="relative w-28 h-36 border-2 border-dashed border-indigo-400 bg-slate-900/40 rounded overflow-hidden flex items-center justify-center transition-shadow shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Target guidelines */}
              <div className="absolute inset-0 border border-white/20 pointer-events-none z-10">
                {/* Crosshairs */}
                <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-white/30"></div>
                {/* Silhouette guideline */}
                <div className="absolute top-4 left-6 right-6 bottom-4 border-2 border-white/10 rounded-[50%] pointer-events-none"></div>
              </div>

              <img
                src={photoConfig.url}
                alt="Original crop"
                className="absolute w-full h-full object-cover origin-center transition-all duration-100 pointer-events-none"
                style={{
                  transform: `translate(${photoConfig.x}px, ${photoConfig.y}px) scale(${photoConfig.zoom}) rotate(${photoConfig.rotation}deg)`,
                  filter: 
                    photoConfig.filter === 'grayscale' 
                      ? `grayscale(1) contrast(${photoConfig.contrast}%) brightness(${photoConfig.brightness}%)`
                      : photoConfig.filter === 'security'
                      ? `grayscale(1) contrast(${photoConfig.contrast + 20}%) brightness(${photoConfig.brightness + 10}%)`
                      : photoConfig.filter === 'sepia'
                      ? `sepia(0.8) contrast(${photoConfig.contrast}%) brightness(${photoConfig.brightness}%)`
                      : photoConfig.filter === 'contrast-high'
                      ? `contrast(${photoConfig.contrast + 40}%) brightness(${photoConfig.brightness}%)`
                      : `contrast(${photoConfig.contrast}%) brightness(${photoConfig.brightness}%)`
                }}
              />
            </div>
            
            {/* Position Pan Controls inside viewport */}
            <div className="absolute bottom-2 right-2 flex bg-black/70 p-1.5 rounded-lg border border-white/10 gap-1 text-[10px] text-white">
              <Eye className="w-3 h-3 text-emerald-400 self-center" />
              <span>Ajusté pour la carte</span>
            </div>
            <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[9px] text-indigo-300 font-bold border border-indigo-500/30">
              Drag image to pan • Wheel to zoom
            </div>
          </div>

          {/* Sizing, Rotation, filter options */}
          <div className="space-y-3">
            {/* Position Adjuster Controls */}
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>Centrage Horizontal / Vertical</span>
                <button 
                  onClick={() => { updateConfig('x', 0); updateConfig('y', 0); }}
                  className="text-indigo-600 hover:underline"
                >
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono w-4 text-slate-400">X:</span>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    value={photoConfig.x}
                    onChange={(e) => updateConfig('x', parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono w-4 text-slate-400">Y:</span>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    value={photoConfig.y}
                    onChange={(e) => updateConfig('y', parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Zoom / Rotation controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Zoom ({Math.round(photoConfig.zoom * 100)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="1.0"
                    max="4"
                    step="0.05"
                    value={photoConfig.zoom}
                    onChange={(e) => updateConfig('zoom', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Rotation ({photoConfig.rotation}°)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 animate-spin-slow" onClick={() => updateConfig('rotation', (photoConfig.rotation + 90) % 360)} />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={photoConfig.rotation}
                    onChange={(e) => updateConfig('rotation', parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div>
              <span className="block text-[11px] font-medium text-slate-600 mb-1.5">Style de photo administrative</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'none', label: 'Couleur réelle' },
                  { key: 'grayscale', label: 'Noir & Blanc' },
                  { key: 'security', label: 'Style Identité' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => updateConfig('filter', f.key)}
                    className={`px-1.5 py-1 text-[10px] text-center font-medium rounded-lg border transition-all ${
                      photoConfig.filter === f.key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {photoConfig.filter === 'security' && (
                <p className="text-[9px] text-emerald-600 mt-1 font-medium">✨ Filtre optimisé officiel : désaturation + contraste accentué.</p>
              )}
            </div>

            {/* Advanced sliders (Contrast & brightness) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  <span>Luminosité & Contraste</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>Brillance</span>
                    <span>{photoConfig.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={photoConfig.brightness}
                    onChange={(e) => updateConfig('brightness', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>Contraste</span>
                    <span>{photoConfig.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={photoConfig.contrast}
                    onChange={(e) => updateConfig('contrast', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
