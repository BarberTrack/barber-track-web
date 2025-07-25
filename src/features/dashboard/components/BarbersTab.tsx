import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Switch } from '../../../shared/components/shadcn/switch';
import { Plus, Edit, User, Star, Clock, Upload, Image, Trash2 } from 'lucide-react';
import type{ Barber, WorkSchedule, BarberCreateRequestModel, BarberUpdateRequestModel } from '../types/barber.type';
import { useCreateBarber } from '../hooks/useCreateBarber';
import { useUpdateBarber } from '../hooks/useUpdateBarber';
import { useBarberPortfolio } from '../hooks/useBarberPortfolio';
import { useDeletePortfolioImage } from '../hooks/useDeletePortfolioImage';
import { DialogDelete } from '@/shared/components/DialogDelete';
import businessServices from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';

interface BarbersTabProps {
  barbers: Barber[];
  businessId: string;
}

const defaultWorkSchedule: WorkSchedule = {
  monday: { start: "09:00", end: "18:00" },
  tuesday: { start: "09:00", end: "18:00" },
  wednesday: { start: "09:00", end: "18:00" },
  thursday: { start: "09:00", end: "18:00" },
  friday: { start: "09:00", end: "18:00" },
  saturday: { start: "09:00", end: "16:00" },
  sunday: { off: true }
};

