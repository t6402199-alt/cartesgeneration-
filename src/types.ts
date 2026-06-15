/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CardTemplateId = 
  | 'france-cni' 
  | 'france-permit'
  | 'france-vitale'
  | 'deutschland-id'
  | 'deutschland-permit'
  | 'deutschland-egk'
  | 'espana-id'
  | 'espana-permit'
  | 'espana-health'
  | 'italia-id'
  | 'italia-permit'
  | 'italia-health'
  | 'belgique-id'
  | 'belgique-permit'
  | 'belgique-health'
  | 'suisse-id'
  | 'suisse-permit'
  | 'netherlands-id'
  | 'netherlands-permit'
  | 'portugal-id'
  | 'portugal-permit'
  | 'portugal-health'
  | 'canada-citizenship'
  | 'canada-permit'
  | 'canada-health'
  | 'austria-id'
  | 'poland-id'
  | 'ireland-identity'
  | 'europe-permit' 
  | 'europe-ceam' 
  | 'student-card' 
  | 'press-badge'
  | 'security-badge';

export interface CardTemplate {
  id: CardTemplateId;
  name: string;
  category: 'id' | 'permit' | 'health' | 'badge' | 'academic';
  countryName: string;
  countryCode: string;
  description: string;
  defaultColors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    textDark: string;
    textLight: string;
  };
  securityPattern: 'pattern1' | 'pattern2' | 'pattern3' | 'none';
  fields: TemplateField[];
  dimensions: {
    width: number; // in mm
    height: number; // in mm
    aspectRatio: number; // width / height
  };
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  section?: string;
  side?: 'recto' | 'verso'; // To display on front (recto) or back (verso) of card
  gridSpan?: 'full' | 'half';
  isGenerated?: boolean; // If code or dynamically calculated
  generatorType?: 'mrz' | 'barcode' | 'qr' | 'permit-cats' | 'card-number';
}

export interface DragItemPosition {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  visible: boolean;
  size?: number; // custom scale or font size
  width?: number; // percentage width
}

export interface CustomText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  bold: boolean;
}

export interface CustomImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
  side: 'recto' | 'verso';
}

export interface PhotoConfig {
  url: string | null;
  zoom: number;
  rotation: number;
  x: number; // horizontal offset in px or %
  y: number; // vertical offset in px or %
  filter: 'none' | 'grayscale' | 'security' | 'sepia' | 'contrast-high';
  contrast: number; // percentage (50 to 200)
  brightness: number; // percentage (50 to 200)
}

export interface CardProject {
  id: string;
  name: string;
  templateId: CardTemplateId;
  countryCode: string;
  fields: Record<string, string>;
  photo: PhotoConfig;
  signature: {
    type: 'draw' | 'text' | 'none';
    dataUrl: string | null; // signature path for drawn or base64
    text: string;
    font: string; // cursive style font key
    color: string;
  };
  positions: Record<string, DragItemPosition>;
  customTexts: CustomText[];
  customImages?: CustomImage[];
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
  showSecurityOverlay: boolean;
  showChip: boolean;
  showSignatureOnCard: boolean;
  showBarcodeOrQR: boolean;
  qrValue?: string;
  updatedAt: string;
}
