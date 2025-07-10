import { ThemeProvider } from "./core/theme/components/theme-provider"
import { AuthPage } from "@/features/auth/pages/AuthPage"
function App() {

  return (
    <>
        <ThemeProvider>
          <AuthPage />
        </ThemeProvider>
    </>
  )
}

export default App
