import { Share2, Linkedin, Twitter, Instagram, Facebook, Github, Youtube, LucideIcon } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { Button } from "@/components/ui/button";
import { useSocial } from "@/hooks/useAirtable";
import { mapSocialData } from "@/utils/airtable-mappers";

interface SocialLink {
  name: string;
  url: string;
  hasLink: boolean;
}

// Mapeo de nombres de redes a iconos y colores
const getSocialIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('linkedin')) return Linkedin;
  if (lowerName.includes('twitter') || lowerName.includes('x')) return Twitter;
  if (lowerName.includes('instagram')) return Instagram;
  if (lowerName.includes('facebook')) return Facebook;
  if (lowerName.includes('github')) return Github;
  if (lowerName.includes('youtube')) return Youtube;

  return Share2; // Icono por defecto
};

const getSocialColor = (name: string): string => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('linkedin')) return 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30';
  if (lowerName.includes('twitter') || lowerName.includes('x')) return 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30';
  if (lowerName.includes('instagram')) return 'hover:bg-[#E4405F]/10 hover:text-[#E4405F] hover:border-[#E4405F]/30';
  if (lowerName.includes('facebook')) return 'hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30';
  if (lowerName.includes('github')) return 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30';
  if (lowerName.includes('youtube')) return 'hover:bg-[#FF0000]/10 hover:text-[#FF0000] hover:border-[#FF0000]/30';

  return 'hover:bg-primary/10 hover:text-primary hover:border-primary/30';
};

const getIconColor = (name: string): string => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('linkedin')) return 'text-[#0A66C2]';
  if (lowerName.includes('twitter') || lowerName.includes('x')) return 'text-[#1DA1F2]';
  if (lowerName.includes('instagram')) return 'text-[#E4405F]';
  if (lowerName.includes('facebook')) return 'text-[#1877F2]';
  if (lowerName.includes('github')) return 'text-gray-800';
  if (lowerName.includes('youtube')) return 'text-[#FF0000]';

  return 'text-primary';
};

// Determina el layout basado en la cantidad de redes
const getGridLayout = (count: number): string => {
  switch (count) {
    case 1:
      return 'grid-cols-1'; // 1 red: 1 columna (full width)
    case 2:
      return 'grid-cols-2'; // 2 redes: 2 columnas (1 fila)
    case 3:
      return 'grid-cols-1'; // 3 redes: 1 columna (3 filas)
    case 4:
      return 'grid-cols-2'; // 4 redes: 2 columnas (2 filas)
    case 5:
      return 'grid-cols-2'; // 5 redes: 2 columnas + última full width
    default:
      return 'grid-cols-2 sm:grid-cols-3'; // 6+ redes: responsive grid
  }
};

export const SocialCard = () => {
  const { data: socialRecords, isLoading } = useSocial();
  const socialData = mapSocialData(socialRecords || []);

  if (isLoading) {
    return (
      <ContentCard title="Redes Sociales" icon={Share2}>
        <div className="grid grid-cols-2 gap-3 animate-pulse">
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
        </div>
      </ContentCard>
    );
  }

  // Si no hay redes activas, no renderizar la tarjeta
  if (socialData.length === 0) {
    return null;
  }

  const gridLayout = getGridLayout(socialData.length);

  return (
    <ContentCard title="Redes Sociales" icon={Share2}>
      <div className={`grid ${gridLayout} gap-3`}>
        {socialData.map((social, index) => {
          const Icon = getSocialIcon(social.name);
          const colorClass = getSocialColor(social.name);
          const iconColor = getIconColor(social.name);

          // Para el caso de 5 redes, la última ocupa toda la fila
          const isLastOfFive = socialData.length === 5 && index === 4;
          const spanClass = isLastOfFive ? 'col-span-2' : '';

          // Si la red está activa pero no tiene link, mostrar sin enlace
          if (!social.hasLink) {
            return (
              <Button
                key={index}
                variant="outline"
                disabled
                className={`h-auto py-4 flex flex-col gap-2 transition-all ${spanClass} cursor-not-allowed opacity-60`}
                style={{ borderColor: '#9ca3af' }}
              >
                <Icon className={`${iconColor}`} style={{ width: '30px', height: '30px' }} />
                <span className="text-sm font-medium">{social.name}</span>
              </Button>
            );
          }

          // Red con link activo
          return (
            <Button
              key={index}
              variant="outline"
              asChild
              className={`h-auto py-4 flex flex-col gap-2 transition-all ${colorClass} ${spanClass}`}
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderColor: '#9ca3af', borderStyle: 'solid' }}
              >
                <Icon className={`${iconColor}`} style={{ width: '30px', height: '30px' }} />
                <span className="text-sm font-medium">{social.name}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </ContentCard>
  );
};
