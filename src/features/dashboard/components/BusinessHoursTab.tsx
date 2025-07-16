import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/shadcn/table';
import { Edit } from 'lucide-react';
import { BusinessHoursSelector } from './BusinessHoursSelector';
import { useUpdateBusiness } from '../hooks/useUpdateBusiness';
import type { Business, BusinessHourDay, BusinessHours } from '../types/business.type';

interface BusinessHoursTabProps {
  business: Business;
  businessId: string;
}

export const BusinessHoursTab = ({ business, businessId }: BusinessHoursTabProps) => {
  const [editHorariosModal, setEditHorariosModal] = useState(false);
  const [tempBusinessHours, setTempBusinessHours] = useState<BusinessHours>(business.businessHours);
  const [isLoading, setIsLoading] = useState(false);
  const { updateBusinessByIdApi } = useUpdateBusiness();

  const diasSemana = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const handleOpenModal = () => {
    setTempBusinessHours(business.businessHours);
    setEditHorariosModal(true);
  };

  const handleSaveHorarios = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        name: business.name,
        description: business.description,
        address: business.address,
        phone: business.phone,
        businessHours: tempBusinessHours,
        cancellationPolicy: business.cancellationPolicy,
      };

      await updateBusinessByIdApi(businessId, updateData);
      setEditHorariosModal(false);
    } catch (error) {
      console.error('Error al actualizar horarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Horarios de Servicio</CardTitle>
          <CardDescription>Configura los horarios de atención de tu barbería</CardDescription>
        </div>
        <Dialog open={editHorariosModal} onOpenChange={setEditHorariosModal}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleOpenModal}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Horarios
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Horarios</DialogTitle>
              <DialogDescription>Configura los horarios de atención para cada día</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <BusinessHoursSelector
                businessHours={tempBusinessHours}
                onChange={setTempBusinessHours}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditHorariosModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveHorarios} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Horarios'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Día</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Horario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diasSemana.map((dia) => {
              const horario = business.businessHours[dia.key as keyof typeof business.businessHours] as BusinessHourDay;
              const isClosed = 'closed' in horario;
              
              return (
                <TableRow key={dia.key}>
                  <TableCell className="font-medium">{dia.label}</TableCell>
                  <TableCell>
                    {isClosed ? (
                      <Badge variant="secondary">Cerrado</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Abierto</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {isClosed ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>
                        {formatTimeDisplay(horario.open)} - {formatTimeDisplay(horario.close)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 