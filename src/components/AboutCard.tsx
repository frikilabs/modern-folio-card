import { User } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { useSobreMi } from "@/hooks/useAirtable";
import { mapSobreMiData } from "@/utils/airtable-mappers";

export const AboutCard = () => {
  // Obtener datos de SobreMi desde Airtable
  const { data: sobreMiRecords, isLoading } = useSobreMi();

  // Mapear datos para obtener el título y párrafos
  const { title, paragraphs } = mapSobreMiData(sobreMiRecords || []);

  // Mostrar loading
  if (isLoading) {
    return (
      <ContentCard title={title} icon={User}>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p className="animate-pulse">Cargando información...</p>
        </div>
      </ContentCard>
    );
  }

  // Si no hay párrafos, no mostrar la tarjeta
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <ContentCard title={title} icon={User}>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </ContentCard>
  );
};
