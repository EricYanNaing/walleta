// App.jsx
import './App.css';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import useAuthStore from '@/store/useAuthStore';

function App() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  // Hide layout on public auth pages or when not logged in
  const authPages = ['/login', '/register', '/forgot-password'];
  const hideLayout = !token || authPages.includes(location.pathname);

  return (
    <section className="App">
      {!hideLayout && <Header />}
      <AppRoutes />
      {!hideLayout && <Footer />}
    </section>
  );
}

export default App;