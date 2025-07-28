import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/shared/components/shadcn/button";
import { Plus } from "lucide-react";
import { Navbar } from "@/shared/components";
import { PromotionCard, PromotionForm } from "../components";
import { usePromotions } from "../hooks";
import { ToastAlert } from "@/shared/components/ToastAlert";
import type { Promotion, PromotionFormData } from "../types/promotion.types";
import type { CreatePromotionDTO } from "../types/promotion.types";

export const Promotions_page = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const {
    promotions,
    isLoading,
    error,
    success,
    getPromotions,
    addPromotion,
    removePromotion,
    editPromotion,
    clearError,
    clearSuccess,
  } = usePromotions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    if (businessId) {
      getPromotions(businessId);
    }
  }, [businessId]);

  useEffect(() => {
    if (success) {
      ToastAlert.success("Operación exitosa", "La promoción se ha procesado correctamente");
      setIsFormOpen(false);
      setEditingPromotion(null);
      clearSuccess();
      if (businessId) {
        getPromotions(businessId);
      }
    }
  }, [success, businessId, clearSuccess]);

  useEffect(() => {
    if (error) {
      if (error.includes("400")) {
        ToastAlert.error("Error", "Algo salió mal, intenta de nuevo");
      } else if (error.includes("500")) {
        ToastAlert.error("Error", "Error interno del servidor");
      } else {
        ToastAlert.error("Error", error);
      }
      clearError();
    }
  }, [error, clearError]);

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setIsFormOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta promoción?")) {
      if (businessId) {
        await removePromotion(businessId, promotionId);
      }
    }
  };

  const handleFormSubmit = async (formData: PromotionFormData) => {
    if (!businessId) return;

    const promotionData: CreatePromotionDTO = {
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      validFrom: `${formData.validFrom}T00:00:00.000Z`,
      validTo: `${formData.validTo}T23:59:59.000Z`,
      conditions: {
        minAmount: formData.minAmount,
      },
      isActive: formData.isActive,
    };

    if (editingPromotion) {
      await editPromotion(businessId, editingPromotion.id, promotionData);
    } else {
      await addPromotion(businessId, promotionData);
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${businessId}`);
  };

  if (isLoading && promotions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300">Cargando promociones...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar
        variant="dashboard"
        title="Promociones"
        subtitle="Gestiona las promociones de tu negocio"
        onBack={handleBackToDashboard}
        backButtonText="Dashboard"
        showLogout={true}
      />
      <div className="p-4 sm:p-6 text-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
            <Button
              className=" hover:bg-blue-700 text-black w-full sm:w-auto"
              onClick={handleCreatePromotion}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Promoción
            </Button>
          </div>

    {promotions.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            onEdit={handleEditPromotion}
            onDelete={handleDeletePromotion}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8 shadow-lg border border-blue-800">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">
            No hay promociones
          </h3>
          <p className="text-blue-300 mb-4 text-sm sm:text-base">
            Crea tu primera promoción para comenzar
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-black w-full sm:w-auto"
            onClick={handleCreatePromotion}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Promoción
          </Button>
        </div>
      </div>
    )}

    <PromotionForm
      isOpen={isFormOpen}
      onClose={() => {
        setIsFormOpen(false);
        setEditingPromotion(null);
      }}
      onSubmit={handleFormSubmit}
      editingPromotion={editingPromotion}
      isLoading={isLoading}
    />
        </div>
      </div>
    </div>
  );
};
