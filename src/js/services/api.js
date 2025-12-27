// frontend/src/js/services/api.js
// Serviço centralizado para todas as chamadas de API
// Garante consistência e facilita manutenção

import { API_BASE_URL } from '../config.js';

/**
 * Classe para gerenciar todas as chamadas de API
 * Centraliza tratamento de erros, headers e formatação
 */
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Método genérico para fazer requisições HTTP
     * @param {string} endpoint - Endpoint da API (sem /api/)
     * @param {Object} options - Opções do fetch (method, body, headers, etc)
     * @returns {Promise<Response>}
     */
    async request(endpoint, options = {}) {
        // Garante que a URL base não tenha barra no final e o endpoint comece com /
        const baseUrl = this.baseUrl.replace(/\/$/, ''); // Remove barra final se existir
        const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${baseUrl}${endpointPath}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // Adiciona token de autenticação se existir (para futuras implementações)
        const token = this.getAuthToken();
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {}),
            },
        };

        try {
            const response = await fetch(url, config);
            
            // Tenta parsear JSON, mas não falha se não for JSON
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // Cria um erro estruturado com informações da resposta
                const error = new Error(data.erro || data.mensagem || `Erro ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            // Se já é um erro nosso, relança
            if (error.status) {
                throw error;
            }
            // Erro de rede ou parsing
            throw new Error(`Erro de conexão: ${error.message}`);
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== void 0 && value !== "") {
                if (Array.isArray(value)) {
                    // CORREÇÃO: Junta o array com vírgulas para o Flask
                    // Antes: value.forEach((v) => queryString.append(key, v)); -> gera ?uf=SP&uf=RJ (Errado para este backend)
                    // Agora: gera ?uf=SP,RJ (Correto)
                    if (value.length > 0) {
                        queryString.append(key, value.join(','));
                    }
                } else {
                    queryString.append(key, value);
                }
            }
        });
        
        const url = queryString.toString() ? `${endpoint}?${queryString.toString()}` : endpoint;
        return this.request(url, {
            method: "GET"
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Obtém token de autenticação (para futuras implementações)
     */
    getAuthToken() {
        // Implementar quando necessário (Firebase Auth, etc)
        return null;
    }

    // ============================================
    // MÉTODOS ESPECÍFICOS DA API
    // ============================================

    /**
     * Busca licitações com filtros
     * @param {Object} filters - Objeto com filtros de busca
     * @returns {Promise<Object>} Resposta da API com licitações e paginação
     */
    async buscarLicitacoes(filters = {}) {
        return this.get('/api/licitacoes', filters);
    }

    /**
     * Busca detalhes de uma licitação específica
     * @param {string} numeroControlePNCP - Número de controle PNCP
     * @returns {Promise<Object>} Dados completos da licitação com itens e arquivos
     */
    async buscarDetalhesLicitacao(numeroControlePNCP) {
        return this.get(`/api/licitacao/${encodeURIComponent(numeroControlePNCP)}`);
    }

    /**
     * Busca modalidades de referência
     * @returns {Promise<Array>} Lista de modalidades
     */
    async buscarModalidades() {
        return this.get('/api/referencias/modalidades');
    }

    /**
     * Busca status de compra de referência
     * @returns {Promise<Array>} Lista de status
     */
    async buscarStatusCompra() {
        return this.get('/api/referencias/statuscompra');
    }

    /**
     * Busca status radar de referência
     * @returns {Promise<Array>} Lista de status radar
     */
    async buscarStatusRadar() {
        return this.get('/api/referencias/statusradar');
    }

    /**
     * Busca municípios do IBGE por UF
     * @param {string} ufSigla - Sigla da UF (ex: 'SP', 'RJ')
     * @returns {Promise<Array>} Lista de municípios
     */
    async buscarMunicipiosIBGE(ufSigla) {
        return this.get(`/api/ibge/municipios/${ufSigla}`);
    }

    /**
     * Exporta licitações em CSV
     * @param {Object} filters - Filtros de busca (mesmos da busca)
     * @returns {void} Abre download do CSV
     */
    exportarCSV(filters = {}) {
        const queryString = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => queryString.append(key, v));
                } else {
                    queryString.append(key, value);
                }
            }
        });
        
        const url = `${this.baseUrl}/api/exportar-csv?${queryString.toString()}`;
        window.open(url, '_blank');
    }

    /**
     * Envia formulário de contato
     * @param {Object} dados - Dados do formulário
     * @returns {Promise<Object>} Resposta da API
     */
    async enviarContato(dados) {
        return this.post('/api/contato', dados);
    }

    /**
     * Busca posts do blog
     * @param {Object} params - Parâmetros de busca (categoria, tag, q, page)
     * @returns {Promise<Object>} Posts e informações de paginação
     */
    async buscarPosts(params = {}) {
        return this.get('/api/posts', params);
    }

    /**
     * Busca um post específico por slug
     * @param {string} slug - Slug do post
     * @returns {Promise<Object>} Dados do post
     */
    async buscarPost(slug) {
        return this.get(`/api/post/${slug}`);
    }

    /**
     * Busca posts em destaque
     * @returns {Promise<Object>} Lista de posts em destaque
     */
    async buscarPostsDestaque() {
        return this.get('/api/posts/destaques');
    }

    /**
     * Busca categorias do blog
     * @returns {Promise<Object>} Lista de categorias
     */
    async buscarCategorias() {
        return this.get('/api/categorias');
    }

    /**
     * Busca tags do blog
     * @returns {Promise<Object>} Lista de tags
     */
    async buscarTags() {
        return this.get('/api/tags');
    }
}

// Exporta instância singleton
export const api = new ApiService(API_BASE_URL);
export default api;

