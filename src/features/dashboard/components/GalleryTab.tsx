import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Plus, Trash2 } from 'lucide-react';
import type { Business } from '../types/business.type';

interface GalleryTabProps {
  business: Business;
  businessId: string;
}

export const GalleryTab = ({ business }: GalleryTabProps) => {
  const [addImageModal, setAddImageModal] = useState(false);

  const handleAddImage = () => {
    // TODO: Implementar la subida de imagen a la API
    console.log('Agregando imagen');
    setAddImageModal(false);
  };

  const handleDeleteImage = (imageId: string) => {
    // TODO: Implementar la eliminación de imagen
    console.log('Eliminando imagen:', imageId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Galería de Imágenes</CardTitle>
          <CardDescription>Administra las imágenes de tu barbería</CardDescription>
        </div>
        <Dialog open={addImageModal} onOpenChange={setAddImageModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Imagen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              <DialogDescription>Sube una nueva imagen a la galería de tu barbería</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="image-upload">Seleccionar Imagen</Label>
                <Input id="image-upload" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-description">Descripción (opcional)</Label>
                <Input id="image-description" placeholder="Descripción de la imagen" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddImageModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddImage} className="bg-blue-600 hover:bg-blue-700">
                Subir Imagen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {business.galleryImages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay imágenes en la galería</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.galleryImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{image.filename}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 