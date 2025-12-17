import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';

// import AuthProvider from './Contexts/AuthProvider.jsx';
// import router from './routes/router.jsx'; // <-- check the case here
// import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { router } from './routes/router.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div data-theme="mytheme">
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  </StrictMode>
);
