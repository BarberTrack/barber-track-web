import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/shadcn/button"
import { Card, CardContent } from "@/shared/components/shadcn/card"
import { Input } from "@/shared/components/shadcn/input"
import { Label } from "@/shared/components/shadcn/label"
import { useNavigate } from "react-router"
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { register, isRegistering, registerSuccess, error, clearAuthError, clearRegisterSuccessState } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      clearAuthError();
      clearRegisterSuccessState();
    };
  }, [clearAuthError, clearRegisterSuccessState]);

  // Manejar el éxito del registro
  useEffect(() => {
    if (registerSuccess) {
      toast.success('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
    }
  }, [registerSuccess, navigate]);

  // Mostrar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    // Validación de contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
      return;
    }

    // Validación de teléfono (formato básico)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Por favor ingresa un teléfono válido (ej: +34612345678)');
      return;
    }

    try {
      await register(formData);
    } catch (error) {
      // El error se maneja en el useEffect
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crear cuenta</h1>
                <p className="text-muted-foreground text-balance">
                  Únete a BarberTrack hoy mismo
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"    
                    type="text"
                    placeholder="Juan"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"    
                    type="text"
                    placeholder="Pérez"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"    
                  type="email"
                  placeholder="juan@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"    
                  type="tel"
                  placeholder="+34612345678"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>

              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <button 
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Inicia sesión
                </button>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/playstore.png"
              alt="BarberTrack App"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 