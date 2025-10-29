import { Share2, Linkedin, Twitter, Instagram, Facebook, Github } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { Button } from "@/components/ui/button";

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://linkedin.com",
    color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30"
  },
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    url: "https://twitter.com",
    color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30"
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://instagram.com",
    color: "hover:bg-[#E4405F]/10 hover:text-[#E4405F] hover:border-[#E4405F]/30"
  },
  {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    url: "https://facebook.com",
    color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30"
  },
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com",
    color: "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30"
  }
];

export const SocialCard = () => {
  return (
    <ContentCard title="Redes Sociales" icon={Share2}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {socialLinks.map((social) => (
          <Button
            key={social.name}
            variant="outline"
            asChild
            className={`h-auto py-4 flex flex-col gap-2 transition-all ${social.color}`}
          >
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              {social.icon}
              <span className="text-sm font-medium">{social.name}</span>
            </a>
          </Button>
        ))}
      </div>
    </ContentCard>
  );
};
