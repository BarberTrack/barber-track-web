import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { Button } from '@/shared/components/shadcn/button';
import { Calendar, Clock, User, Scissors, MapPin, Phone, DollarSign, CheckCircle, X, Info } from 'lucide-react';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { CompleteAppointmentModal } from './CompleteAppointmentModal';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { ClientInfoModal } from './ClientInfoModal';
import type { Appointment } from '../types/appointment.types';

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
  onAppointmentUpdate?: () => void;
}

export const AppointmentCard = ({ appointment, className, onAppointmentUpdate }: AppointmentCardProps) => {
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isClientInfoModalOpen, setIsClientInfoModalOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className || ''}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formatDate(appointment.scheduledDatetime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatTime(appointment.scheduledDatetime)} • {appointment.durationMinutes}min
              </span>
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del Barbero */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center">
            {appointment.barber.profileImageUrl ? (
              <img 
                src={appointment.barber.profileImageUrl} 
                alt={`${appointment.barber.firstName} ${appointment.barber.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {appointment.barber.firstName} {appointment.barber.lastName}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{appointment.barber.phone}</span>
            </div>
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {appointment.client.name}
            </p>
            <p className="text-xs text-muted-foreground">Cliente</p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsClientInfoModalOpen(true)}
            className="h-8 w-16 p-0"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Información del Servicio */}
        <div className="flex items-start gap-3">
          <Scissors className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">{appointment.service.name}</p>
            <p className="text-xs text-muted-foreground">{appointment.service.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {formatPrice(appointment.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Package si existe */}
        {appointment.package && (
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="text-xs">
              Paquete
            </Badge>
            <div className="flex-1">
              <p className="font-medium text-sm">{appointment.package.name}</p>
              <p className="text-xs text-muted-foreground">{appointment.package.description}</p>
            </div>
          </div>
        )}

        {/* Información del Negocio */}
        <div className="flex items-start gap-3 pt-2 border-t">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">{appointment.business.name}</p>
            <p className="text-xs text-muted-foreground">{appointment.business.address}</p>
          </div>
        </div>

        {/* Notas del Cliente */}
        {appointment.clientNotes && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas del cliente:</p>
            <p className="text-sm">{appointment.clientNotes}</p>
          </div>
        )}

        {/* Notas del Barbero */}
        {appointment.barberNotes && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas del barbero:</p>
            <p className="text-sm">{appointment.barberNotes}</p>
          </div>
        )}

        {/* Botones para citas scheduled */}
        {appointment.status === 'scheduled' && (
          <div className="pt-3 border-t space-y-2">
            <Button
              onClick={() => setIsCompleteModalOpen(true)}
              className="w-full"
              size="sm"
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como completada
            </Button>
            
            <Button
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full"
              size="sm"
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar cita
            </Button>
          </div>
        )}

      </CardContent>

      {/* Modal para completar cita */}
      <CompleteAppointmentModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        appointmentId={appointment.id}
        onComplete={() => {
          if (onAppointmentUpdate) {
            onAppointmentUpdate();
          }
        }}
      />

      {/* Modal para cancelar cita */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointmentId={appointment.id}
        onCancel={() => {
          if (onAppointmentUpdate) {
            onAppointmentUpdate();
          }
        }}
      />

      {/* Modal para información del cliente */}
      <ClientInfoModal
        isOpen={isClientInfoModalOpen}
        onClose={() => setIsClientInfoModalOpen(false)}
        client={appointment.client}
      />
    </Card>
  );
}; 