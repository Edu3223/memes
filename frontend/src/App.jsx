import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Sparkles, Github, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader.jsx';
import TextInput from './components/TextInput.jsx';
import ImageGallery from './components/ImageGallery.jsx';
import { generateImages, validateImageFile, checkServerStatus, base64ToUrl, cleanupBlobUrls } from './utils/api.js';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  // Verificar estado del servidor al cargar
  useEffect(() => {
    const checkStatus = async () => {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
    };
    
    checkStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Limpiar URLs de blob al desmontar
  useEffect(() => {
    return () => {
      if (generatedImages.length > 0) {
        const urls = generatedImages.map(img => img.url);
        cleanupBlobUrls(urls);
      }
    };
  }, [generatedImages]);

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
    setError(null);
  };

  const handleTextChange = (text) => {
    setDescription(text);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !description.trim()) {
      setError('Por favor, sube una imagen y describe la modificación que quieres.');
      return;
    }

    try {
      // Validar archivo
      validateImageFile(selectedImage.file);
      
      setIsGenerating(true);
      setError(null);
      
      // Limpiar imágenes anteriores
      if (generatedImages.length > 0) {
        const urls = generatedImages.map(img => img.url);
        cleanupBlobUrls(urls);
        setGeneratedImages([]);
      }

      // Generar imágenes
      const result = await generateImages(selectedImage.file, description);
      
      // Convertir las imágenes base64 a URLs de blob
      const imageUrls = result.images.map((base64Image, index) => ({
        url: base64ToUrl(base64Image),
        id: `generated-${Date.now()}-${index}`
      }));

      setGeneratedImages(imageUrls);
      
    } catch (error) {
      console.error('Error al generar imágenes:', error);
      setError(error.message || 'Error al generar las imágenes. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearResults = () => {
    if (generatedImages.length > 0) {
      const urls = generatedImages.map(img => img.url);
      cleanupBlobUrls(urls);
    }
    setGeneratedImages([]);
    setError(null);
  };

  const canGenerate = selectedImage && description.trim() && !isGenerating && serverStatus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Generador de Memes con IA</h1>
                <p className="text-sm text-muted-foreground">Transforma tus fotos con inteligencia artificial</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {serverStatus !== null && (
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                  serverStatus 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {serverStatus ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>Online</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Estado del servidor */}
        {serverStatus === false && (
          <Alert className="max-w-2xl mx-auto border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              El servidor está temporalmente fuera de línea. Por favor, inténtalo más tarde.
            </AlertDescription>
          </Alert>
        )}

        {/* Error general */}
        {error && (
          <Alert className="max-w-2xl mx-auto border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sección de carga */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Crea memes únicos en segundos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sube tu imagen, describe cómo quieres modificarla, y nuestra IA generará 4 variaciones divertidas para ti.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Subir imagen */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Sube tu imagen</h3>
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Describe la modificación</h3>
              <TextInput
                onTextChange={handleTextChange}
                onGenerate={handleGenerate}
                text={description}
                isGenerating={isGenerating}
                disabled={!selectedImage || !serverStatus}
              />
            </div>
          </div>
        </section>

        {/* Resultados */}
        {(isGenerating || generatedImages.length > 0) && (
          <section className="space-y-6">
            <ImageGallery
              images={generatedImages}
              isLoading={isGenerating}
              onClear={handleClearResults}
            />
          </section>
        )}

        {/* Información adicional */}
        {!isGenerating && generatedImages.length === 0 && (
          <section className="max-w-2xl mx-auto space-y-6 text-center">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-1">Sube tu foto</h4>
                <p className="text-sm text-muted-foreground">JPG, PNG o WebP hasta 5MB</p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-1">Describe el cambio</h4>
                <p className="text-sm text-muted-foreground">Sé específico y creativo</p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-1">Descarga tus memes</h4>
                <p className="text-sm text-muted-foreground">4 variaciones únicas</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>usando React, Tailwind CSS y IA</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>100% gratuito • Sin registro • Privacidad garantizada</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

