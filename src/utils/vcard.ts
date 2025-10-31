/**
 * Utilidad para generar archivos vCard (formato .vcf)
 * Compatible con iOS y Android
 */

export interface VCardData {
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  photo?: string; // URL de la foto
}

/**
 * Detecta si el dispositivo es iOS
 */
export const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Detecta si el dispositivo es Android
 */
export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Genera un archivo vCard en formato VCF 3.0
 * Compatible con iOS y Android
 */
export const generateVCard = (data: VCardData): string => {
  const {
    name,
    title,
    company,
    phone,
    email,
    website,
    address,
    photo,
  } = data;

  // Separar nombre en partes (apellido;nombre)
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';

  // Nombre completo y estructurado
  vcard += `FN:${name}\n`;
  vcard += `N:${lastName};${firstName};;;\n`;

  // Organización y título
  if (company) {
    vcard += `ORG:${company}\n`;
  }
  if (title) {
    vcard += `TITLE:${title}\n`;
  }

  // Teléfono
  if (phone) {
    vcard += `TEL;TYPE=CELL:${phone}\n`;
  }

  // Email
  if (email) {
    vcard += `EMAIL;TYPE=INTERNET:${email}\n`;
  }

  // Sitio web
  if (website) {
    vcard += `URL:${website}\n`;
  }

  // Dirección
  if (address) {
    vcard += `ADR;TYPE=WORK:;;${address};;;;\n`;
  }

  // Foto (URL)
  if (photo) {
    vcard += `PHOTO;VALUE=URL;TYPE=JPEG:${photo}\n`;
  }

  vcard += 'END:VCARD';

  return vcard;
};

/**
 * Descarga un archivo vCard
 */
export const downloadVCard = (vcardContent: string, fileName: string = 'contacto'): void => {
  // Crear blob con el contenido
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });

  // Crear URL temporal
  const url = window.URL.createObjectURL(blob);

  // Crear enlace temporal y hacer click
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.vcf`;

  // Agregar al DOM, hacer click y remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpiar URL temporal
  window.URL.revokeObjectURL(url);
};

/**
 * Comparte un vCard usando Web Share API (NFC, AirDrop, Bluetooth)
 * Funciona en dispositivos móviles modernos
 */
export const shareVCard = async (vcardContent: string, fileName: string = 'contacto'): Promise<boolean> => {
  // Verificar si el navegador soporta Web Share API
  if (!navigator.share) {
    console.warn('Web Share API no soportada en este navegador');
    return false;
  }

  try {
    // Crear blob y archivo
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const file = new File([blob], `${fileName}.vcf`, { type: 'text/vcard' });

    // Verificar si se puede compartir archivos
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Compartir contacto',
        text: `Contacto: ${fileName}`,
      });
      return true;
    } else {
      // Fallback: compartir solo URL si no se pueden compartir archivos
      console.warn('No se pueden compartir archivos, usando fallback');
      return false;
    }
  } catch (error) {
    // El usuario canceló o hubo un error
    if ((error as Error).name === 'AbortError') {
      console.log('Usuario canceló el compartir');
    } else {
      console.error('Error al compartir:', error);
    }
    return false;
  }
};
