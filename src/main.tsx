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
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { store } from "./app/store";
import { configureApiClient } from './shared/utils/configureApiClient';
import { HomePage } from "./features/home/pages/HomePage";
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { CreateBusinessPage } from './features/createBusiness/page/CreateBusinessPage';
import { Toaster } from './shared/components/shadcn/sonner';
import { AppointmentPage } from './features/appointments/pages/AppointmentPage';
import { Analytics_page } from './features/analytics/page/Analytics_page';
import { Promotions_page } from './features/promotions/pages/Promotions_page';  
import { MLpage } from './features/ml/pages/MLpage';
import { Stats_page } from './features/stats/page/Stats_page';
configureApiClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
  },
  {
    path: "/appointments/:businessId",
    element: <AppointmentPage/>
  },
  {
    path: "/analytics/:businessId",
    element: <Analytics_page/>
  },
  {
    path: "/promotions/:businessId",
    element: <Promotions_page/>
  },
  { 
    path: "/machine-learning/:businessId",
    element: <MLpage/>
  },
  {
    path: "/stats/:businessId",
    element: <Stats_page/>
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
