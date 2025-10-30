import { ProfileCard } from "@/components/ProfileCard";
import { AboutCard } from "@/components/AboutCard";
import { ContactCard } from "@/components/ContactCard";
import { SocialCard } from "@/components/SocialCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { GalleryCard } from "@/components/GalleryCard";
import { VideoCard } from "@/components/VideoCard";
import { LocationCard } from "@/components/LocationCard";
import { CTACard } from "@/components/CTACard";
import { useConfig } from "@/hooks/useAirtable";
import { usePosicionTarjeta } from "@/hooks/useAirtable";
import { mapConfigToProfile, mapPosicionTarjetaData } from "@/utils/airtable-mappers";

// Mapa de componentes: nombre de archivo -> componente React
const CARD_COMPONENTS: Record<string, React.ComponentType> = {
  'AboutCard.tsx': AboutCard,
  'ContactCard.tsx': ContactCard,
  'SocialCard.tsx': SocialCard,
  'ExperienceCard.tsx': ExperienceCard,
  'GalleryCard.tsx': GalleryCard,
  'VideoCard.tsx': VideoCard,
  'LocationCard.tsx': LocationCard,
  'CTACard.tsx': CTACard,
};

const Index = () => {
  // Obtener datos de configuración desde Airtable
  const { data: config, isLoading, error } = useConfig();

  // Obtener posición y activación de tarjetas
  const { data: posicionRecords, isLoading: isLoadingPosicion } = usePosicionTarjeta();

  // Mapear datos para ProfileCard
  const profileData = mapConfigToProfile(config);

  // Obtener orden de tarjetas activas
  const activeCardNames = mapPosicionTarjetaData(posicionRecords || []);

  // Mostrar loading state
  if (isLoading || isLoadingPosicion) {
    return (
      <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-500">Error al cargar los datos</p>
              <p className="text-sm text-muted-foreground mt-2">
                Por favor verifica tu conexión a Airtable
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
        {/* ProfileCard siempre se muestra primero */}
        {profileData && (
          <ProfileCard
            name={profileData.name}
            title={profileData.title}
            company={profileData.company}
            location={profileData.location}
            avatarUrl={profileData.avatarUrl}
            backgroundUrl={profileData.backgroundUrl}
          />
        )}

        {/* Renderizar tarjetas dinámicamente según orden de Airtable */}
        {activeCardNames.map((cardName, index) => {
          const CardComponent = CARD_COMPONENTS[cardName];

          // Si el componente existe en el mapa, renderizarlo
          if (CardComponent) {
            return <CardComponent key={`${cardName}-${index}`} />;
          }

          // Si no existe, no renderizar nada (evitar errores)
          return null;
        })}

        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4">
          © 2024 {profileData?.name || 'Vcard Frikilabs'}. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Index;
