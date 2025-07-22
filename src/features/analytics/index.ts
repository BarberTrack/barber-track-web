// Exportar todos los elementos principales de la feature analytics
export * from './types/analytics.types';
export * from './store/analyticsSlice';
export * from './hooks/useAnalytics';
export * from './services/analyticsService';

// Exportar componente principal
export { AnalyticsPage } from './page/AnalyticsPage';

// Exportar componentes auxiliares
export * from './components'; 