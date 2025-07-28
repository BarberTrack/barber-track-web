import { useEffect, useState } from 'react';
import { useAnalyticsDashboard, useAnalyticsReports, useAnalyticsFilters } from '../hooks';
import {
  AnalyticsHeader,
  FiltersPanel,
  TrendsSection,
  ServicesAnalytics,
  BarbersRanking,
  PeakHoursChart,
} from '../components';


export const Analytics_page = () => {
  const [businessId] = useState<string>('5c7cb59c-18c5-4a55-b6ee-9461147bb2f9');
  
  const { data: dashboardData, loading: dashboardLoading, getDashboard } = useAnalyticsDashboard(businessId);
  const { data: reportsData, loading: reportsLoading, getReports } = useAnalyticsReports(businessId);
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8">
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
  );
};
