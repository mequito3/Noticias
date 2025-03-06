'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';

// Definición de tipos para los artículos de noticias
interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Definición de tipos para la respuesta de la API
interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Usar la API Key directamente (en producción debería usar variables de entorno)
const API_KEY = "56a1e7cf6f97466d833ca132eb515af8";

// Endpoint directo (puede tener problemas de CORS)
const API_URL = `https://newsapi.org/v2/everything?q=tesla&from=2025-02-06&sortBy=publishedAt&apiKey=56a1e7cf6f97466d833ca132eb515af8
`;

export default function Home() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detectar preferencia de tema del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme as 'dark' | 'light');
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    fetchNews();
  }, []);

  // Efecto para guardar el tema en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Aplicar clase al elemento html para estilos globales
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Efecto para el slider automático
  useEffect(() => {
    if (news.length > 0 && !showModal) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === news.slice(0, 5).length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news, showModal]);

  // Efecto para cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Efecto para bloquear el scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Efecto para enfocar el input de búsqueda cuando se abre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Efecto para filtrar noticias cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNews(news);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = news.filter(article => 
      article.title.toLowerCase().includes(query) || 
      (article.description && article.description.toLowerCase().includes(query)) ||
      (article.content && article.content.toLowerCase().includes(query))
    );
    
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  const fetchNews = async () => {
    try {
      console.log("Obteniendo noticias desde:", API_URL);
      
      const response = await fetch(API_URL);
      const data: NewsApiResponse = await response.json();
      
      console.log("Respuesta de la API:", data);
      
      if (data.status === "ok" && data.articles && data.articles.length > 0) {
        // Filtrar artículos que tienen imagen para el slider
        const articlesWithImages = data.articles.filter(article => article.urlToImage);
        setNews(data.articles);
        setFilteredNews(data.articles);
      } else {
        setError("No se encontraron noticias disponibles.");
      }
    } catch (error: any) {
      console.error('Error al obtener noticias:', error);
      setError('Error al cargar las noticias. Por favor, verifica tu conexión a internet o inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const openArticleDetail = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = () => {
    // Redireccionar a la página de login
    router.push('/login');
  };

  const handleRegister = () => {
    // Redireccionar a la página de registro
    router.push('/register');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simular búsqueda con un pequeño retraso para mostrar el efecto
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Formatear fecha para mostrar en formato legible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener solo artículos con imágenes para el slider
  const sliderArticles = filteredNews.filter(article => article.urlToImage).slice(0, 5);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'} transition-colors duration-300`}>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 shadow-sm px-4 py-3 flex justify-between items-center mb-4 md:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-4">NotiApp</h1>
          
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar noticias..."
                  className={`border rounded-l-lg py-1.5 pl-8 pr-3 focus:outline-none focus:ring-2 w-full md:w-64 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:ring-amber-500' : 'bg-white border-gray-300 focus:ring-amber-300'
                  }`}
                />
                <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-sm">
                  🔍
                </span>
                {isSearching && (
                  <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </div>
              <button 
                type="button" 
                onClick={toggleSearch}
                className={`ml-2 px-2 py-1.5 rounded ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ✕
              </button>
            </form>
          ) : (
            <button 
              onClick={toggleSearch} 
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-amber-100'
              }`}
              aria-label="Buscar"
            >
              🔍
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-amber-100'
            }`}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleRegister}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-amber-400 hover:bg-gray-700 border border-amber-600' 
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              } transition-colors flex items-center`}
            >
              <span className="mr-1">👤</span>
              <span className="hidden sm:inline">Registrarse</span>
            </button>
            
            <button 
              onClick={handleLogin}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-amber-400 text-amber-900 hover:bg-amber-500'
              } transition-colors flex items-center`}
            >
              <span className="mr-1">🔐</span>
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </header>
      
      {loading ? (
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-4 text-center mx-4`}>
          <p className="font-bold">Cargando noticias...</p>
          <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden mt-2`}>
            <div className="h-full bg-amber-500 animate-pulse" style={{ width: "50%" }}></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <p className={`text-red-500 mb-2`}>{error}</p>
          <button 
            onClick={fetchNews}
            className={`mt-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-400 hover:bg-amber-500'
            }`}
          >
            Reintentar
          </button>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">No se encontraron resultados</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            No hay noticias que coincidan con "{searchQuery}"
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-400 hover:bg-amber-500'
            }`}
          >
            Ver todas las noticias
          </button>
        </div>
      ) : (
        <div className="px-4 md:px-6 lg:px-8">
          {/* Slider de noticias */}
          {sliderArticles.length > 0 && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-lg shadow-md" ref={sliderRef} style={{ height: '200px' }}>
                <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {sliderArticles.map((article, index) => (
                    <div key={index} className="min-w-full h-full relative flex-shrink-0">
                      <img 
                        src={article.urlToImage || ''} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white font-bold text-sm line-clamp-2">{article.title}</h3>
                        <p className="text-white text-xs opacity-80 mt-1">{article.source.name}</p>
                      </div>
                      <button 
                        onClick={() => openArticleDetail(article)} 
                        className="absolute inset-0 w-full h-full cursor-pointer" 
                        aria-label={article.title}
                      ></button>
                    </div>
                  ))}
                </div>
                
                {/* Indicadores del slider */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  {sliderArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                      aria-label={`Ir a la diapositiva ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Botones de navegación */}
                <button 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => setCurrentSlide(prev => (prev === 0 ? sliderArticles.length - 1 : prev - 1))}
                  aria-label="Anterior"
                >
                  ←
                </button>
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => setCurrentSlide(prev => (prev === sliderArticles.length - 1 ? 0 : prev + 1))}
                  aria-label="Siguiente"
                >
                  →
                </button>
              </div>
            </div>
          )}

          {/* Tarjetas de noticias */}
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
              {searchQuery ? `Resultados para "${searchQuery}"` : "Últimas Noticias"}
            </h2>
            {searchQuery && (
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredNews.length} {filteredNews.length === 1 ? 'resultado' : 'resultados'}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {filteredNews.map((article, index) => (
              <div 
                key={index} 
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } rounded-lg shadow-md p-4 border cursor-pointer hover:shadow-lg transition-all duration-300`}
                onClick={() => openArticleDetail(article)}
              >
                <div className="flex flex-row">
                  <div className="flex-1">
                    <p className="font-semibold">{article.title}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mt-1`}>
                      {article.description || 'Sin descripción disponible'}
                    </p>
                    <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(article.publishedAt).toLocaleDateString('es-ES')} • {article.source.name}
                    </div>
                    <button className={`${theme === 'dark' ? 'text-amber-400' : 'text-blue-500'} text-sm mt-2 hover:underline`}>
                      Ver más
                    </button>
                  </div>
                  {article.urlToImage ? (
                    <div className="ml-4 w-20 h-20 flex-shrink-0">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className={`ml-4 w-20 h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex-shrink-0 flex items-center justify-center rounded`}>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sin imagen</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalle de noticia */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            ref={modalRef}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
          >
            {/* Cabecera del modal */}
            <div className="relative">
              {selectedArticle.urlToImage ? (
                <img 
                  src={selectedArticle.urlToImage} 
                  alt={selectedArticle.title} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className={`w-full h-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center rounded-t-lg`}>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No hay imagen disponible</span>
                </div>
              )}
              <button 
                onClick={closeModal}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-5">
              <h2 className="text-xl font-bold mb-2">{selectedArticle.title}</h2>
              
              <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                <span className="mr-2">{formatDate(selectedArticle.publishedAt)}</span>
                <span>•</span>
                <span className="ml-2 font-medium">{selectedArticle.source.name}</span>
              </div>
              
              {selectedArticle.author && (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                  <span className="font-medium">Autor:</span> {selectedArticle.author}
                </p>
              )}
              
              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>
              
              <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                {selectedArticle.description || 'Sin descripción disponible'}
              </p>
              
              {selectedArticle.content && (
                <div className="mb-4">
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedArticle.content.replace(/\[\+\d+ chars\]$/, '')}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button 
                  onClick={closeModal}
                  className={`px-4 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } rounded-lg`}
                >
                  Cerrar
                </button>
                <a 
                  href={selectedArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-4 py-2 ${
                    theme === 'dark' 
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  } rounded-lg`}
                >
                  Leer artículo completo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}