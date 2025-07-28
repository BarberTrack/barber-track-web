import { Badge } from '@/shared/components/shadcn/badge';
import type { AppointmentStatus } from '../types/appointment.types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig = {
  scheduled: {
    label: 'Programada',
    variant: 'secondary' as const,
    className: 'border-blue-200 text-blue-700 bg-blue-50',
  },
  confirmed: {
    label: 'Confirmada',
    variant: 'secondary' as const,
    className: 'border-cyan-200 text-cyan-700 bg-cyan-50',
  },
  in_progress: {
    label: 'En Progreso',
    variant: 'secondary' as const,
    className: 'border-yellow-200 text-yellow-700 bg-yellow-50',
  },
  completed: {
    label: 'Completada',
    variant: 'secondary' as const,
    className: 'border-green-200 text-green-800 bg-green-100',
  },
  cancelled: {
    label: 'Cancelada',
    variant: 'destructive' as const,
    className: 'border-red-200 text-red-700 bg-red-50',
  },
  no_show: {
    label: 'No Se Presentó',
    variant: 'destructive' as const,
    className: 'border-gray-200 text-gray-700 bg-gray-50',
  },
};

export const AppointmentStatusBadge = ({ status, className }: AppointmentStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}; 