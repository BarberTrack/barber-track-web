import { ListBusiness } from '../components/ListBusiness';
import { Link } from 'react-router';
import { Button } from '../../../shared/components/shadcn/button';
import { Plus } from "lucide-react"
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LogOut, Scissors } from 'lucide-react';


export const HomePage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <main className="min-h-screen">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">


            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Mis barberías
              </h1>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </nav>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between p-4 m-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2">Mis Barberías</h2>
          <p className="text-gray-200">Administra todas tus barberías desde un solo lugar</p>
        </div>
        <div className='flex justify-end'>
          <Link to="/create-business">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Negocio
            </Button>
          </Link>
        </div>
      </div>
      <ListBusiness />
    </main>
  )
}
