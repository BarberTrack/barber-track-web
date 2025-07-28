import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAnalyticsDashboard, useAnalyticsReports, useAnalyticsFilters } from '../hooks';
import {
  AnalyticsHeader,
  FiltersPanel,
  TrendsSection,
  ServicesAnalytics,
  BarbersRanking,
  PeakHoursChart,
} from '../components';
import { Navbar } from '../../../shared/components';


export const Analytics_page = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const { data: dashboardData, loading: dashboardLoading, getDashboard } = useAnalyticsDashboard(businessId || '');
  const { data: reportsData, loading: reportsLoading, getReports } = useAnalyticsReports(businessId || '');
  const { 
    period, 
    reportType, 
    dateRange, 
    groupBy,
    updatePeriod, 
    updateReportType, 
    updateDateRange, 
    updateGroupBy 
  } = useAnalyticsFilters();

  useEffect(() => {
    if (businessId) {
      getDashboard(period);
    }
  }, [businessId, period]);

  useEffect(() => {
    if (businessId && reportType) {
      getReports({
        type: reportType,
        from: dateRange.from,
        to: dateRange.to,
        groupBy: groupBy,
      });
    }
  }, [businessId, reportType, dateRange, groupBy]);

  const handlePeriodChange = (newPeriod: 'week' | 'month') => {
    updatePeriod(newPeriod);
  };

  const handleReportTypeChange = (type: 'appointments' | 'revenue' | 'services') => {
    updateReportType(type);
  };

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    updateDateRange(range);
  };

  const handleGroupByChange = (newGroupBy: 'week' | 'month') => {
    updateGroupBy(newGroupBy);
  };

  const handleBackToDashboard = () => {
    if (businessId) {
      navigate(`/dashboard/${businessId}`);
    }
  };

  if (!businessId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">ID de negocio no proporcionado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar
        variant="dashboard"
        title="Analíticas"
        subtitle="Analytics del negocio"
        onBack={handleBackToDashboard}
        backButtonText="Dashboard"
        showLogout={true}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AnalyticsHeader 
              data={dashboardData} 
              loading={dashboardLoading} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <FiltersPanel
              period={period}
              reportType={reportType}
              dateRange={dateRange}
              groupBy={groupBy}
              onPeriodChange={handlePeriodChange}
              onReportTypeChange={handleReportTypeChange}
              onDateRangeChange={handleDateRangeChange}
              onGroupByChange={handleGroupByChange}
            />
          </div>
        </div>

        <TrendsSection 
          reportData={reportsData} 
          loading={reportsLoading} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServicesAnalytics 
            services={dashboardData?.dashboard.popularServices || []} 
            loading={dashboardLoading} 
          />
          
          <BarbersRanking 
            barbers={dashboardData?.dashboard.topBarbers || []} 
            loading={dashboardLoading} 
          />
        </div>

        {reportsData?.type === 'services' && reportsData.reportData && 'peakHours' in reportsData.reportData && (
          <PeakHoursChart 
            peakHours={(reportsData.reportData as any).peakHours || []} 
            loading={reportsLoading} 
          />
        )}
        </div>
      </div>
    </div>
  );
};