export const BarbersTab = ({ barbers, businessId }: BarbersTabProps) => {
 
  const [addBarberoModal, setAddBarberoModal] = useState(false);
  const [editBarberoModal, setEditBarberoModal] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newBarbero, setNewBarbero] = useState<BarberCreateRequestModel>({
    businessId: businessId,
    firstName: '',
    lastName: '',
    bio: '',
    specialties: [],
    workSchedule: defaultWorkSchedule,
    yearsExperience: 0,
  });
  const [editBarbero, setEditBarbero] = useState<BarberUpdateRequestModel>({
    firstName: '',
    lastName: '',
    bio: '',
    specialties: [],
    workSchedule: defaultWorkSchedule,
    yearsExperience: 0,
    isActive: true,
  });
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [editSpecialtyInput, setEditSpecialtyInput] = useState('');
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [selectedBarberForPortfolio, setSelectedBarberForPortfolio] = useState<Barber | null>(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedBarberForSchedule, setSelectedBarberForSchedule] = useState<Barber | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleCreateBarber } = useCreateBarber(businessId);
  const { handleUpdateBarber } = useUpdateBarber(businessId);
  const { portfolioImages, isLoading: isLoadingPortfolio, fetchPortfolio, setPortfolioImages } = useBarberPortfolio(selectedBarberForPortfolio?.id || null);
  const { deletePortfolioImage, isDeleting } = useDeletePortfolioImage();
    
  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !newBarbero.specialties.includes(specialtyInput.trim())) {
      setNewBarbero({
        ...newBarbero,
        specialties: [...newBarbero.specialties, specialtyInput.trim()]
      });
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setNewBarbero({
      ...newBarbero,
      specialties: newBarbero.specialties.filter((_, i) => i !== index)
    });
  };

  const handleAddEditSpecialty = () => {
    if (editSpecialtyInput.trim() && !editBarbero.specialties.includes(editSpecialtyInput.trim())) {
      setEditBarbero({
        ...editBarbero,
        specialties: [...editBarbero.specialties, editSpecialtyInput.trim()]
      });
      setEditSpecialtyInput('');
    }
  };

  const handleRemoveEditSpecialty = (index: number) => {
    setEditBarbero({
      ...editBarbero,
      specialties: editBarbero.specialties.filter((_, i) => i !== index)
    });
  };

  const handleWorkScheduleChange = (day: keyof WorkSchedule, field: 'start' | 'end', value: string) => {
    setNewBarbero({
      ...newBarbero,
      workSchedule: {
        ...newBarbero.workSchedule,
        [day]: {
          ...newBarbero.workSchedule[day],
          [field]: value
        }
      }
    });
  };

  const handleEditWorkScheduleChange = (day: keyof WorkSchedule, field: 'start' | 'end', value: string) => {
    setEditBarbero({
      ...editBarbero,
      workSchedule: {
        ...editBarbero.workSchedule,
        [day]: {
          ...editBarbero.workSchedule[day],
          [field]: value
        }
      }
    });
  };

  const handleDayToggle = (day: keyof WorkSchedule, isClosed: boolean) => {
    setNewBarbero({
      ...newBarbero,
      workSchedule: {
        ...newBarbero.workSchedule,
        [day]: isClosed 
          ? { off: true }
          : { start: "09:00", end: "18:00" }
      }
    });
  };

  const handleEditDayToggle = (day: keyof WorkSchedule, isClosed: boolean) => {
    setEditBarbero({
      ...editBarbero,
      workSchedule: {
        ...editBarbero.workSchedule,
        [day]: isClosed 
          ? { off: true }
          : { start: "09:00", end: "18:00" }
      }
    });
  };

  const handleSubmit = async () => {
    if (!newBarbero.firstName.trim() || !newBarbero.lastName.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await handleCreateBarber(newBarbero);
      setAddBarberoModal(false);
      setNewBarbero({
        businessId: businessId,
        firstName: '',
        lastName: '',
        bio: '',
        specialties: [],
        workSchedule: defaultWorkSchedule,
        yearsExperience: 0,
      });
      setSpecialtyInput('');
    } catch (error) {
     
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedBarber || !editBarbero.firstName.trim() || !editBarbero.lastName.trim()) {
      return;
    }
    
    setIsUpdating(true);
    try {
      await handleUpdateBarber(selectedBarber.id, editBarbero);
      setEditBarberoModal(false);
      setSelectedBarber(null);
      setEditBarbero({
        firstName: '',
        lastName: '',
        bio: '',
        specialties: [],
        workSchedule: defaultWorkSchedule,
        yearsExperience: 0,
        isActive: true,
      });
      setEditSpecialtyInput('');
    } catch (error) {
     
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setEditBarbero({
      firstName: barber.firstName,
      lastName: barber.lastName,
      bio: barber.bio,
      specialties: [...barber.specialties],
      workSchedule: { ...barber.workSchedule },
      yearsExperience: barber.yearsExperience,
      isActive: barber.isActive,
    });
    setEditBarberoModal(true);
  };

  const handleUploadPortfolioImages = (barber: Barber) => {
    setSelectedBarberForPortfolio(barber);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedBarberForPortfolio) return;

    const fileArray = Array.from(files);
    
    try {
      await businessServices.uploadBarberPortfolioImages(selectedBarberForPortfolio.id, fileArray);
      
      ToastAlert.success(
        fileArray.length === 1 ? "Imagen subida correctamente" : "Imágenes subidas correctamente",
        "Portafolio actualizado"
      );
      
      // Refrescar el portafolio
      await fetchPortfolio(selectedBarberForPortfolio.id);
    } catch (error: any) {
      console.error('Error al subir imágenes del portafolio:', error);
      ToastAlert.error(
        "Error al subir imágenes",
        error?.message || "Intenta de nuevo"
      );
    }
    
    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewPortfolio = (barber: Barber) => {
    setSelectedBarberForPortfolio(barber);
    setPortfolioModal(true);
  };

  const handleViewSchedule = (barber: Barber) => {
    setSelectedBarberForSchedule(barber);
    setScheduleModal(true);
  };

  const handleDeletePortfolioImage = async (imageId: string) => {
    const success = await deletePortfolioImage(imageId);
    if (success && selectedBarberForPortfolio) {
      // Remover la imagen del estado local
      setPortfolioImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes', 
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Barberos</CardTitle>
          <CardDescription>Administra el equipo de barberos de tu negocio</CardDescription>
        </div>
        <Dialog open={addBarberoModal} onOpenChange={setAddBarberoModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Barbero
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Barbero</DialogTitle>
              <DialogDescription>Completa la información del nuevo barbero</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={newBarbero.firstName}
                      onChange={(e) => setNewBarbero({ ...newBarbero, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={newBarbero.lastName}
                      onChange={(e) => setNewBarbero({ ...newBarbero, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={newBarbero.bio}
                    onChange={(e) => setNewBarbero({ ...newBarbero, bio: e.target.value })}
                    placeholder="Descripción del barbero y sus especialidades"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Años de Experiencia</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={newBarbero.yearsExperience}
                    onChange={(e) =>
                      setNewBarbero({ ...newBarbero, yearsExperience: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {/* Especialidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Especialidades</h3>
                <div className="flex gap-2">
                  <Input
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="Agregar especialidad"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                  />
                  <Button type="button" onClick={handleAddSpecialty} variant="outline">
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newBarbero.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveSpecialty(index)}
                    >
                      {specialty} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Horario de Trabajo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horario de Trabajo
                </h3>
                <div className="space-y-3">
                  {Object.entries(newBarbero.workSchedule).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-20 text-sm font-medium">
                          {dayNames[day as keyof typeof dayNames]}
                        </span>
                        <Switch
                          checked={!('off' in schedule)}
                          onCheckedChange={(checked) => handleDayToggle(day as keyof WorkSchedule, !checked)}
                        />
                      </div>
                      {!('off' in schedule) && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => handleWorkScheduleChange(day as keyof WorkSchedule, 'start', e.target.value)}
                            className="w-24"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleWorkScheduleChange(day as keyof WorkSchedule, 'end', e.target.value)}
                            className="w-24"
                          />
                        </div>
                      )}
                      {('off' in schedule) && (
                        <span className="text-gray-500 text-sm">Cerrado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddBarberoModal(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !newBarbero.firstName.trim() || !newBarbero.lastName.trim()}
              >
                {isLoading ? 'Creando...' : 'Agregar Barbero'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* Input oculto para subir imágenes del portafolio */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Modal de Edición */}
      <Dialog open={editBarberoModal} onOpenChange={setEditBarberoModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Barbero</DialogTitle>
            <DialogDescription>Modifica la información del barbero</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editFirstName">Nombre *</Label>
                  <Input
                    id="editFirstName"
                    value={editBarbero.firstName}
                    onChange={(e) => setEditBarbero({ ...editBarbero, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editLastName">Apellido *</Label>
                  <Input
                    id="editLastName"
                    value={editBarbero.lastName}
                    onChange={(e) => setEditBarbero({ ...editBarbero, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBio">Biografía</Label>
                <Textarea
                  id="editBio"
                  value={editBarbero.bio}
                  onChange={(e) => setEditBarbero({ ...editBarbero, bio: e.target.value })}
                  placeholder="Descripción del barbero y sus especialidades"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editExperience">Años de Experiencia</Label>
                <Input
                  id="editExperience"
                  type="number"
                  min="0"
                  value={editBarbero.yearsExperience}
                  onChange={(e) =>
                    setEditBarbero({ ...editBarbero, yearsExperience: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="editIsActive">Estado Activo</Label>
                  <Switch
                    id="editIsActive"
                    checked={editBarbero.isActive}
                    onCheckedChange={(checked) => setEditBarbero({ ...editBarbero, isActive: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Especialidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Especialidades</h3>
              <div className="flex gap-2">
                <Input
                  value={editSpecialtyInput}
                  onChange={(e) => setEditSpecialtyInput(e.target.value)}
                  placeholder="Agregar especialidad"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEditSpecialty()}
                />
                <Button type="button" onClick={handleAddEditSpecialty} variant="outline">
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editBarbero.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveEditSpecialty(index)}
                  >
                    {specialty} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Horario de Trabajo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horario de Trabajo
              </h3>
              <div className="space-y-3">
                {Object.entries(editBarbero.workSchedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-sm font-medium">
                        {dayNames[day as keyof typeof dayNames]}
                      </span>
                      <Switch
                        checked={!('off' in schedule)}
                        onCheckedChange={(checked) => handleEditDayToggle(day as keyof WorkSchedule, !checked)}
                      />
                    </div>
                    {!('off' in schedule) && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleEditWorkScheduleChange(day as keyof WorkSchedule, 'start', e.target.value)}
                          className="w-24"
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleEditWorkScheduleChange(day as keyof WorkSchedule, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    )}
                    {('off' in schedule) && (
                      <span className="text-gray-500 text-sm">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditBarberoModal(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating || !editBarbero.firstName.trim() || !editBarbero.lastName.trim()}
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar Barbero'}
            </Button>
          </div>
        </DialogContent>
              </Dialog>

      {/* Modal del Portafolio */}
      <Dialog open={portfolioModal} onOpenChange={setPortfolioModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Portafolio de {selectedBarberForPortfolio?.firstName} {selectedBarberForPortfolio?.lastName}
            </DialogTitle>
            <DialogDescription>
              Galería de trabajos del barbero
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingPortfolio ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando portafolio...</p>
              </div>
            ) : portfolioImages && portfolioImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div className="relative aspect-square">
                      <img
                        src={image.url}
                        alt={`Trabajo del portafolio`}
                        className="w-full h-full object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg'; // Imagen de respaldo
                        }}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePortfolioImage(image.id)}
                      disabled={isDeleting}
                      className="w-full"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay imágenes en el portafolio</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Horarios */}
      <Dialog open={scheduleModal} onOpenChange={setScheduleModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de {selectedBarberForSchedule?.firstName} {selectedBarberForSchedule?.lastName}
            </DialogTitle>
            <DialogDescription>
              Horario de trabajo del barbero
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBarberForSchedule && (
              <div className="space-y-3">
                {Object.entries(selectedBarberForSchedule.workSchedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium">
                        {dayNames[day as keyof typeof dayNames]}
                      </span>
                    </div>
                    <div className="text-sm">
                      {('off' in schedule) ? (
                        <span className="text-gray-500 font-medium">Cerrado</span>
                      ) : (
                        <span className="text-gray-700 font-medium">
                          {schedule.start} - {schedule.end}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CardContent>
        <div className="grid gap-4">
          {!barbers || !Array.isArray(barbers) || barbers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay barberos registrados</p>
            </div>
          ) : (
            barbers
              .filter(barbero => 
                barbero && 
                typeof barbero === 'object' && 
                barbero.firstName && 
                barbero.lastName &&
                barbero.id
              )
              .map((barbero) => (
              <Card key={barbero.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {barbero.firstName} {barbero.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">{barbero.bio || ''}</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(barbero.specialties) && barbero.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{barbero.yearsExperience || 0} años de experiencia</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {barbero.ratingAverage || '0'} ({barbero.totalReviews || 0} reseñas)
                        </div>
                        <div className="flex items-center">
                          <Image className="w-4 h-4 mr-1 text-blue-600" />
                          {barbero.portfolioImages?.length || 0} imágenes
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={barbero.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {barbero.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewSchedule(barbero)}
                      title="Ver horarios"
                    >
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewPortfolio(barbero)}
                      title="Ver portafolio"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUploadPortfolioImages(barbero)}
                      title="Agregar imagen al portafolio"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditBarber(barbero)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DialogDelete type="barbero" typeId={barbero.id} businessId={businessId} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 