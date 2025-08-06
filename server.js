const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS
app.use(cors());

// ⭐ CLAVE: Middleware para servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// ⭐ SOLUCIÓN al error "Cannot GET /": Ruta explícita para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔁 Función de espera para reintentos
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🔁 Función robusta con retry para DeepL
async function translateChunkWithRetry(apiKey, texts, targetLang, retries = 3) {
    const params = new URLSearchParams();
    params.append('auth_key', apiKey);
    params.append('target_lang', targetLang);
    params.append('preserve_formatting', '1');
    params.append('split_sentences', '0');
    
    texts.forEach(text => params.append('text', text));

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 Intento ${attempt} para ${texts.length} textos`);
            
            const response = await axios.post(
                'https://api-free.deepl.com/v2/translate', 
                params,
                {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            console.log(`✅ Traducción exitosa en intento ${attempt}`);
            return response.data.translations.map(t => t.text);
            
        } catch (error) {
            const isRateLimit = error.response?.status === 429;
            const isServerError = error.response?.status >= 500;
            const shouldRetry = (isRateLimit || isServerError) && attempt < retries;

            console.warn(`⚠️ Error intento ${attempt}:`, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });

            if (shouldRetry) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
                console.log(`⏳ Esperando ${waitTime}ms antes del siguiente intento...`);
                await sleep(waitTime);
            } else {
                throw error;
            }
        }
    }
}

// 🔀 Función para dividir en chunks
function chunkArray(array, chunkSize) {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
    }
    return results;
}

// 📥 ENDPOINT PRINCIPAL DE TRADUCCIÓN - ¡AQUÍ ESTÁ LA MAGIA!
app.post('/api/translate', async (req, res) => {
    try {
        console.log('🚀 Nueva solicitud de traducción recibida');
        const { apiKey, texts, targetLang } = req.body;

        // Validación básica
        if (!apiKey || !Array.isArray(texts) || !targetLang) {
            console.error('❌ Parámetros faltantes:', { 
                hasApiKey: !!apiKey, 
                isTextsArray: Array.isArray(texts), 
                hasTargetLang: !!targetLang 
            });
            return res.status(400).json({ 
                error: 'Faltan parámetros requeridos: apiKey, texts, targetLang' 
            });
        }

        if (texts.length === 0) {
            console.log('ℹ️ Array de textos vacío, devolviendo array vacío');
            return res.json({ translations: [] });
        }

        console.log(`📝 Traduciendo ${texts.length} textos a ${targetLang}`);
        console.log('📋 Primeros 3 textos:', texts.slice(0, 3));

        // Procesar en chunks de 40 (límite recomendado para DeepL)
        const CHUNK_SIZE = 40;
        const textChunks = chunkArray(texts, CHUNK_SIZE);
        const allTranslations = [];

        console.log(`📦 Dividido en ${textChunks.length} chunks de máximo ${CHUNK_SIZE} textos`);

        for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];
            console.log(`📦 Procesando chunk ${i + 1}/${textChunks.length} (${chunk.length} textos)`);
            
            const translations = await translateChunkWithRetry(apiKey, chunk, targetLang);
            allTranslations.push(...translations);
            
            // Pequeña pausa entre chunks para ser amigable con la API
            if (i < textChunks.length - 1) {
                console.log('⏳ Pausa de 500ms entre chunks...');
                await sleep(500);
            }
        }

        console.log(`✅ Traducción completada: ${allTranslations.length} textos traducidos`);
        console.log('📋 Primeras 3 traducciones:', allTranslations.slice(0, 3));

        res.json({ 
            translations: allTranslations,
            originalCount: texts.length,
            translatedCount: allTranslations.length,
            targetLanguage: targetLang
        });

    } catch (error) {
        console.error('❌ Error en endpoint de traducción:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || 'Error interno del servidor';
        
        res.status(statusCode).json({
            error: 'Error en la traducción',
            details: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
});

// 🏥 Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// 📊 Status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        service: 'JSON Translator',
        version: '1.0.0',
        port: PORT
    });
});

// Ruta catch-all para manejar rutas no encontradas (debe ir al final)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 ==========================================');
    console.log('🚀 TRADUCTOR JSON INICIADO EXITOSAMENTE');
    console.log('🎉 ==========================================');
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📁 Archivos estáticos: /public`);
    console.log(`📡 API traducción: http://localhost:${PORT}/api/translate`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log('🎉 ==========================================');
});
