import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import { Label } from "@/shared/components/shadcn/label";
import { Textarea } from "@/shared/components/shadcn/textarea";
import { MapPin, Edit2, Save, X, Building2, Clock } from "lucide-react";
import BusinessHoursSelector from "../components/BusinessHoursSelector";
import MapComponent from "../components/MapComponent";
import { useCreateBusiness } from "../hooks/useCreateBusiness";
import { ToastAlert } from "@/shared/components/ToastAlert";
import { Navbar } from "@/shared/components/Navbar";
import type { BusinessHours, Location, CreateBusinessFormData } from "../types/business.types";

const defaultBusinessHours: BusinessHours = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "09:00", close: "16:00" },
  sunday: { closed: true },
};

export const CreateBusinessPage = () => {
  const { createBusiness, isLoading, error, success, clearError, clearSuccess } = useCreateBusiness();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState<CreateBusinessFormData>({
    name: "",
    description: "",
    phone: "",
    email: "",
    location: null,
    businessHours: defaultBusinessHours,
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState("");

  useEffect(() => {
    if (success) {
      ToastAlert.success(
        "¡Negocio creado exitosamente!",
        "Tu barbería ha sido registrada correctamente"
      );
      
      setBusinessData({
        name: "",
        description: "",
        phone: "",
        email: "",
        location: null,
        businessHours: defaultBusinessHours,
      });
      
      clearSuccess();
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [success, clearSuccess, navigate]);

  useEffect(() => {
    if (error) {
      ToastAlert.error(
        "Error al crear el negocio",
        error || "Ha ocurrido un error inesperado"
      );
      clearError();
    }
  }, [error, clearError]);

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    try {
      const latitude = parseFloat(lat.toFixed(8));
      const longitude = parseFloat(lng.toFixed(8));

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const newLocation: Location = {
        latitude: latitude,
        longitude: longitude,
        address: address,
      };

      setBusinessData((prev) => ({
        ...prev,
        location: newLocation,
      }));
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error obteniendo la dirección:", error);
      const latitude = parseFloat(lat.toFixed(8));
      const longitude = parseFloat(lng.toFixed(8));
      const newLocation: Location = {
        latitude: latitude,
        longitude: longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
      setBusinessData((prev) => ({
        ...prev,
        location: newLocation,
      }));
    }
  }, []);

  const handleInputChange = (field: keyof CreateBusinessFormData, value: string) => {
    setBusinessData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessHoursChange = (newBusinessHours: BusinessHours) => {
    setBusinessData((prev) => ({
      ...prev,
      businessHours: newBusinessHours,
    }));
  };

  const handleEditAddress = () => {
    setEditedAddress(businessData.location?.address || "");
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    if (businessData.location && editedAddress.trim()) {
      setBusinessData((prev) => ({
        ...prev,
        location: prev.location
          ? {
              ...prev.location,
              address: editedAddress.trim(),
            }
          : null,
      }));
      setIsEditingAddress(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setEditedAddress("");
  };

  const handleClearLocation = () => {
    setBusinessData((prev) => ({
      ...prev,
      location: null,
    }));
    setIsEditingAddress(false);
  };

  const handleSubmit = async () => {
    if (!businessData.name.trim()) {
      ToastAlert.error("Campo requerido", "El nombre del negocio es requerido");
      return;
    }
    if (!businessData.email.trim()) {
      ToastAlert.error("Campo requerido", "El email es requerido");
      return;
    }
    if (!businessData.phone.trim()) {
      ToastAlert.error("Campo requerido", "El teléfono es requerido");
      return;
    }
    if (!businessData.location) {
      ToastAlert.error("Campo requerido", "La ubicación es requerida");
      return;
    }

    const createBusinessData = {
      name: businessData.name.trim(),
      description: businessData.description.trim(),
      address: businessData.location.address,
      latitude: parseFloat(businessData.location.latitude.toString()),
      longitude: parseFloat(businessData.location.longitude.toString()),
      phone: businessData.phone.trim(),
      email: businessData.email.trim(),
      businessHours: businessData.businessHours,
      cancellationPolicy: {
        hoursBeforeAppointment: 24,
        refundPercentage: 100,
      },
    };

    try {
      await createBusiness(createBusinessData);
    } catch (error) {
      console.error("Error creando negocio:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        variant="dashboard" 
        title="Crear Negocio" 
        subtitle="Completa la información de tu barbería"
        showLogout={true}
      />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Crear Negocio</h1>
            <p className="text-gray-200">Completa la información de tu negocio y selecciona la ubicación en el mapa</p>
          </div>



        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Información del Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Negocio</Label>
                  <Input
                    id="name"
                    value={businessData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Barbería El Estilo"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={businessData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe tu negocio..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={businessData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Ej: +34 123 456 789"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Ej: contacto@barberia.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusinessHoursSelector
                  businessHours={businessData.businessHours}
                  onChange={handleBusinessHoursChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessData.location ? (
                  <>


                    <div>
                      <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                      {isEditingAddress ? (
                        <div className="mt-1 space-y-2">
                          <Input
                            value={editedAddress}
                            onChange={(e) => setEditedAddress(e.target.value)}
                            placeholder="Ingresa la dirección"
                            className="text-sm"
                            disabled={isLoading}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveAddress} className="flex-1" disabled={isLoading}>
                              <Save className="h-4 w-4 mr-1" />
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="flex-1 bg-transparent"
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 space-y-2">
                          <div className="p-2 rounded border text-sm">{businessData.location.address}</div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleEditAddress}
                              className="flex-1 bg-transparent"
                              disabled={isLoading}
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={handleClearLocation} 
                              className="flex-1"
                              disabled={isLoading}
                            >
                              Limpiar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Selecciona un punto en el mapa</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creando Negocio..." : "Crear Negocio"}
            </Button>
          </div>


          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Seleccionar Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapComponent onLocationSelect={handleLocationSelect} selectedLocation={businessData.location} />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Haz clic en cualquier punto del mapa para seleccionar la ubicación de tu negocio
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
    </div>

  );
};
