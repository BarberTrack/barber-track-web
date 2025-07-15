import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Edit, Phone, Mail, MapPin } from 'lucide-react';
import type { Business } from '../types/business.type';

interface BusinessInfoTabProps {
  business: Business;
  businessId: string;
}

export const BusinessInfoTab = ({ business }: BusinessInfoTabProps) => {
  const [editInfoModal, setEditInfoModal] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: business.name,
    description: business.description,
    phone: business.phone,
    email: business.email,
    address: business.address,
  });

  const handleSaveChanges = () => {
    // TODO: Implementar la llamada a la API para actualizar la información
    console.log('Actualizando información:', editedInfo);
    setEditInfoModal(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Información de la Barbería</CardTitle>
          <CardDescription>Administra la información básica de tu barbería</CardDescription>
        </div>
        <Dialog open={editInfoModal} onOpenChange={setEditInfoModal}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Información</DialogTitle>
              <DialogDescription>Actualiza la información de tu barbería</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editedInfo.description}
                  onChange={(e) => setEditedInfo({ ...editedInfo, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input
                  id="edit-address"
                  value={editedInfo.address}
                  onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editedInfo.email}
                  onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditInfoModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white-100">Nombre</Label>
            <p className="text-white-100">{business.name}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white-100">Teléfono</Label>
            <p className="text-white-100 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              {business.phone}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white-100">Email</Label>
            <p className="text-white-100 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              {business.email}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white-100">Dirección</Label>
            <p className="text-white-100 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              {business.address}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white-100">Descripción</Label>
          <p className="text-white-100">{business.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}; 