import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CTACard = () => {
  return (
    <Card className="card-elevated p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">¿Listo para colaborar?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Estoy disponible para nuevos proyectos y oportunidades. No dudes en contactarme.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" className="gap-2">
            <Calendar className="w-5 h-5" />
            Agenda una Reunión
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Download className="w-5 h-5" />
            Descargar CV
          </Button>
        </div>
      </div>
    </Card>
  );
};
