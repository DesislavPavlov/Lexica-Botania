import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import SuggestionPage from './pages/SuggestionPage';
import SuggestResultPage from './pages/SuggestResultPage';
import AdminLoginPage from './pages/AdminLoginPage';
import FailedAdminLoginPage from './pages/FailedAdminLoginPage';
import AdminLogoutPage from './pages/AdminLogoutPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
  },
  {
    path: '/suggestion',
    element: <SuggestionPage />,
  },
  {
    path: '/suggestion-result',
    element: <SuggestResultPage />,
  },
  {
    path: '/admin',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin-failed',
    element: <FailedAdminLoginPage />,
  },
  {
    path: '/admin-logout',
    element: <AdminLogoutPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
