import { ListBusiness } from '../components/ListBusiness';
import { Link } from 'react-router';
import { Button } from '../../../shared/components/shadcn/button';
import { Plus } from "lucide-react"
export const HomePage = () => {

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between">
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
