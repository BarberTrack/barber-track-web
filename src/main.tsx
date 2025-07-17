import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { Provider } from 'react-redux';
import './index.css'
import { ThemeProvider } from "./core/theme/components/theme-provider"
import { AuthPage } from "@/features/auth/pages/AuthPage"
import { store } from "./app/store";
import { configureApiClient } from './shared/utils/configureApiClient';
import { HomePage } from "./features/home/pages/HomePage";
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { CreateBusinessPage } from './features/createBusiness/page/CreateBusinessPage';
import { Toaster } from './shared/components/shadcn/sonner';

// Configurar apiClient al inicio de la aplicación
configureApiClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/dashboard/:businessId",
    element: <DashboardPage/>
  },
  {
    path: "/create-business",
    element: <CreateBusinessPage/>
  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors/>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
