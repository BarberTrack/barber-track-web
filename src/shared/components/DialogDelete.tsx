import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './shadcn/dialog';
import { Button } from './shadcn/button';
import { Trash2 } from 'lucide-react';
import { useDeleteBusiness } from '../../features/dashboard/hooks/useDeleteBusiness';
import { ToastAlert } from './ToastAlert';

export const DialogDelete = ({type, typeId}: {type: 'business' | 'barber' | 'service' | 'review', typeId: string}) => {
    const { deleteBusinessByIdApi } = useDeleteBusiness(typeId);

    const handleDelete = async () => {
      if (type === 'business') {
        try{
            await deleteBusinessByIdApi();
            ToastAlert.success(
                "Negocio eliminado correctamente",
                "Datos guardados"
              );
        } catch{
            ToastAlert.success(
                "Algo salio mal",
                "Intenta de nuevo"
              );
        }
      }
    };
    
    

  return (
    <>
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar {type}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Eliminar {type}</DialogTitle>
                <DialogDescription>¿Estás seguro de querer eliminar este {type}?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="destructive" onClick={handleDelete}>Eliminar {type}</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>    
    </>
)
}       
