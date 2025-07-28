import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/shadcn/card";
import { Button } from "@/shared/components/shadcn/button";
import { Badge } from "@/shared/components/shadcn/badge";
import { CalendarDays, Edit, Percent, Trash2 } from "lucide-react";
import type { Promotion } from "../types/promotion.types";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotionId: string) => void;
}

export const PromotionCard = ({ promotion, onEdit, onDelete }: PromotionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountText = () => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountValue}% de descuento`;
    }
    return `$${promotion.discountValue} de descuento`;
  };

  return (
    <Card className="bg-gray-900 border border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-blue-400 text-lg">{promotion.title}</CardTitle>
          <Badge
            variant={promotion.isActive ? "default" : "secondary"}
            className={
              promotion.isActive
                ? "bg-blue-200 text-gray-200"
                : "bg-gray-600 text-gray-200"
            }
          >
            {promotion.isActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <CardDescription className="text-blue-300">{promotion.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-blue-300">
          <Percent className="w-4 h-4" />
          <span className="font-semibold">{getDiscountText()}</span>
        </div>

        <div className="flex items-center gap-2 text-blue-300 text-sm">
          <CalendarDays className="w-4 h-4" />
          <span>
            {formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}
          </span>
        </div>

        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-blue-200">
            <span className="font-medium">Monto mínimo:</span> ${promotion.conditions.minAmount}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-900 text-gray-100 hover:bg-green-950 hover:text-green-400 bg-transparent"
          onClick={() => onEdit(promotion)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-gray-200 hover:bg-red-950 hover:text-red-400 bg-transparent"
          onClick={() => onDelete(promotion.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
