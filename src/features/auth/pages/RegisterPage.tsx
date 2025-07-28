import { ModeToggle } from "@/shared/components/Mode-toggle"
import { RegisterForm } from "../components/register-form"

export const RegisterPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full flex justify-end">
        <ModeToggle />
      </div>      
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  )
} 