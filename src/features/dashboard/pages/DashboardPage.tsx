import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDashboardData } from '../hooks/useDashboardData';
import { Button } from '../../../shared/components/shadcn/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/shadcn/tabs';
import { ArrowLeft, Star, MapPin, Clock, User, Scissors, MessageSquare, ImageIcon } from 'lucide-react';
import { 
  BusinessInfoTab, 
  BusinessHoursTab, 
  BarbersTab, 
  ServicesTab, 
  ReviewsTab, 
  GalleryTab 
} from '../components';

export const DashboardPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const {
    business,
    barbers,
    services,
    reviews,
    isLoading,
    hasError,
    errors
  } = useDashboardData(businessId || '');
  
  const [activeTab, setActiveTab] = useState("info");

  if (isLoading && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Cargando dashboard...</h2>
        </div>
      </div>
    );
  }

  if (hasError && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error al cargar dashboard</h2>
          <p className="text-gray-600 mt-2">
            {errors.business || errors.barbers || errors.services || errors.reviews || "Ocurrió un error inesperado"}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Business ID: {businessId}
          </div>
          <Button onClick={() => navigate('/')} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Negocio no encontrado</h2>
          <div className="mt-2 text-sm text-gray-500">
            <p>Business ID: {businessId}</p>
            <p>Loading: {isLoading ? 'Sí' : 'No'}</p>
            <p>Has Error: {hasError ? 'Sí' : 'No'}</p>
            <p>Business Data: {business ? 'Existe' : 'Null/Undefined'}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-4 mr-2">
            Recargar
          </Button>
          <Button onClick={() => navigate('/')} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Cargando datos del negocio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">{business.name}</h1>
                <p className="text-sm text-gray-600">Dashboard de administración</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
            <TabsTrigger value="barberos" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Barberos</span>
            </TabsTrigger>
            <TabsTrigger value="servicios" className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="galeria" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Galería</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <BusinessInfoTab business={business} businessId={businessId || ''} />
          </TabsContent>

          <TabsContent value="horarios">
            <BusinessHoursTab business={business} businessId={businessId || ''} />
          </TabsContent>

          <TabsContent value="barberos">
            <BarbersTab barbers={barbers || []} businessId={businessId || ''} />
          </TabsContent>

          <TabsContent value="servicios">
            <ServicesTab services={services?.services || []} businessId={businessId || ''} barbers={barbers || []} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab reviews={reviews?.reviews || []} businessId={businessId || ''} />
          </TabsContent>

          <TabsContent value="galeria">
            <GalleryTab business={business} businessId={businessId || ''} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
