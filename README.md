# Generador de Memes con IA

Una aplicación web responsive que permite a los usuarios subir fotos y modificarlas según frases descriptivas usando inteligencia artificial para generar 4 variaciones únicas de memes.

## 🚀 Características

- **100% Gratuito**: Sin necesidad de pagos ni cuentas de usuario
- **Privacidad Garantizada**: No almacenamos tus imágenes ni datos personales
- **Responsive**: Funciona perfectamente en móviles y desktop
- **IA Avanzada**: Utiliza modelos de Stable Diffusion para generar imágenes
- **4 Variaciones**: Genera automáticamente 4 estilos diferentes de cada meme
- **Descarga Fácil**: Descarga individual o todas las imágenes de una vez

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de interfaz de usuario
- **Tailwind CSS** - Framework de estilos
- **Vite** - Herramienta de construcción y desarrollo
- **shadcn/ui** - Componentes de interfaz de usuario
- **Lucide Icons** - Iconografía moderna

### Backend
- **Flask** - Framework web de Python
- **Flask-CORS** - Manejo de CORS para comunicación frontend-backend
- **Pillow (PIL)** - Procesamiento de imágenes
- **Requests** - Cliente HTTP para APIs externas

### IA y APIs
- **Hugging Face Inference API** - Generación de imágenes con IA
- **Stable Diffusion v1.5** - Modelo de generación de imágenes

## 📋 Requisitos del Sistema

- **Node.js** 18+ y pnpm
- **Python** 3.8+
- **Navegador web** moderno (Chrome, Firefox, Safari, Edge)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd meme-generator
```

### 2. Configurar el Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configurar el Frontend

```bash
cd frontend
pnpm install
```

### 4. Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `backend` para configurar el token de Hugging Face (opcional pero recomendado para evitar límites de uso):

```env
HUGGINGFACE_TOKEN=tu_token_aqui
```

Para obtener un token gratuito:
1. Visita [huggingface.co](https://huggingface.co)
2. Crea una cuenta gratuita
3. Ve a Settings > Access Tokens
4. Crea un nuevo token con permisos de "Read"

## 🏃‍♂️ Ejecutar en Desarrollo

### Iniciar el Backend

```bash
cd backend
source venv/bin/activate
python src/main.py
```

El backend estará disponible en `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend
pnpm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📦 Construcción para Producción

### Construir el Frontend

```bash
cd frontend
pnpm run build
```

Los archivos estáticos se generarán en `frontend/dist/`

### Preparar para Despliegue

1. Copia los archivos de `frontend/dist/` a `backend/src/static/`
2. El backend servirá automáticamente el frontend desde la ruta raíz

```bash
cp -r frontend/dist/* backend/src/static/
```

## 🌐 Opciones de Despliegue

### Opción 1: Despliegue Full-Stack (Recomendado)

**Plataformas compatibles:**
- [Railway](https://railway.app) - Gratuito con límites generosos
- [Render](https://render.com) - Plan gratuito disponible
- [Heroku](https://heroku.com) - Plan gratuito limitado

**Pasos:**
1. Construye el frontend: `cd frontend && pnpm run build`
2. Copia archivos estáticos: `cp -r frontend/dist/* backend/src/static/`
3. Despliega la carpeta `backend/` en tu plataforma elegida
4. Configura la variable de entorno `HUGGINGFACE_TOKEN` (opcional)

### Opción 2: Despliegue Separado

**Frontend (Estático):**
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)

**Backend:**
- [Railway](https://railway.app)
- [Render](https://render.com)
- [PythonAnywhere](https://pythonanywhere.com)

**Configuración adicional:**
- Actualiza la URL del backend en `frontend/src/utils/api.js`
- Configura CORS en el backend para permitir tu dominio frontend

## 🔧 Configuración Avanzada

### Personalizar Prompts de IA

Edita los prompts creativos en `backend/src/routes/image_generation.py`:

```python
creative_prompts = [
    f"{prompt}, cartoon style, funny, colorful",
    f"{prompt}, meme style, humorous, bold colors",
    f"{prompt}, comic book style, exaggerated features",
    f"{prompt}, digital art, vibrant, entertaining"
]
```

### Ajustar Límites de Archivo

Modifica las constantes en `backend/src/routes/image_generation.py`:

```python
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
```

### Personalizar Estilos

Los estilos se pueden modificar en:
- `frontend/src/App.css` - Estilos globales
- `frontend/tailwind.config.js` - Configuración de Tailwind

## 🐛 Solución de Problemas

### El backend no responde
- Verifica que Flask esté ejecutándose en `http://localhost:5000`
- Revisa los logs en la terminal del backend
- Asegúrate de que todas las dependencias estén instaladas

### Error de CORS
- Verifica que Flask-CORS esté instalado y configurado
- Revisa que el frontend esté haciendo peticiones a la URL correcta

### Imágenes no se generan
- Verifica tu conexión a internet
- Revisa si tienes configurado el token de Hugging Face
- Comprueba los logs del backend para errores de API

### Problemas de rendimiento
- La generación de imágenes puede tomar 30-60 segundos
- Considera usar un token de Hugging Face para mejor rendimiento
- Verifica que tu servidor tenga suficiente memoria RAM

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de solución de problemas
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🙏 Agradecimientos

- [Hugging Face](https://huggingface.co) por proporcionar APIs gratuitas de IA
- [Stability AI](https://stability.ai) por el modelo Stable Diffusion
- [React](https://reactjs.org) y [Tailwind CSS](https://tailwindcss.com) por las herramientas de desarrollo
- [Flask](https://flask.palletsprojects.com) por el framework backend

---

**¡Disfruta creando memes únicos con IA! 🎨✨**

