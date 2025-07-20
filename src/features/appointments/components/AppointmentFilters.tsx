import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Button } from '@/shared/components/shadcn/button';
import { Label } from '@/shared/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select';
import { Filter, X, User } from 'lucide-react';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import type { AppointmentStatus } from '../types/appointment.types';

interface AppointmentFiltersProps {
  barbers?: Array<{ id: string; firstName: string; lastName: string }>;
  className?: string;
}

const statusOptions: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'scheduled', label: 'Programadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
  { value: 'no_show', label: 'No Se Presentó' },
];

export const AppointmentFilters = ({ barbers = [], className }: AppointmentFiltersProps) => {
  const {
    filters,
    hasActiveFilters,
    updateStatus,
    updateBarber,
    clearAllFilters,
  } = useAppointmentFilters();

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtro por Estado */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Estado</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => updateStatus(value === 'all' ? undefined : value as AppointmentStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Barbero */}
        {barbers.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Barbero
            </Label>
            <Select
              value={filters.barberId || 'all'}
              onValueChange={(value) => updateBarber(value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los barberos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los barberos</SelectItem>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.firstName} {barber.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}



        {/* Resumen de Filtros Activos */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Filtros Activos:
            </Label>
            <div className="flex flex-wrap gap-1">
              {filters.status && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {statusOptions.find(opt => opt.value === filters.status)?.label}
                </span>
              )}
              {filters.barberId && barbers.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {barbers.find(b => b.id === filters.barberId)?.firstName} {barbers.find(b => b.id === filters.barberId)?.lastName}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 