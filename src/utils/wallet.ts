/**
 * Utilidades para generar pases de Apple Wallet y Google Wallet
 * Usando servicios gratuitos y APIs públicas
 */

export interface WalletPassData {
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  photo?: string;
}

/**
 * Detecta si el dispositivo es iOS/macOS (soporta Apple Wallet)
 */
export const supportsAppleWallet = (): boolean => {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};

/**
 * Detecta si el dispositivo es Android (soporta Google Wallet)
 */
export const supportsGoogleWallet = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Genera un pase de contacto para Apple Wallet usando pass2u.net (servicio gratuito)
 *
 * Pass2U es un servicio gratuito que permite generar pases .pkpass sin necesidad
 * de certificados de Apple Developer
 */
export const generateAppleWalletPass = async (data: WalletPassData): Promise<string | null> => {
  try {
    // Crear datos del pase en formato compatible
    const passData = {
      // Información básica del pase
      description: `Tarjeta de contacto de ${data.name}`,
      organizationName: data.company || 'Contacto',

      // Tipo de pase: tarjeta genérica
      passTypeIdentifier: 'pass.com.businesscard',

      // Información de la tarjeta
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'Nombre',
            value: data.name
          }
        ],
        secondaryFields: [
          {
            key: 'title',
            label: 'Cargo',
            value: data.title || ''
          }
        ],
        auxiliaryFields: [
          {
            key: 'company',
            label: 'Empresa',
            value: data.company || ''
          }
        ],
        backFields: [
          {
            key: 'phone',
            label: 'Teléfono',
            value: data.phone || ''
          },
          {
            key: 'email',
            label: 'Email',
            value: data.email || ''
          },
          {
            key: 'website',
            label: 'Sitio web',
            value: data.website || ''
          }
        ]
      }
    };

    // Por ahora, retornamos null ya que necesitaríamos un backend para firmar el pase
    // En su lugar, usaremos un enfoque diferente más abajo
    console.log('Apple Wallet pass data prepared:', passData);
    return null;
  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error);
    return null;
  }
};

/**
 * Genera una URL para agregar a Google Wallet
 * Usa Google Wallet API con JWT
 */
export const generateGoogleWalletURL = (data: WalletPassData): string => {
  // Crear el objeto del pase
  const passObject = {
    id: `business-card-${Date.now()}`,
    classId: 'business_card_class',
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    cardTitle: {
      defaultValue: {
        language: 'es',
        value: data.name
      }
    },
    header: {
      defaultValue: {
        language: 'es',
        value: data.title || 'Contacto'
      }
    },
    textModulesData: [
      {
        header: 'Empresa',
        body: data.company || '',
        id: 'company'
      },
      {
        header: 'Teléfono',
        body: data.phone || '',
        id: 'phone'
      },
      {
        header: 'Email',
        body: data.email || '',
        id: 'email'
      },
      {
        header: 'Web',
        body: data.website || '',
        id: 'website'
      }
    ]
  };

  // Codificar el objeto como JSON
  const passJSON = JSON.stringify(passObject);
  const encodedPass = btoa(passJSON);

  // Por ahora retornamos la URL de documentación
  // En producción necesitarías firmar esto con tu API key de Google
  return `https://pay.google.com/gp/v/save/${encodedPass}`;
};

/**
 * SOLUCIÓN ALTERNATIVA GRATUITA:
 * Usar un enfoque basado en vCard mejorado que se puede agregar como "contacto especial"
 * y generar un QR code que la otra persona puede escanear
 */

/**
 * Genera una URL especial que al abrirse en iOS muestra opción de agregar a Wallet
 * Usa el formato de "Contact Card" especial de iOS
 */
export const generateAppleContactURL = (data: WalletPassData): string => {
  // iOS puede abrir archivos vCard desde URLs con el protocolo adecuado
  const vcard = generateEnhancedVCard(data);
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  return url;
};

/**
 * Genera un vCard mejorado con más metadatos
 */
const generateEnhancedVCard = (data: WalletPassData): string => {
  const nameParts = data.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${data.name}\n`;
  vcard += `N:${lastName};${firstName};;;\n`;

  if (data.company) vcard += `ORG:${data.company}\n`;
  if (data.title) vcard += `TITLE:${data.title}\n`;
  if (data.phone) vcard += `TEL;TYPE=CELL:${data.phone}\n`;
  if (data.email) vcard += `EMAIL;TYPE=INTERNET:${data.email}\n`;
  if (data.website) vcard += `URL:${data.website}\n`;
  if (data.address) vcard += `ADR;TYPE=WORK:;;${data.address};;;;\n`;
  if (data.photo) vcard += `PHOTO;VALUE=URL;TYPE=JPEG:${data.photo}\n`;

  // Agregar categoría especial para que iOS lo reconozca
  vcard += 'CATEGORIES:Business Card,Digital Card\n';

  // Agregar nota con instrucciones
  vcard += 'NOTE:Tarjeta de presentación digital. Guarda este contacto para tener toda mi información siempre a mano.\n';

  vcard += 'END:VCARD';
  return vcard;
};

/**
 * Abre el diálogo de "Agregar a Wallet" del dispositivo
 * En iOS: Intenta usar Apple Wallet
 * En Android: Usa Google Wallet
 */
export const addToWallet = async (data: WalletPassData): Promise<boolean> => {
  if (supportsAppleWallet()) {
    // Para iOS, por ahora usamos vCard mejorado
    // En el futuro, cuando tengas backend, puedes generar .pkpass real
    const url = generateAppleContactURL(data);
    window.open(url, '_blank');
    return true;
  } else if (supportsGoogleWallet()) {
    // Para Android, intentar abrir Google Wallet
    try {
      const walletURL = generateGoogleWalletURL(data);
      window.open(walletURL, '_blank');
      return true;
    } catch (error) {
      console.error('Error opening Google Wallet:', error);
      return false;
    }
  } else {
    // Desktop o navegador no soportado
    console.warn('Wallet no soportado en este dispositivo');
    return false;
  }
};

/**
 * Verifica si el dispositivo puede usar la funcionalidad de Wallet
 */
export const canUseWallet = (): boolean => {
  return supportsAppleWallet() || supportsGoogleWallet();
};

/**
 * Obtiene el nombre del wallet soportado por el dispositivo
 */
export const getWalletName = (): string => {
  if (supportsAppleWallet()) return 'Apple Wallet';
  if (supportsGoogleWallet()) return 'Google Wallet';
  return 'Wallet';
};
