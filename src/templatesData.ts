/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardTemplate } from './types';

export const TEMPLATES: CardTemplate[] = [
  {
    id: 'france-cni',
    name: "Carte Nationale d'Identité (France) - Nouveau Format",
    category: 'id',
    countryName: 'France',
    countryCode: 'FR',
    description: "Format officiel ID-1 (85.6 x 53.98 mm) mis en circulation par le Ministère de l'Intérieur depuis 2021. Avec dispositif holographique sécurisé, photo fantôme et MRZ à 3 lignes.",
    defaultColors: {
      primary: '#1d3557', // dark blue
      secondary: '#457b9d', // soft blue
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 45%, #f1f5f9 100%)',
      accent: '#e63946', // republican red
      textDark: '#111827',
      textLight: '#f9fafb',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: '1. NOM / Surname', type: 'text', placeholder: 'MARTIN', defaultValue: 'MARTIN', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nom_usage', label: "Nom d'usage / Alternate name", type: 'text', placeholder: 'Néant', defaultValue: 'NOM D\'USAGE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Prénoms / Given names', type: 'text', placeholder: 'Maëlys-Gaëlle, Marie', defaultValue: 'Maëlys-Gaëlle, Marie', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'sexe', label: '3. SEXE / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: '4. NATIONALITÉ / Nationality', type: 'text', defaultValue: 'FRA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '5. DATE DE NAISS. / Date of birth', type: 'date', defaultValue: '1990-07-13', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: '6. LIEU DE NAISSANCE / Place of birth', type: 'text', defaultValue: 'PARIS', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: '7. N° DU DOCUMENT / Document No.', type: 'text', defaultValue: 'X4RTBPFW4', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "8. DATE D'EXPIR. / Expiry date", type: 'date', defaultValue: '2030-02-11', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_code', label: "Numéro de contrôle (bas droite)", type: 'text', defaultValue: '384213', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'taille', label: 'TAILLE / Height', type: 'text', defaultValue: '1,68 m', section: 'Physique', side: 'verso', gridSpan: 'half' },
      { key: 'date_emission', label: "DATE DE DÉLIVRANCE / Date of issue", type: 'date', defaultValue: '2020-02-12', section: 'Validité', side: 'verso', gridSpan: 'half' },
      { key: 'adresse', label: 'ADRESSE / Address', type: 'textarea', defaultValue: '44 RUE DÉSIRÉ SAINT CLÉMENT\nRÉSIDENCE DU PLEIN AIR BÂT 4\n33000 BORDEAUX\nFRANCE', section: 'Adresse', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'deutschland-id',
    name: "Personalausweis (Allemagne)",
    category: 'id',
    countryName: 'Allemagne',
    countryCode: 'DE',
    description: "Carte nationale d'identité allemande officielle de format ID-1 avec micro-graphes sécurisés, aigle fédéral et photo gravée au laser.",
    defaultColors: {
      primary: '#000000', // black
      secondary: '#d97706', // gold
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #fffbeb 100%)', // light green-yellow
      accent: '#dc2626', // red
      textDark: '#1f2937',
      textLight: '#f9fafb',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: 'Name / Surname', type: 'text', defaultValue: 'MÜLLER', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nom_naissance', label: 'Geburtsname / Maiden name', type: 'text', defaultValue: '-', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Vornamen / Given names', type: 'text', defaultValue: 'MAXINE ELISABETH', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: 'Geburtsdatum / Date of birth', type: 'date', defaultValue: '1992-08-24', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: 'Geburtsort / Place of birth', type: 'text', defaultValue: 'BERLIN', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: 'Staatsangehörigkeit / Nationality', type: 'text', defaultValue: 'DEUTSCH', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Gültig bis / Expiry date', type: 'date', defaultValue: '2032-08-23', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Zugangsnummer / Doc No. (CAN)', type: 'text', defaultValue: 'C7TR8WQP2', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'adresse', label: 'Anschrift / Address (Wohnort)', type: 'textarea', defaultValue: 'SCHÖNHAUSER ALLEE 104\n10439 BERLIN', section: 'Adresse', side: 'verso', gridSpan: 'full' },
      { key: 'couleur_yeux', label: 'Augenfarbe / Eye color', type: 'text', defaultValue: 'BLAU', section: 'Physique', side: 'verso', gridSpan: 'half' },
      { key: 'taille', label: 'Größe / Height', type: 'text', defaultValue: '1,72 m', section: 'Physique', side: 'verso', gridSpan: 'half' },
      { key: 'prefecture', label: 'Behörde / Issuing authority', type: 'text', defaultValue: 'BÜRGERAMT BERLIN', section: 'Validité', side: 'verso', gridSpan: 'full' },
      { key: 'date_emission', label: 'Ausstellungsdatum / Issue date', type: 'date', defaultValue: '2022-08-24', section: 'Validité', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'espana-id',
    name: "Documento Nacional de Identidad (Espagne)",
    category: 'id',
    countryName: 'Espagne',
    countryCode: 'ES',
    description: "DNI 4.0 espagnol avec conformité de design de sécurité européen, police d'écriture officielle, puce intelligente recto, et éléments graphiques espagnols.",
    defaultColors: {
      primary: '#9a3412', // orange / red-brown
      secondary: '#ca8a04', // yellow gold
      background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #f0fdfa 100%)', // gold/teal security tone
      accent: '#dc2626', // spain red
      textDark: '#1c1917',
      textLight: '#fefefe',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'primer_apellido', label: 'Primer Apellido / Surname 1', type: 'text', defaultValue: 'GARCIA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'segundo_apellido', label: 'Segundo Apellido / Surname 2', type: 'text', defaultValue: 'LOPEZ', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nom', label: 'Nombre / Given name', type: 'text', defaultValue: 'SOFIA', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'sexe', label: 'Sexo / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: 'Nacionalidad / Nationality', type: 'text', defaultValue: 'ESP', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'F. Nacimiento / Birth date', type: 'date', defaultValue: '1991-04-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Num. Documento / DNI No.', type: 'text', defaultValue: '12345678A', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Validez / Expiry date', type: 'date', defaultValue: '2031-04-11', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'lieu_naissance', label: 'Lugar de Nacimiento / Place of birth', type: 'text', defaultValue: 'MADRID', section: 'Naissance', side: 'verso', gridSpan: 'half' },
      { key: 'provincia', label: 'Provincia / Province', type: 'text', defaultValue: 'MADRID', section: 'Naissance', side: 'verso', gridSpan: 'half' },
      { key: 'parents', label: 'Hijo de / Parents Name', type: 'text', defaultValue: 'ANTONIO Y CARMEN', section: 'Identité', side: 'verso', gridSpan: 'full' },
      { key: 'adresse', label: 'Domicilio / Address', type: 'textarea', defaultValue: 'CALLE GRAN VIA 45 4B\n28013 MADRID', section: 'Adresse', side: 'verso', gridSpan: 'full' },
      { key: 'prefecture', label: 'Equipo / Issuing office', type: 'text', defaultValue: 'POLICIA NACIONAL', section: 'Validité', side: 'verso', gridSpan: 'half' },
      { key: 'date_emission', label: 'F. Expedición / Issue date', type: 'date', defaultValue: '2021-04-12', section: 'Validité', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'italia-id',
    name: "Carta d'Identità Elettronica (Italie)",
    category: 'id',
    countryName: 'Italie',
    countryCode: 'IT',
    description: "CIE italienne hautement détaillée respectant l'organisation visuelle du Ministère de l'Intérieur, avec le code fiscal du titulaire, filigranes et signatures.",
    defaultColors: {
      primary: '#15803d', // italian green
      secondary: '#0369a1', // light ocean blue
      background: 'linear-gradient(135deg, #fdf8f6 0%, #f3ebf2 40%, #ebf5fe 100%)', // tri-shade safety paper
      accent: '#cf1717', // red
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: 'Cognome / Surname', type: 'text', defaultValue: 'ROSSI', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Nome / Given Names', type: 'text', defaultValue: 'GIULIA ANNA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Data di nascita / Date of birth', type: 'date', defaultValue: '1988-11-05', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: 'Luogo di nascita / Place of birth', type: 'text', defaultValue: 'MILANO (MI)', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sesso / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: 'Cittadinanza / Nationality', type: 'text', defaultValue: 'ITA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Numero di doc. / Doc No.', type: 'text', defaultValue: 'CA45901ZN', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Scadenza / Expiry date', type: 'date', defaultValue: '2029-11-04', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'codice_fiscale', label: 'Codice Fiscale / Tax Code', type: 'text', defaultValue: 'RSSGLN88S45F205W', section: 'Identité', side: 'verso', gridSpan: 'full' },
      { key: 'adresse', label: 'Indirizzo di residenza / Address', type: 'textarea', defaultValue: 'VIA DANTE ALIGHIERI 12\n20121 MILANO (MI)', section: 'Adresse', side: 'verso', gridSpan: 'full' },
      { key: 'comune', label: 'Comune / Issuing municipality', type: 'text', defaultValue: 'MILANO', section: 'Validité', side: 'verso', gridSpan: 'half' },
      { key: 'parents', label: 'Padre-Madre o tutore / Parents Names', type: 'text', defaultValue: 'MARIO E CARLA', section: 'Identité', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'belgique-id',
    name: "Carte d'Identité (Belgique)",
    category: 'id',
    countryName: 'Belgique',
    countryCode: 'BE',
    description: "Format officiel de la carte d'identité belge avec sa disposition de champs unique, drapeau belge sur le recto et code de puce.",
    defaultColors: {
      primary: '#1e293b', // carbon black
      secondary: '#ca8a04', // golden yellow
      background: 'linear-gradient(135deg, #fefce8 0%, #fffbeb 50%, #fafaf9 100%)',
      accent: '#dc2626', // red
      textDark: '#1e293b',
      textLight: '#fcfcfc',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: 'Naam / Nom / Surname', type: 'text', defaultValue: 'VANDEPUP', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Voornamen / Prénoms / Given names', type: 'text', defaultValue: 'LUCAS FRANS', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Geslacht / Sexe / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: 'Nationaliteit / Nationalité / Nationality', type: 'text', defaultValue: 'BEL', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Geboortedatum / Date de naissance', type: 'date', defaultValue: '1994-01-15', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Kaartnummer / Card Number', type: 'text', defaultValue: '592104593', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Geldig tot / Expiry date', type: 'date', defaultValue: '2034-01-14', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'lieu_naissance', label: 'Geboorteplaats / Lieu de naissance', type: 'text', defaultValue: 'BRUSSEL', section: 'Naissance', side: 'verso', gridSpan: 'half' },
      { key: 'date_emission', label: "Afgifte / Issue Date", type: 'date', defaultValue: '2024-01-15', section: 'Validité', side: 'verso', gridSpan: 'half' },
      { key: 'adresse', label: 'Adres / Adresse / Residence', type: 'textarea', defaultValue: 'RUE DE LA LOI 16\n1000 BRUXELLES\nBELGIQUE', section: 'Adresse', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'europe-permit',
    name: 'Permis de Conduire Européen',
    category: 'permit',
    countryName: 'Union Européenne',
    countryCode: 'EU',
    description: "Le permis de conduire standard européen de format carte bancaire, avec couleur rose dominante et catégories sélectionnables.",
    defaultColors: {
      primary: '#db2777', // pink/magenta
      secondary: '#4f46e5', // violet-indigo
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fee2e2 40%, #faf5ff 100%)',
      accent: '#2563eb', // EU flag blue
      textDark: '#1e293b',
      textLight: '#f8fafc',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: '1. Nom de famille / Surname', type: 'text', defaultValue: 'LEFEBVRE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Prénom(s) / Given name', type: 'text', defaultValue: 'PIERRE MICHEL', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Date de naissance / Birth date', type: 'date', defaultValue: '1985-11-23', section: 'Dates', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: '3. Lieu de naissance / Birthplace', type: 'text', defaultValue: 'LYON (69)', section: 'Dates', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "4a. Date d'émission / Issue date", type: 'date', defaultValue: '2024-06-15', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Date d'expiration / Expiry date", type: 'date', defaultValue: '2039-06-14', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Autorité émettrice / Issuer", type: 'text', defaultValue: 'MINISTERE DE L INTERIEUR', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Numéro de Permis / License No.', type: 'text', defaultValue: '14AA99999', section: 'Général', side: 'recto', gridSpan: 'half' },

      // VERSO FIELDS
      { key: 'lieu_residence', label: '8. Lieu de résidence / Residence', type: 'text', defaultValue: 'MARSEILLE', section: 'Adresse', side: 'verso', gridSpan: 'full' },
      { key: 'categories', label: 'Catégories possédées / Categories', type: 'text', defaultValue: 'AM / B / B1', section: 'Permis', placeholder: 'AM / B / B1 / A', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'europe-ceam',
    name: "Carte Européenne d'Assurance Maladie (CEAM)",
    category: 'health',
    countryName: 'Espace Européen',
    countryCode: 'EU',
    description: "La carte d'assurance maladie facilitant la prise en charge des soins lors de voyages dans l'Espace Économique Européen.",
    defaultColors: {
      primary: '#1d4ed8', // classic royal blue
      secondary: '#075985',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 60%, #bae6fd 100%)',
      accent: '#fbbf24', // golden stars
      textDark: '#0369a1',
      textLight: '#f8fafc',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'nom', label: '3. Nom / Surname', type: 'text', defaultValue: 'BERNARD', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '4. Prénom / Given name', type: 'text', defaultValue: 'SOPHIE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '5. Date de naissance / Birth date', type: 'date', defaultValue: '1990-09-05', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'assure_num', label: '6. N° identification / ID number', type: 'text', defaultValue: '2 90 09 75 125 432', section: 'Identification', side: 'recto', gridSpan: 'half' },
      { key: 'inst_num', label: '7. N° de l’institution / Institution', type: 'text', defaultValue: '10001 (CPAM)', section: 'Identification', side: 'recto', gridSpan: 'half' },
      { key: 'card_num', label: '8. N° identification carte / Card ID', type: 'text', defaultValue: 'FR8309999234', section: 'Identification', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: '9. Date d’expiration / Expiry date', type: 'date', defaultValue: '2028-09-04', section: 'Validité', side: 'recto', gridSpan: 'half' },

      // VERSO
      { key: 'instructions', label: 'Notice / Instructions', type: 'textarea', defaultValue: 'Cette carte est valable pour d\'éventuels soins médicaux d\'urgence à l\'étranger lors de séjours temporaires.', section: 'Validité', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'france-vitale',
    name: 'Carte Vitale (France)',
    category: 'health',
    countryName: 'France',
    countryCode: 'FR',
    description: "Carte d'assurance maladie française reconnaissable à ses couleurs vert/doré et sa puce à contact métallique.",
    defaultColors: {
      primary: '#047857', // forest green
      secondary: '#d97706', // gold/amber
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #fef3c7 100%)',
      accent: '#eab308', // gold
      textDark: '#064e3b',
      textLight: '#f8fafc',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO FIELDS
      { key: 'secu_num', label: 'Numéro de Sécurité Sociale (15 ch.)', type: 'text', defaultValue: '192057512543209', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nom de famille', type: 'text', defaultValue: 'GIRARD', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénom(s)', type: 'text', defaultValue: 'NICOLAS', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "Date d'émission", type: 'date', defaultValue: '2025-08-12', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'organisme', label: "Organisme émetteur (ex: CPAM Paris)", type: 'text', defaultValue: 'Assurance Maladie CPAM', section: 'Général', side: 'recto', gridSpan: 'half' },

      // VERSO
      { key: 'vitale_instructions', label: 'Instructions vitales', type: 'textarea', defaultValue: 'Cette carte est strictement personnelle. Elle contient les informations nécessaires à la prise en charge de vos soins.', section: 'Général', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'student-card',
    name: 'Carte Étudiante Européenne (ESC)',
    category: 'academic',
    countryName: 'Europe',
    countryCode: 'EU',
    description: "Carte d'étudiant uniforme permettant l'accès aux campus, bibliothèques et réductions universitaires à travers l'Europe.",
    defaultColors: {
      primary: '#0f172a', // Slate black
      secondary: '#38bdf8', // Light blue cyan
      background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 60%, #e0f2fe 100%)',
      accent: '#2563eb', // Academic Blue
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      // RECTO
      { key: 'universite', label: 'Université / École', type: 'text', defaultValue: 'UNIVERSITÉ DE SORBONNE', section: 'Établissement', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nom', type: 'text', defaultValue: 'PETIT', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénom', type: 'text', defaultValue: 'MAURICE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'etudiant_num', label: 'N° Étudiant (ex: 20261109)', type: 'text', defaultValue: 'ST829104', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Date de naissance', type: 'date', defaultValue: '2004-03-30', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'academic_year', label: 'Année Scolaire', type: 'select', options: ['2025 / 2026', '2026 / 2027', '2027 / 2028'], defaultValue: '2026 / 2027', section: 'Cursus', side: 'recto', gridSpan: 'half' },
      { key: 'filiere', label: 'Cursus / Filière', type: 'text', defaultValue: 'Sciences de l\'Ingénieur', section: 'Cursus', side: 'recto', gridSpan: 'half' },
      { key: 'esc_number', label: 'N° Européen ESC (carte d\'étudiant)', type: 'text', defaultValue: '1004-982-10AB-842', section: 'Cursus', side: 'recto', gridSpan: 'full' },

      // VERSO
      { key: 'academic_terms', label: 'Règlements & Services', type: 'textarea', defaultValue: 'La carte donne accès aux RU, BU d\'Europe sous réserve d\'affiliation valide pour l\'année d\'exercice.', section: 'Cursus', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'press-badge',
    name: "Carte de Presse / Badge Journaliste",
    category: 'badge',
    countryName: 'Professionnel',
    countryCode: 'PRESS',
    description: "Badge d'identification de presse officiel pour journalistes, photoreporters, avec de grands repères visuels à haute visibilité.",
    defaultColors: {
      primary: '#dc2626', // Bright red
      secondary: '#1e293b', // charcoal
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      accent: '#dc2626',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'none',
    dimensions: { width: 53.98, height: 85.6, aspectRatio: 0.63 }, // Vertical orientation!
    fields: [
      // RECTO
      { key: 'media', label: 'Organe de Presse / Média', type: 'text', defaultValue: 'EUROPE NEWS NETWORK', section: 'Média', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nom', type: 'text', defaultValue: 'DUBOIS', section: 'Journaliste', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénom', type: 'text', defaultValue: 'AURÉLIE', section: 'Journaliste', side: 'recto', gridSpan: 'half' },
      { key: 'fonction', label: 'Fonction (ex: Correspondante)', type: 'text', defaultValue: 'REPORTER PHOTOGRAPHE', section: 'Journaliste', side: 'recto', gridSpan: 'full' },
      { key: 'carte_num', label: 'N° de carte professionnelle', type: 'text', defaultValue: 'PRESS-82910', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Valable jusqu\'au', type: 'date', defaultValue: '2027-12-31', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'authorisation', label: 'Autorité de régulation / Union', type: 'text', defaultValue: 'FEDERATION INTERNATIONALE DES JOURNALISTES', section: 'Média', side: 'recto', gridSpan: 'full' },

      // VERSO
      { key: 'press_rules', label: 'Garanties d\'accès professionnel', type: 'textarea', defaultValue: 'Les autorités civiles et militaires sont priées de laisser circuler librement le titulaire de cette carte dans l\'exercice de ses fonctions de presse.', section: 'Validité', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'security-badge',
    name: "Badge d'Accès Sécurité (Entreprise)",
    category: 'badge',
    countryName: 'Sécurité',
    countryCode: 'SEC',
    description: "Badge d'accès professionnel vertical pour entreprises et sites sécurisés, équipé de barcode et d'indicateur de niveau d'accès.",
    defaultColors: {
      primary: '#1e3a8a', // industrial blue
      secondary: '#ef4444', // Danger alert
      background: 'linear-gradient(135deg, #f8fafc 0%, #eaeefe 60%, #cbd5e1 100%)',
      accent: '#10b981', // green for safe
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 53.98, height: 85.6, aspectRatio: 0.63 }, // Vertical!
    fields: [
      // RECTO
      { key: 'entreprise', label: 'Nom de l\'entreprise', type: 'text', defaultValue: 'ALEXA RESEARCH LABS', section: 'Structure', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nom', type: 'text', defaultValue: 'SANCHEZ', section: 'Titulaire', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénom', type: 'text', defaultValue: 'EMMA', section: 'Titulaire', side: 'recto', gridSpan: 'half' },
      { key: 'fonction', label: 'Poste / Fonction', type: 'text', defaultValue: 'INGÉNIEUR CYBERSÉCURITÉ', section: 'Titulaire', side: 'recto', gridSpan: 'full' },
      { key: 'matricule', label: 'Matricule ID', type: 'text', defaultValue: 'SEC-2026-99A', section: 'Sécurité', side: 'recto', gridSpan: 'half' },
      { key: 'access_level', label: 'Niveau d\'accès', type: 'select', options: ['NIVEAU A (TOTAL)', 'NIVEAU B (RESERVE)', 'NIVEAU C (RESTREINT)', 'NIVEAU D (PUBLIC)'], defaultValue: 'NIVEAU A (TOTAL)', section: 'Sécurité', side: 'recto', gridSpan: 'half' },
      { key: 'zone_autorisee', label: 'Zones Autorisées', type: 'text', defaultValue: 'ZONES: 01, 02, S-3, DC-ALPHA', section: 'Sécurité', side: 'recto', gridSpan: 'full' },

      // VERSO
      { key: 'access_rules', label: 'Propriété et restitution', type: 'textarea', defaultValue: 'Ce badge est la propriété de l\'entreprise. Il doit être porté visiblement et restitué immédiatement en cas de rupture de contrat.', section: 'Sécurité', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'france-permit',
    name: 'Permis de Conduire (France)',
    category: 'permit',
    countryName: 'France',
    countryCode: 'FR',
    description: "Format officiel ID-1 du permis de conduire sécurisé français de l'Imprimerie Nationale avec couleur rose réglementaire.",
    defaultColors: {
      primary: '#db2777',
      secondary: '#4f46e5',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #ffe4e6 45%, #f5f5f4 100%)',
      accent: '#2563eb',
      textDark: '#1e293b',
      textLight: '#f8fafc',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. NOM / Surname', type: 'text', defaultValue: 'MARTIN', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. PRÉNOMS / Given names', type: 'text', defaultValue: 'JEAN FRANÇOIS', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. DATE DE NAISSANCE / Birth date', type: 'date', defaultValue: '1984-06-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: '3. LIEU DE NAISSANCE / Birthplace', type: 'text', defaultValue: 'NICE (06)', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "4a. DATE D'ÉMISSION / Issue date", type: 'date', defaultValue: '2024-06-15', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. FIN DE VALIDITÉ / Expiry date", type: 'date', defaultValue: '2039-06-14', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. AUTORITÉ / Issuing authority", type: 'text', defaultValue: 'PREFECTURE DE NICE', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. NUMÉRO DU PERMIS / License No.', type: 'text', defaultValue: '22AF0918', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'adresse', label: '8. ADRESSE / Residence address', type: 'textarea', defaultValue: '45 AVENUE DE LA RÉPUBLIQUE\n06000 NICE', section: 'Adresse', side: 'verso', gridSpan: 'full' },
      { key: 'categories', label: 'Catégories possédées / Categories', type: 'text', defaultValue: 'AM / A1 / B', section: 'Permis', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'deutschland-permit',
    name: 'Führerschein (Allemagne)',
    category: 'permit',
    countryName: 'Allemagne',
    countryCode: 'DE',
    description: "Permis de conduire officiel de la République Fédérale d'Allemagne (Führerschein) avec sécurité d'impression rose/verte.",
    defaultColors: {
      primary: '#b91c1c',
      secondary: '#047857',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f0fdf4 50%, #fafafa 100%)',
      accent: '#d97706',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Name / Surname', type: 'text', defaultValue: 'MÜLLER', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Vorname / Given names', type: 'text', defaultValue: 'MAXINE ELISABETH', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Geburtsdatum und -ort', type: 'text', defaultValue: '24.08.1992 BERLIN', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_emission', label: "4a. Ausstellungsdatum / Issue date", type: 'date', defaultValue: '2024-01-20', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Ablaufdatum / Expiry date", type: 'date', defaultValue: '2039-01-19', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Behörde / Authority", type: 'text', defaultValue: 'FAHRERLAUBNISBEHÖRDE BERLIN', section: 'Validité', side: 'recto', gridSpan: 'full' },
      { key: 'permis_num', label: '5. Führerscheinnummer / License No.', type: 'text', defaultValue: '89AE1029', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: 'Klassen / Categories', type: 'text', defaultValue: 'AM / B / L', section: 'Führerschein', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'deutschland-egk',
    name: 'Elektronische Gesundheitskarte (Allemagne)',
    category: 'health',
    countryName: 'Allemagne',
    countryCode: 'DE',
    description: "La carte de santé électronique allemande (eGK) avec drapeau allemand, puce médicale sécurisée NFC et logo d'assurance.",
    defaultColors: {
      primary: '#0d9488',
      secondary: '#075985',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0fdff 100%)',
      accent: '#dc2626',
      textDark: '#0f172a',
      textLight: '#f8fafc',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'assure_num', label: 'Krankenversichertennummer (10-stellig)', type: 'text', defaultValue: 'X120495812', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nachname / Surname', type: 'text', defaultValue: 'MÜLLER', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Vorname / First name', type: 'text', defaultValue: 'MAXINE ELISABETH', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'inst_num', label: 'Krankenkasse / Insurer', type: 'text', defaultValue: 'AOK BAYERN', section: 'Versicherung', side: 'recto', gridSpan: 'full' },
      { key: 'date_expiration', label: 'Karten-Gültigkeit / Expiry', type: 'date', defaultValue: '2029-12-31', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'card_num', label: 'Kennnummer der Karte / Card ID', type: 'text', defaultValue: '80276001234', section: 'Versicherung', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'espana-permit',
    name: 'Permiso de Conducción (Espagne)',
    category: 'permit',
    countryName: 'Espagne',
    countryCode: 'ES',
    description: "Permis de conduire espagnol officiel rose, avec intégration du blason de l'Espagne et conformité européenne.",
    defaultColors: {
      primary: '#c2410c',
      secondary: '#b91c1c',
      background: 'linear-gradient(135deg, #fffbeb 0%, #ffe4e6 50%, #fafaf9 100%)',
      accent: '#ca8a04',
      textDark: '#1c1917',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Apellidos / Surname', type: 'text', defaultValue: 'GARCIA LOPEZ', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: '2. Nombre / Given name', type: 'text', defaultValue: 'SOFIA', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: '3. F. Nacimiento y Lugar', type: 'text', defaultValue: '12.04.1991 MADRID', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_emission', label: "4a. F. Expedición / Issue date", type: 'date', defaultValue: '2023-05-18', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. F. Caducidad / Expiry date", type: 'date', defaultValue: '2033-05-17', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Autoridad / Authority", type: 'text', defaultValue: 'DGT MADRID', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Num. Permiso / License No.', type: 'text', defaultValue: '33BB1920', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: 'Clases / Categories', type: 'text', defaultValue: 'B / B1', section: 'Permiso', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'espana-health',
    name: 'Tarjeta Sanitaria (Espagne)',
    category: 'health',
    countryName: 'Espagne',
    countryCode: 'ES',
    description: "Carte sanitaire espagnole (Tarjeta Sanitaria) assurant la couverture médicale par le système national de santé.",
    defaultColors: {
      primary: '#0284c7',
      secondary: '#0f766e',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 50%, #fafafa 100%)',
      accent: '#cf1717',
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'secu_num', label: 'CIPA / Código de Identificación SNS', type: 'text', defaultValue: 'GALO1234567890', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Apellidos / Surnames', type: 'text', defaultValue: 'GARCIA LOPEZ', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: 'Nombre / Given Name', type: 'text', defaultValue: 'SOFIA', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'inst_num', label: 'Servicio de Salud (Comunidad)', type: 'text', defaultValue: 'SERMAS MADRID', section: 'Général', side: 'recto', gridSpan: 'full' },
    ],
  },
  {
    id: 'italia-permit',
    name: 'Patente di Guida (Italie)',
    category: 'permit',
    countryName: 'Italie',
    countryCode: 'IT',
    description: "Patente di Guida italienne au format compact européen, à dominante rose-ivoire de la République Italienne.",
    defaultColors: {
      primary: '#cf1717',
      secondary: '#15803d',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fdf2f8 60%, #fafaf9 100%)',
      accent: '#1e3a8a',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Cognome / Surname', type: 'text', defaultValue: 'ROSSI', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Nome / Given names', type: 'text', defaultValue: 'GIULIA ANNA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Data e luogo di nascita', type: 'text', defaultValue: '05.11.1988 MILANO', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_emission', label: "4a. Data di rilascio / Issue", type: 'date', defaultValue: '2025-02-14', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Data di scadenza / Expiry", type: 'date', defaultValue: '2035-02-13', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Rilasciata da / Authority", type: 'text', defaultValue: 'MIT UCO', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Numero Patente / License No.', type: 'text', defaultValue: '33BB1920', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: '9. Categorie / Categories', type: 'text', defaultValue: 'AM / B', section: 'Patente', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'italia-health',
    name: 'Tessera Sanitaria (Italie)',
    category: 'health',
    countryName: 'Italie',
    countryCode: 'IT',
    description: "Carte nationale des services de santé et code fiscal (Tessera Sanitaria) d'Italie de couleur bleu-vert à l'échelle.",
    defaultColors: {
      primary: '#0284c7',
      secondary: '#047857',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ecfdf5 45%, #ffffff 100%)',
      accent: '#cf1717',
      textDark: '#1e3a8a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'codice_fiscale', label: 'CODICE FISCALE (Cod. Fisc.)', type: 'text', defaultValue: 'RSSGLN88S45F205W', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Cognome / Surname', type: 'text', defaultValue: 'ROSSI', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Nome / First name', type: 'text', defaultValue: 'GIULIA ANNA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sesso / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Data di nascita / Date of birth', type: 'date', defaultValue: '1988-11-05', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'lieu_naissance', label: 'Luogo di nascita / Birthplace', type: 'text', defaultValue: 'MILANO (MI)', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_expiration', label: 'Scadenza / Expiry date', type: 'date', defaultValue: '2030-11-04', section: 'Validité', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'belgique-permit',
    name: 'Permis de Conduire (Belgique)',
    category: 'permit',
    countryName: 'Belgique',
    countryCode: 'BE',
    description: "Permis de conduire officiel belge (Rijbewijs), rose européen classique, estampillé avec le symbole royal de la Belgique.",
    defaultColors: {
      primary: '#1e293b',
      secondary: '#d97706',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fffbeb 50%, #fafafa 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Naam / Nom / Surname', type: 'text', defaultValue: 'VANDEPUP', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Voornamen / Prénoms / Given names', type: 'text', defaultValue: 'LUCAS FRANS', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Geboorteplaats & -datum / Birth info', type: 'text', defaultValue: '15.01.1994 BRUSSEL', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_emission', label: "4a. Afgiftebepalingen / Issue date", type: 'date', defaultValue: '2024-02-10', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Vervaldatum / Expiry date", type: 'date', defaultValue: '2034-02-09', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Afgegeven door / Issuing officer", type: 'text', defaultValue: 'STAD BRUSSEL', section: 'Validité', side: 'recto', gridSpan: 'full' },
      { key: 'permis_num', label: '5. Rijbewijsnummer / License No.', type: 'text', defaultValue: '592104593', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: '9. Categorieën / Categories', type: 'text', defaultValue: 'B / AM', section: 'Permis', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'belgique-health',
    name: 'Carte d\'Assurance Maladie (Belgique)',
    category: 'health',
    countryName: 'Belgique',
    countryCode: 'BE',
    description: "Carte sanitaire de la mutualité belge facilitant les remboursements de soins médicaux et de pharmacie.",
    defaultColors: {
      primary: '#2563eb',
      secondary: '#ca8a04',
      background: 'linear-gradient(135deg, #eff6ff 0%, #fefce8 50%, #fafaf9 100%)',
      accent: '#dc2626',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'secu_num', label: 'N° / INSZ-NISS National Identification', type: 'text', defaultValue: '94.01.15-123.45', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Naam / Nom / Surname', type: 'text', defaultValue: 'VANDEPUP', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénoms / Given names', type: 'text', defaultValue: 'LUCAS FRANS', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'card_num', label: 'Klantnummer-Mutualité / Beneficiary', type: 'text', defaultValue: 'MUT306-102945', section: 'Mutualité', side: 'recto', gridSpan: 'full' },
    ],
  },
  {
    id: 'suisse-id',
    name: "Identitätskarte / Carte d'Identité (Suisse)",
    category: 'id',
    countryName: 'Suisse',
    countryCode: 'CH',
    description: "Carte d'identité suisse officielle (Format ID-1) de couleur rouge vif avec d'authentiques croix suisses en hologramme.",
    defaultColors: {
      primary: '#ef4444',
      secondary: '#ffffff',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 40%, #ffffff 100%)',
      accent: '#b91c1c',
      textDark: '#1e293b',
      textLight: '#ff0000',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Name / Nom / Surname', type: 'text', defaultValue: 'FAVRRE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Vornamen / Prénoms / Given names', type: 'text', defaultValue: 'LEONIE MATHILDA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Geburtsdatum / Birthdate', type: 'date', defaultValue: '1995-10-18', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Geschlecht / Sexe / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Ausweis Nr. / Card Number', type: 'text', defaultValue: 'CH9820155', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Gültig bis / Expiry date', type: 'date', defaultValue: '2035-10-17', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'taille', label: 'Grösse / Taille / Height', type: 'text', defaultValue: '1.67 m', section: 'Physique', side: 'verso', gridSpan: 'half' },
      { key: 'prefecture', label: 'Kanton / Canton d\'origine', type: 'text', defaultValue: 'GENÈVE (GE)', section: 'Validité', side: 'verso', gridSpan: 'half' },
      { key: 'date_emission', label: 'Ausgestellt am / Date of issue', type: 'date', defaultValue: '2025-10-18', section: 'Validité', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'suisse-permit',
    name: 'Führerausweis / Permis de Conduire (Suisse)',
    category: 'permit',
    countryName: 'Suisse',
    countryCode: 'CH',
    description: "Führerausweis suisse officiel, un des plus innovants avec dégradés bleu et rose sécurisés et armoiries confédérées.",
    defaultColors: {
      primary: '#0ea5e9',
      secondary: '#db2777',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #fdf2f8 60%, #fafafa 100%)',
      accent: '#cf1717',
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Name / Nom / Surname', type: 'text', defaultValue: 'FAVRRE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Vorname / Prénoms / Given name', type: 'text', defaultValue: 'LEONIE MATHILDA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Geburtsdatum / Birth date', type: 'date', defaultValue: '1995-10-18', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "4a. Ausgestellt am / Date d'émission", type: 'date', defaultValue: '2024-03-12', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Kanton Behörde / Canton Authority", type: 'text', defaultValue: 'OCN GENÈVE', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Ausweisnummer / License No.', type: 'text', defaultValue: 'GE-902155/1', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: 'Categories', type: 'text', defaultValue: 'A / B / BE', section: 'Permis', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'netherlands-id',
    name: 'Identiteitskaart (Pays-Bas)',
    category: 'id',
    countryName: 'Pays-Bas',
    countryCode: 'NL',
    description: "Identiteitskaart néerlandaise réglementaire avec la couronne d'Orange et micro-motifs sécurisés bleutés.",
    defaultColors: {
      primary: '#4338ca',
      secondary: '#ea580c',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fff7ed 55%, #fafafa 100%)',
      accent: '#ea580c',
      textDark: '#1e1b4b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Achternaam / Surname', type: 'text', defaultValue: 'DE JONG', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Voornamen / Given Names', type: 'text', defaultValue: 'SOPHIE ANIQUE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Geburtsdatum / Birthdate', type: 'date', defaultValue: '1993-07-22', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Geslacht / Sex', type: 'select', options: ['M', 'V'], defaultValue: 'V', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Documentnummer / Card No.', type: 'text', defaultValue: 'NL1892552', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Geldig tot / Expiry date', type: 'date', defaultValue: '2033-07-21', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'bsn', label: 'Burgerservicenummer (BSN)', type: 'text', defaultValue: '192.051.84A', section: 'Identification', side: 'verso', gridSpan: 'full' },
      { key: 'date_emission', label: 'Afgifte / Issue Date', type: 'date', defaultValue: '2023-07-22', section: 'Validité', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'netherlands-permit',
    name: 'Rijbewijs (Pays-Bas)',
    category: 'permit',
    countryName: 'Pays-Bas',
    countryCode: 'NL',
    description: "Rijbewijs hollandais officiel de format compact rose avec lettrage néerlandais distinctif.",
    defaultColors: {
      primary: '#ca8a04',
      secondary: '#4f46e5',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fffbeb 50%, #fafafa 100%)',
      accent: '#ca8a04',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Achternaam / Surname', type: 'text', defaultValue: 'DE JONG', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: '2. Voornamen / Given names', type: 'text', defaultValue: 'SOPHIE ANIQUE', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: '3. Geboortedatum / Birth date', type: 'date', defaultValue: '1993-07-22', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "4a. Afgifte / Issue date", type: 'date', defaultValue: '2024-05-11', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Geldig tot / Expiry date", type: 'date', defaultValue: '2034-05-10', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Autoriteit / Issuing Authority", type: 'text', defaultValue: 'RDW APELDOORN', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Rijbewijsnummer / License No.', type: 'text', defaultValue: 'NL-10295111', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: '9. Categorieën / Categories', type: 'text', defaultValue: 'B / AM', section: 'Permis', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'portugal-id',
    name: 'Cartão de Cidadão (Portugal)',
    category: 'id',
    countryName: 'Portugal',
    countryCode: 'PT',
    description: "Format officiel du Cartão de Cidadão portugais, à dominante beige-doré-vert d'eau, avec sphère armillaire et blason national.",
    defaultColors: {
      primary: '#047857',
      secondary: '#ca8a04',
      background: 'linear-gradient(135deg, #fefae0 0%, #ecfdf5 45%, #ffffff 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Apelidos / Surnames', type: 'text', defaultValue: 'SILVA CARVALHO', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: 'Nomes / Given Names', type: 'text', defaultValue: 'TIAGO MANUEL', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: 'Data de Nascimento / Birth date', type: 'date', defaultValue: '1991-03-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sexo / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Num. Documento / Card ID', type: 'text', defaultValue: 'PT8294511', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Validade / Expiry date', type: 'date', defaultValue: '2031-03-11', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'nif', label: 'NIF (Contribinte)', type: 'text', defaultValue: '192049511', section: 'Identification', side: 'verso', gridSpan: 'half' },
      { key: 'niss', label: 'NISS (Segurança Social)', type: 'text', defaultValue: '10928412932', section: 'Identification', side: 'verso', gridSpan: 'half' },
    ],
  },
  {
    id: 'portugal-permit',
    name: 'Carta de Condução (Portugal)',
    category: 'permit',
    countryName: 'Portugal',
    countryCode: 'PT',
    description: "Carta de Condução réglementaire du Portugal, modèle rose européen, marqué des armoiries de la République Portugaise.",
    defaultColors: {
      primary: '#15803d',
      secondary: '#db2777',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #ffffeb 50%, #fafafa 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Apelidos / Surnames', type: 'text', defaultValue: 'SILVA CARVALHO', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: '2. Nomes / Given names', type: 'text', defaultValue: 'TIAGO MANUEL', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: '3. Data e local de nascimento', type: 'text', defaultValue: '12.03.1991 LISBOA', section: 'Naissance', side: 'recto', gridSpan: 'full' },
      { key: 'date_emission', label: "4a. Emissão / Issue date", type: 'date', defaultValue: '2023-04-18', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Validade / Expiry date", type: 'date', defaultValue: '2033-04-17', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'delivre_par', label: "4c. Autoridade / Authority", type: 'text', defaultValue: 'IMT LISBOA', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Num. Carta / License No.', type: 'text', defaultValue: '33BB1920', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'categories', label: 'Categorias de condução', type: 'text', defaultValue: 'AM / B', section: 'Carta', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'portugal-health',
    name: 'Cartão de Utente de Saúde (Portugal)',
    category: 'health',
    countryName: 'Portugal',
    countryCode: 'PT',
    description: "La carte nationale d'usager de santé portugaise (SNS) pour l'accès aux soins de santé publics.",
    defaultColors: {
      primary: '#0ea5e9',
      secondary: '#10b981',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ecfdf5 50%, #ffffff 100%)',
      accent: '#059669',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'numero_utente', label: 'Nº Utente / National Health No.', type: 'text', defaultValue: '409281309', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nome Completo / Full Name', type: 'text', defaultValue: 'TIAGO MANUEL SILVA CARVALHO', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: 'Data de Nascimento / Date of birth', type: 'date', defaultValue: '1991-03-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sexo / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'canada-citizenship',
    name: 'Certificat de Citoyenneté (Canada)',
    category: 'id',
    countryName: 'Canada',
    countryCode: 'CA',
    description: "Format officiel de la carte de citoyenneté canadienne avec feuille d'érable rouge, bilingue anglais-français.",
    defaultColors: {
      primary: '#dc2626',
      secondary: '#ffffff',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 40%, #fff5f5 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ef4444',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Nom de famille / Surname', type: 'text', defaultValue: 'SMITH', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénoms / Given names', type: 'text', defaultValue: 'EMMA GRACE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'cert_num', label: 'N° de certificat / Certificate No.', type: 'text', defaultValue: 'CAN-1959-128', section: 'Identification', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sexe / Sex', type: 'select', options: ['M', 'F', 'X'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Date de naissance / Date of birth', type: 'date', defaultValue: '1997-04-20', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_citoyen', label: 'Date de citoyenneté / Citizenship Date', type: 'date', defaultValue: '2019-10-24', section: 'Validité', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'canada-permit',
    name: "Permis de Conduire (Canada - Ontario)",
    category: 'permit',
    countryName: 'Canada',
    countryCode: 'CA',
    description: "Permis de conduire canadien (Ontario), à dominante turquoise avec fleurs triliums de l'Ontario et feuilles d'érable sécurisées.",
    defaultColors: {
      primary: '#0e7490',
      secondary: '#0891b2',
      background: 'linear-gradient(135deg, #ecfeff 0%, #e0f7fa 45%, #ffffff 100%)',
      accent: '#dc2626',
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Nom de famille / Surname', type: 'text', defaultValue: 'SMITH', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'prenoms', label: '2. Prénom(s) / Given name(s)', type: 'text', defaultValue: 'EMMA GRACE', section: 'Identité', side: 'recto', gridSpan: 'full' },
      { key: 'adresse', label: '8. Domicile / Address', type: 'textarea', defaultValue: '124 SPADINA AVENUE\nTORONTO ON M5V 2L4\nCANADA', section: 'Adresse', side: 'recto', gridSpan: 'full' },
      { key: 'date_naissance', label: '3. Date de naissance / Date of Birth', type: 'date', defaultValue: '1997-04-20', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sexe / Sex', type: 'select', options: ['M', 'F', 'X'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'taille', label: 'Hauteur / Height', type: 'text', defaultValue: '165 cm', section: 'Physique', side: 'recto', gridSpan: 'half' },
      { key: 'class', label: '9. Classe / Class', type: 'text', defaultValue: 'G', section: 'Général', side: 'recto', gridSpan: 'half' },
      { key: 'date_emission', label: "4a. Date d'émission / Issue Date", type: 'date', defaultValue: '2023-05-14', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "4b. Date d'expiration / Expiry Date", type: 'date', defaultValue: '2028-04-20', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'permis_num', label: '5. Numéro de licence / License No.', type: 'text', defaultValue: 'S1294-59210-97420', section: 'Général', side: 'recto', gridSpan: 'full' },
    ],
  },
  {
    id: 'canada-health',
    name: "Carte d'Assurance Maladie (Québec)",
    category: 'health',
    countryName: 'Canada',
    countryCode: 'CA',
    description: "Carte d'assurance maladie du Québec (RAMQ), surnommée 'Carte soleil' avec dégradé bleu ciel et motif soleil couchant.",
    defaultColors: {
      primary: '#0284c7',
      secondary: '#4f46e5',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ffedd5 50%, #ffffff 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'code_sante', label: "Code d'Assurance Maladie (ex: SMIT 1974 0420)", type: 'text', defaultValue: 'SMIT 1974 0420', section: 'Identification', side: 'recto', gridSpan: 'full' },
      { key: 'nom', label: 'Nom à la naissance / Surname', type: 'text', defaultValue: 'SMITH', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Prénom / Given name', type: 'text', defaultValue: 'EMMA', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Sexe / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'F', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Date de naissance / Date of birth', type: 'date', defaultValue: '1997-04-20', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: "Expire en (Année-Mois) / Expiry Date", type: 'text', defaultValue: '2028-10', section: 'Validité', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'austria-id',
    name: 'Personalausweis (Autriche)',
    category: 'id',
    countryName: 'Autriche',
    countryCode: 'AT',
    description: "Carte d'identité autrichienne officielle format ID-1 avec fond dégradé rose/gris, armoiries de l'Autriche (aigle royal).",
    defaultColors: {
      primary: '#be123c',
      secondary: '#64748b',
      background: 'linear-gradient(135deg, #ffe4e6 0%, #f1f5f9 45%, #ffffff 100%)',
      accent: '#be123c',
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern2',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: '1. Nachname / Surname', type: 'text', defaultValue: 'HUBER', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: '2. Vorname / Given names', type: 'text', defaultValue: 'LUKAS JAKOB', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: '3. Geburtsdatum / Date of birth', type: 'date', defaultValue: '1994-11-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Geschlecht / Sex', type: 'select', options: ['M', 'W'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: '7. Ausweisnummer / Card Number', type: 'text', defaultValue: 'A9250198', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: '8. Gültig bis / Expiry date', type: 'date', defaultValue: '2034-11-11', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'adresse', label: 'Wohnort / Address', type: 'textarea', defaultValue: 'HERRENGASSE 7\n1010 WIEN', section: 'Adresse', side: 'verso', gridSpan: 'full' },
    ],
  },
  {
    id: 'poland-id',
    name: 'Dowód Osobisty / e-Dowód (Pologne)',
    category: 'id',
    countryName: 'Pologne',
    countryCode: 'PL',
    description: "Carte nationale d'identité de la République de Pologne bilingue avec blason de l'aigle blanc d'argent et fond de sécurité rose-blanc.",
    defaultColors: {
      primary: '#cf1717',
      secondary: '#dc2626',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff5f5 100%)',
      accent: '#cf1717',
      textDark: '#1e293b',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern1',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Nazwisko / Surname', type: 'text', defaultValue: 'KOWALSKI', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Imiona / Given Names', type: 'text', defaultValue: 'JAN PAWEŁ', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationalite', label: 'Obywatelstwo / Nationality', type: 'text', defaultValue: 'POLSKIE', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'pesel', label: 'Numer PESEL / PESEL No.', type: 'text', defaultValue: '94111204910', section: 'Identification', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Numer dowodu / Document No.', type: 'text', defaultValue: 'AYE924015', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Termin ważności / Expiry date', type: 'date', defaultValue: '2034-11-12', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Data urodzenia / Birth date', type: 'date', defaultValue: '1994-11-12', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Płeć / Sex', type: 'select', options: ['M', 'K'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
    ],
  },
  {
    id: 'ireland-identity',
    name: 'Passport Card (Irlande)',
    category: 'id',
    countryName: 'Irlande',
    countryCode: 'IE',
    description: "Carte passeport de la République d'Irlande, vert profond officiel, avec harpe celtique, motifs sécurisés et lettrages bilingues irlandais/anglais.",
    defaultColors: {
      primary: '#0f5132',
      secondary: '#ca8a04',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #fef8f0 55%, #e8f5e9 100%)',
      accent: '#064e3b',
      textDark: '#0f172a',
      textLight: '#ffffff',
    },
    securityPattern: 'pattern3',
    dimensions: { width: 85.6, height: 53.98, aspectRatio: 1.586 },
    fields: [
      { key: 'nom', label: 'Sloinne / Surname', type: 'text', defaultValue: 'O’CONNOR', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'prenoms', label: 'Túsainmneacha / Given names', type: 'text', defaultValue: 'SEÁN PATRICK', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'doc_num', label: 'Uimhir an Chárta / Card No.', type: 'text', defaultValue: 'IE921045A', section: 'Validité', side: 'recto', gridSpan: 'half' },
      { key: 'sexe', label: 'Gnéas / Sex', type: 'select', options: ['M', 'F'], defaultValue: 'M', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'nationality', label: 'Náisiúntacht / Nationality', type: 'text', defaultValue: 'IRL', section: 'Identité', side: 'recto', gridSpan: 'half' },
      { key: 'date_naissance', label: 'Dáta Breithe / Birth date', type: 'date', defaultValue: '1992-05-17', section: 'Naissance', side: 'recto', gridSpan: 'half' },
      { key: 'date_expiration', label: 'Dáta Éaga / Expiry Date', type: 'date', defaultValue: '2032-05-16', section: 'Validité', side: 'recto', gridSpan: 'half' },
    ],
  },
];

export const COUNTRY_LOGOS: Record<string, { flag: string; countryCode: string; countryCode3: string; defaultHeaderName: string }> = {
  FR: { flag: '🇫🇷', countryCode: 'F', countryCode3: 'FRA', defaultHeaderName: 'RÉPUBLIQUE FRANÇAISE' },
  DE: { flag: '🇩🇪', countryCode: 'D', countryCode3: 'DEU', defaultHeaderName: 'BUNDESREPUBLIK DEUTSCHLAND' },
  ES: { flag: '🇪🇸', countryCode: 'E', countryCode3: 'ESP', defaultHeaderName: 'REINO DE ESPAÑA' },
  IT: { flag: '🇮🇹', countryCode: 'I', countryCode3: 'ITA', defaultHeaderName: 'REPUBBLICA ITALIANA' },
  BE: { flag: '🇧🇪', countryCode: 'B', countryCode3: 'BEL', defaultHeaderName: 'ROYAUME DE BELGIQUE' },
  PT: { flag: '🇵🇹', countryCode: 'P', countryCode3: 'PRT', defaultHeaderName: 'REPÚBLICA PORTUGUESA' },
  CH: { flag: '🇨🇭', countryCode: 'CH', countryCode3: 'CHE', defaultHeaderName: 'CONFÉDÉRATION SUISSE' },
  NL: { flag: '🇳🇱', countryCode: 'NL', countryCode3: 'NLD', defaultHeaderName: 'KONINKRIJK DER NEDERLANDEN' },
  AT: { flag: '🇦🇹', countryCode: 'A', countryCode3: 'AUT', defaultHeaderName: 'REPUBLIK ÖSTERREICH' },
  PL: { flag: '🇵🇱', countryCode: 'PL', countryCode3: 'POL', defaultHeaderName: 'RZECZPOSPOLITA POLSKA' },
  IE: { flag: '🇮🇪', countryCode: 'IRL', countryCode3: 'IRL', defaultHeaderName: 'REPUBLIC OF IRELAND é ÉIRE' },
  CA: { flag: '🇨🇦', countryCode: 'CA', countryCode3: 'CAN', defaultHeaderName: 'GOVERNMENT OF CANADA - GOUVERNEMENT DU CANADA' },
  EU: { flag: '🇪🇺', countryCode: 'EU', countryCode3: 'EUE', defaultHeaderName: 'UNION EUROPÉENNE' },
  PRESS: { flag: '📰', countryCode: 'PRESS', countryCode3: 'PRS', defaultHeaderName: 'PRESS CARD - INTERNATIONAL' },
  SEC: { flag: '🛡️', countryCode: 'SEC', countryCode3: 'SEC', defaultHeaderName: 'SECURITY ACCESS CONTROL' },
};

export const SIGNATURE_FONTS = [
  { key: 'cursive1', name: 'Élégante', className: 'font-["Playfair_Display",_serif] italic font-semibold' },
  { key: 'cursive2', name: 'Manuscrite Moderne', className: 'font-sans italic font-light tracking-wide' },
  { key: 'cursive3', name: 'Technique', className: 'font-mono uppercase tracking-widest text-[#0f172a]' },
  { key: 'cursive4', name: 'Calligraphic', className: 'font-serif tracking-wider font-extralight' },
];

/**
 * Calculates MRZ checksum according to standard ICAO Doc 9303 (weights 7, 3, 1 repeating)
 */
export function calculateMRZChecksum(str: string): number {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    let val = 0;
    if (char >= '0' && char <= '9') {
      val = parseInt(char, 10);
    } else if (char >= 'A' && char <= 'Z') {
      val = char.charCodeAt(0) - 55;
    } else {
      val = 0; // '<' represents 0
    }
    sum += val * weights[i % 3];
  }
  return sum % 10;
}

/**
 * Generates official 3-line TD1 Machine Readable Zone (MRZ) used on new European ID cards (Format ID-1, 3 lines of 30 characters each).
 */
export function generateTD1MRZ(
  countryCode3: string,
  docNum: string,
  nom: string,
  prenoms: string,
  dateNaissance: string,
  sexe: string,
  dateExpiration: string
): string[] {
  // Format inputs
  const rawCountry = (countryCode3 || 'FRA').toUpperCase().slice(0, 3).padEnd(3, '<');
  const rawDocNum = (docNum || 'XXXXXXXXX').toUpperCase().slice(0, 9).replace(/[^A-Z0-9]/g, '<').padEnd(9, '<');
  
  const docCheck = calculateMRZChecksum(rawDocNum);

  // Optional further field (standardized spaces, sometimes carries sex, control codes, birth verification)
  // On French new CNI:
  // Line 1: IDFRAX4RTBPFW46<<<<<<<<<<<<<<< (30 chars)
  // Where ID + FRA + DocNum (9 chars) + Check digit (1 char) + padding/optional info (15 chars)
  // Let's create Line 1:
  const line1 = `ID${rawCountry}${rawDocNum}${docCheck}<<<<<<<<<<<<<<<`.slice(0, 30);

  // Line 2: Birth date (YYMMDD) + check digit + sex (M/F) + expiry date (YYMMDD) + check digit + nationality + padding + global check digit
  let birthYYMMDD = '900101';
  if (dateNaissance && dateNaissance.length >= 10) {
    birthYYMMDD = dateNaissance.slice(2, 4) + dateNaissance.slice(5, 7) + dateNaissance.slice(8, 10);
  }
  const birthCheck = calculateMRZChecksum(birthYYMMDD);

  const cleanSex = (sexe || 'M').toUpperCase().charAt(0);
  
  let expYYMMDD = '350101';
  if (dateExpiration && dateExpiration.length >= 10) {
    expYYMMDD = dateExpiration.slice(2, 4) + dateExpiration.slice(5, 7) + dateExpiration.slice(8, 10);
  }
  const expCheck = calculateMRZChecksum(expYYMMDD);

  // Nationality: Let's use rawCountry
  const nationality = rawCountry;

  // Let's construct core of line 2: 6(birth) + 1(check) + 1(sex) + 6(exp) + 1(check) + 3(nat) = 18 chars.
  // Padded with `<` up to 29 characters, then 1 digit of composite checksum (covering docNum, birth, exp)
  const line2Core = `${birthYYMMDD}${birthCheck}${cleanSex}${expYYMMDD}${expCheck}${nationality}`;
  const paddingLine2 = `<<<<<<<<<<<`; // 11 chars padding
  const unsignLine2 = `${line2Core}${paddingLine2}`.slice(0, 29);
  
  // Composite checksum consists of: rawDocNum + docCheck + birthYYMMDD + birthCheck + expYYMMDD + expCheck + optional info
  // Since we don't have optional info, we check: rawDocNum + docCheck + birthYYMMDD + birthCheck + expYYMMDD + expCheck
  const mrzCompositeStr = `${rawDocNum}${docCheck}${birthYYMMDD}${birthCheck}${expYYMMDD}${expCheck}`;
  const compositeCheck = calculateMRZChecksum(mrzCompositeStr);
  const line2 = `${unsignLine2}${compositeCheck}`;

  // Line 3: Name and surnames. Format: Surname << Forename1 < Forename2 < ...
  const cleanNom = (nom || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, '');
  const cleanPrenoms = (prenoms || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s,.-]/g, '').replace(/[\s,.-]+/g, '<');
  
  // Surname + "<<" + given names, filled to 30 characters
  const line3 = `${cleanNom}<<${cleanPrenoms}`.padEnd(30, '<').slice(0, 30);

  return [line1, line2, line3];
}

/**
 * Generates ancient 2-line French CNI MRZ (2 lines of 36 characters) as a backward fallback
 */
export function generateFrenchMRZ(nom: string, prenoms: string, dateNaissance: string, sexe: string, docNum: string, expDate: string): string[] {
  const cleanNom = (nom || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, '');
  const cleanPrenoms = (prenoms || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, '>');
  const cleanDoc = (docNum || '999999999').slice(0, 9).toUpperCase().padEnd(9, '<');
  
  let birthYYMMDD = '900101';
  if (dateNaissance && dateNaissance.length >= 10) {
    birthYYMMDD = dateNaissance.slice(2, 4) + dateNaissance.slice(5, 7) + dateNaissance.slice(8, 10);
  }
  
  let expYYMMDD = '350101';
  if (expDate && expDate.length >= 10) {
    expYYMMDD = expDate.slice(2, 4) + expDate.slice(5, 7) + expDate.slice(8, 10);
  }
  
  const cleanSex = (sexe || 'M').slice(0, 1).toUpperCase();
  
  const docCheck = calculateMRZChecksum(cleanDoc);
  const birthCheck = calculateMRZChecksum(birthYYMMDD);
  const expCheck = calculateMRZChecksum(expYYMMDD);
  
  const line1 = `IDFRA${cleanDoc}${docCheck}<<<<<<<<<<<<<<<<<<`.slice(0, 36);
  const nameSection = `${cleanNom}<<${cleanPrenoms}`.padEnd(21, '<').slice(0, 21);
  const core2 = `${birthYYMMDD}${birthCheck}${cleanSex}${expYYMMDD}${expCheck}FRA`;
  const line2 = `${nameSection}${core2}<<<<<<<<<<<<<<<<<<<`.slice(0, 36);
  
  return [line1, line2];
}
