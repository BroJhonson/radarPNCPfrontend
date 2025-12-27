// src/js/pages/post.js

import api from '../services/api.js';
import { decodeHtml } from '../modules/utils.js';

export default async function initPostPage() {
    const titleElement = document.getElementById('post-title');
    const contentElement = document.getElementById('post-content'); // <-- CORRIGIDO: de 'post-content-body' para 'post-content'
    const metaContainer = document.getElementById('post-meta'); // <-- Adicionado para facilitar

    if (!titleElement || !contentElement) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');

    if (!postSlug) {
        titleElement.textContent = 'Post não encontrado';
        contentElement.innerHTML = '<p class="text-danger">O link para este post parece estar quebrado.</p>';
        return;
    }

    try {
        const data = await api.buscarPost(postSlug);
        const post = data.post;
        
        if (!post) {
            throw new Error('Post não encontrado.');
        }
        
        // PREENCHER A PÁGINA (CÓDIGO MOVIDO PARA CÁ)
        document.title = `${decodeHtml(post.titulo)} - Blog RADAR PNCP`;
        titleElement.innerHTML = decodeHtml(post.titulo);
        
        // O conteúdo vem sanitizado do backend
        contentElement.innerHTML = decodeHtml(post.conteudo_completo);

        // --- INÍCIO DO CÓDIGO MOVIDO E CORRIGIDO ---
        // Data
        const postDate = document.getElementById("post-date");
        if(postDate) postDate.textContent = new Date(post.data_publicacao).toLocaleDateString("pt-BR");

        // Categoria
        const catElem = document.getElementById("post-category");
        if (catElem) {
            if (post.categoria_nome && post.categoria_slug) {
                catElem.textContent = post.categoria_nome;
                catElem.href = `/blog.html?categoria=${post.categoria_slug}`;
            } else {
                catElem.textContent = "Sem categoria";
                catElem.removeAttribute("href");
            }
        }
        
        // Tags
        const tagsElem = document.getElementById("post-tags");
        if (tagsElem) {
            tagsElem.innerHTML = ""; // Limpa o placeholder "..."
            // Verificamos se post.tags existe e tem itens
            if (post.tags && post.tags.length > 0) {
                // O backend agora envia um array de strings, ex: ["Tecnologia", "Avisos"]
                // Então, a variável 'tag' dentro do loop é a própria string.
                post.tags.forEach(tag => { 
                    const a = document.createElement("a");
                    // Usamos 'tag' diretamente, pois é a string com o nome da tag
                    a.href = `/blog.html?tag=${encodeURIComponent(tag)}`; 
                    a.textContent = tag; // E aqui também
                    a.classList.add("badge", "bg-secondary", "text-decoration-none", "me-1");
                    tagsElem.appendChild(a);
                });
            } else {
                // Se não houver tags, exibe um traço
                tagsElem.textContent = "—";
            }
        }
        
        // Preenche breadcrumb
        const crumb = document.getElementById('breadcrumb-post-title');
        if (crumb) crumb.textContent = decodeHtml(post.titulo);

        // --- FIM DO CÓDIGO MOVIDO E CORRIGIDO ---

    } catch (error) {
        // console.error("Erro ao carregar post:", error);
        document.title = "Erro - RADAR PNCP";
        titleElement.textContent = 'Ocorreu um Erro';
        contentElement.innerHTML = `<p class="text-center text-danger">Não foi possível carregar o conteúdo do post. Causa: ${error.message}</p>`;
    }

    // Carrega categorias e tags da sidebar (código local simples)
    async function loadSidebar() {
    const categoryList = document.getElementById('category-list');
    const tagCloud = document.getElementById('tag-cloud');
    try {
        const [catsData, tagsData] = await Promise.all([
        api.buscarCategorias(),
        api.buscarTags()
        ]);

        if (categoryList && catsData.categorias) {
        categoryList.innerHTML = catsData.categorias
            .map(cat => `<li><a href="/blog.html?categoria=${cat.slug}">${cat.nome}</a></li>`)
            .join('');
        }
        if (tagCloud && tagsData.tags) {
        tagCloud.innerHTML = tagsData.tags
            .map(tag => `<a href="/blog.html?tag=${tag.nome}" class="tag-item">${tag.nome}</a>`)
            .join(' ');
        }
    } catch (e) {
        if (categoryList) categoryList.innerHTML = '<li>Falha ao carregar.</li>';
        if (tagCloud) tagCloud.innerHTML = '<span class="text-danger">Falha ao carregar.</span>';
    }
    }
    loadSidebar();

}