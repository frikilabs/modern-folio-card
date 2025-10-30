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
    <div className="w-full">
      <Card className="relative w-full h-[360px] sm:h-[380px] md:h-[400px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-lg mb-4">
        {/* Sección Superior: Imagen de fondo - Más alta */}
        <div className="absolute top-0 left-0 w-full h-[72%] sm:h-[67%]">
          <div className="relative w-full h-full">
            <img
              src={backgroundUrl}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        {/* Sección Inferior: Fondo oscuro - Ajustado */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] sm:h-[40%] bg-[#1a1a1a]">
        </div>

        {/* Avatar superpuesto - Subido 2% (63% mobile, 68% desktop) */}
        <div className="absolute left-4 sm:left-6 md:left-8 top-[80%] sm:top-[68%] -translate-y-1/2 z-10">
          <div className="relative w-[100px] sm:w-[110px] md:w-[120px] h-[100px] sm:h-[110px] md:h-[120px] rounded-xl sm:rounded-lg overflow-hidden border-[3px] sm:border-4 border-white shadow-lg">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Nombre y texto al lado de la foto - 10px más a la derecha y 5% más abajo */}
        <div className="absolute left-[130px] sm:left-[144px] md:left-[162px] top-[83%] sm:top-[72%] -translate-y-1/2 z-10 pr-4">
          <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold text-white leading-tight">
            {name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 line-clamp-2 leading-relaxed mt-0.5">
            {title}
          </p>
        </div>
      </Card>

      {/* Botones de acción - Fuera de la card */}
      <div className="flex gap-2.5 sm:gap-3 md:gap-4 px-1">
        <Button
          onClick={handleSaveContact}
          variant="outline"
          className="flex-1 h-11 sm:h-12 bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium text-sm sm:text-base shadow-sm transition-colors"
        >
          <span className="hidden xs:inline">Save Contact</span>
          <span className="xs:hidden">Guardar</span>
        </Button>
        <Button
          onClick={handleBookNow}
          className="flex-1 h-11 sm:h-12 bg-accent text-white hover:bg-accent/90 font-medium text-sm sm:text-base shadow-sm"
        >
          <Calendar className="w-4 h-4 mr-1.5 sm:mr-2" />
          <span className="hidden xs:inline">Book Now</span>
          <span className="xs:hidden">Reservar</span>
        </Button>
      </div>
    </div>
  );
};
