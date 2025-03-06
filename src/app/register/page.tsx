'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Categorías de intereses disponibles
const CATEGORIAS_INTERESES = [
  'Ciencia', 'Moda', 'Recetas', 'Arte', 'Diseño', 'Bienestar',
  'Internacional', 'Tecnología', 'Belleza', 'Deportes', 'Política', 'Economía',
  'Cultura', 'Música', 'Cine'
];

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [intereses, setIntereses] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: datos personales, 2: intereses
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

  const toggleInteres = (interes: string) => {
    if (intereses.includes(interes)) {
      setIntereses(intereses.filter(i => i !== interes));
    } else {
      setIntereses([...intereses, interes]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validar datos del primer paso de forma más permisiva
      if (username.trim() === '') {
        setError('Por favor ingresa un nombre de usuario');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      
      setError('');
      setStep(2);
      return;
    }
    
    // Procesar el registro completo
    setLoading(true);
    
    // Simulación de registro (aceptando cualquier dato)
    setTimeout(() => {
      console.log('Registro completado:', {
        username,
        password,
        intereses
      });
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({ 
        username, 
        intereses,
        isLoggedIn: true
      }));
      
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  const handleSkipInterests = () => {
    setLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        username, 
        intereses: [],
        isLoggedIn: true
      }));
      
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'
    } transition-colors duration-300`}>
      {/* Header con botones de navegación */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 shadow-sm px-4 py-3 flex justify-between items-center md:px-6 lg:px-8">
        <button 
          onClick={() => router.push('/')}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-amber-100'
          }`}
          aria-label="Volver a inicio"
        >
          ←
        </button>
        
        <h1 className="text-xl font-bold flex items-center">
          <span className="mr-2">Registro</span>
          <span className="text-amber-500">NotiApp</span>
        </h1>
        
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-amber-100'
          }`}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Paso {step} de 2
            </span>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {step === 1 ? 'Datos básicos' : 'Personalización'}
            </span>
          </div>
          <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Título de la sección */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {step === 1 ? 'Crea tu cuenta' : 'Personaliza tu experiencia'}
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {step === 1 
              ? 'Ingresa tus datos para comenzar a disfrutar de NotiApp' 
              : 'Selecciona tus temas de interés para personalizar tu feed de noticias'}
          </p>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className={`${
            theme === 'dark' ? 'bg-red-900 border-red-800' : 'bg-red-100 border-red-400'
          } border text-red-700 px-4 py-3 rounded relative mb-4`} role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {step === 1 ? (
          /* Paso 1: Datos de usuario */
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl p-6 shadow-lg`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Ingresa tu nombre de usuario"
                />
              </div>
              
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Crea una contraseña"
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
              
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark' 
                      ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 focus:ring-offset-gray-800' 
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                  }`}
                >
                  Continuar
                </button>
              </div>
            </form>

            <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              ¿Ya tienes una cuenta?{' '}
              <button 
                onClick={() => router.push('/login')}
                className={`font-medium hover:underline ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`}
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        ) : (
          /* Paso 2: Selección de intereses */
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl p-6 shadow-lg`}>
            <div className="mb-6">
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Selecciona tus temas favoritos
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Elige los temas que te interesan para personalizar tu experiencia.
                {intereses.length > 0 && ` Has seleccionado ${intereses.length} ${intereses.length === 1 ? 'tema' : 'temas'}.`}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {CATEGORIAS_INTERESES.map((interes) => (
                <button
                  key={interes}
                  type="button"
                  onClick={() => toggleInteres(interes)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    intereses.includes(interes)
                      ? theme === 'dark'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {interes}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSkipInterests}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Omitir este paso
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading 
                    ? 'bg-amber-400 cursor-not-allowed' 
                    : theme === 'dark'
                      ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 focus:ring-offset-gray-800'
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Completando registro...
                  </div>
                ) : (
                  'Completar registro'
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } mt-auto`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2023 NotiApp. Todos los derechos reservados.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className={`text-xs hover:underline ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Términos de servicio</a>
            <a href="#" className={`text-xs hover:underline ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Política de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 