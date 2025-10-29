import { Mail, Phone, Globe, LucideIcon } from "lucide-react";
import { ContentCard } from "./ContentCard";

interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

const contactItems: ContactItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "contacto@ejemplo.com",
    href: "mailto:contacto@ejemplo.com"
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567"
  },
  {
    icon: Globe,
    label: "Sitio Web",
    value: "www.ejemplo.com",
    href: "https://www.ejemplo.com"
  }
];

export const ContactCard = () => {
  return (
    <ContentCard title="Contacto" icon={Mail}>
      <div className="space-y-3">
        {contactItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {item.value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </ContentCard>
  );
};
