import { Briefcase } from "lucide-react";
import { ContentCard } from "./ContentCard";

interface Experience {
  period: string;
  title: string;
  description: string;
}

const experiences: Experience[] = [
  {
    period: "2020 - Presente",
    title: "Director de Innovación Digital",
    description: "Liderando la transformación digital y desarrollo de productos innovadores."
  },
  {
    period: "2017 - 2020",
    title: "Gerente de Producto Senior",
    description: "Gestión de equipos y lanzamiento de productos exitosos en el mercado."
  },
  {
    period: "2014 - 2017",
    title: "Líder de Desarrollo",
    description: "Coordinación de proyectos tecnológicos y mentoring de equipos."
  }
];

export const ExperienceCard = () => {
  return (
    <ContentCard title="Experiencia" icon={Briefcase}>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">{exp.period}</p>
              <h3 className="text-lg font-bold">{exp.title}</h3>
              <p className="text-muted-foreground">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
};
