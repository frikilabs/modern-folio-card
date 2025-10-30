import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ContentCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const ContentCard = ({
  title,
  icon: Icon,
  children,
  className = ""
}: ContentCardProps) => {
  return (
    <Card className={`card-elevated p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6 text-black" />}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
};
