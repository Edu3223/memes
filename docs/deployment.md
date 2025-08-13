# Guía de Despliegue - Generador de Memes con IA

Esta guía te ayudará a desplegar tu aplicación de generación de memes en diferentes plataformas de hosting gratuitas.

## 🎯 Opciones de Despliegue

### Opción 1: Despliegue Full-Stack en Railway (Recomendado)

Railway es una plataforma moderna que ofrece despliegue gratuito con límites generosos.

#### Pasos para Railway:

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   pnpm run build
   cp -r dist/* ../backend/src/static/
   cd ../backend
   ```

2. **Crear cuenta en Railway:**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

3. **Desplegar:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio
   - Railway detectará automáticamente que es un proyecto Python

4. **Configurar variables de entorno:**
   - En el dashboard de Railway, ve a "Variables"
   - Añade `HUGGINGFACE_TOKEN` con tu token (opcional)

5. **Configurar el comando de inicio:**
   - En "Settings" > "Deploy", configura:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python src/main.py`

### Opción 2: Despliegue Full-Stack en Render

Render ofrece hosting gratuito con algunas limitaciones.

#### Pasos para Render:

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   pnpm run build
   cp -r dist/* ../backend/src/static/
   cd ../backend
   ```

2. **Crear cuenta en Render:**
   - Ve a [render.com](https://render.com)
   - Regístrate con GitHub

3. **Crear Web Service:**
   - Haz clic en "New" > "Web Service"
   - Conecta tu repositorio de GitHub
   - Configura:
     - Name: `meme-generator`
     - Environment: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python src/main.py`
     - Root Directory: `backend`

4. **Configurar variables de entorno:**
   - En "Environment", añade `HUGGINGFACE_TOKEN`

### Opción 3: Despliegue Separado

#### Frontend en Netlify

1. **Construir el frontend:**
   ```bash
   cd frontend
   pnpm run build
   ```

2. **Desplegar en Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist/` al área de despliegue
   - O conecta tu repositorio de GitHub

3. **Configurar redirects:**
   Crea `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

#### Backend en PythonAnywhere

1. **Crear cuenta gratuita:**
   - Ve a [pythonanywhere.com](https://pythonanywhere.com)
   - Regístrate para una cuenta gratuita

2. **Subir código:**
   - Usa Git o sube archivos manualmente
   - Instala dependencias: `pip3.10 install --user -r requirements.txt`

3. **Configurar Web App:**
   - Ve a "Web" > "Add a new web app"
   - Selecciona Flask
   - Configura el archivo WSGI

4. **Actualizar frontend:**
   - Cambia la URL del backend en `frontend/src/utils/api.js`
   - Reconstruye y redespliega el frontend

## 🔧 Configuración Específica por Plataforma

### Railway

**Archivo `railway.toml` (opcional):**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python src/main.py"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Render

**Archivo `render.yaml` (opcional):**
```yaml
services:
  - type: web
    name: meme-generator
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python src/main.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Heroku

**Archivo `Procfile`:**
```
web: python src/main.py
```

**Archivo `runtime.txt`:**
```
python-3.11.0
```

## 🌍 Variables de Entorno

### Variables Requeridas

- `PORT` - Puerto del servidor (automático en la mayoría de plataformas)

### Variables Opcionales

- `HUGGINGFACE_TOKEN` - Token de API de Hugging Face para mejor rendimiento
- `FLASK_ENV` - Entorno de Flask (`production` para producción)

### Obtener Token de Hugging Face

1. Ve a [huggingface.co](https://huggingface.co)
2. Crea una cuenta gratuita
3. Ve a Settings > Access Tokens
4. Crea un token con permisos "Read"
5. Copia el token y úsalo como variable de entorno

## 🚀 Optimizaciones para Producción

### 1. Configurar Flask para Producción

En `backend/src/main.py`, modifica:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
```

### 2. Optimizar el Frontend

```bash
cd frontend
pnpm run build
```

### 3. Comprimir Imágenes

Añade compresión en el backend:

```python
# En image_generation.py
def compress_image(image, quality=85):
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG', quality=quality, optimize=True)
    return buffer.getvalue()
```

### 4. Caché de Respuestas

Implementa caché para mejorar rendimiento:

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.cached(timeout=300)
def cached_generation():
    # Lógica de generación
    pass
```

## 🔍 Verificación del Despliegue

### Checklist Post-Despliegue

- [ ] La aplicación carga correctamente
- [ ] El endpoint `/api/health` responde
- [ ] Se pueden subir imágenes
- [ ] La generación de imágenes funciona
- [ ] Las descargas funcionan
- [ ] El diseño es responsive
- [ ] No hay errores en la consola del navegador

### URLs de Prueba

- **Salud del servidor:** `https://tu-app.com/api/health`
- **Prueba de generación:** `https://tu-app.com/api/test`
- **Aplicación principal:** `https://tu-app.com/`

## 🐛 Solución de Problemas Comunes

### Error 500 en Producción

1. Revisa los logs del servidor
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que las variables de entorno estén configuradas

### Problemas de CORS

1. Verifica que Flask-CORS esté instalado
2. Asegúrate de que el frontend use la URL correcta del backend
3. Revisa la configuración de CORS en `main.py`

### Timeouts en Generación

1. Aumenta el timeout del servidor
2. Considera usar un token de Hugging Face
3. Implementa un sistema de cola para peticiones largas

### Problemas de Memoria

1. Optimiza el procesamiento de imágenes
2. Implementa límites de tamaño de archivo más estrictos
3. Considera usar un servidor con más RAM

## 📊 Monitoreo y Mantenimiento

### Logs Importantes

- Errores de generación de imágenes
- Timeouts de API
- Errores de subida de archivos
- Uso de memoria y CPU

### Métricas a Monitorear

- Tiempo de respuesta de la API
- Tasa de éxito de generación
- Uso de ancho de banda
- Número de usuarios activos

### Actualizaciones

1. Mantén las dependencias actualizadas
2. Revisa regularmente los logs de errores
3. Actualiza los modelos de IA cuando estén disponibles
4. Optimiza el rendimiento basado en métricas

## 🎉 ¡Felicidades!

Tu aplicación de generación de memes con IA está ahora desplegada y lista para usar. Los usuarios pueden:

- Subir sus fotos
- Generar memes únicos con IA
- Descargar sus creaciones
- Disfrutar de una experiencia completamente gratuita

¡Comparte tu aplicación y disfruta viendo las creaciones de tus usuarios! 🎨✨

