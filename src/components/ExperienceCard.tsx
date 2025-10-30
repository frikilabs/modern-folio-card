import { Briefcase } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { useExperience } from "@/hooks/useAirtable";
import { mapExperienceData } from "@/utils/airtable-mappers";

interface Experience {
  period: string;
  title: string;
  description: string;
}

export const ExperienceCard = () => {
  const { data: experienceRecords, isLoading } = useExperience();
  const experiences = mapExperienceData(experienceRecords || []);

  if (isLoading) {
    return (
      <ContentCard title="Experiencia" icon={Briefcase}>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
        </div>
      </ContentCard>
    );
  }

  // Si no hay experiencias, no mostrar la tarjeta
  if (experiences.length === 0) {
    return null;
  }

  return (
    <ContentCard title="Experiencia" icon={Briefcase}>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-6 border-l-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-4 border-background"></div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-black">{exp.period}</p>
              <h3 className="text-lg font-bold">{exp.title}</h3>
              {exp.description && (
                <p className="text-muted-foreground">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
};
