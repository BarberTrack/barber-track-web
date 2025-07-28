import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Button } from '@/shared/components/shadcn/button';
import { Label } from '@/shared/components/shadcn/label';
import { Input } from '@/shared/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select';
import { Filter, X, User, Calendar, CalendarDays } from 'lucide-react';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import type { AppointmentStatus } from '../types/appointment.types';

interface AppointmentFiltersProps {
  barbers?: Array<{ id: string; firstName: string; lastName: string }>;
  className?: string;
}

const statusOptions: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'scheduled', label: 'Programadas' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'in_progress', label: 'En Progreso' },
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
    updateFromDate,
    updateToDate,
    setTodayRange,
    setThisWeekRange,
    setThisMonthRange,
    clearDateFilters,
    clearAllFilters,
  } = useAppointmentFilters();

  // Helper para formatear fecha para input datetime-local
  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper para convertir fecha de input a ISO string
  const formatInputToISO = (inputValue: string) => {
    if (!inputValue) return undefined;
    return new Date(inputValue).toISOString();
  };

  // Helper para formatear fecha para mostrar
  const formatDateForDisplay = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

        {/* Filtros por Fecha */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Rango de Fechas
          </Label>
          
          {/* Botones de rangos rápidos */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={setTodayRange}
              className="text-xs"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={setThisWeekRange}
              className="text-xs"
            >
              Esta Semana
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={setThisMonthRange}
              className="text-xs col-span-2"
            >
              Este Mes
            </Button>
          </div>

          {/* Inputs de fecha personalizada */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Desde:</Label>
            <Input
              type="datetime-local"
              value={formatDateForInput(filters.from)}
              onChange={(e) => updateFromDate(formatInputToISO(e.target.value))}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Hasta:</Label>
            <Input
              type="datetime-local"
              value={formatDateForInput(filters.to)}
              onChange={(e) => updateToDate(formatInputToISO(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Botón para limpiar filtros de fecha */}
          {(filters.from || filters.to) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateFilters}
              className="w-full text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar Fechas
            </Button>
          )}
        </div>

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
              {filters.from && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Desde: {formatDateForDisplay(filters.from)}
                </span>
              )}
              {filters.to && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Hasta: {formatDateForDisplay(filters.to)}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 