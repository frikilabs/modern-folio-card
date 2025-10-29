import { User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  name: string;
  title: string;
  company: string;
  location?: string;
  avatarUrl?: string;
}

export const ProfileCard = ({ 
  name, 
  title, 
  company, 
  location,
  avatarUrl 
}: ProfileCardProps) => {
  const handleSaveContact = () => {
    // Aquí se implementaría la lógica para guardar el contacto
    console.log("Guardando contacto...");
  };

  return (
    <Card className="card-elevated p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-secondary">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <p className="text-xl text-muted-foreground">{title}</p>
          <p className="text-lg font-medium text-primary">{company}</p>
          {location && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSaveContact}
          size="lg"
          className="w-full sm:w-auto mt-4 font-semibold"
        >
          Guardar Contacto
        </Button>
      </div>
    </Card>
  );
};
