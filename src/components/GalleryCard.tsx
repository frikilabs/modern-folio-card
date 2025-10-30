import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Image } from "lucide-react";
import { useGallery } from "@/hooks/useAirtable";
import { mapGalleryData } from "@/utils/airtable-mappers";
import Autoplay from "embla-carousel-autoplay";

interface GalleryImage {
  url: string;
  alt: string;
}

export const GalleryCard = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: galleryRecords, isLoading } = useGallery();
  const images = mapGalleryData(galleryRecords || []);

  const autoplayPlugin = Autoplay({
    delay: 3800,
    stopOnInteraction: true,
  });

  if (isLoading) {
    return (
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Galería</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-pulse">
          <div className="aspect-square bg-muted rounded-lg"></div>
          <div className="aspect-square bg-muted rounded-lg"></div>
          <div className="aspect-square bg-muted rounded-lg"></div>
        </div>
      </Card>
    );
  }

  // Si no hay imágenes, mostrar mensaje
  if (images.length === 0) {
    return (
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Galería</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay imágenes en la galería. Sube tus prieras imagenes.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Galería</h2>
        </div>

        <Carousel
          className="w-full"
          plugins={[autoplayPlugin]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
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
