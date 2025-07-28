import { useState, useEffect } from "react";
import { Button } from "@/shared/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog";
import { Input } from "@/shared/components/shadcn/input";
import { Label } from "@/shared/components/shadcn/label";
import { Textarea } from "@/shared/components/shadcn/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn/select";
import { Switch } from "@/shared/components/shadcn/switch";
import type { PromotionFormData, Promotion } from "../types/promotion.types";

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionFormData) => void;
  editingPromotion?: Promotion | null;
  isLoading: boolean;
}

export const PromotionForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPromotion, 
  isLoading 
}: PromotionFormProps) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    validFrom: "",
    validTo: "",
    minAmount: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        title: editingPromotion.title,
        description: editingPromotion.description,
        discountType: editingPromotion.discountType,
        discountValue: editingPromotion.discountValue,
        validFrom: editingPromotion.validFrom.split('T')[0],
        validTo: editingPromotion.validTo.split('T')[0],
        minAmount: editingPromotion.conditions.minAmount,
        isActive: editingPromotion.isActive,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        validFrom: "",
        validTo: "",
        minAmount: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [editingPromotion, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (formData.discountValue <= 0) {
      newErrors.discountValue = "El valor del descuento debe ser mayor a 0";
    }
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = "El porcentaje no puede ser mayor a 100";
    }
    if (!formData.validFrom) {
      newErrors.validFrom = "La fecha de inicio es requerida";
    }
    if (!formData.validTo) {
      newErrors.validTo = "La fecha de fin es requerida";
    }
    if (formData.validFrom && formData.validTo && formData.validFrom >= formData.validTo) {
      newErrors.validTo = "La fecha de fin debe ser posterior a la fecha de inicio";
    }
    if (formData.minAmount < 0) {
      newErrors.minAmount = "El monto mínimo no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PromotionFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-blue-900">
            {editingPromotion ? "Editar Promoción" : "Crear Nueva Promoción"}
          </DialogTitle>
          <DialogDescription>
            {editingPromotion 
              ? "Modifica los datos de la promoción" 
              : "Completa los datos para crear una nueva promoción"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Nombre de la promoción"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la promoción"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discountType">Tipo de descuento</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: 'percentage' | 'fixed') => handleInputChange("discountType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Monto fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountValue">Valor</Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="0"
                value={formData.discountValue.toString()}
                onChange={(e) => handleInputChange("discountValue", Number(e.target.value))}
                className={errors.discountValue ? "border-red-500" : ""}
              />
              {errors.discountValue && <span className="text-red-500 text-sm">{errors.discountValue}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="validFrom">Válido desde</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange("validFrom", e.target.value)}
                className={errors.validFrom ? "border-red-500" : ""}
              />
              {errors.validFrom && <span className="text-red-500 text-sm">{errors.validFrom}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validTo">Válido hasta</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleInputChange("validTo", e.target.value)}
                className={errors.validTo ? "border-red-500" : ""}
              />
              {errors.validTo && <span className="text-red-500 text-sm">{errors.validTo}</span>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minAmount">Monto mínimo</Label>
            <Input
              id="minAmount"
              type="number"
              placeholder="0"
              value={formData.minAmount.toString()}
              onChange={(e) => handleInputChange("minAmount", Number(e.target.value))}
              className={errors.minAmount ? "border-red-500" : ""}
            />
            {errors.minAmount && <span className="text-red-500 text-sm">{errors.minAmount}</span>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Promoción activa</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : (editingPromotion ? "Actualizar" : "Crear Promoción")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
