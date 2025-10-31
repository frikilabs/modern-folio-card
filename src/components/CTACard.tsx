import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useColaborar } from "@/hooks/useAirtable";
import { mapColaborarData } from "@/utils/airtable-mappers";

export const CTACard = () => {
  const { data: colaborarRecord, isLoading } = useColaborar();
  const data = mapColaborarData(colaborarRecord || null);

  // Si no hay datos, no mostrar la tarjeta
  if (!data || isLoading) return null;

  return (
    <Card className="card-elevated p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.description && (
          <p className="text-muted-foreground max-w-md mx-auto">
            {data.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {data.primaryButton.label && data.primaryButton.url && (
            <Button
              size="lg"
              className="gap-2"
              asChild
            >
              <a href={data.primaryButton.url} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5" />
                {data.primaryButton.label}
              </a>
            </Button>
          )}
          {data.secondaryButton.label && data.secondaryButton.url && (
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              asChild
            >
              <a href={data.secondaryButton.url} target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5" />
                {data.secondaryButton.label}
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
