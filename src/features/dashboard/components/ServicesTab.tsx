import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/shadcn/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/shadcn/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type{ Service } from '../types/services.type';
import type { Barber } from '../types/barber.type';
import type { BarberAssignmentRequest } from '../types/services.type';
import { useCreateService } from '../hooks/useCreateService';

interface ServicesTabProps {
  services: Service[];
  businessId: string;
  barbers: Barber[];
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  durationMinutes: number;
  selectedBarberId: string;
}

export const ServicesTab = ({ services, businessId, barbers }: ServicesTabProps) => {
  const [addServicioModal, setAddServicioModal] = useState(false);
  const [newServicio, setNewServicio] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    selectedBarberId: ''
  });

  const { createService, isCreating } = useCreateService();

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? `${barber.firstName} ${barber.lastName}` : 'Barbero no encontrado';
  };

  const handleAddServicio = async () => {
    if (!newServicio.name || !newServicio.description || !newServicio.price || !newServicio.selectedBarberId) {
      alert('Por favor completa todos los campos y selecciona un barbero');
      return;
    }

    try {
      const servicePrice = Number.parseFloat(newServicio.price);
      
      await createService({
        businessId,
        name: newServicio.name,
        description: newServicio.description,
        price: servicePrice,
        durationMinutes: newServicio.durationMinutes,
        barberAssignments: [{
          barberId: newServicio.selectedBarberId,
          specialPrice: servicePrice, // Mismo precio que el servicio
          isPreferred: true // Siempre true
        }]
      });

      // Limpiar formulario y cerrar modal
      setAddServicioModal(false);
      setNewServicio({
        name: '',
        description: '',
        price: '',
        durationMinutes: 30,
        selectedBarberId: ''
      });
    } catch (error) {
      console.error('Error al crear servicio:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Servicios</CardTitle>
          <CardDescription>Administra los servicios que ofrece tu barbería</CardDescription>
        </div>
        <Dialog open={addServicioModal} onOpenChange={setAddServicioModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
              <DialogDescription>Completa la información del nuevo servicio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="service-name">Nombre del Servicio</Label>
                <Input
                  id="service-name"
                  value={newServicio.name}
                  onChange={(e) => setNewServicio({ ...newServicio, name: e.target.value })}
                  placeholder="Ej: Corte de cabello"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service-description">Descripción</Label>
                <Textarea
                  id="service-description"
                  value={newServicio.description}
                  onChange={(e) => setNewServicio({ ...newServicio, description: e.target.value })}
                  placeholder="Descripción detallada del servicio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="service-price">Precio ($)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    step="0.01"
                    value={newServicio.price}
                    onChange={(e) => setNewServicio({ ...newServicio, price: e.target.value })}
                    placeholder="150.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-duration">Duración (min)</Label>
                  <Select
                    value={newServicio.durationMinutes.toString()}
                    onValueChange={(value) =>
                      setNewServicio({ ...newServicio, durationMinutes: Number.parseInt(value) || 30 })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selección de barbero */}
              <div className="grid gap-2">
                <Label htmlFor="barber-select">Barbero asignado</Label>
                <Select 
                  value={newServicio.selectedBarberId} 
                  onValueChange={(barberId) => setNewServicio({ ...newServicio, selectedBarberId: barberId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un barbero" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.firstName} {barber.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newServicio.selectedBarberId && (
                  <p className="text-sm text-gray-600">
                    Barbero seleccionado: <span className="font-medium">{getBarberName(newServicio.selectedBarberId)}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddServicioModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddServicio} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Agregar Servicio'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay servicios registrados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Barbero</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="font-medium">{servicio.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{servicio.description}</TableCell>
                  <TableCell>${servicio.price}</TableCell>
                  <TableCell>{servicio.durationMinutes} min</TableCell>
                  <TableCell>
                    {servicio.barberAssignments.length > 0 ? (
                      <Badge variant="default" className="text-xs">
                        {servicio.barberAssignments[0].first_name} {servicio.barberAssignments[0].last_name} ⭐
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Sin barbero
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={servicio.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {servicio.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}; 