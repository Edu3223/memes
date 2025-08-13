import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!selectedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}
            `}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragOver ? '¡Suelta tu imagen aquí!' : 'Sube tu imagen'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta una imagen o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos soportados: JPG, PNG, WebP (máx. 5MB)
              </p>
            </div>
            
            <Button variant="outline" className="mt-4">
              <ImageIcon className="w-4 h-4 mr-2" />
              Seleccionar imagen
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={selectedImage.preview}
              alt={selectedImage.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedImage.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="ml-4 text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Quitar
            </Button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;

