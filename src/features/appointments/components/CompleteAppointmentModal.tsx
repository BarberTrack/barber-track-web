import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/shadcn/dialog';
import { Button } from '@/shared/components/shadcn/button';
import { Label } from '@/shared/components/shadcn/label';
import { Textarea } from '@/shared/components/shadcn/textarea';
import { appointmentService } from '../services/appointmentService';
import { ToastAlert } from '@/shared/components/ToastAlert';

interface CompleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onComplete: () => void;
}

export const CompleteAppointmentModal = ({
  isOpen,
  onClose,
  appointmentId,
  onComplete,
}: CompleteAppointmentModalProps) => {
  const [barberNotes, setBarberNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      // Obtener el ID del usuario del localStorage
      const userDataString = localStorage.getItem('barbertrack_user');
      if (!userDataString) {
        ToastAlert.error('Error', 'No se encontró información del usuario');
        return;
      }

      const userData = JSON.parse(userDataString);
      const completedBy = userData.id;

      if (!completedBy) {
        ToastAlert.error('Error', 'No se pudo obtener el ID del usuario');
        return;
      }

      // Llamar al servicio para completar la cita
      await appointmentService.completeAppointment(
        appointmentId,
        barberNotes,
        completedBy
      );

      ToastAlert.success(
        'Cita completada',
        'La cita ha sido marcada como completada exitosamente'
      );

      // Limpiar el formulario y cerrar modal
      setBarberNotes('');
      onClose();
      
      // Recargar las citas
      onComplete();
    } catch (error: any) {
      ToastAlert.error(
        'Error al completar cita',
        error.message || 'Ocurrió un error al marcar la cita como completada'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setBarberNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar cita como completada</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barber-notes">
              Notas del barbero
            </Label>
            <Textarea
              id="barber-notes"
              placeholder="Agrega notas sobre el servicio realizado..."
              value={barberNotes}
              onChange={(e) => setBarberNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Marcar como completado'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 