import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/components/shadcn/dialog';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Plus, Trash2 } from 'lucide-react';
import type { Business } from '../types/business.type';
import { useUploadGalleryImages } from '../hooks/useUploadGalleryImages';
import { useDeleteGalleryImage } from '../hooks/useDeleteGalleryImage';
import { useAppDispatch } from '../../../app/hooks';
import { getBusinessById } from '../store';

interface GalleryTabProps {
  business: Business;
  businessId: string;
}

export const GalleryTab = ({ business, businessId }: GalleryTabProps) => {
  const [addImageModal, setAddImageModal] = useState(false);
  const [deleteImageModal, setDeleteImageModal] = useState(false);
  const [selectedImageToDelete, setSelectedImageToDelete] = useState<{id: string, filename: string} | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  
  const { uploadImages, isUploading } = useUploadGalleryImages(businessId);
  const { deleteImage, isDeleting } = useDeleteGalleryImage();

  const handleAddImage = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    const success = await uploadImages(selectedFiles);
    
    if (success) {
      // Recargar los datos del negocio para mostrar las nuevas imágenes
      await dispatch(getBusinessById(businessId));
      
      // Limpiar y cerrar modal
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setAddImageModal(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDeleteImageClick = (imageId: string, filename: string) => {
    setSelectedImageToDelete({ id: imageId, filename });
    setDeleteImageModal(true);
  };

  const handleConfirmDeleteImage = async () => {
    if (!selectedImageToDelete) return;

    const success = await deleteImage(selectedImageToDelete.id);
    
    if (success) {
      // Recargar los datos del negocio para mostrar las imágenes actualizadas
      await dispatch(getBusinessById(businessId));
      
      // Cerrar modal y limpiar selección
      setDeleteImageModal(false);
      setSelectedImageToDelete(null);
    }
  };

  const handleCancelDeleteImage = () => {
    setDeleteImageModal(false);
    setSelectedImageToDelete(null);
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
              Agregar Imágenes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Imágenes</DialogTitle>
              <DialogDescription>Sube una o más imágenes a la galería de tu barbería</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="image-upload">Seleccionar Imágenes</Label>
                <Input 
                  ref={fileInputRef}
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange}
                />
                {selectedFiles.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedFiles.length === 1 
                      ? `1 imagen seleccionada: ${selectedFiles[0].name}`
                      : `${selectedFiles.length} imágenes seleccionadas`
                    }
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddImageModal(false);
                  setSelectedFiles([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddImage} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading 
                  ? 'Subiendo...' 
                  : selectedFiles.length === 1 
                    ? 'Subir Imagen' 
                    : 'Subir Imágenes'
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!business.galleryImages || business.galleryImages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay imágenes en la galería para este negocio aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.galleryImages.map((image) => (
              <div key={image.id} className="group">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{image.filename}</p>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="w-full mt-2"
                  onClick={() => handleDeleteImageClick(image.id, image.filename)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmación para eliminar imagen */}
        <Dialog open={deleteImageModal} onOpenChange={setDeleteImageModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Eliminar Imagen</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar la imagen "{selectedImageToDelete?.filename}"? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleCancelDeleteImage}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmDeleteImage}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 