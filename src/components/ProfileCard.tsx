import { User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  name: string;
  title: string;
  company: string;
  location?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
}

export const ProfileCard = ({ 
  name, 
  title, 
  company, 
  location,
  avatarUrl,
  backgroundUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
}: ProfileCardProps) => {
  const handleSaveContact = () => {
    console.log("Guardando contacto...");
  };

  const handleBookNow = () => {
    console.log("Reservar ahora...");
  };

  return (
    <Card className="relative w-full h-[560px] rounded-[24px] overflow-hidden shadow-lg">
      {/* Sección Superior: Imagen de fondo (60%) */}
      <div className="absolute top-0 left-0 w-full h-[60%]">
        <div className="relative w-full h-full">
          <img 
            src={backgroundUrl}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Sección Inferior: Fondo oscuro (40%) */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-[#1a1a1a]">
        <div className="px-8 pt-20 pb-6 h-full flex flex-col justify-between">
          {/* Información de texto */}
          <div>
            <h1 className="text-[32px] font-bold text-white leading-tight">
              {name}
            </h1>
            <p className="text-lg text-white/80 mt-2">
              {title}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button
              onClick={handleSaveContact}
              variant="outline"
              className="flex-1 h-12 bg-white text-black border-[#E5E7EB] hover:bg-white/90 font-medium"
            >
              Save Contact
            </Button>
            <Button
              onClick={handleBookNow}
              className="flex-1 h-12 bg-accent text-white hover:bg-accent/90 font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Avatar superpuesto */}
      <div className="absolute left-8 top-[calc(60%-60px)] z-10">
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border-4 border-white shadow-lg">
          {avatarUrl ? (
            <img 
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
