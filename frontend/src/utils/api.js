// Configuración de la API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com' // Cambiar por la URL real del backend
  : 'http://localhost:5000';

// Función para generar imágenes
export const generateImages = async (imageFile, description) => {
  try {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', description);

    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al generar las imágenes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en generateImages:', error);
    throw error;
  }
};

// Función para verificar el estado del servidor
export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Error al verificar el estado del servidor:', error);
    return false;
  }
};

// Función para convertir base64 a blob URL (para mostrar imágenes)
export const base64ToUrl = (base64String) => {
  try {
    // Remover el prefijo data:image/...;base64, si existe
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convertir base64 a bytes
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error al convertir base64 a URL:', error);
    return null;
  }
};

// Función para limpiar URLs de blob (liberar memoria)
export const cleanupBlobUrls = (urls) => {
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};

// Función para validar el archivo de imagen
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagen no soportado. Usa JPG, PNG o WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB.');
  }

  return true;
};

// Función para redimensionar imagen si es necesario
export const resizeImageIfNeeded = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar la imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a blob
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

