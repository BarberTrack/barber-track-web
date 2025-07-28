import { ListBusiness } from '../components/ListBusiness';
import { Link } from 'react-router';
import { Button } from '../../../shared/components/shadcn/button';
import { Plus } from "lucide-react"
import { Navbar } from '../../../shared/components';


export const HomePage = () => {
  return (
    <main className="min-h-screen">
      <Navbar
        variant="dashboard"
        title="Mis Barberías"
        subtitle="Administra todas tus barberías desde un solo lugar"
        showBackButton={false}
        showLogout={true}
      />
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
