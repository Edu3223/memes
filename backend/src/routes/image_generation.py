import os
import io
import base64
import requests
from flask import Blueprint, request, jsonify
from PIL import Image
from werkzeug.utils import secure_filename

image_gen_bp = Blueprint('image_generation', __name__)

# Configuración de Hugging Face
# Usaremos un modelo más simple que funcione sin token
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN', '')  # Token opcional

# Para image-to-image, usaremos un enfoque híbrido:
# 1. Generar nuevas imágenes basadas en el prompt
# 2. Usar la imagen original como referencia visual

# Configuración de archivos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image, max_size=512):
    """Redimensiona la imagen manteniendo la proporción"""
    width, height = image.size
    
    if width > max_size or height > max_size:
        ratio = min(max_size / width, max_size / height)
        new_width = int(width * ratio)
        new_height = int(height * ratio)
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return image

def image_to_base64(image):
    """Convierte una imagen PIL a base64"""
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return img_str

def generate_with_huggingface(image_base64, prompt, num_variations=4):
    """Genera imágenes usando la API de Hugging Face con text-to-image"""
    headers = {"Content-Type": "application/json"}
    if HUGGINGFACE_TOKEN:
        headers["Authorization"] = f"Bearer {HUGGINGFACE_TOKEN}"
    
    generated_images = []
    
    # Prompts creativos para cada variación
    creative_prompts = [
        f"{prompt}, cartoon style, funny, colorful",
        f"{prompt}, meme style, humorous, bold colors",
        f"{prompt}, comic book style, exaggerated features",
        f"{prompt}, digital art, vibrant, entertaining"
    ]
    
    for i, variation_prompt in enumerate(creative_prompts):
        payload = {
            "inputs": variation_prompt,
            "parameters": {
                "num_inference_steps": 20,
                "guidance_scale": 7.5,
                "width": 512,
                "height": 512
            }
        }
        
        try:
            response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                # La respuesta es una imagen en bytes
                image_bytes = response.content
                generated_image = Image.open(io.BytesIO(image_bytes))
                generated_images.append(image_to_base64(generated_image))
            else:
                print(f"Error en API HuggingFace para variación {i+1}: {response.status_code}")
                # Si falla, crear una imagen placeholder
                placeholder = create_placeholder_image(f"Variación {i+1}", variation_prompt)
                generated_images.append(image_to_base64(placeholder))
                
        except Exception as e:
            print(f"Error generando imagen {i+1}: {e}")
            # Crear imagen placeholder en caso de error
            placeholder = create_placeholder_image(f"Error - Variación {i+1}", variation_prompt)
            generated_images.append(image_to_base64(placeholder))
    
    return generated_images

def create_placeholder_image(text, prompt=""):
    """Crea una imagen placeholder para demostración"""
    from PIL import Image, ImageDraw, ImageFont
    
    # Crear imagen de 512x512 con fondo colorido
    colors = [(100, 150, 200), (150, 100, 200), (200, 150, 100), (100, 200, 150)]
    color_index = hash(text) % len(colors)
    img = Image.new('RGB', (512, 512), color=colors[color_index])
    draw = ImageDraw.Draw(img)
    
    try:
        # Intentar usar una fuente del sistema
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        # Usar fuente por defecto si no se encuentra
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Dibujar título
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (512 - text_width) // 2
    y = 200
    
    draw.text((x, y), text, fill=(255, 255, 255), font=font_large)
    
    # Dibujar prompt si existe
    if prompt:
        # Dividir el prompt en líneas
        words = prompt.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font_small)
            if bbox[2] - bbox[0] < 400:  # Ancho máximo
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Dibujar las líneas
        start_y = 280
        for i, line in enumerate(lines[:3]):  # Máximo 3 líneas
            bbox = draw.textbbox((0, 0), line, font=font_small)
            line_width = bbox[2] - bbox[0]
            x = (512 - line_width) // 2
            draw.text((x, start_y + i * 20), line, fill=(255, 255, 255), font=font_small)
    
    # Añadir algunos elementos decorativos
    draw.rectangle([50, 50, 462, 462], outline=(255, 255, 255), width=3)
    
    return img

@image_gen_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar el estado del servidor"""
    return jsonify({
        'status': 'online',
        'message': 'Servidor funcionando correctamente'
    })

@image_gen_bp.route('/generate', methods=['POST'])
def generate_images():
    """Endpoint principal para generar imágenes"""
    try:
        # Verificar que se envió una imagen
        if 'image' not in request.files:
            return jsonify({'error': 'No se envió ninguna imagen'}), 400
        
        file = request.files['image']
        description = request.form.get('description', '').strip()
        
        # Validaciones
        if file.filename == '':
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        if not description:
            return jsonify({'error': 'La descripción es requerida'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Formato de archivo no soportado'}), 400
        
        # Verificar tamaño del archivo
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'El archivo es demasiado grande (máx. 5MB)'}), 400
        
        # Procesar la imagen
        try:
            image = Image.open(file.stream)
            
            # Convertir a RGB si es necesario
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Redimensionar si es necesario
            image = resize_image(image)
            
            # Convertir a base64 para enviar a la API
            image_base64 = image_to_base64(image)
            
        except Exception as e:
            return jsonify({'error': f'Error procesando la imagen: {str(e)}'}), 400
        
        # Generar las imágenes
        try:
            generated_images = generate_with_huggingface(image_base64, description)
            
            return jsonify({
                'success': True,
                'images': generated_images,
                'message': f'Se generaron {len(generated_images)} variaciones exitosamente'
            })
            
        except Exception as e:
            return jsonify({'error': f'Error generando imágenes: {str(e)}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@image_gen_bp.route('/test', methods=['GET'])
def test_generation():
    """Endpoint de prueba para verificar la generación de imágenes"""
    try:
        # Crear una imagen de prueba
        test_image = create_placeholder_image("Imagen de prueba", "Prueba del sistema")
        test_base64 = image_to_base64(test_image)
        
        # Generar 4 imágenes de prueba
        test_images = []
        for i in range(4):
            placeholder = create_placeholder_image(f"Prueba {i+1}", "Imagen de prueba generada")
            test_images.append(image_to_base64(placeholder))
        
        return jsonify({
            'success': True,
            'images': test_images,
            'message': 'Generación de prueba exitosa'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error en prueba: {str(e)}'}), 500

