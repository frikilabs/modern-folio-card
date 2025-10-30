import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";
import { useVideos } from "@/hooks/useAirtable";
import { mapVideoData } from "@/utils/airtable-mappers";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface VideoItem {
  videoUrl: string;
  title: string;
  description?: string;
  videoId: string | null;
}

export const VideoCard = () => {
  const { data: videoRecords, isLoading } = useVideos();
  const videos = mapVideoData(videoRecords || []);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(videos.length > 0 ? videos[0] : null);

  if (isLoading) {
    return (
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Video className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Vídeos</h2>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="aspect-video bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
        </div>
      </Card>
    );
  }

  // Si no hay videos, mostrar mensaje
  if (videos.length === 0) {
    return (
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Video className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Vídeos</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay videos para publicar, coloca tu primer video.</p>
        </div>
      </Card>
    );
  }

  // Actualizar el video seleccionado si aún no está establecido
  if (!selectedVideo && videos.length > 0) {
    setSelectedVideo(videos[0]);
  }

  const renderVideo = (video: VideoItem) => {
    // Si tiene videoId de YouTube, usar iframe de YouTube
    if (video.videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }

    // Si es una URL directa de video, usar elemento video
    return (
      <video
        src={video.videoUrl}
        controls
        className="w-full h-full"
      />
    );
  };

  return (
    <Card className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-6 h-6 text-black" />
        <h2 className="text-xl font-bold">Vídeos</h2>
      </div>

      <div className="space-y-4">
        {/* Video principal */}
        {selectedVideo && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {renderVideo(selectedVideo)}
          </div>
        )}

        {/* Lista de videos */}
        {videos.length > 1 && (
          <>
            {/* Si hay 3 o menos videos (además del principal), mostrar sin carousel */}
            {videos.length <= 4 ? (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedVideo(video)}
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedVideo?.videoUrl === video.videoUrl
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {video.videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-muted flex items-center justify-center rounded">
                          <Video className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
                      {video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Si hay más de 4 videos, usar carousel */
              <Carousel className="w-full">
                <CarouselContent>
                  {videos.map((video, index) => (
                    <CarouselItem key={index}>
                      <div
                        onClick={() => setSelectedVideo(video)}
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedVideo?.videoUrl === video.videoUrl
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {video.videoId ? (
                            <img
                              src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-24 h-16 bg-muted flex items-center justify-center rounded">
                              <Video className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
                          {video.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
