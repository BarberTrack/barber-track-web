import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/shadcn/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/shadcn/table';
import { Plus, Edit, Image, Upload, Trash2 } from 'lucide-react';
import type{ Service } from '../types/services.type';
import type { Barber } from '../types/barber.type';

import { useCreateService } from '../hooks/useCreateService';
import { useUpdateService } from '../hooks/useUpdateService';
import { useServiceImage } from '../hooks/useServiceImage';
import { DialogDelete } from '@/shared/components/DialogDelete';
import { ToastAlert } from '@/shared/components/ToastAlert';

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
  const [editServicioModal, setEditServicioModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string>('');
  const [viewImageModal, setViewImageModal] = useState(false);
  const [uploadImageModal, setUploadImageModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newServicio, setNewServicio] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    selectedBarberId: ''
  });
  const [editServicio, setEditServicio] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    selectedBarberId: ''
  });
  //console.log(services);
  const { createService, isCreating } = useCreateService();
  const { updateService, isUpdating } = useUpdateService();
  const { uploadServiceImage, deleteServiceImage, isUploading, isDeleting } = useServiceImage();

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

  const handleEditServicio = (servicio: Service) => {
    // Find the assigned barber
    const assignedBarber = servicio.barberAssignments.length > 0 
      ? servicio.barberAssignments[0] 
      : null;

    setEditServicio({
      name: servicio.name,
      description: servicio.description,
      price: servicio.price,
      durationMinutes: servicio.durationMinutes,
      selectedBarberId: assignedBarber ? assignedBarber.barberId : ''
    });
    setEditingServiceId(servicio.id);
    setEditServicioModal(true);
  };

  const handleUpdateServicio = async () => {
    if (!editServicio.name || !editServicio.description || !editServicio.price || !editServicio.selectedBarberId) {
      alert('Por favor completa todos los campos y selecciona un barbero');
      return;
    }

    try {
      const servicePrice = Number.parseFloat(editServicio.price);
      
      await updateService(editingServiceId, {
        name: editServicio.name,
        description: editServicio.description,
        price: servicePrice,
        durationMinutes: editServicio.durationMinutes,
        barberAssignments: [{
          barberId: editServicio.selectedBarberId,
          specialPrice: servicePrice, // Mismo precio que el servicio
          isPreferred: true // Siempre true
        }]
      });

      // Limpiar formulario y cerrar modal
      setEditServicioModal(false);
      setEditingServiceId('');
      setEditServicio({
        name: '',
        description: '',
        price: '',
        durationMinutes: 30,
        selectedBarberId: ''
      });
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
    }
  };

  const handleViewImage = (service: Service) => {
    setSelectedService(service);
    setViewImageModal(true);
  };

  const handleUploadImage = (service: Service) => {
    setSelectedService(service);
    setUploadImageModal(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedService) {
      try {
        await uploadServiceImage(selectedService.id, file, businessId);
        setUploadImageModal(false);
        setSelectedService(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        ToastAlert.success('Imagen subida', 'La imagen se ha subido correctamente');
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (selectedService) {
      try {
        await deleteServiceImage(selectedService.id, businessId);
        setViewImageModal(false);
        setSelectedService(null);
        ToastAlert.success('Imagen eliminada', 'La imagen se ha eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
      }
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

        {/* Modal de Editar Servicio */}
        <Dialog open={editServicioModal} onOpenChange={setEditServicioModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Servicio</DialogTitle>
              <DialogDescription>Modifica la información del servicio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-service-name">Nombre del Servicio</Label>
                <Input
                  id="edit-service-name"
                  value={editServicio.name}
                  onChange={(e) => setEditServicio({ ...editServicio, name: e.target.value })}
                  placeholder="Ej: Corte de cabello"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-service-description">Descripción</Label>
                <Textarea
                  id="edit-service-description"
                  value={editServicio.description}
                  onChange={(e) => setEditServicio({ ...editServicio, description: e.target.value })}
                  placeholder="Descripción detallada del servicio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-service-price">Precio ($)</Label>
                  <Input
                    id="edit-service-price"
                    type="number"
                    step="0.01"
                    value={editServicio.price}
                    onChange={(e) => setEditServicio({ ...editServicio, price: e.target.value })}
                    placeholder="150.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-service-duration">Duración (min)</Label>
                  <Select
                    value={editServicio.durationMinutes.toString()}
                    onValueChange={(value) =>
                      setEditServicio({ ...editServicio, durationMinutes: Number.parseInt(value) || 30 })
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
                <Label htmlFor="edit-barber-select">Barbero asignado</Label>
                <Select 
                  value={editServicio.selectedBarberId} 
                  onValueChange={(barberId) => setEditServicio({ ...editServicio, selectedBarberId: barberId })}
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
                {editServicio.selectedBarberId && (
                  <p className="text-sm text-gray-600">
                    Barbero seleccionado: <span className="font-medium">{getBarberName(editServicio.selectedBarberId)}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditServicioModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateServicio} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar Servicio'}
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
                <TableHead>Imagen</TableHead>
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
                      {servicio.imageUrl ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewImage(servicio)}
                        >
                          <Image className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUploadImage(servicio)}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditServicio(servicio)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <DialogDelete type="servicio" typeId={servicio.id} businessId={businessId} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Modal para ver imagen del servicio */}
      <Dialog open={viewImageModal} onOpenChange={setViewImageModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Imagen del Servicio</DialogTitle>
            <DialogDescription>
              {selectedService?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedService?.imageUrl && (
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={selectedService.imageUrl} 
                alt={selectedService.name}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
              <Button 
                variant="destructive" 
                onClick={handleDeleteImage}
                disabled={isDeleting}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Eliminando...' : 'Eliminar Imagen'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para subir imagen del servicio */}
      <Dialog open={uploadImageModal} onOpenChange={setUploadImageModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Imagen al Servicio</DialogTitle>
            <DialogDescription>
              Selecciona una imagen para {selectedService?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service-image">Seleccionar imagen</Label>
              <Input
                id="service-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setUploadImageModal(false);
                setSelectedService(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 