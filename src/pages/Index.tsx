import { ProfileCard } from "@/components/ProfileCard";
import { AboutCard } from "@/components/AboutCard";
import { ContactCard } from "@/components/ContactCard";
import { SocialCard } from "@/components/SocialCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { CTACard } from "@/components/CTACard";

const Index = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <ProfileCard
          name="María González"
          title="Directora de Innovación Digital"
          company="Tech Solutions Inc."
          location="Madrid, España"
        />
        
        <AboutCard />
        
        <ContactCard />
        
        <SocialCard />
        
        <ExperienceCard />
        
        <CTACard />
        
        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4">
          © 2024 María González. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Index;
