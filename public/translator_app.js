// 📦 Tutto il JavaScript dell'app è qui

const COUNTRY_CONFIGS = {
  ES: {
    name: "España",
    deepl_code: "ES",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+34",
    flag: "🇪🇸",
    output_suffix: "espana",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "euros", dólares: "euros",
      "+351": "+34", "+1": "+34"
    }
  },
  PT: {
    name: "Portugal",
    deepl_code: "PT-PT",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+351",
    flag: "🇵🇹",
    output_suffix: "portugal",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "euros", dólares: "euros",
      "+34": "+351", "+1": "+351"
    }
  },
  DE: {
    name: "Alemania",
    deepl_code: "DE",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+49",
    flag: "🇩🇪",
    output_suffix: "alemania",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "Euro", dólares: "Euro",
      "+34": "+49", "+351": "+49", "+1": "+49"
    }
  },
  PL: {
    name: "Polonia",
    deepl_code: "PL",
    currency_symbol: "zł",
    currency_name: "złoty",
    phone_format: "+48",
    flag: "🇵🇱",
    output_suffix: "polonia",
    locale_adjustments: {
      "€": "zł", EUR: "PLN", USD: "PLN", "$": "zł", euro: "złoty", euros: "złoty",
      dollars: "złoty", dólares: "złoty", "+34": "+48", "+351": "+48", "+1": "+48"
    }
  },
  LT: {
    name: "Lituania",
    deepl_code: "LT",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+370",
    flag: "🇱🇹",
    output_suffix: "lituania",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "eurai", dólares: "eurai",
      "+34": "+370", "+351": "+370", "+1": "+370"
    }
  },
  CZ: {
    name: "República Checa",
    deepl_code: "CS",
    currency_symbol: "Kč",
    currency_name: "koruna",
    phone_format: "+420",
    flag: "🇨🇿",
    output_suffix: "republica_checa",
    locale_adjustments: {
      "€": "Kč", EUR: "CZK", USD: "CZK", "$": "Kč", euro: "koruna", euros: "koruny",
      dollars: "koruny", dólares: "koruny", "+34": "+420", "+351": "+420", "+1": "+420"
    }
  },
  HU: {
    name: "Hungría",
    deepl_code: "HU",
    currency_symbol: "Ft",
    currency_name: "forint",
    phone_format: "+36",
    flag: "🇭🇺",
    output_suffix: "hungria",
    locale_adjustments: {
      "€": "Ft", EUR: "HUF", USD: "HUF", "$": "Ft", euro: "forint", euros: "forint",
      dollars: "forint", dólares: "forint", "+34": "+36", "+351": "+36", "+1": "+36"
    }
  },
  SI: {
    name: "Eslovenia",
    deepl_code: "SL",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+386",
    flag: "🇸🇮",
    output_suffix: "eslovenia",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "evri", dólares: "evri",
      "+34": "+386", "+351": "+386", "+1": "+386"
    }
  },
  SK: {
    name: "Eslovaquia",
    deepl_code: "SK",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+421",
    flag: "🇸🇰",
    output_suffix: "eslovaquia",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "eurá", dólares: "eurá",
      "+34": "+421", "+351": "+421", "+1": "+421"
    }
  },
  RO: {
    name: "Rumanía",
    deepl_code: "RO",
    currency_symbol: "lei",
    currency_name: "leu",
    phone_format: "+40",
    flag: "🇷🇴",
    output_suffix: "rumania",
    locale_adjustments: {
      "€": "lei", EUR: "RON", USD: "RON", "$": "lei", euro: "leu", euros: "lei",
      dollars: "lei", dólares: "lei", "+34": "+40", "+351": "+40", "+1": "+40"
    }
  },
  BG: {
    name: "Bulgaria",
    deepl_code: "BG",
    currency_symbol: "лв",
    currency_name: "lev",
    phone_format: "+359",
    flag: "🇧🇬",
    output_suffix: "bulgaria",
    locale_adjustments: {
      "€": "лв", EUR: "BGN", USD: "BGN", "$": "лв", euro: "лев", euros: "лева",
      dollars: "лева", dólares: "лева", "+34": "+359", "+351": "+359", "+1": "+359"
    }
  },
  EL: {
    name: "Grecia",
    deepl_code: "EL",
    currency_symbol: "€",
    currency_name: "euro",
    phone_format: "+30",
    flag: "🇬🇷",
    output_suffix: "grecia",
    locale_adjustments: {
      "€": "€", USD: "EUR", "$": "€", dollars: "ευρώ", dólares: "ευρώ",
      "+34": "+30", "+351": "+30", "+1": "+30"
    }
  }
};

let jsonData = null;
let selectedLanguage = null;
let translatedData = null;

