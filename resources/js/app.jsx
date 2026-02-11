import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './AppComponent';

createRoot(document.getElementById('app')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
