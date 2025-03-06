'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Credenciales falsas para demostración
const DEMO_USERS = [
  { email: 'usuario@ejemplo.com', password: 'password123', name: 'Usuario Demo' },
  { email: 'admin@notiapp.com', password: 'admin123', name: 'Administrador' },
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Efecto para detectar el tema del sistema y cargar el tema guardado
  useEffect(() => {
    // Intentar obtener el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme as 'dark' | 'light');
    } else {
      // Si no hay tema guardado, detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Efecto para aplicar el tema
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de verificación de credenciales
    setTimeout(() => {
      const user = DEMO_USERS.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // Guardar información del usuario en localStorage (solo para demo)
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify({ email: user.email, name: user.name }));
        }
        
        // Simulación de inicio de sesión exitoso
        setLoading(false);
        router.push('/');
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
        setLoading(false);
      }
    }, 1500); // Simular tiempo de carga
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_USERS[0].email);
    setPassword(DEMO_USERS[0].password);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'
    }`}>
      {/* Botón de tema */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-amber-100 hover:bg-amber-200'
        }`}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Botón para volver */}
      <button 
        onClick={() => router.push('/')}
        className={`absolute top-4 left-4 p-2 rounded-full ${
          theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-amber-100 hover:bg-amber-200'
        }`}
        aria-label="Volver a inicio"
      >
        ←
      </button>

      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">NotiApp</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Correo electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`h-4 w-4 rounded border-gray-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-amber-600 focus:ring-amber-500' 
                    : 'text-amber-600 focus:ring-amber-500'
                }`}
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={`font-medium hover:underline ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading 
                  ? 'bg-amber-400 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
              } ${theme === 'dark' ? 'focus:ring-offset-gray-800' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'}`}>
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 focus:ring-offset-gray-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } focus:ring-amber-500`}
            >
              G
            </button>
            <button
              type="button"
              className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 focus:ring-offset-gray-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } focus:ring-amber-500`}
            >
              f
            </button>
            <button
              type="button"
              className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 focus:ring-offset-gray-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } focus:ring-amber-500`}
            >
              in
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className={`text-sm font-medium hover:underline ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            Usar credenciales de demostración
          </button>
        </div>

        <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          ¿No tienes una cuenta?{' '}
          <a href="#" className={`font-medium hover:underline ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          }`}>
            Regístrate ahora
          </a>
        </div>
      </div>

      <div className={`mt-8 text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>© 2023 NotiApp. Todos los derechos reservados.</p>
        <div className="mt-2">
          <a href="#" className="hover:underline mx-2">Términos de servicio</a>
          <a href="#" className="hover:underline mx-2">Política de privacidad</a>
          <a href="#" className="hover:underline mx-2">Contacto</a>
        </div>
      </div>
    </div>
  );
} 