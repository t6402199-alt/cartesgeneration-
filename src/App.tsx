/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  FileDown, 
  RotateCcw, 
  Sparkles, 
  Edit, 
  Save, 
  FolderLock, 
  Share2, 
  Undo2, 
  Info, 
  HelpCircle, 
  Palette, 
  Eye, 
  EyeOff, 
  Type, 
  ChevronRight,
  MapPin, 
  Copy,
  FolderSync,
  FileCode,
  MessageCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { CardProject, CardTemplate, DragItemPosition, CustomText, PhotoConfig } from './types';
import { TEMPLATES, COUNTRY_LOGOS } from './templatesData';
import CardPreview from './components/CardPreview';
import ImageUploader from './components/ImageUploader';
import SignatureCanvas from './components/SignatureCanvas';
import TemplateLibrary from './components/TemplateLibrary';

// Default initial config for profile photographs
const DEFAULT_PHOTO: PhotoConfig = {
  url: null,
  zoom: 1.1,
  rotation: 0,
  x: 0,
  y: 0,
  filter: 'security',
  contrast: 105,
  brightness: 100,
};

// Help helper lists of realistic mock info to prefill
const MOCK_IDENTITIES = [
  {
    nom: 'MARTIN',
    prenoms: 'JEAN FRANÇOIS',
    date_naissance: '1984-06-12',
    lieu_naissance: 'NICE (06)',
    sexe: 'M',
    nationalite: 'FRA',
    adresse: '45 AVENUE DE LA RÉPUBLIQUE\n06000 NICE',
    taille: '1.82',
    doc_num: '2F0518923',
    permis_num: '22AF0918',
    secu_num: '184060612345678',
    assure_num: '1 84 06 06 123 456',
    inst_num: '10002 (CPAM)',
    card_num: 'FR84051259',
    etudiant_num: 'ST829551',
    filiere: 'Économie et Gestion',
    media: 'LE PROGRÈS EUROPÉEN',
    fonction: 'REPORTER PHOTO',
    carte_num: 'PRESS-510A',
    entreprise: 'THALES SECTOR SYSTEMS',
    matricule: 'SEC-8910',
    access_level: 'NIVEAU A (TOTAL)',
    zone_autorisee: 'ZONES 1, 2, 3 ET DATA-SERVER',
  },
  {
    nom: 'SOMMER',
    prenoms: 'ANNELIESE',
    date_naissance: '1993-10-09',
    lieu_naissance: 'MUNICH (DE)',
    sexe: 'F',
    nationalite: 'DEU',
    adresse: 'SCHWANTHALERSTRASSE 12\n80336 MÜNCHEN',
    taille: '1.69',
    doc_num: 'D2A772591',
    permis_num: '89AE1029',
    secu_num: '293100912345601',
    assure_num: '2 93 10 09 123 456',
    inst_num: 'AOK BAYERN',
    card_num: 'DE10295111',
    etudiant_num: 'ST102933',
    filiere: 'Informatique Appliquée',
    media: 'SÜDDEUTSCHE TAGEBLATT',
    fonction: 'JOURNALISTE SCIENCE',
    carte_num: 'PRESS-918B',
    entreprise: 'KRAUSS COMPUTING',
    matricule: 'SEC-4509',
    access_level: 'NIVEAU B (RESERVE)',
    zone_autorisee: 'HQ-MUNICH, BLDG 4',
  },
  {
    nom: 'SANCHEZ',
    prenoms: 'ALEJANDRO',
    date_naissance: '1989-02-28',
    lieu_naissance: 'BARCELONA (ES)',
    sexe: 'M',
    nationalite: 'ESP',
    adresse: 'CALLE DE ARAGÓN 254\n08007 BARCELONA',
    taille: '1.75',
    doc_num: 'ES8912345',
    permis_num: '33BB1920',
    secu_num: '189022812345610',
    assure_num: '1 89 02 28 123 456',
    inst_num: 'SEGURIDAD SOCIAL',
    card_num: 'ES99210452',
    etudiant_num: 'ST992015',
    filiere: 'Histoire de l\'Art',
    media: 'EL DIARIO GLOBAL',
    fonction: 'CHEF DE RUBRIQUE',
    carte_num: 'PRESS-011E',
    entreprise: 'TELEFONICA DIGITAL',
    matricule: 'SEC-3321',
    access_level: 'NIVEAU A (TOTAL)',
    zone_autorisee: 'ZONAS LAB, GENERAL',
  }
];

