import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { TicketProvider } from './contexts/TicketContext.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
          <RouterProvider router={router} />
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
