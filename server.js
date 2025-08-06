const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ⭐ CLAVE: Middleware para servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON (mantiene tu funcionalidad de traducción)
app.use(express.json());

// ⭐ SOLUCIÓN al error "Cannot GET /": Ruta explícita para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ⭐ Mantén aquí tus rutas existentes de traducción
app.post('/api/translate', (req, res) => {
    // Tu lógica de traducción existente
    try {
        const { text, sourceLang, targetLang } = req.body;
        
        // Aquí va tu lógica de traducción actual
        // Por ejemplo:
        // const translatedText = tuFuncionDeTraduccion(text, sourceLang, targetLang);
        
        res.json({ 
            originalText: text,
            translatedText: "Traducción procesada", // Reemplaza con tu lógica
            sourceLang,
            targetLang
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en la traducción' });
    }
});

// Ruta catch-all para manejar rutas no encontradas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📁 Sirviendo archivos estáticos desde /public`);
});
