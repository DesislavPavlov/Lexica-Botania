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
    Component: HomePage,
  },
  {
    path: '/gallery',
    Component: GalleryPage,
  },
  {
    path: '/suggestion',
    Component: SuggestionPage,
  },
  {
    path: '/suggestion-result',
    Component: SuggestResultPage,
  },
  {
    path: '/admin',
    Component: AdminLoginPage,
  },
  {
    path: '/admin-failed',
    Component: FailedAdminLoginPage,
  },
  {
    path: '/admin-logout',
    Component: AdminLogoutPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
