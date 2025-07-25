import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '@/shared/components/shadcn/card';
import { Button } from '@/shared/components/shadcn/button';
import { Calendar, AlertCircle, Loader2, ArrowLeft, LogOut, Scissors } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { 
  AppointmentsList, 
  AppointmentFilters
} from '../components';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const AppointmentPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    appointments,
    isLoading,
    error,
    reloadAppointments,
    clearAppointmentError,
  } = useAppointments(businessId);

  useEffect(() => {
    if (error) {
      ToastAlert.error('Error', error);
      clearAppointmentError();
    }
  }, [error, clearAppointmentError]);

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${businessId}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!businessId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>No se ha proporcionado un ID de negocio válido.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRefresh = () => {
    reloadAppointments();
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Lado izquierdo - Botón de regresar y título */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Citas
              </h1>
            </div>
          </div>

          {/* Lado derecho - Botón de cerrar sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-200 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              Gestión de Citas
            </h1>
            <p className="text-gray-300 mt-1">
              Administra y visualiza todas las citas de tu negocio
            </p>
            {error && (
              <p className="text-amber-600 text-sm mt-1">
                ⚠️ Verifica la conexión con la API
              </p>
            )}
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Actualizar Citas
          </Button>
        </div>

        {/* Estadísticas */}
        {/* <AppointmentStats 
          statusStats={statusStats}
          isLoading={isLoading}
        /> */}

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con filtros */}
          <div className="lg:col-span-1">
            <AppointmentFilters className="sticky top-6" />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <AppointmentsList 
              appointments={appointments}
              isLoading={isLoading}
              error={error}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