function initializeLanguages() {
  const grid = document.getElementById("languageGrid");
  Object.entries(COUNTRY_CONFIGS).forEach(([code, config]) => {
    const option = document.createElement("div");
    option.className = "language-option";
    option.dataset.code = code;
    option.innerHTML = `
      <div class="flag">${config.flag}</div>
      <div class="country-name">${config.name}</div>
      <div class="currency-info">${config.currency_symbol} ${config.currency_name}</div>
    `;
    option.onclick = () => selectLanguage(code);
    grid.appendChild(option);
  });
}

function handleFileInput() {
  const fileInput = document.getElementById("fileInput");
  const fileUpload = document.getElementById("fileUpload");

  fileInput.addEventListener("change", e => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  });

  fileUpload.addEventListener("dragover", e => {
    e.preventDefault();
    fileUpload.classList.add("dragover");
  });

  fileUpload.addEventListener("dragleave", e => {
    e.preventDefault();
    fileUpload.classList.remove("dragover");
  });

  fileUpload.addEventListener("drop", e => {
    e.preventDefault();
    fileUpload.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  });
}

function processFile(file) {
  const fileInfo = document.getElementById("fileInfo");
  fileInfo.style.display = "block";
  if (!file.name.endsWith(".json")) {
    fileInfo.innerHTML = '<div class="status-error">❌ Solo JSON</div>';
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    try {
      jsonData = JSON.parse(e.target.result);
      fileInfo.innerHTML = `<div class="status-success">✅ Archivo cargado: ${file.name}</div>`;
      document.getElementById("step3").classList.add("active");
    } catch (err) {
      fileInfo.innerHTML = `<div class="status-error">❌ Error JSON: ${err.message}</div>`;
    }
  };
  reader.readAsText(file);
}

function selectLanguage(code) {
  selectedLanguage = code;
  document.querySelectorAll(".language-option").forEach(opt => opt.classList.remove("selected"));
  document.querySelector(`[data-code="${code}"]`).classList.add("selected");
  if (jsonData) showAnalysis();
}

function showAnalysis() {
  const config = COUNTRY_CONFIGS[selectedLanguage];
  const translatableTexts = extractTranslatableTexts(jsonData);
  document.getElementById("step4").style.display = "block";
  document.getElementById("step4").classList.add("active");
  document.getElementById("analysisContent").innerHTML = `
    <div class="status-info">🔍 ${translatableTexts.length} textos</div>
    <div class="status-info">🎯 País: ${config.name} (${config.currency_symbol})</div>`;
}

function extractTranslatableTexts(obj, path = "") {
  let texts = [];
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        texts = texts.concat(extractTranslatableTexts(item, `${path}[${index}]`));
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        texts = texts.concat(extractTranslatableTexts(value, newPath));
      });
    }
  } else if (typeof obj === "string" && obj.length > 2) {
    texts.push([path, obj]);
  }
  return texts;
}

async function startTranslation() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const config = COUNTRY_CONFIGS[selectedLanguage];
  const translatableTexts = extractTranslatableTexts(jsonData);

  const textsOnly = translatableTexts.map(([_, text]) => text);
  const translations = await translateWithBackend(textsOnly, config.deepl_code, apiKey);

  const translationMap = {};
  translatableTexts.forEach(([path, _], idx) => {
    const translated = translations[idx];
    translationMap[path] = applyCulturalAdjustments(translated, config);
  });

  translatedData = applyTranslationsToJSON(jsonData, translationMap);
  document.getElementById("downloadSection").style.display = "block";
}

function applyCulturalAdjustments(text, config) {
  let adjustedText = text;
  Object.entries(config.locale_adjustments).forEach(([original, replacement]) => {
    const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedOriginal}\\b`, "gi");
    adjustedText = adjustedText.replace(regex, replacement);
  });
  return adjustedText;
}

function applyTranslationsToJSON(obj, translationMap, path = "") {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => applyTranslationsToJSON(item, translationMap, `${path}[${index}]`));
    } else {
      const result = {};
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        result[key] = applyTranslationsToJSON(value, translationMap, newPath);
      });
      return result;
    }
  } else if (typeof obj === "string") {
    return translationMap[path] || obj;
  }
  return obj;
}

async function translateWithBackend(texts, targetLang, apiKey) {
  const response = await fetch("http://localhost:3001/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, targetLang, apiKey })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Errore traduzione");
  return data.translations;
}

function downloadTranslatedFile() {
  const config = COUNTRY_CONFIGS[selectedLanguage];
  const filename = `traducido_${config.output_suffix}.json`;
  const blob = new Blob([JSON.stringify(translatedData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function validateApiKey() {
  const apiKey = document.getElementById("apiKey").value.trim();
  document.getElementById("step2").classList.toggle("active", apiKey.length > 10);
}

function initialize() {
  document.getElementById("apiKey").addEventListener("input", validateApiKey);
  validateApiKey();
  initializeLanguages();
  handleFileInput();
  document.getElementById("startTranslation").addEventListener("click", startTranslation);
  document.getElementById("downloadBtn").addEventListener("click", downloadTranslatedFile);
}

document.addEventListener("DOMContentLoaded", initialize);
