import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useAnalytics } from '../hooks/useAnalytics';
import { ToastAlert } from '@/shared/components/ToastAlert';
import {
  AnalyticsHeader,
  OverviewCards,
  TopServicesChart,
  TopBarbersChart,
  ServiceTrendsGrid,
  ServiceRankingTable,
  BarberRankingTable,
  AnalyticsLoadingSkeleton,
  ErrorCard
} from '../components';

export const AnalyticsPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  
  const {
    dashboardData,
    serviceTrendsData,
    businessInfo,
    isLoading,
    hasData,
    dashboardError,
    serviceTrendsError,
    reloadAnalytics,
    clearErrors,
  } = useAnalytics(businessId);

  // Manejar errores
  useEffect(() => {
    if (dashboardError) {
      ToastAlert.error('Error en Dashboard', dashboardError);
      clearErrors();
    }
    if (serviceTrendsError) {
      ToastAlert.error('Error en Tendencias', serviceTrendsError);
      clearErrors();
    }
  }, [dashboardError, serviceTrendsError, clearErrors]);

  // Validar businessId
  if (!businessId) {
    return <ErrorCard type="no-business-id" />;
  }

  // Renderizar skeleton mientras carga
  if (isLoading && !hasData) {
    return <AnalyticsLoadingSkeleton />;
  }

  // Si no hay datos y no está cargando, mostrar error
  if (!hasData && !isLoading) {
    return (
      <ErrorCard 
        type="no-data" 
        onRefresh={reloadAnalytics}
        showRefreshButton 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <AnalyticsHeader 
          businessName={businessInfo?.businessName}
          location={businessInfo?.location}
        />

        {/* Overview Cards */}
        <OverviewCards 
          dashboardData={dashboardData}
          serviceTrendsData={serviceTrendsData}
        />

        {/* Simple Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopServicesChart dashboardData={dashboardData} />
          <TopBarbersChart dashboardData={dashboardData} />
        </div>

        {/* Services Trend Data */}
        <ServiceTrendsGrid serviceTrendsData={serviceTrendsData} />

        {/* Detailed Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceRankingTable dashboardData={dashboardData} />
          <BarberRankingTable dashboardData={dashboardData} />
        </div>
      </div>
    </div>
  );
};
