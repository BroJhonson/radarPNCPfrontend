// frontend/src/js/config.js

// Define se estamos em ambiente de produção.
// A variável 'process.env.NODE_ENV' será substituída por "production" ou "development" pelo esbuild.
const isProduction = process.env.NODE_ENV === 'production';

// As URLs agora estão diretamente no código, não vêm mais do .env para o build.
const API_BASE_URL_PROD = "https://api.finnd.com.br/"; // URL DE PRODUÇÃO REAL
const API_BASE_URL_DEV = "http://localhost:5000";   // URL para desenvolvimento local

// O script escolhe a URL correta com base no ambiente injetado.
export const API_BASE_URL = isProduction ? API_BASE_URL_PROD : API_BASE_URL_DEV;

// console.log(`[Config] Ambiente: ${isProduction ? 'Produção' : 'Desenvolvimento'}. API URL: ${API_BASE_URL}`);
