import { User, Wallet, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateVCard, downloadVCard, shareVCard } from "@/utils/vcard";
import { addToWallet, canUseWallet, getWalletName } from "@/utils/wallet";
import { useState } from "react";

interface BackgroundStyle {
  type: 'image' | 'color' | 'gradient';
  value: string;
}

interface ProfileCardProps {
  name: string;
  title: string;
  company: string;
  location?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  backgroundStyle?: BackgroundStyle | null;
  subtitleSectionStyle?: BackgroundStyle | null;
  nameColor?: string;
  titleColor?: string;
  // Datos de contacto para vCard
  phone?: string;
  email?: string;
  website?: string;
}

export const ProfileCard = ({
  name,
  title,
  company,
  location,
  avatarUrl,
  backgroundUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  backgroundStyle,
  subtitleSectionStyle,
  nameColor,
  titleColor,
  phone,
  email,
  website
}: ProfileCardProps) => {
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  const handleAddToWallet = async () => {
    setIsAddingToWallet(true);

    try {
      // Intentar agregar a Apple Wallet o Google Wallet según el dispositivo
      const walletData = {
        name,
        title,
        company,
        phone,
        email,
        website,
        address: location,
        photo: avatarUrl,
      };

      const success = await addToWallet(walletData);

      if (!success) {
        // Si no se pudo agregar a wallet, hacer fallback a vCard
        const vcardContent = generateVCard(walletData);
        const fileName = name.replace(/\s+/g, '_').toLowerCase();
        downloadVCard(vcardContent, fileName);
      }
    } catch (error) {
      console.error('Error adding to wallet:', error);
      // Fallback a vCard si hay error
      const vcardContent = generateVCard({
        name,
        title,
        company,
        phone,
        email,
        website,
        address: location,
        photo: avatarUrl,
      });
      const fileName = name.replace(/\s+/g, '_').toLowerCase();
      downloadVCard(vcardContent, fileName);
    } finally {
      setIsAddingToWallet(false);
    }
  };

  const handleShareContact = async () => {
    // Generar vCard con los datos del perfil
    const vcardContent = generateVCard({
      name,
      title,
      company,
      phone,
      email,
      website,
      address: location,
      photo: avatarUrl,
    });

    // Intentar compartir usando Web Share API (NFC, AirDrop, etc.)
    const fileName = name.replace(/\s+/g, '_').toLowerCase();
    const shared = await shareVCard(vcardContent, fileName);

    // Si no se pudo compartir, hacer fallback a descarga
    if (!shared) {
      downloadVCard(vcardContent, fileName);
    }
  };

  // Determinar el estilo del fondo principal
  const getBackgroundStyles = () => {
    if (backgroundStyle) {
      if (backgroundStyle.type === 'image') {
        return { backgroundImage: `url(${backgroundStyle.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
      return { background: backgroundStyle.value };
    }
    // Fallback a backgroundUrl prop
    return { backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  };

  // Determinar el estilo de la sección de subtítulo
  const getSubtitleSectionStyles = () => {
    if (subtitleSectionStyle) {
      if (subtitleSectionStyle.type === 'image') {
        return { backgroundImage: `url(${subtitleSectionStyle.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
      return { background: subtitleSectionStyle.value };
    }
    // Fallback a color oscuro por defecto
    return { backgroundColor: '#1a1a1a' };
  };

  return (
    <div className="w-full">
      <Card className="relative w-full h-[360px] sm:h-[380px] md:h-[400px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-lg mb-4">
        {/* Sección Superior: Fondo (imagen, color o degradado) */}
        <div
          className="absolute top-0 left-0 w-full h-[72%] sm:h-[67%]"
          style={getBackgroundStyles()}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Sección Inferior: Sección de subtítulo (imagen, color o degradado) */}
        <div
          className="absolute bottom-0 left-0 w-full h-[30%] sm:h-[40%]"
          style={getSubtitleSectionStyles()}
        >
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
          <h1
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight"
            style={{ color: nameColor || '#ffffff' }}
          >
            {name}
          </h1>
          <p
            className="text-sm sm:text-base line-clamp-2 leading-relaxed mt-0.5"
            style={{ color: titleColor || 'rgba(255, 255, 255, 0.8)' }}
          >
            {title}
          </p>
        </div>
      </Card>

      {/* Botones de acción - Fuera de la card */}
      <div className="flex gap-2.5 sm:gap-3 md:gap-4 px-1">
        <Button
          onClick={handleAddToWallet}
          disabled={isAddingToWallet}
          variant="outline"
          className="flex-1 h-11 sm:h-12 bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium text-sm sm:text-base shadow-sm transition-colors"
        >
          <Wallet className="w-4 h-4 mr-1.5 sm:mr-2" />
          <span className="hidden xs:inline">
            {isAddingToWallet ? 'Agregando...' : `Agregar a ${canUseWallet() ? getWalletName() : 'Contactos'}`}
          </span>
          <span className="xs:hidden">
            {isAddingToWallet ? 'Agregando...' : 'Wallet'}
          </span>
        </Button>
        <Button
          onClick={handleShareContact}
          className="flex-1 h-11 sm:h-12 bg-accent text-white hover:bg-accent/90 font-medium text-sm sm:text-base shadow-sm"
        >
          <Share2 className="w-4 h-4 mr-1.5 sm:mr-2" />
          <span className="hidden xs:inline">Compartir</span>
          <span className="xs:hidden">Compartir</span>
        </Button>
      </div>
    </div>
  );
};
