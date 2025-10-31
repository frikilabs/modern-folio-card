# Implementación de Digital Wallet - Tarjeta de Presentación

## Resumen

Esta implementación permite agregar tu tarjeta de presentación digital a Apple Wallet (iOS) y Google Wallet (Android) de forma **gratuita**.

## Cómo Funciona

### 1. **Botón "Agregar a Wallet"**

El botón detecta automáticamente el dispositivo del usuario:

- **En iPhone/iPad**: Muestra "Agregar a Apple Wallet"
- **En Android**: Muestra "Agregar a Google Wallet"
- **En Desktop**: Muestra "Agregar a Contactos" (descarga vCard)

### 2. **Flujo de Usuario**

#### iPhone (Apple Wallet):
1. Usuario hace clic en "Agregar a Apple Wallet"
2. Se genera un archivo vCard mejorado
3. iOS detecta el archivo y ofrece opciones:
   - Agregar a Contactos
   - Compartir via AirDrop
   - Guardar en Archivos

**Limitación actual**: Para generar un pase `.pkpass` real de Apple Wallet se requiere:
- Certificado de Apple Developer ($99/año)
- Backend para firmar los pases

**Solución temporal**: El vCard funciona perfectamente para guardar el contacto, y cuando tengas certificado de Apple Developer, podemos actualizar para generar pases `.pkpass` reales.

#### Android (Google Wallet):
1. Usuario hace clic en "Agregar a Google Wallet"
2. Se genera una URL de Google Wallet
3. Se abre Google Wallet app con los datos

**Limitación actual**: Para Google Wallet se requiere:
- Cuenta de Google Cloud
- API Key de Google Wallet
- Firmar JWT con credenciales

**Solución temporal**: Similar a iOS, se usa vCard como fallback.

### 3. **Botón "Compartir"**

Usa la **Web Share API** del navegador:

- **iOS**: Abre el menú nativo de iOS con opciones:
  - AirDrop
  - Mensajes
  - WhatsApp
  - Email
  - etc.

- **Android**: Abre el menú nativo de Android:
  - Nearby Share (NFC/Bluetooth)
  - WhatsApp
  - Email
  - etc.

## Para el Futuro: NFC

Cuando consigas una tarjeta NFC física, necesitarás:

### Hardware:
- Tarjeta NFC (NTAG213, NTAG215 o NTAG216)
- Lector/grabador NFC (o un smartphone Android con NFC)

### Software para grabar NFC:
- **Android**: NFC Tools (app gratuita)
- **iPhone**: NFC Tools iOS (requiere iPhone XS o posterior)

### Qué escribir en la tarjeta NFC:
```
URL: https://tudominio.com/tu-pagina
```

Cuando alguien acerque su teléfono a tu tarjeta física:
1. El teléfono lee la URL del chip NFC
2. Abre automáticamente tu página web
3. Ve tus datos y puede:
   - Agregar a su Wallet
   - Compartir tu contacto
   - Ver tu información

## Implementación Completa (Futura)

### Para Apple Wallet (.pkpass):

**Requisitos**:
1. Cuenta de Apple Developer ($99/año)
2. Crear un Pass Type ID en el portal de Apple
3. Generar certificado de firma
4. Backend Node.js con librería `passkit-generator`

**Código de ejemplo** (cuando tengas los certificados):
```javascript
import { PKPass } from 'passkit-generator';

const pass = await PKPass.from({
  model: './modelo-tarjeta',
  certificates: {
    wwdr: fs.readFileSync('./certs/wwdr.pem'),
    signerCert: fs.readFileSync('./certs/signerCert.pem'),
    signerKey: fs.readFileSync('./certs/signerKey.pem'),
  },
});

pass.primaryFields.push({
  key: 'name',
  label: 'Nombre',
  value: 'Tu Nombre'
});

const buffer = pass.getAsBuffer();
// Enviar al cliente
```

### Para Google Wallet:

**Requisitos**:
1. Cuenta Google Cloud Platform
2. Habilitar Google Wallet API
3. Crear Service Account
4. Obtener credenciales JWT

**Código de ejemplo** (cuando tengas la API configurada):
```javascript
import { GoogleAuth } from 'google-auth-library';

const credentials = require('./google-credentials.json');

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

// Crear clase de objeto
const classId = 'tu_issuer_id.business_card_class';

// Crear objeto de pase
const objectId = `tu_issuer_id.${userId}`;

// Generar JWT y URL
const jwt = generateJWT(objectId);
const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;
```

## Código Actual

### Archivos principales:
- `src/utils/wallet.ts` - Lógica de detección de dispositivo y generación de pases
- `src/utils/vcard.ts` - Generación de vCard (fallback actual)
- `src/components/ProfileCard.tsx` - Botones de UI

### Detección de dispositivo:
```typescript
export const supportsAppleWallet = (): boolean => {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};

export const supportsGoogleWallet = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};
```

## Testing

### Para probar en iPhone:
1. Abre la página en Safari (iOS)
2. Haz clic en "Agregar a Apple Wallet"
3. Verás opciones para agregar el contacto

### Para probar en Android:
1. Abre la página en Chrome (Android)
2. Haz clic en "Agregar a Google Wallet"
3. Verás opciones para compartir/guardar

### Para probar compartir (ambos):
1. Haz clic en "Compartir"
2. Elige el método (AirDrop, Nearby Share, etc.)
3. Acerca los dispositivos si usas NFC/Bluetooth

## Próximos Pasos Recomendados

1. **Corto plazo** (funciona ahora):
   - ✅ Usar vCard para guardar contactos
   - ✅ Web Share API para compartir via NFC/AirDrop/Nearby Share
   - ✅ Funciona en todos los dispositivos

2. **Mediano plazo** (requiere configuración):
   - [ ] Configurar cuenta de Google Cloud para Google Wallet
   - [ ] Implementar backend para generar pases de Google Wallet
   - [ ] Testing con Google Wallet real

3. **Largo plazo** (requiere inversión):
   - [ ] Obtener certificado de Apple Developer ($99/año)
   - [ ] Implementar backend para generar .pkpass
   - [ ] Testing con Apple Wallet real

4. **Hardware NFC** (cuando estés listo):
   - [ ] Comprar tarjetas NFC
   - [ ] Grabar URL en las tarjetas
   - [ ] Testing físico con acercamiento de dispositivos

## Servicios Gratuitos Alternativos

Si quieres evitar el desarrollo de backend, puedes usar servicios de terceros:

1. **PassKit.com** - Plan gratuito limitado (100 pases/mes)
2. **Pass2U** - Generador simple de pases
3. **Passcreator.com** - Plan gratuito básico

Estos servicios ofrecen:
- Generación de .pkpass sin certificado propio
- API REST para crear pases
- Panel de administración web

## Conclusión

**Implementación actual** = Funcional y gratuita usando vCard + Web Share API

**Implementación futura** = Requiere certificados y APIs de pago para pases nativos de Wallet

**Recomendación**: Comienza con la implementación actual para testing y validación, luego invierte en certificados cuando valides que el sistema funciona bien.
