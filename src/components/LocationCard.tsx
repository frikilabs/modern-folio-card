import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useUbicacion } from "@/hooks/useAirtable";
import { mapUbicacionData } from "@/utils/airtable-mappers";

/**
 * Convierte cualquier URL de Google Maps en un formato embebible sin API Key
 * Extrae las coordenadas o información de lugar y crea una URL embed pública
 */
const getEmbedUrl = (url: string): string => {
  // Si ya es una URL embed, devolverla tal cual
  if (url.includes('google.com/maps/embed')) {
    return url;
  }

  try {
    // Para URLs cortas de Google Maps (maps.app.goo.gl o goo.gl)
    // Convertir a formato embed usando pb parameter (formato público)
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      // Usar el formato de embed público que funciona sin API Key
      // El usuario deberá pegar la URL completa expandida en Airtable
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s&q=${encodeURIComponent(url)}`;
    }

    // Para URLs con @lat,lng,zoom
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),?(\d+\.?\d*)?z?/);
    if (coordMatch) {
      const [, lat, lng, zoom = '11'] = coordMatch;
      const adjustedZoom = Math.max(1, Math.floor(parseFloat(zoom)) - 3);
      return `https://maps.google.com/maps?q=${lat},${lng}&z=${adjustedZoom}&output=embed`;
    }

    // Para URLs con /place/ - extraer el nombre del lugar
    const placeMatch = url.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }

    // Para URLs con query ?q=
    const queryMatch = url.match(/[?&]q=([^&]+)/);
    if (queryMatch) {
      const query = decodeURIComponent(queryMatch[1]);
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }

    // Si contiene data= o lugar específico, intentar extraer coordenadas
    const dataMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (dataMatch) {
      const [, lat, lng] = dataMatch;
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }

    // Fallback: usar formato embed genérico
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  } catch (error) {
    console.error('Error al procesar URL de Google Maps:', error);
    // Fallback básico
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  }
};

export function LocationCard() {
  const { data: ubicacionRecord, isLoading } = useUbicacion();
  const { title, url } = mapUbicacionData(ubicacionRecord);

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full animate-pulse bg-muted" style={{ paddingBottom: '56.25%' }} />
        </CardContent>
      </Card>
    );
  }

  // Si no hay URL, no mostrar la tarjeta
  if (!url) {
    return null;
  }

  const embedUrl = getEmbedUrl(url);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${title} en Google Maps`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
