import { User } from "lucide-react";
import { ContentCard } from "./ContentCard";

export const AboutCard = () => {
  return (
    <ContentCard title="Acerca de Mí" icon={User}>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Profesional apasionado con más de 10 años de experiencia en el desarrollo de soluciones innovadoras
          que impulsan el crecimiento empresarial y mejoran la experiencia del usuario.
        </p>
        <p>
          Especializado en liderar equipos multidisciplinarios, implementar estrategias digitales efectivas
          y transformar ideas complejas en productos tangibles y exitosos.
        </p>
        <p>
          Mi enfoque combina creatividad, análisis estratégico y una mentalidad orientada a resultados,
          siempre buscando superar las expectativas y generar impacto positivo en cada proyecto.
        </p>
      </div>
    </ContentCard>
  );
};
