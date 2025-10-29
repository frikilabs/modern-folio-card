import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Video, Maximize } from "lucide-react";

interface VideoItem {
  url: string;
  thumbnail: string;
  title: string;
  description: string;
}

const defaultVideos: VideoItem[] = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb",
    title: "Presentación Principal",
    description: "Video introductorio sobre nuestros servicios y valores corporativos"
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    title: "Detrás de Escenas",
    description: "Conoce más sobre nuestro equipo y cultura organizacional"
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    title: "Casos de Éxito",
    description: "Historias inspiradoras de nuestros clientes y proyectos realizados"
  },
];

export const VideoCard = () => {
  const [selectedVideo, setSelectedVideo] = useState(defaultVideos[0]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Card className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Vídeos</h2>
      </div>

      <div className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            src={selectedVideo.url}
            controls
            className="w-full h-full"
          />
          <button
            onClick={handleFullscreen}
            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-2">
          {defaultVideos.map((video, index) => (
            <div
              key={index}
              onClick={() => setSelectedVideo(video)}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedVideo.url === video.url 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex-shrink-0">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
