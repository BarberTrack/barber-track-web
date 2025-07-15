import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Plus, Edit, User, Star } from 'lucide-react';
import type{ Barber } from '../types/barber.type';

interface BarbersTabProps {
  barbers: Barber[];
  businessId: string;
}

export const BarbersTab = ({ barbers }: BarbersTabProps) => {
  const [addBarberoModal, setAddBarberoModal] = useState(false);
  const [newBarbero, setNewBarbero] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    specialties: '',
    yearsExperience: 0,
  });

  const handleAddBarbero = () => {
    // TODO: Implementar la llamada a la API para agregar barbero
    console.log('Agregando barbero:', newBarbero);
    setAddBarberoModal(false);
    setNewBarbero({
      firstName: '',
      lastName: '',
      bio: '',
      specialties: '',
      yearsExperience: 0,
    });
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Barbero</DialogTitle>
              <DialogDescription>Completa la información del nuevo barbero</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={newBarbero.firstName}
                    onChange={(e) => setNewBarbero({ ...newBarbero, firstName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={newBarbero.lastName}
                    onChange={(e) => setNewBarbero({ ...newBarbero, lastName: e.target.value })}
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
                <Label htmlFor="specialties">Especialidades</Label>
                <Input
                  id="specialties"
                  value={newBarbero.specialties}
                  onChange={(e) => setNewBarbero({ ...newBarbero, specialties: e.target.value })}
                  placeholder="Corte clásico, Barba, Peinados (separado por comas)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Años de Experiencia</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newBarbero.yearsExperience}
                  onChange={(e) =>
                    setNewBarbero({ ...newBarbero, yearsExperience: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddBarberoModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddBarbero} className="bg-blue-600 hover:bg-blue-700">
                Agregar Barbero
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {barbers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay barberos registrados</p>
            </div>
          ) : (
            barbers.map((barbero) => (
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
                      <p className="text-gray-600 text-sm">{barbero.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {barbero.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{barbero.yearsExperience} años de experiencia</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {barbero.ratingAverage} ({barbero.totalReviews} reseñas)
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