import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Button } from '@/shared/components/shadcn/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select';
import { Skeleton } from '@/shared/components/shadcn/skeleton';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { AppointmentCard } from './AppointmentCard';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import type { Appointment } from '../types/appointment.types';

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const AppointmentsList = ({ 
  appointments, 
  isLoading, 
  error,
  onRefresh 
}: AppointmentsListProps) => {
  

  const {
    paginationInfo,
    pageNumbers,
    changePage,
    changeLimit,
  } = useAppointmentFilters();

  // Componente de Loading
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Componente de Error
  const ErrorState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar las citas
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Componente de Estado Vacío
  const EmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay citas disponibles
        </h3>
        <p className="text-gray-600 mb-4">
          No se encontraron citas que coincidan con los filtros seleccionados.
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Componente de Paginación
  const PaginationControls = () => {
    if (paginationInfo.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-2">
        {/* Información de elementos */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>
            Mostrando {paginationInfo.startItem} - {paginationInfo.endItem} de {paginationInfo.totalItems} citas
          </span>
          <Select
            value={paginationInfo.itemsPerPage.toString()}
            onValueChange={(value) => changeLimit(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>por página</span>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center gap-1">
          {/* Botón Anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(paginationInfo.previousPage!)}
            disabled={!paginationInfo.hasPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {/* Números de página */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => (
              <div key={index}>
                {pageNum === '...' ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={pageNum === paginationInfo.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => changePage(pageNum as number)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Botón Siguiente */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(paginationInfo.nextPage!)}
            disabled={!paginationInfo.hasNext}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lista de Citas
          </CardTitle>
          {onRefresh && !isLoading && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contenido principal */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState />
        ) : appointments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Lista de citas */}
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onAppointmentUpdate={onRefresh}
                />
              ))}
            </div>

            {/* Paginación */}
            <PaginationControls />
          </>
        )}
      </CardContent>
    </Card>
  );
}; 