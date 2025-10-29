import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Image } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
}

const defaultImages: GalleryImage[] = [
  { url: "https://images.unsplash.com/photo-1497366216548-37526070297c", alt: "Oficina moderna" },
  { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2", alt: "Espacio de trabajo" },
  { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", alt: "Equipo colaborativo" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c", alt: "Reunión de equipo" },
];

export const GalleryCard = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Galería</h2>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {defaultImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover-scale"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Imagen ampliada"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
