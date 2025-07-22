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

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onCancel: () => void;
}

export const CancelAppointmentModal = ({
  isOpen,
  onClose,
  appointmentId,
  onCancel,
}: CancelAppointmentModalProps) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      ToastAlert.error('Error', 'La razón de cancelación es requerida');
      return;
    }

    try {
      setIsLoading(true);

      // Llamar al servicio para cancelar la cita
      await appointmentService.cancelAppointment(appointmentId, reason.trim());

      ToastAlert.success(
        'Cita cancelada',
        'La cita ha sido cancelada exitosamente'
      );

      // Limpiar el formulario y cerrar modal
      setReason('');
      onClose();
      
      // Recargar las citas
      onCancel();
    } catch (error: any) {
      ToastAlert.error(
        'Error al cancelar cita',
        error.message || 'Ocurrió un error al cancelar la cita'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar cita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">
              Razón de cancelación *
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Indica la razón por la cual se cancela la cita..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cerrar
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Cancelar cita'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 