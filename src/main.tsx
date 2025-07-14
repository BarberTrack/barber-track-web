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
import { HomePage } from "./features/home/pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
