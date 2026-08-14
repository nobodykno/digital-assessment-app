import './config/env';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/auth-context.tsx';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/error-boundary/error-boundary.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
