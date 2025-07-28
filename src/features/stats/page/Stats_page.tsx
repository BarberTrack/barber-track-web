import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStats } from '../hooks';
import { StatsHeader, StatsFilters, StatsChart, StatsSummary } from '../components';
import { Navbar } from '../../../shared/components';

export const Stats_page = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const { 
    data, 
    loading, 
    error, 
    summary, 
    period, 
    dateRange, 
    getStats, 
    updatePeriod, 
    updateDateRange,
    clearStatsError 
  } = useStats(businessId || '');
  
  // Remove unused import - filters are handled directly in the components

  useEffect(() => {
    if (businessId) {
      getStats();
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId && period && dateRange.from && dateRange.to) {
      getStats({
        period,
        from: dateRange.from,
        to: dateRange.to,
      });
    }
  }, [businessId, period, dateRange]);

  const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month' | 'year') => {
    updatePeriod(newPeriod);
  };

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    updateDateRange(range);
  };

  const handleBackToDashboard = () => {
    if (businessId) {
      navigate(`/dashboard/${businessId}`);
    }
  };

  useEffect(() => {
    if (error) {
      // Could add toast notification here
      console.error('Error loading stats:', error);
      setTimeout(() => {
        clearStatsError();
      }, 5000);
    }
  }, [error, clearStatsError]);

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
        title="Estadísticas"
        subtitle="Estadísticas de citas agrupadas"
        onBack={handleBackToDashboard}
        backButtonText="Dashboard"
        showLogout={true}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Header and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <StatsHeader 
                data={data} 
                summary={summary}
                loading={loading} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <StatsFilters
                period={period}
                dateRange={dateRange}
                onPeriodChange={handlePeriodChange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          {/* Charts and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatsChart 
                data={data} 
                loading={loading}
                period={period}
              />
            </div>
            
            <div className="lg:col-span-1">
              <StatsSummary 
                summary={summary}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
