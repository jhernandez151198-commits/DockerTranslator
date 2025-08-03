const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🔁 Attendi per i retry
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// 🔁 Funzione robusta con retry
async function translateChunkWithRetry(apiKey, texts, targetLang, retries = 3) {
  const params = new URLSearchParams();
  params.append('auth_key', apiKey);
  params.append('target_lang', targetLang);
  texts.forEach(text => params.append('text', text));

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post('https://api-free.deepl.com/v2/translate', params);
      return response.data.translations.map(t => t.text);
    } catch (error) {
      const isTemporary = error.response?.data?.message === 'Temporary Error';
      const status = error.response?.status;

      console.warn(`⚠️ DeepL error attempt ${attempt}:`, error.response?.data || error.message);

      if (isTemporary && attempt < retries) {
        const waitTime = 1000 * attempt;
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
      } else {
        throw error;
      }
    }
  }
}

// 🔀 Dividi in blocchi
function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

// 📥 POST /translate
app.post('/translate', async (req, res) => {
  const { apiKey, texts, targetLang } = req.body;

  if (!apiKey || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const CHUNK_SIZE = 40;
  const textChunks = chunkArray(texts, CHUNK_SIZE);
  const allTranslations = [];

  try {
    for (const chunk of textChunks) {
      const translations = await translateChunkWithRetry(apiKey, chunk, targetLang);
      allTranslations.push(...translations);
    }

    res.json({ translations: allTranslations });
  } catch (error) {
    console.error('❌ DeepL API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Errore da DeepL',
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server backend in ascolto su http://localhost:${PORT}`);
});