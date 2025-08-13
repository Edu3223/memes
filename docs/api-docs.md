# Documentación de la API - Generador de Memes con IA

Esta documentación describe todos los endpoints disponibles en la API del backend.

## 🌐 URL Base

- **Desarrollo:** `http://localhost:5000`
- **Producción:** `https://tu-dominio.com`

Todos los endpoints de la API tienen el prefijo `/api/`

## 📋 Endpoints Disponibles

### 1. Health Check

Verifica el estado del servidor.

**Endpoint:** `GET /api/health`

**Respuesta exitosa:**
```json
{
  "status": "online",
  "message": "Servidor funcionando correctamente"
}
```

**Códigos de estado:**
- `200` - Servidor funcionando correctamente

**Ejemplo de uso:**
```bash
curl -X GET http://localhost:5000/api/health
```

---

### 2. Generar Imágenes

Genera 4 variaciones de memes basadas en una imagen y descripción.

**Endpoint:** `POST /api/generate`

**Content-Type:** `multipart/form-data`

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `image` | File | Sí | Archivo de imagen (JPG, PNG, WebP, máx. 5MB) |
| `description` | String | Sí | Descripción de la modificación deseada (máx. 200 caracteres) |

**Respuesta exitosa:**
```json
{
  "success": true,
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  "message": "Se generaron 4 variaciones exitosamente"
}
```

**Respuesta de error:**
```json
{
  "error": "Descripción del error"
}
```

**Códigos de estado:**
- `200` - Generación exitosa
- `400` - Error en los parámetros de entrada
- `500` - Error interno del servidor

**Ejemplo de uso con curl:**
```bash
curl -X POST http://localhost:5000/api/generate \
  -F "image=@/path/to/image.jpg" \
  -F "description=añadir bigotes grandes y divertidos"
```

**Ejemplo de uso con JavaScript:**
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('description', 'añadir bigotes grandes y divertidos');

fetch('/api/generate', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Imágenes generadas:', data.images);
  } else {
    console.error('Error:', data.error);
  }
});
```

---

### 3. Prueba de Generación

Genera imágenes de prueba para verificar el funcionamiento del sistema.

**Endpoint:** `GET /api/test`

**Respuesta exitosa:**
```json
{
  "success": true,
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  "message": "Generación de prueba exitosa"
}
```

**Códigos de estado:**
- `200` - Prueba exitosa
- `500` - Error interno del servidor

**Ejemplo de uso:**
```bash
curl -X GET http://localhost:5000/api/test
```

## 🔧 Detalles Técnicos

### Formatos de Imagen Soportados

- **Entrada:** JPG, JPEG, PNG, WebP
- **Salida:** PNG (base64 encoded)
- **Tamaño máximo:** 5MB
- **Resolución de salida:** 512x512 píxeles

### Procesamiento de Imágenes

1. **Validación:** Se verifica el formato y tamaño del archivo
2. **Conversión:** La imagen se convierte a RGB si es necesario
3. **Redimensionado:** Se ajusta a máximo 512x512 píxeles manteniendo proporción
4. **Generación:** Se crean 4 variaciones usando diferentes prompts creativos

### Prompts Creativos Utilizados

El sistema utiliza estos prompts base para generar variaciones:

1. `{descripción}, cartoon style, funny, colorful`
2. `{descripción}, meme style, humorous, bold colors`
3. `{descripción}, comic book style, exaggerated features`
4. `{descripción}, digital art, vibrant, entertaining`

### Manejo de Errores

La API maneja los siguientes tipos de errores:

#### Errores de Validación (400)
- No se envió imagen
- Archivo vacío
- Formato no soportado
- Archivo demasiado grande
- Descripción vacía o demasiado larga

#### Errores de Procesamiento (500)
- Error al procesar la imagen
- Error en la API de Hugging Face
- Error interno del servidor

### Límites y Restricciones

- **Tamaño de archivo:** Máximo 5MB
- **Longitud de descripción:** Máximo 200 caracteres
- **Tiempo de procesamiento:** 30-60 segundos por generación
- **Formatos soportados:** JPG, PNG, WebP
- **Resolución de salida:** 512x512 píxeles

## 🔐 Autenticación

Actualmente la API no requiere autenticación. Todas las rutas son públicas.

## 🚀 Rendimiento

### Tiempos de Respuesta Esperados

- **Health check:** < 100ms
- **Prueba de generación:** < 1 segundo
- **Generación real:** 30-60 segundos

### Optimizaciones

- Las imágenes se procesan en memoria para mayor velocidad
- Se utiliza compresión PNG optimizada
- Las imágenes se redimensionan automáticamente para reducir tiempo de procesamiento

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 400 | Error en los parámetros de entrada |
| 404 | Endpoint no encontrado |
| 500 | Error interno del servidor |

## 🔍 Debugging

### Headers Útiles para Debugging

```bash
# Verificar CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:5000/api/generate

# Verificar content-type
curl -H "Content-Type: multipart/form-data" \
     -X POST http://localhost:5000/api/generate
```

### Logs del Servidor

El servidor registra:
- Peticiones recibidas
- Errores de procesamiento
- Tiempos de respuesta de APIs externas
- Errores de validación

## 🌐 CORS

La API está configurada para permitir peticiones desde cualquier origen:

```python
CORS(app, origins="*")
```

En producción, considera restringir los orígenes permitidos:

```python
CORS(app, origins=["https://tu-frontend.com"])
```

## 📝 Ejemplos de Integración

### React/JavaScript

```javascript
import { generateImages } from './utils/api.js';

const handleGenerate = async (imageFile, description) => {
  try {
    const result = await generateImages(imageFile, description);
    setGeneratedImages(result.images);
  } catch (error) {
    setError(error.message);
  }
};
```

### Python

```python
import requests

def generate_memes(image_path, description):
    url = "http://localhost:5000/api/generate"
    
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'description': description}
        
        response = requests.post(url, files=files, data=data)
        
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.status_code}")
```

### cURL

```bash
# Generar memes
curl -X POST http://localhost:5000/api/generate \
  -F "image=@imagen.jpg" \
  -F "description=añadir sombrero de chef"

# Verificar salud
curl -X GET http://localhost:5000/api/health

# Prueba rápida
curl -X GET http://localhost:5000/api/test
```

## 🔄 Versionado

Actualmente la API está en la versión 1.0. Futuras versiones mantendrán compatibilidad hacia atrás.

## 📞 Soporte

Para reportar problemas con la API:

1. Verifica que estés usando los endpoints correctos
2. Revisa los códigos de estado HTTP
3. Consulta los logs del servidor
4. Crea un issue en el repositorio con detalles del problema

---

**¡La API está lista para generar memes increíbles! 🎨✨**

