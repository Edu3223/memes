import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Download, Eye, X, Loader2 } from 'lucide-react';

const ImageGallery = ({ images, isLoading, onClear }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadingIndex, setDownloadingIndex] = useState(null);

  const handleDownload = async (image, index) => {
    setDownloadingIndex(index);
    
    try {
      // Crear un enlace temporal para descargar la imagen
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `meme-generado-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handlePreview = (image) => {
    setSelectedImage(image);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Generando tus memes...</h3>
          <p className="text-muted-foreground">
            Esto puede tomar entre 30-60 segundos. ¡La magia está sucediendo!
          </p>
          
          {/* Barra de progreso animada */}
          <div className="w-full max-w-md mx-auto">
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{
                animation: 'progress 3s ease-in-out infinite'
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Tus memes generados</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={`Meme generado ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                  onClick={() => handlePreview(image)}
                />
                
                {/* Overlay con botones */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePreview(image)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleDownload(image, index)}
                      disabled={downloadingIndex === index}
                      className="bg-primary/90 hover:bg-primary"
                    >
                      {downloadingIndex === index ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Información de la imagen */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variación {index + 1}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(image, index)}
                    disabled={downloadingIndex === index}
                    className="h-8"
                  >
                    {downloadingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <Download className="w-3 h-3 mr-1" />
                    )}
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para descargar todas */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              images.forEach((image, index) => {
                setTimeout(() => handleDownload(image, index), index * 500);
              });
            }}
            className="w-full max-w-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar todas las imágenes
          </Button>
        </div>
      </div>

      {/* Modal de preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage.url}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <Button
              variant="secondary"
              size="sm"
              onClick={closePreview}
              className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
};

export default ImageGallery;

