import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Switch } from '../../../shared/components/shadcn/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/shadcn/table';
import { Edit } from 'lucide-react';
import type { Business, BusinessHourDay } from '../types/business.type';

interface BusinessHoursTabProps {
  business: Business;
  businessId: string;
}

export const BusinessHoursTab = ({ business }: BusinessHoursTabProps) => {
  const [editHorariosModal, setEditHorariosModal] = useState(false);

  const diasSemana = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const handleSaveHorarios = () => {
    // TODO: Implementar la llamada a la API para actualizar los horarios
    console.log('Actualizando horarios');
    setEditHorariosModal(false);
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
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar Horarios
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Horarios</DialogTitle>
              <DialogDescription>Configura los horarios de atención para cada día</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {diasSemana.map((dia) => {
                const horario = business.businessHours[dia.key as keyof typeof business.businessHours] as BusinessHourDay;
                const isClosed = 'closed' in horario;
                
                return (
                  <div key={dia.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="font-medium">{dia.label}</Label>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked={!isClosed} />
                      <Input 
                        type="time" 
                        className="w-24" 
                        defaultValue={!isClosed ? horario.open : "09:00"} 
                        disabled={isClosed}
                      />
                      <span>-</span>
                      <Input 
                        type="time" 
                        className="w-24" 
                        defaultValue={!isClosed ? horario.close : "18:00"} 
                        disabled={isClosed}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditHorariosModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveHorarios} className="bg-blue-600 hover:bg-blue-700">
                Guardar Horarios
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
                        {horario.open} - {horario.close}
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