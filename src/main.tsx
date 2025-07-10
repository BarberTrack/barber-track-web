import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './index.css'
import { ThemeProvider } from "./core/theme/components/theme-provider"
import { AuthPage } from "@/features/auth/pages/AuthPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
