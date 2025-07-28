
import { useParams, useNavigate } from 'react-router';
import { MLDashboard } from '../components';
import { useDashboardData } from '../../dashboard/hooks/useDashboardData';
import { Navbar } from '../../../shared/components';
import { Loader2, AlertTriangle } from 'lucide-react';

export const MLpage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  // Get business information with loading states
  const { business, businessLoading, businessError } = useDashboardData(businessId || '');

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${businessId}`);
  };

  if (!businessId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-white text-lg">ID de negocio no válido</p>
          <p className="text-gray-400">Por favor, verifica la URL e inténtalo de nuevo.</p>
        </div>
      </div>
    );
  }

  // Show loading state while business data is being fetched
  if (businessLoading && !business) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-white text-lg">Cargando información del negocio...</p>
          <p className="text-gray-400">Preparando el dashboard ML</p>
        </div>
      </div>
    );
  }

  // Show error state if business data failed to load
  if (businessError && !business) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-white text-lg">Error al cargar información del negocio</p>
          <p className="text-gray-400">{businessError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar
        variant="dashboard"
        title="Machine Learning"
        subtitle={`Analytics avanzado - ${business?.name || 'Cargando...'}`}
        onBack={handleBackToDashboard}
        backButtonText="Dashboard"
        showLogout={true}
      />
      <MLDashboard 
        businessId={businessId} 
        businessName={business?.name}
      />
    </div>
  );
};
