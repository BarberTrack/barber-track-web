import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog';
import { User, Mail } from 'lucide-react';
import type { AppointmentClient } from '../types/appointment.types';

interface ClientInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: AppointmentClient;
}

export const ClientInfoModal = ({ isOpen, onClose, client }: ClientInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Cliente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Avatar del cliente */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          {/* Información del cliente */}
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {client.firstName} {client.lastName}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 ">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Nombre</p>
                  <p className="font-medium">{client.firstName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3  rounded-lg border border-gray-600 ">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Apellido</p>
                  <p className="font-medium">{client.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3  rounded-lg border border-gray-600 ">
                <Mail className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 