export default function App() {
  const [projects, setProjects] = useState<CardProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'template' | 'fields' | 'appearance' | 'texts' | 'help'>('template');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeSide, setActiveSide] = useState<'recto' | 'verso'>('recto');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Custom states for high quality previews
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Custom text builders
  const [newCustomText, setNewCustomText] = useState('');
  const [newCustomSize, setNewCustomSize] = useState(10);
  const [newCustomColor, setNewCustomColor] = useState('#1e3a8a');
  const [newCustomBold, setNewCustomBold] = useState(true);

  // Status for exporting actions
  const [isExporting, setIsExporting] = useState(false);

  // Manually added image placement options
  const [imagePlacementMode, setImagePlacementMode] = useState<'recto_center' | 'verso_center' | 'verso_vertical_stack' | 'verso_slot_1' | 'verso_slot_2'>('verso_vertical_stack');

  // Load project configurations on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('administrative_card_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved projects', e);
    }
    
    // Boot up with a default project
    const defaultProj = createNewProject('france-cni', "Ma Carte d'Identité");
    setProjects([defaultProj]);
    setActiveProjectId(defaultProj.id);
  }, []);

  // Save projects on update automatically (la sauvegarde automatique requested)
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('administrative_card_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Helper notice manager
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Build structure for a brand new project
  const createNewProject = (templateId: string, customName?: string): CardProject => {
    const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    const countryCode = template.countryCode === 'EU' ? 'FR' : template.countryCode;

    // Build default fields dictionary
    const fields: Record<string, string> = {};
    template.fields.forEach((f) => {
      fields[f.key] = f.defaultValue || '';
    });

    // Make default position presets
    const positions: Record<string, DragItemPosition> = {
      photo_element: { x: template.dimensions.width > template.dimensions.height ? 4.5 : 22, y: 16, visible: true },
      chip_element: { x: 74, y: 16, visible: true },
      signature_element: templateId === 'france-cni' ? { x: 44, y: 58, visible: true } : { x: 72, y: 52, visible: true },
      code_element: { x: 70, y: 70, visible: true },
      mrz_element: { x: 4, y: 82, visible: true }
    };

    if (templateId === 'france-cni') {
      positions.field_doc_code = { x: 44, y: 51, visible: true };
    }

    return {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: customName || `Nouveau Projet (${template.name})`,
      templateId: templateId as any,
      countryCode,
      fields,
      photo: { ...DEFAULT_PHOTO },
      signature: {
        type: 'draw',
        dataUrl: null,
        text: 'N. Dupont',
        font: 'cursive1',
        color: '#1e3a8a',
      },
      positions,
      customTexts: [],
      customImages: [],
      showSecurityOverlay: true,
      showChip: template.category === 'id' || template.id === 'france-vitale',
      showSignatureOnCard: template.category === 'id' || template.category === 'permit' || template.id === 'press-badge',
      showBarcodeOrQR: template.category === 'badge' || template.id === 'student-card',
      updatedAt: new Date().toISOString(),
    };
  };

  const handleAddNewProject = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    const proj = createNewProject(templateId, `Projet - ${template.name}`);
    setProjects([proj, ...projects]);
    setActiveProjectId(proj.id);
    setActiveTab('fields');
    showToast(`Nouveau projet créé d'après le modèle ${template.name}`, 'success');
  };

  // Switch template for existing project
  const handleSwitchTemplate = (template: CardTemplate) => {
    if (!activeProject) return;

    // Build default fields dictionary
    const fields: Record<string, string> = {};
    template.fields.forEach((f) => {
      fields[f.key] = f.defaultValue || '';
    });

    const isVert = template.dimensions.height > template.dimensions.width;

    const updated = {
      ...activeProject,
      templateId: template.id,
      countryCode: template.countryCode === 'EU' ? 'FR' : template.countryCode,
      fields,
      showChip: template.category === 'id' || template.id === 'france-vitale',
      showSignatureOnCard: template.category === 'id' || template.category === 'permit' || template.id === 'press-badge',
      showBarcodeOrQR: template.category === 'badge' || template.id === 'student-card',
      positions: {
        ...activeProject.positions,
        photo_element: { x: isVert ? 22 : 4.5, y: 16, visible: true },
        chip_element: { x: isVert ? 74 : 74, y: 16, visible: true },
        signature_element: { x: isVert ? 35 : 72, y: isVert ? 82 : 52, visible: true },
        code_element: { x: isVert ? 75 : 70, y: isVert ? 82 : 70, visible: true },
      },
      updatedAt: new Date().toISOString(),
    };

    updateActiveProject(updated);
    showToast(`Modèle remplace par : ${template.name}`, 'info');
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeTemplate = activeProject 
    ? TEMPLATES.find((t) => t.id === activeProject.templateId) || TEMPLATES[0]
    : TEMPLATES[0];

  const updateActiveProject = (updated: CardProject) => {
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Fast filling with real country info (Remplissage automatique)
  const handleAutoFillWithMock = () => {
    if (!activeProject) return;
    
    // Choose appropriate mock data
    const randomIndex = Math.floor(Math.random() * MOCK_IDENTITIES.length);
    const mock = MOCK_IDENTITIES[randomIndex];

    const fieldsData: Record<string, string> = {};
    activeTemplate.fields.forEach((f) => {
      if (mock[f.key as keyof typeof mock]) {
        fieldsData[f.key] = mock[f.key as keyof typeof mock];
      } else {
        fieldsData[f.key] = f.defaultValue || '';
      }
    });

    // Update signature name with mock names (First letter name + Surname)
    const mockNameStr = `${mock.prenoms.split(' ')[0][0]}. ${mock.nom}`;

    const updated: CardProject = {
      ...activeProject,
      countryCode: mock.nationalite === 'DEU' ? 'DE' : mock.nationalite === 'ESP' ? 'ES' : activeProject.countryCode,
      fields: fieldsData,
      signature: {
        ...activeProject.signature,
        text: mockNameStr,
      },
      updatedAt: new Date().toISOString(),
    };

    updateActiveProject(updated);
    showToast(`Champs renseignés avec les données de simulation de ${mock.prenoms} ${mock.nom}`, 'success');
  };

  // Handle single field value change
  const handleFieldChange = (key: string, value: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      fields: {
        ...activeProject.fields,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
  };

  // Change dragging coordinates of system elements
  const handlePositionChange = (key: string, pos: DragItemPosition) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      positions: {
        ...activeProject.positions,
        [key]: pos,
      },
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
  };

  // Change dragging coordinates of user custom text boxes
  const handleCustomTextPositionChange = (id: string, x: number, y: number) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      customTexts: activeProject.customTexts.map((ct) => (ct.id === id ? { ...ct, x, y } : ct)),
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
  };

  // Change dragging coordinates of custom images
  const handleCustomImagePositionChange = (id: string, x: number, y: number) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      customImages: (activeProject.customImages || []).map((ci) => (ci.id === id ? { ...ci, x, y } : ci)),
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
  };

  // Add custom image
  const handleAddCustomImage = (
    url: string, 
    requestedWidth: number = 20,
    extra?: { x: number; y: number; side: 'recto' | 'verso'; id?: string }
  ) => {
    if (!activeProject) return;

    const customImages = [...(activeProject.customImages || [])];

    // If extra parameters exist and have id: we are either removing or setting a specific slot image
    if (extra && extra.id) {
      const slotId = extra.id;
      // If url is empty, it means REMOVING the image from that slot
      if (!url) {
        const updated = {
          ...activeProject,
          customImages: customImages.filter((im) => im.id !== slotId),
          updatedAt: new Date().toISOString(),
        };
        updateActiveProject(updated);
        showToast('Image du slot retirée', 'info');
        return;
      }

      // Otherwise, update or insert slot image
      const existingIndex = customImages.findIndex((img) => img.id === slotId);
      const newImg = {
        id: slotId,
        url: url,
        x: extra.x,
        y: extra.y,
        width: requestedWidth,
        opacity: 1,
        rotation: 0,
        side: extra.side,
      };

      if (existingIndex > -1) {
        customImages[existingIndex] = newImg;
      } else {
        customImages.push(newImg);
      }

      const updated = {
        ...activeProject,
        customImages: customImages,
        updatedAt: new Date().toISOString(),
      };
      updateActiveProject(updated);
      showToast('Image insérée dans la case !', 'success');
      return;
    }
    
    let targetSide: 'recto' | 'verso' = activeSide;
    let targetX = 35;
    let targetY = 35;

    if (imagePlacementMode === 'recto_center') {
      targetSide = 'recto';
      targetX = 35;
      targetY = 35;
    } else if (imagePlacementMode === 'verso_center') {
      targetSide = 'verso';
      targetX = 35;
      targetY = 35;
    } else if (imagePlacementMode === 'verso_vertical_stack') {
      targetSide = 'verso';
      
      // Calculate how many custom images already exist on the left side (x < 20) of the verso
      const leftVersoImages = customImages
        .filter(img => img.side === 'verso' && img.x < 20 && img.id !== 'slot_verso_tr_1' && img.id !== 'slot_verso_tr_2');
      const index = leftVersoImages.length;
      
      targetX = 4; // left margin (e.g. 4%)
      targetY = 4 + (index * 18); // height spacing (e.g. 18% per image)
      
      if (targetY > 78) {
        // Shift a column right or start overlapping
        const colShift = Math.floor(targetY / 80);
        targetX = Math.min(60, 4 + colShift * 14);
        targetY = 4 + ((index % 5) * 18);
      }
    } else if (imagePlacementMode === 'verso_slot_1') {
      handleAddCustomImage(url, 20, { x: 4, y: 8, side: 'verso', id: 'slot_verso_tr_1' });
      return;
    } else if (imagePlacementMode === 'verso_slot_2') {
      handleAddCustomImage(url, 20, { x: 4, y: 44, side: 'verso', id: 'slot_verso_tr_2' });
      return;
    }

    // Add base CustomImage item
    const newImg = {
      id: `img_${Date.now()}`,
      url: url,
      x: targetX,
      y: targetY,
      width: requestedWidth,
      opacity: 1,
      rotation: 0,
      side: targetSide,
    };

    const updated = {
      ...activeProject,
      customImages: [...customImages, newImg],
      updatedAt: new Date().toISOString(),
    };

    updateActiveProject(updated);
    showToast('Image insérée ! Activez le "Mode Édition" pour la glisser-déposer librement.', 'success');
  };

  // Remove a custom image
  const handleRemoveCustomImage = (id: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      customImages: (activeProject.customImages || []).filter((im) => im.id !== id),
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
    showToast('Image personnalisée retirée', 'info');
  };

  // Adjust properties of a custom image (rotation, opacity, width)
  const handleUpdateCustomImageProperty = (id: string, field: string, value: any) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      customImages: (activeProject.customImages || []).map((ci) => (ci.id === id ? { ...ci, [field]: value } : ci)),
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
  };

  const handleAddCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newCustomText.trim()) return;

    const newTxt: CustomText = {
      id: `txt_${Date.now()}`,
      text: newCustomText.toUpperCase(),
      x: 35, // centered area default
      y: 45,
      fontSize: newCustomSize,
      color: newCustomColor,
      bold: newCustomBold,
    };

    const updated = {
      ...activeProject,
      customTexts: [...activeProject.customTexts, newTxt],
      updatedAt: new Date().toISOString(),
    };

    updateActiveProject(updated);
    setNewCustomText('');
    showToast('Texte ajouté ! Glissez-le sur la carte en activant le Mode Édition.', 'success');
  };

  const handleRemoveCustomText = (id: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      customTexts: activeProject.customTexts.filter((t) => t.id !== id),
      updatedAt: new Date().toISOString(),
    };
    updateActiveProject(updated);
    showToast('Texte personnalisé retiré', 'info');
  };

  const handleDuplicateProject = (proj: CardProject) => {
    const duplicated: CardProject = {
      ...proj,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${proj.name} (copie)`,
      updatedAt: new Date().toISOString(),
    };
    setProjects([duplicated, ...projects]);
    setActiveProjectId(duplicated.id);
    showToast('Projet dupliqué avec succès !', 'success');
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      showToast("Impossible de supprimer l'unique projet restant. Veuillez en créer un nouveau d'abord.", 'error');
      return;
    }
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    setActiveProjectId(filtered[0].id);
    showToast('Projet supprimé de la sauvegarde', 'info');
  };

  const renameProject = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setProjects(projects.map((p) => (p.id === id ? { ...p, name: newName } : p)));
    showToast('Projet renommé', 'success');
  };

  // Helper to convert DataURL to Blob
  const dataURLtoBlob = (dataUrl: string): Blob => {
    try {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      console.error('Error converting dataURL to blob:', e);
      return new Blob([], { type: 'image/png' });
    }
  };

  // Helper to download an image from a DataURL
  const downloadImage = (dataUrl: string, filename: string = 'carte.png') => {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      console.error('Error in downloadImage:', e);
      showToast(`Échec du téléchargement direct : ${e.message || e}`, 'error');
    }
  };

  // Helper to download a blob securely (used for jsPDF)
  const downloadBlob = (blob: Blob, filename: string = 'carte.png') => {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error('Error in downloadBlob:', e);
      showToast(`Échec du téléchargement du fichier : ${e.message || e}`, 'error');
    }
  };

  // Dynamic side capture function that switches activeSide and captures image
  const captureSide = async (side: 'recto' | 'verso'): Promise<string | null> => {
    setActiveSide(side);
    // Wait for the DOM and styling to fully render
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.querySelector('#editor-card-container #print-card-target') || document.getElementById('print-card-target');
    if (!element) {
      throw new Error(`Élément #print-card-target introuvable pour la face ${side}`);
    }
    try {
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2.6, // Excellent quality-to-performance ratio, lightweight & reliable on Android
        backgroundColor: null,
        useCORS: true,
        allowTaint: false, // MANDATORY: avoids SecurityError with fonts/custom images
        logging: false,
        imageTimeout: 5000,
      });
      return canvas.toDataURL('image/png');
    } catch (e: any) {
      console.error('html2canvas exception:', e);
      throw new Error(`html2canvas a échoué sur ${side}: ${e.message || e}`);
    }
  };

  // PDF Export logic representing true standard millimetric sizes using jsPDF & html2canvas
  const handleExportPDF = async () => {
    if (!activeProject || !activeTemplate) return;
    setIsExporting(true);
    const savedSide = activeSide;
    const savedEditMode = isEditMode;
    
    // Disable edit mode visual indicators temporarily
    setIsEditMode(false);
    showToast("Génération du PDF recto/verso de haute qualité...", 'info');

    try {
      // 1. Capture Recto
      const rectoData = await captureSide('recto');
      if (!rectoData) throw new Error("Échec du rendu de la face Recto.");

      // 2. Capture Verso
      const versoData = await captureSide('verso');
      if (!versoData) throw new Error("Échec du rendu de la face Verso.");

      const isVert = activeTemplate.dimensions.height > activeTemplate.dimensions.width;
      const docWidth = activeTemplate.dimensions.width;
      const docHeight = activeTemplate.dimensions.height;

      // 3. Assemble PDF
      const pdf = new jsPDF({
        orientation: isVert ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [docWidth, docHeight],
      });

      // Add Recto (first page)
      pdf.addImage(rectoData, 'PNG', 0, 0, docWidth, docHeight);
      
      // Add Verso (second page)
      pdf.addPage([docWidth, docHeight], isVert ? 'portrait' : 'landscape');
      pdf.addImage(versoData, 'PNG', 0, 0, docWidth, docHeight);

      // Save PDF natively via jsPDF's built-in robust downloader (optimal for mobile & desktop)
      pdf.save(`Carte_RectoVerso_${activeProject.name.replace(/\s+/g, '_')}.pdf`);
      showToast("PDF double page (Recto & Verso) téléchargé avec succès !", 'success');
    } catch (err: any) {
      console.error('Export error', err);
      showToast(`Échec de la génération PDF : ${err.message || err}`, 'error');
    } finally {
      setActiveSide(savedSide);
      setIsEditMode(savedEditMode);
      setIsExporting(false);
    }
  };

  // High Resolution Image download for both sides
  const handleExportPNG = async () => {
    if (!activeProject) return;
    setIsExporting(true);
    const savedSide = activeSide;
    const savedEditMode = isEditMode;

    // Disable edit mode visual indicators temporarily
    setIsEditMode(false);
    showToast("Génération des images haute définition (Recto & Verso)...", 'info');

    try {
      // Capture Recto
      const rectoData = await captureSide('recto');
      if (rectoData) {
        downloadImage(rectoData, `Carte_${activeProject.name.replace(/\s+/g, '_')}_Recto.png`);
      } else {
        throw new Error("Échec du rendu de la face Recto.");
      }

      // Small pause to prevent browser downloads blocking
      await new Promise((r) => setTimeout(r, 600));

      // Capture Verso
      const versoData = await captureSide('verso');
      if (versoData) {
        downloadImage(versoData, `Carte_${activeProject.name.replace(/\s+/g, '_')}_Verso.png`);
      } else {
        throw new Error("Échec du rendu de la face Verso.");
      }

      showToast("Images PNG UHD (Recto & Verso) téléchargées avec succès !", 'success');
    } catch (err: any) {
      console.error('PNG Export error:', err);
      showToast(`Échec de l'export PNG : ${err.message || err}`, 'error');
    } finally {
      setActiveSide(savedSide);
      setIsEditMode(savedEditMode);
      setIsExporting(false);
    }
  };

  // Standalone self-contained HTML export of the card layout (with inline styles)
  const handleExportHTML = async () => {
    if (!activeProject || !activeTemplate) return;
    setIsExporting(true);
    const savedEditMode = isEditMode;
    // Momentarily turn off edit highlights to get original print quality look
    setIsEditMode(false);
    showToast("Préparation de l'export HTML...", 'info');

    try {
      // Small pause for state to fully apply
      await new Promise((r) => setTimeout(r, 100));

      const element = document.querySelector('#editor-card-container #print-card-target') || document.getElementById('print-card-target');
      if (!element) {
        throw new Error("Élément de carte introuvable");
      }

      // Clone card structure
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Strip out interactive edit elements if any remains
      clone.querySelectorAll('.ring-2').forEach(el => el.classList.remove('ring-2', 'ring-indigo-500'));
      clone.querySelectorAll('.cursor-move').forEach(el => el.classList.remove('cursor-move'));

      const coreHtml = clone.outerHTML;

      const fullHtmlString = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carte ID - ${activeProject.name}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #0f172a;
      color: #fafafa;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .badge-card-container {
      margin-top: 16px;
      transform: scale(1);
      transform-origin: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      border-radius: 14px;
      overflow: hidden;
    }
    @media (max-width: 520px) {
      .badge-card-container {
        transform: scale(0.72);
      }
    }
  </style>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div style="text-align: center; max-width: 480px; margin-bottom: 20px;">
    <h2 style="font-weight: 800; font-size: 20px; color: #6366f1; margin: 0 0 4px 0;">${activeProject.name}</h2>
    <p style="font-size: 11px; opacity: 0.6; margin: 0;">Carte ID générée par l'Éditeur • Sauvegarde HTML complète (${activeSide.toUpperCase()})</p>
  </div>
  
  <div class="badge-card-container">
    ${coreHtml}
  </div>

  <div style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background-color: #1e1b4b; border: 1px solid #4338ca; color: #ffffff; font-size: 12px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s;">
      Imprimer la Carte / Enregistrer en PDF
    </button>
  </div>
</body>
</html>`;

      const blob = new Blob([fullHtmlString], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, `Carte_${activeProject.name.replace(/\s+/g, '_')}_${activeSide}.html`);
      showToast("Fichier de sauvegarde HTML de la carte téléchargé avec succès !", 'success');
    } catch (err: any) {
      console.error('HTML Export error:', err);
      showToast(`Échec de l'export HTML : ${err.message || err}`, 'error');
    } finally {
      setIsEditMode(savedEditMode);
      setIsExporting(false);
    }
  };

  // WhatsApp transfer with local download + Web Share + direct API fallback
  const handleExportWhatsApp = async () => {
    if (!activeProject) return;
    setIsExporting(true);
    const savedSide = activeSide;
    const savedEditMode = isEditMode;
    setIsEditMode(false);
    showToast("Préparation et enregistrement de l'image de la carte...", 'info');

    try {
      // 1. Capture the specific active side image first as high-res PNG
      const dataUrl = await captureSide(activeSide);
      if (!dataUrl) throw new Error("Échec de la capture d'image");

      // 2. Download automatically to local system/internal storage (telechargement local)
      const sanitizedName = activeProject.name.replace(/\s+/g, '_');
      const filename = `Carte_${sanitizedName}_${activeSide}.png`;
      downloadImage(dataUrl, filename);
      
      // Let it breathe for downloads
      await new Promise((r) => setTimeout(r, 200));

      // 3. Formulate the share message
      const docNumStr = activeProject.fields.doc_num ? ` (N° : ${activeProject.fields.doc_num})` : "";
      const textMessage = `Voici ma carte "${activeProject.name}"${docNumStr} exportée en haute définition.`;

      // 4. Invoke native share if supported (mobile chrome / webview / safaris)
      const blob = dataURLtoBlob(dataUrl);
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: activeProject.name,
              text: textMessage,
            });
            showToast("Partagé sur WhatsApp avec succès !", 'success');
            return;
          } catch (shareErr) {
            console.log("Web Share API rejected or failed:", shareErr);
          }
        }
      }

      // 5. Fallback link to WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage + ' (Image téléchargée et enregistrée sur votre stockage interne, veuillez la joindre pour l\'envoyer)')}`;
      window.open(whatsappUrl, '_blank');
      showToast("Carte enregistrée ! Redirection vers WhatsApp...", 'success');
    } catch (err: any) {
      console.error('WhatsApp export error:', err);
      showToast(`Échec WhatsApp : ${err.message || err}`, 'error');
    } finally {
      setActiveSide(savedSide);
      setIsEditMode(savedEditMode);
      setIsExporting(false);
    }
  };

  // Modern New-Tab HTML print preview & calibration generator
  const handlePreviewInNewTab = async () => {
    if (!activeProject || !activeTemplate) return;
    setIsExporting(true);
    const savedSide = activeSide;
    showToast("Génération de l'aperçu HD plein écran...", 'info');

    try {
      // 1. Capture Recto
      const rectoData = await captureSide('recto');
      if (!rectoData) throw new Error("Échec de la capture de la face Recto.");

      // 2. Capture Verso
      const versoData = await captureSide('verso');
      if (!versoData) throw new Error("Échec de la capture de la face Verso.");

      // Open new window
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        showToast("Le bloqueur de pop-ups a empêché l'aperçu. Veuillez autoriser les fenêtres pop-up.", 'error');
        return;
      }

      const isVertical = activeTemplate.dimensions.height > activeTemplate.dimensions.width;
      const cardWidth = isVertical ? '53.98mm' : '85.6mm';
      const cardHeight = isVertical ? '85.6mm' : '53.98mm';
      const cardAspect = isVertical ? 'aspect-[0.63]' : 'aspect-[1.586]';
      const cardBorderRadius = '3.2mm';

      // HTML Document
      const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aperçu HD-1:1 ${activeTemplate.countryName} - ${activeProject.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
    }
    .print-card-box {
      width: ${cardWidth};
      height: ${cardHeight};
      user-select: none;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.1);
      border-radius: ${cardBorderRadius};
      overflow: hidden;
      background: white;
    }
    @media print {
      body {
        background-color: white !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .print-container {
        padding: 0 !important;
        background: none !important;
        display: block !important;
        width: 100% !important;
      }
      .print-cards-grid {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 15mm !important;
        margin-top: 15mm !important;
      }
      .print-card-box {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        page-break-inside: avoid;
        margin: 0 auto !important;
      }
    }
  </style>
</head>
<body class="p-4 md:p-10 text-slate-800">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header visual bar (hidden during print) -->
    <div class="no-print bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-sm md:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>APERCU PLEIN ÉCRAN ECHELLE RÉELLE (1:1)</span>
          <span class="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase font-mono font-semibold">Gabarit Certifié</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Calibré aux dimensions réglementaires mondiales : <strong>${activeTemplate.dimensions.width} mm &times; ${activeTemplate.dimensions.height} mm</strong></p>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <button onclick="window.print()" class="flex-1 md:flex-initial px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Imprimer la carte
        </button>
        <button onclick="window.close()" class="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-755 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer">
          Fermer la page
        </button>
      </div>
    </div>

    <!-- Layout notice (hidden during print) -->
    <div class="no-print bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-2xl text-[11px] leading-relaxed space-y-1">
      <p class="font-black text-xs text-amber-950 flex items-center gap-1 mb-1">
        <span>💡 Directives d'impression physiques :</span>
      </p>
      <ul class="list-disc pl-5 space-y-0.5">
        <li>Dans la boîte de dialogue d'impression, réglez l'<strong>Échelle</strong> à <strong>100%</strong> (surtout pas "Ajuster au format du papier").</li>
        <li>Activez l'option <strong>"Images d'arrière-plan" (Background Graphics)</strong> pour afficher les fonds de sécurité complexes et les photos de fond.</li>
        <li>Désactivez les <strong>Marges</strong> et <strong>"En-têtes et pieds de page"</strong> pour un rendu digne des originaux.</li>
      </ul>
    </div>

    <!-- Print Canvas Containers -->
    <div class="print-container flex flex-col items-center justify-center py-6">
      <div class="print-cards-grid flex flex-col md:flex-row gap-10 justify-center items-center w-full">
        <!-- RECTO -->
        <div class="flex flex-col items-center gap-2">
          <span class="no-print text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200/50 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Face avant (Recto)</span>
          <div class="print-card-box ${cardAspect}">
            <img src="${rectoData}" class="w-full h-full object-cover" alt="Recto HD" />
          </div>
        </div>

        <!-- VERSO -->
        <div class="flex flex-col items-center gap-2">
          <span class="no-print text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Face arrière (Verso)</span>
          <div class="print-card-box ${cardAspect}">
            <img src="${versoData}" class="w-full h-full object-cover" alt="Verso HD" />
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      showToast("Aperçu officiel 1:1 ouvert dans un nouvel onglet !", 'success');
    } catch (err: any) {
      console.error('Error opening preview window:', err);
      showToast(`Échec du rendu plein écran : ${err.message}`, 'error');
    } finally {
      setActiveSide(savedSide);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="studio-root-container">
      {/* 1. Header principal */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-950 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20">
            <FolderSync className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-md md:text-lg font-black tracking-tight flex items-center gap-2">
              <span>ADMIN CARTE STUDIO</span>
              <span className="text-[10px] bg-indigo-500 text-white font-mono uppercase px-2 py-0.5 rounded-full font-semibold">EURO PRESETS</span>
            </h1>
            <p className="text-[11px] text-slate-400">Générateur et Éditeur de cartes d'identité, permis et badges administratifs de l'UE</p>
          </div>
        </div>

        {/* Global Save indicators & notifications status */}
        <div className="flex items-center gap-4">
          {notification && (
            <div 
              id="global-toast-notification" 
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-md animate-fade-in flex items-center gap-2 ${
                notification.type === 'success' 
                  ? 'bg-emerald-600 text-white' 
                  : notification.type === 'error'
                  ? 'bg-red-650 bg-red-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{notification.message}</span>
            </div>
          )}

          <div className="bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-slate-300 font-medium text-[11px]">Sauvegarde Auto : Active</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workstation Area */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ----------------- GAUCHE (4 COLS): PROJECTS & SELECTION ----------------- */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Projects Switcher */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3.5" id="project-management-box">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FolderLock className="w-4 h-4 text-indigo-500" />
                Vos projets en cours ({projects.length})
              </h2>
              <button
                onClick={() => handleAddNewProject('france-cni')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouveau
              </button>
            </div>

            {/* List with Rename capabilities */}
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isAct = proj.id === activeProjectId;
                const pTemplate = TEMPLATES.find((t) => t.id === proj.templateId) || TEMPLATES[0];
                const country = COUNTRY_LOGOS[proj.countryCode] || { flag: '🗺️' };

                return (
                  <div
                    key={proj.id}
                    onClick={() => setActiveProjectId(proj.id)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isAct 
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                        : 'border-slate-200 hover:bg-slate-50 bg-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="text-sm shrink-0">{country.flag}</span>
                        {isAct ? (
                          <input
                            type="text"
                            value={proj.name}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => renameProject(proj.id, e.target.value)}
                            className="bg-transparent border-b border-indigo-300 font-bold text-xs text-slate-800 focus:outline-none w-full py-0.5 truncate"
                          />
                        ) : (
                          <span className="font-semibold text-xs text-slate-700 truncate">{proj.name}</span>
                        )}
                      </div>
                      
                      {/* Action icons */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDuplicateProject(proj)}
                          title="Dupliquer le projet"
                          className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded transition"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          title="Supprimer ce projet"
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1.5 text-[9.5px] font-mono text-slate-400">
                      <span>Modèle : {pTemplate.name.split(' (')[0]}</span>
                      <span>Mise à jour : {new Date(proj.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick presets list for direct custom replacement */}
          <div className="bg-white rounded-xl border border-slate-200/95 shadow-sm p-4 space-y-3" id="quick-presets-replacement">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choisir un modèle officiel d'Europe</h3>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tpl) => {
                const logo = COUNTRY_LOGOS[tpl.countryCode] || { flag: '🇪🇺' };
                const isSelected = activeProject?.templateId === tpl.id;

                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      if (activeProject) {
                        handleSwitchTemplate(tpl);
                      } else {
                        handleAddNewProject(tpl.id);
                      }
                    }}
                    type="button"
                    className={`text-left p-2.5 rounded-lg border text-[11px] font-medium transition ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold' 
                        : 'border-slate-150 hover:bg-slate-50 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span>{logo.flag}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-1 bg-slate-100 rounded text-slate-500">
                        {tpl.countryCode}
                      </span>
                    </div>
                    <span className="line-clamp-2">{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Documentation and Guidelines block */}
          <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-3 shadow-inner">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              Régles d'Impression & Échelle
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Chaque carte est générée selon les dimensions standard **ID-1 ISO/IEC 7810** (85.60 × 53.98 mm). Lors de l'exportation en PDF, le fichier aura ces dimensions physiques exactes afin que la carte conserve une taille réelle lors de son impression.
            </p>
            <div className="bg-slate-800 p-2.5 rounded text-[10px] space-y-1 text-slate-400">
              <p>🖨️ <strong className="text-slate-200">Conseil d'impression :</strong></p>
              <p className="pl-3">1. Ouvrez le PDF exporté dans Acrobat Reader.</p>
              <p className="pl-3">2. Sélectionnez "Taille réelle" (100%) dans les options d'impression.</p>
              <p className="pl-3">3. Utilisez un papier cartonné ou plastifié pour un résultat authentique.</p>
            </div>
          </div>
        </div>

        {/* ----------------- CENTRE (5 COLS): LIVE REALTIME PREVIEW ----------------- */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5 flex flex-col items-center">
          
          {/* Header area with active name */}
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3" id="preview-header">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono tracking-wider">PRÉVISUALISATION EN TEMPS RÉEL</span>
              <h2 className="text-sm font-bold text-slate-800">{activeProject?.name || "Sans Titre"}</h2>
            </div>
            
            {/* Auto fill triggers */}
            <button
              onClick={handleAutoFillWithMock}
              title="Compléter automatiquement avec des informations aléatoires de simulation"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simuler ID</span>
            </button>
          </div>

          {/* Note on official layouts */}
          <div className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200/65 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> Le format et l'apparence respectent rigoureusement les normes administratives.
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 rounded font-black uppercase">Format officiel</span>
          </div>

          {/* Live Component Render Area */}
          {activeProject && (
            <div className="flex flex-col items-center w-full space-y-4">
              {/* Sliding segment Switcher for Recto & Verso */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner w-full max-w-[280px]">
                <button
                  type="button"
                  onClick={() => setActiveSide('recto')}
                  className={`flex-1 text-[11px] font-black py-2 rounded-lg transition-all flex items-center justify-center gap-1 border ${
                    activeSide === 'recto'
                      ? 'bg-slate-900 border-slate-950 text-white shadow-md'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <span>RECTO (Face)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide('verso')}
                  className={`flex-1 text-[11px] font-black py-2 rounded-lg transition-all flex items-center justify-center gap-1 border ${
                    activeSide === 'verso'
                      ? 'bg-slate-900 border-slate-950 text-white shadow-md'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <span>VERSO (Dos)</span>
                </button>
              </div>

              <div id="editor-card-container" className="p-4 bg-slate-100/60 rounded-2xl border border-slate-200/50 w-full flex items-center justify-center min-h-[340px]">
                <CardPreview
                  project={activeProject}
                  template={activeTemplate}
                  isEditMode={isEditMode}
                  activeSide={activeSide}
                  onUpdatePosition={handlePositionChange}
                  onUpdateCustomTextPosition={handleCustomTextPositionChange}
                  onUpdateCustomImagePosition={handleCustomImagePositionChange}
                  onAddCustomImage={handleAddCustomImage}
                />
              </div>
            </div>
          )}

          {/* High-quality preview buttons prior to export */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5" id="preview-panel-buttons">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-350 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              Aperçu Rapide (Modal)
            </button>
            <button
              onClick={handlePreviewInNewTab}
              className="flex-1 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-indigo-600 animate-pulse" />
              Aperçu Plein Écran (Nouvel Onglet)
            </button>
          </div>

          {/* Export and download triggers bar */}
          <div className="w-full flex flex-col gap-3" id="exportation-panel">
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-emerald-400" />
                Télécharger PDF
              </button>
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                Télécharger Image PNG
              </button>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={handleExportHTML}
                disabled={isExporting}
                className="py-2.5 px-4 bg-slate-700 hover:bg-slate-650 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                title="Télécharge la maquette vectorielle au format d'une page HTML autonome pour votre stockage local"
              >
                <FileCode className="w-4 h-4 text-cyan-300" />
                Télécharger HTML
              </button>
              <button
                onClick={handleExportWhatsApp}
                disabled={isExporting}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                title="Télécharge l'image de la carte et l'envoie sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-green-150 animate-bounce" />
                Partager WhatsApp
              </button>
            </div>
          </div>

          {/* Custom draggable user texts dashboard */}
          {activeProject && activeProject.customTexts.length > 0 && (
            <div className="w-full border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Textes additionnels ajoutés :</span>
              <div className="space-y-1.5">
                {activeProject.customTexts.map((txt) => (
                  <div key={txt.id} className="flex items-center justify-between bg-white text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: txt.color }} />
                      <span className="font-bold text-slate-700">{txt.text}</span>
                      <span className="text-[9px] text-slate-400 font-mono">({txt.fontSize}px)</span>
                    </div>
                    <button
                      onClick={() => handleRemoveCustomText(txt.id)}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ----------------- DROITE (3 COLS): EDIT PANEL PARAMETERS ----------------- */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm" id="control-editor-workspace">
          
          {/* Navigation tabs inside parameters side-editor */}
          <div className="flex border-b border-slate-200 mb-4 overflow-x-auto pb-0.5">
            {[
              { key: 'fields', label: 'Champs' },
              { key: 'appearance', label: 'Esthétique' },
              { key: 'texts', label: 'Textes' },
              { key: 'images', label: 'Images' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                type="button"
                className={`py-1.5 px-2.5 font-bold text-xs whitespace-nowrap border-b-2 leading-none transition-all ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeProject && (
            <div className="space-y-4">
              
              {/* TAB 1: PARAMETER FIELDS */}
              {activeTab === 'fields' && (
                <div className="space-y-4">
                  
                  {/* National origin selection code */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Pays Émetteur (Emblèmes & Titres)
                    </label>
                    <select
                      value={activeProject.countryCode}
                      onChange={(e) => {
                        const updated = {
                          ...activeProject,
                          countryCode: e.target.value,
                        };
                        updateActiveProject(updated);
                        showToast(`Emblème mis à jour pour : ${e.target.value}`, 'info');
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500"
                    >
                      {Object.keys(COUNTRY_LOGOS).map((code) => (
                        <option key={code} value={code}>
                          {COUNTRY_LOGOS[code].flag} {COUNTRY_LOGOS[code].defaultHeaderName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generated database fields list */}
                  <div className="space-y-3">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Informations de la carte
                    </span>

                    {activeTemplate.fields.map((f) => (
                      <div key={f.key}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <label className="text-[11px] font-medium text-slate-600">{f.label}</label>
                          {f.isGenerated && (
                            <span className="text-[9px] font-mono text-indigo-600">Généré Auto</span>
                          )}
                        </div>

                        {f.type === 'select' ? (
                          <select
                            value={activeProject.fields[f.key] || ''}
                            onChange={(e) => handleFieldChange(f.key, e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
                          >
                            {f.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : f.type === 'textarea' ? (
                          <textarea
                            value={activeProject.fields[f.key] || ''}
                            onChange={(e) => handleFieldChange(f.key, e.target.value)}
                            rows={2}
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 resize-none font-mono"
                          />
                        ) : (
                          <input
                            type={f.type === 'date' ? 'date' : 'text'}
                            value={activeProject.fields[f.key] || ''}
                            onChange={(e) => handleFieldChange(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Photo & Signature (Visuels Obligatoires directement dans le formulaire) */}
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
                    <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-150 space-y-2">
                      <span className="block text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-sm">📸</span> Photo d'Identité Officielle
                      </span>
                      <ImageUploader
                        photoConfig={activeProject.photo}
                        onChange={(newPhoto) => {
                          updateActiveProject({
                            ...activeProject,
                            photo: newPhoto,
                          });
                        }}
                      />
                    </div>

                    <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-150 space-y-2">
                      <span className="block text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-sm">✍️</span> Signature du Titulaire
                      </span>
                      <SignatureCanvas
                        signature={activeProject.signature}
                        onChange={(newSig) => {
                          updateActiveProject({
                            ...activeProject,
                            signature: newSig,
                          });
                        }}
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: APPEARANCE (PHOTOS, SIGNATURES AND SEALS) */}
              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  {/* Photo Uploader */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Photo d'Identité</span>
                    <ImageUploader
                      photoConfig={activeProject.photo}
                      onChange={(newPhoto) => {
                        updateActiveProject({
                          ...activeProject,
                          photo: newPhoto,
                        });
                      }}
                    />
                  </div>

                  {/* Signature block widget */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Signature Officielle</span>
                    <SignatureCanvas
                      signature={activeProject.signature}
                      onChange={(newSig) => {
                        updateActiveProject({
                          ...activeProject,
                          signature: newSig,
                        });
                      }}
                    />
                  </div>

                  {/* Micro-chip, code seals togglers */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Éléments de Sécurité
                    </span>

                    <div className="space-y-2 text-xs font-semibold text-slate-600">
                      <label className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeProject.showSecurityOverlay}
                          onChange={(e) => updateActiveProject({
                            ...activeProject,
                            showSecurityOverlay: e.target.checked
                          })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span>Hologrammes & Lignes de Sécurité</span>
                      </label>

                      <label className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeProject.showChip}
                          onChange={(e) => updateActiveProject({
                            ...activeProject,
                            showChip: e.target.checked
                          })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span>Puce électronique dorée (RFID)</span>
                      </label>

                      <label className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeProject.showSignatureOnCard}
                          onChange={(e) => updateActiveProject({
                            ...activeProject,
                            showSignatureOnCard: e.target.checked
                          })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span>Afficher la Signature</span>
                      </label>

                      <label className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeProject.showBarcodeOrQR}
                          onChange={(e) => updateActiveProject({
                            ...activeProject,
                            showBarcodeOrQR: e.target.checked
                          })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span>Puce scan (Code-barres / QR)</span>
                      </label>
                    </div>
                  </div>

                  {/* Custom color presets */}
                  <div className="border-t border-slate-100 pt-3">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Thème de la Carte</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updated = {
                            ...activeProject,
                            customColors: undefined
                          };
                          updateActiveProject(updated);
                          showToast("Couleurs réinitialisées au modèle", "info");
                        }}
                        className="text-[10px] font-bold border border-slate-200 px-2 py-1 rounded bg-white hover:bg-slate-50 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        Défaut
                      </button>

                      {[
                        { primary: '#0f172a', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', label: 'Dark Mode' },
                        { primary: '#0369a1', background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)', label: 'Ocean Minimal' },
                        { primary: '#1e3a8a', background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', label: 'Warm Card' },
                      ].map((cp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...activeProject,
                              customColors: {
                                primary: cp.primary,
                                secondary: cp.primary,
                                background: cp.background
                              }
                            };
                            updateActiveProject(updated);
                            showToast(`Palette ${cp.label} appliquée !`, 'success');
                          }}
                          className="w-5 h-5 rounded-full border border-slate-300"
                          style={{ background: cp.background }}
                          title={cp.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ADD TEXTS (BOOST USER CONTROL) */}
              {activeTab === 'texts' && (
                <div className="space-y-4">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Inscrire un nouveau texte</span>
                    
                    <form onSubmit={handleAddCustomText} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={newCustomText}
                          onChange={(e) => setNewCustomText(e.target.value)}
                          placeholder="EX: RESPONSABLE ACADÉMIQUE"
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:outline-none focus:border-indigo-500 uppercase"
                          maxLength={32}
                        />
                      </div>

                      {/* Custom font sizes slider */}
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>Taille du texte ({newCustomSize}px) :</span>
                        </div>
                        <input
                          type="range"
                          min="6"
                          max="20"
                          value={newCustomSize}
                          onChange={(e) => setNewCustomSize(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Color picker for text */}
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-500 mb-1.5">Couleur du texte :</span>
                        <div className="flex gap-1.5">
                          {['#0f172a', '#1e3a8a', '#dc2626', '#eab308', '#059669', '#ffffff'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewCustomColor(color)}
                              style={{ backgroundColor: color }}
                              className={`w-4 h-4 rounded-full border transition ${
                                newCustomColor === color
                                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                                  : 'border-slate-300 opacity-80'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="new-custom-bold"
                          checked={newCustomBold}
                          onChange={(e) => setNewCustomBold(e.target.checked)}
                          className="w-3.5 h-3.5 border-slate-300 text-indigo-600 rounded"
                        />
                        <label htmlFor="new-custom-bold" className="text-[11px] font-semibold text-slate-600 cursor-pointer">
                          Texte en gras (B)
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full text-xs py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Plus className="w-4 h-4" />
                        Inscrire sur la carte
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">
                    <p className="text-[10px] leading-relaxed text-slate-500">
                      ℹ️ **Conseil :** Une fois le texte inscrit, activez le **Mode Édition (Régler par glisser-déposer)** au milieu pour déplacer ce texte à l'endroit idéal sur la carte.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: ADD GRAPHICS & IMAGES */}
              {activeTab === 'images' && (
                <div className="space-y-4">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">Ajouter un logo ou une image</span>
                    
                    {/* Destination/mode selector for manually added images */}
                    <div className="mb-4 bg-amber-50/20 p-2.5 rounded-lg border border-amber-500/25">
                      <span className="block text-[9.5px] font-bold text-amber-700 uppercase tracking-widest mb-1.5 font-sans">Options d'emplacement & Alignement</span>
                      <div className="space-y-1.5">
                        <label className={`flex items-start gap-2 p-1.5 rounded border text-[10.5px] cursor-pointer transition ${
                          imagePlacementMode === 'verso_vertical_stack' 
                            ? 'bg-emerald-55/35 border-emerald-500/40 text-emerald-900 font-medium' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <input 
                            type="radio" 
                            name="placement_mode" 
                            checked={imagePlacementMode === 'verso_vertical_stack'} 
                            onChange={() => setImagePlacementMode('verso_vertical_stack')} 
                            className="mt-0.5 accent-emerald-600 cursor-pointer shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-800 text-[10px]">Aligneurs automatiques Verso (Dos)</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">
                              Toutes les photos sont installées l'une après l'autre verticalement dans le coin gauche.
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2 p-1.5 rounded border text-[10.5px] cursor-pointer transition ${
                          imagePlacementMode === 'recto_center' 
                            ? 'bg-indigo-55/35 border-indigo-500/40 text-indigo-900 font-medium' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <input 
                            type="radio" 
                            name="placement_mode" 
                            checked={imagePlacementMode === 'recto_center'} 
                            onChange={() => setImagePlacementMode('recto_center')} 
                            className="mt-0.5 accent-indigo-600 cursor-pointer shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-800 text-[10px]">Recto (Face) - Centré</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">
                              L'image sera déposée au milieu de la face avant de la carte d'identité.
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2 p-1.5 rounded border text-[10.5px] cursor-pointer transition ${
                          imagePlacementMode === 'verso_center' 
                            ? 'bg-indigo-55/35 border-indigo-500/40 text-indigo-900 font-medium' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <input 
                            type="radio" 
                            name="placement_mode" 
                            checked={imagePlacementMode === 'verso_center'} 
                            onChange={() => setImagePlacementMode('verso_center')} 
                            className="mt-0.5 accent-indigo-600 cursor-pointer shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-855 text-[10px]">Verso (Dos) - Centré</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">
                              L'image sera déposée au milieu du dos de la carte d'identité.
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2 p-1.5 rounded border text-[10.5px] cursor-pointer transition ${
                          imagePlacementMode === 'verso_slot_1' 
                            ? 'bg-indigo-55/35 border-indigo-500/40 text-indigo-900 font-medium' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <input 
                            type="radio" 
                            name="placement_mode" 
                            checked={imagePlacementMode === 'verso_slot_1'} 
                            onChange={() => setImagePlacementMode('verso_slot_1')} 
                            className="mt-0.5 accent-indigo-600 cursor-pointer shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-800 text-[10px]">Case Verso Haut Gauche (Photo 1)</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">
                              L'image sera déposée dans la première case de téléversement en haut à gauche du verso.
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2 p-1.5 rounded border text-[10.5px] cursor-pointer transition ${
                          imagePlacementMode === 'verso_slot_2' 
                            ? 'bg-indigo-55/35 border-indigo-500/40 text-indigo-900 font-medium' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}>
                          <input 
                            type="radio" 
                            name="placement_mode" 
                            checked={imagePlacementMode === 'verso_slot_2'} 
                            onChange={() => setImagePlacementMode('verso_slot_2')} 
                            className="mt-0.5 accent-indigo-600 cursor-pointer shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-800 text-[10px]">Case Verso Haut Gauche (Photo 2)</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">
                              L'image sera déposée dans la deuxième case de téléversement en haut à gauche du verso.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                  {/* Presets Grid */}
                  <div className="mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-205">
                    <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Presets officiels & puces</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Puce Dorée", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Golden_microchip_EMV.svg/150px-Golden_microchip_EMV.svg.png", width: 12 },
                          { name: "Datamatrix", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Data_Matrix_Code.svg/150px-Data_Matrix_Code.svg.png", width: 14 },
                          { name: "Logotype UE", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/150px-Flag_of_Europe.svg.png", width: 14 },
                          { name: "Signature", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Signature_of_Jean-Baptiste_Colbert.svg/150px-Signature_of_Jean-Baptiste_Colbert.svg.png", width: 22 }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddCustomImage(preset.url, preset.width)}
                            className="bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 p-1.5 rounded-lg flex flex-col items-center justify-center transition cursor-pointer"
                          >
                            <img src={preset.url} alt={preset.name} className="h-7 object-contain pointer-events-none mb-1 opacity-80" />
                            <span className="text-[8px] font-bold text-slate-500 tracking-tight leading-none text-center">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Drag-and-drop or Local upload selector */}
                    <div className="mb-4">
                      <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Importer une image locale</span>
                      <div className="border border-dashed border-slate-350 hover:border-indigo-500 rounded-lg p-3 bg-slate-50 text-center transition hover:bg-indigo-50/5 relative cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  handleAddCustomImage(event.target.result as string, 16);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <p className="text-[10px] text-slate-500 font-bold leading-normal">
                          Glissez-déposez ou <span className="text-indigo-600 underline">parcourez</span>
                        </p>
                        <p className="text-[8px] text-slate-400 font-medium mt-0.5">PNG, JPG ou SVG (Max: 5Mo)</p>
                      </div>
                    </div>

                    {/* URL image box */}
                    <div>
                      <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Ou depuis une adresse web (URL)</span>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const url = formData.get('imageUrl') as string;
                        if (url?.trim()) {
                          handleAddCustomImage(url.trim(), 16);
                          e.currentTarget.reset();
                        }
                      }} className="flex gap-2">
                        <input
                          type="url"
                          name="imageUrl"
                          placeholder="https://example.com/logo.png"
                          className="flex-1 text-[11px] px-2.5 py-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500 font-medium"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white text-[10px] rounded-lg px-3 py-1 font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                        >
                          Ajouter
                        </button>
                      </form>
                    </div>

                    {/* Control Panel of existing placed Images */}
                    {activeProject.customImages && activeProject.customImages.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">Gestion des images posées</span>
                        <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                          {activeProject.customImages.map((img) => (
                            <div key={img.id} className="flex flex-col gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  <img src={img.url} alt="Placed" className="w-6 h-6 object-contain rounded bg-white border border-slate-150 shrink-0" />
                                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight truncate">
                                    {img.id === 'slot_verso_tr_1' ? 'Photo Verso 1 (Haut)' 
                                     : img.id === 'slot_verso_tr_2' ? 'Photo Verso 2 (Bas)' 
                                     : `Image ${img.id.slice(-6)}`}
                                  </span>
                                  <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wide shrink-0">
                                    ({img.side === 'recto' ? 'Face' : 'Dos'})
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomImage(img.id)}
                                  className="text-[9.5px] font-bold text-red-500 uppercase tracking-wider hover:text-red-700 bg-red-50 hover:bg-red-100/50 px-2 py-0.5 rounded transition cursor-pointer"
                                >
                                  Retirer
                                </button>
                              </div>

                              {/* Controls adjusting image (rotation, width, opacity) */}
                              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/50">
                                <div>
                                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Taille ({img.width}%)</span>
                                  <input
                                    type="range"
                                    min="4"
                                    max="60"
                                    value={img.width}
                                    onChange={(e) => handleUpdateCustomImageProperty(img.id, 'width', parseInt(e.target.value, 10))}
                                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                                <div>
                                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 font-sans">Rot ({img.rotation ?? 0}°)</span>
                                  <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={img.rotation ?? 0}
                                    onChange={(e) => handleUpdateCustomImageProperty(img.id, 'rotation', parseInt(e.target.value, 10))}
                                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                                <div>
                                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Opa ({Math.round((img.opacity ?? 1) * 100)}%)</span>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={Math.round((img.opacity ?? 1) * 100)}
                                    onChange={(e) => handleUpdateCustomImageProperty(img.id, 'opacity', parseFloat(e.target.value) / 100)}
                                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>

                              {/* Controls adjusting position coordinates x and y manually */}
                              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100">
                                <div>
                                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Position Horis. X ({img.x}%)</span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={img.x}
                                    onChange={(e) => handleUpdateCustomImageProperty(img.id, 'x', parseInt(e.target.value, 10))}
                                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                                <div>
                                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Position Verti. Y ({img.y}%)</span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={img.y}
                                    onChange={(e) => handleUpdateCustomImageProperty(img.id, 'y', parseInt(e.target.value, 10))}
                                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>

                              {/* Side selector */}
                              <div className="flex items-center justify-between pt-1 text-[8.5px] text-slate-500 font-bold">
                                <span>Côté d'appartenance :</span>
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCustomImageProperty(img.id, 'side', 'recto')}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition cursor-pointer ${
                                      img.side === 'recto' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-650'
                                    }`}
                                  >
                                    Face (Recto)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCustomImageProperty(img.id, 'side', 'verso')}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition cursor-pointer ${
                                      img.side === 'verso' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-650'
                                    }`}
                                  >
                                    Dos (Verso)
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          )}

        </div>

      </main>

      {/* 3. Global template list slider at the bottom */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-950 py-6 px-4 md:px-6">
        <div className="max-w-[1550px] mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-indigo-950/50 pb-3 gap-2">
            <div>
              <h3 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Bibliothèque Complète de Modèles Administratifs Europe
              </h3>
              <p className="text-[11px] text-slate-400">Accédez instantanément aux formats officiels d'état civil, d'assurances et professionnels les plus utilisés</p>
            </div>
          </div>

          <TemplateLibrary
            selectedTemplateId={activeProject?.templateId || ''}
            onSelect={(tpl) => {
              if (activeProject) {
                handleSwitchTemplate(tpl);
              } else {
                handleAddNewProject(tpl.id);
              }
            }}
          />

          <div className="pt-4 border-t border-indigo-950 flex flex-col md:flex-row justify-between items-center text-[10.5px] text-slate-500 gap-2">
            <span>© 2026 Admin Carte Studio • Tous Droits Réservés • Utilisation civile et privée uniquement</span>
            <div className="flex gap-4">
              <span className="hover:text-indigo-400 transition cursor-pointer">Sceau de cryptage AES-256</span>
              <span className="hover:text-indigo-400 transition cursor-pointer">Impression Vectorielle UHD</span>
              <span className="hover:text-indigo-400 transition cursor-pointer font-bold text-slate-400">Made for AI Studio</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RECTO-VERSO HIGH-DEFINITION PREVIEW MODAL */}
      {isPreviewModalOpen && activeProject && activeTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xs md:text-sm font-black text-slate-850 uppercase tracking-wider">
                  Prévisualisation HD de la carte avant exportation
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 px-3 bg-slate-200/60 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Fermer (Esc)
              </button>
            </div>

            {/* Modal Content - Side by Side Cards */}
            <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto space-y-6 flex flex-col items-center bg-slate-50/50">
              <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                {/* Recto Card Block */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white border border-slate-250 px-3 py-0.5 rounded-full shadow-sm">
                    FACE AVANT (RECTO)
                  </span>
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200/40">
                    <CardPreview
                      project={activeProject}
                      template={activeTemplate}
                      isEditMode={false}
                      activeSide="recto"
                      onUpdatePosition={() => {}}
                      onUpdateCustomTextPosition={() => {}}
                      onUpdateCustomImagePosition={() => {}}
                    />
                  </div>
                </div>

                {/* Verso Card Block */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-white border border-slate-250 px-3 py-0.5 rounded-full shadow-sm">
                    FACE ARRIÈRE (VERSO)
                  </span>
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200/40">
                    <CardPreview
                      project={activeProject}
                      template={activeTemplate}
                      isEditMode={false}
                      activeSide="verso"
                      onUpdatePosition={() => {}}
                      onUpdateCustomTextPosition={() => {}}
                      onUpdateCustomImagePosition={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Tips and export trigger from within modal */}
              <div className="max-w-md w-full bg-white border border-slate-205 rounded-xl p-4 text-center space-y-3.5 shadow-sm">
                <p className="text-[11px] leading-relaxed text-slate-500 font-bold">
                  Cette prévisualisation affiche la carte dans sa configuration finale imprimable sans aucune bordure d'édition ni boutons de mouvement.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      handleExportPDF();
                    }}
                    disabled={isExporting}
                    className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    Télécharger PDF
                  </button>
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      handleExportPNG();
                    }}
                    disabled={isExporting}
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-250" />
                    Télécharger PNG
                  </button>
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      handleExportHTML();
                    }}
                    disabled={isExporting}
                    className="py-1.5 px-3 bg-slate-700 hover:bg-slate-650 text-white rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-300" />
                    Télécharger HTML
                  </button>
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      handleExportWhatsApp();
                    }}
                    disabled={isExporting}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-green-150" />
                    Partager WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
