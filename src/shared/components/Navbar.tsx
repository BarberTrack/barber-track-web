import { useNavigate } from 'react-router';
import { Button } from './shadcn/button';
import { ArrowLeft, LogOut, Scissors } from 'lucide-react';

interface NavbarProps {
  showBackButton?: boolean;
  title?: string;
}

export const Navbar = ({ showBackButton = true, title }: NavbarProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('barbertrack_user');
    
    // Navegar a la página de login o home
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Lado izquierdo - Botón de regresar y título */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Inicio
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title || 'BarberTrack'}
            </h1>
          </div>
        </div>

        {/* Lado derecho - Botón de cerrar sesión */}
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
  );
}; 