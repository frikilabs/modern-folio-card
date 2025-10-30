import { Mail, Phone, Globe, MessageCircle, LucideIcon } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { useContact } from "@/hooks/useAirtable";
import { mapContactData } from "@/utils/airtable-mappers";

interface ContactItem {
  type: 'email' | 'phone' | 'whatsapp' | 'web';
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

const getIconForType = (type: 'email' | 'phone' | 'whatsapp' | 'web'): LucideIcon => {
  switch (type) {
    case 'email':
      return Mail;
    case 'phone':
      return Phone;
    case 'whatsapp':
      return MessageCircle;
    case 'web':
      return Globe;
    default:
      return Mail;
  }
};

export const ContactCard = () => {
  const { data: contactRecord, isLoading } = useContact();
  const contactData = mapContactData(contactRecord);

  if (isLoading) {
    return (
      <ContentCard title="Contacto" icon={Mail}>
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      </ContentCard>
    );
  }

  // Si no hay items de contacto, no renderizar la tarjeta
  if (contactData.items.length === 0) {
    return null;
  }

  return (
    <ContentCard title={contactData.title} icon={Mail}>
      <div className="space-y-3">
        {contactData.items.map((item, index) => {
          const IconComponent = getIconForType(item.type);
          return (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <IconComponent className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium text-foreground truncate group-hover:text-black transition-colors">
                  {item.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </ContentCard>
  );
};
