import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Switch } from '../../../shared/components/shadcn/switch';
import { Plus, Edit, User, Star, Clock } from 'lucide-react';
import type{ Barber, WorkSchedule, BarberCreateRequestModel } from '../types/barber.type';
import { useCreateBarber } from '../hooks/useCreateBarber';

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
  const [isLoading, setIsLoading] = useState(false);
  const [newBarbero, setNewBarbero] = useState<BarberCreateRequestModel>({
    businessId: businessId,
    firstName: '',
    lastName: '',
    bio: '',
    specialties: [],
    workSchedule: defaultWorkSchedule,
    yearsExperience: 0,
  });
  const [specialtyInput, setSpecialtyInput] = useState('');

  const { handleCreateBarber } = useCreateBarber(businessId);

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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={barbero.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {barbero.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
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