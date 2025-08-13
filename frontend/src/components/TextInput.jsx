import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Sparkles, Lightbulb } from 'lucide-react';

const TextInput = ({ onTextChange, onGenerate, text, isGenerating, disabled }) => {
  const [suggestions] = useState([
    "añadir bigotes grandes y divertidos",
    "convertir en estilo cartoon",
    "añadir gafas de sol geniales",
    "hacer que parezca un superhéroe",
    "añadir sombrero de chef",
    "convertir en zombie",
    "añadir barba épica",
    "hacer que parezca un pirata"
  ]);

  const handleSuggestionClick = (suggestion) => {
    onTextChange(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !disabled && text.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Describe la modificación que quieres
        </label>
        
        <Textarea
          id="description"
          placeholder="Ej: añadir bigotes grandes y divertidos..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="min-h-[100px] resize-none"
          maxLength={200}
        />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Presiona Ctrl + Enter para generar</span>
          <span>{text.length}/200</span>
        </div>
      </div>

      {/* Sugerencias */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Lightbulb className="w-4 h-4 mr-2" />
          Ideas para probar:
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 4).map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
              className="text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Botón de generar */}
      <Button
        onClick={onGenerate}
        disabled={disabled || !text.trim()}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generando memes...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generar 4 variaciones
          </>
        )}
      </Button>
    </div>
  );
};

export default TextInput;

