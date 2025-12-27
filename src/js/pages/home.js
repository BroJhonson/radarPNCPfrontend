// frontend/src/js/pages/home.js

import api from '../services/api.js';
import { decodeHtml } from '../modules/utils.js';

// Função para criar o HTML de um único card de post
function createPostCard(post) {
    if (!post.slug) return '';

    const imageUrl = post.imagem_destaque
        ? (post.imagem_destaque.startsWith('http')
            ? post.imagem_destaque
            : `./static/images/${post.imagem_destaque}`)
        : 'https://i.postimg.cc/XqFpk2fX/grtrtrf564.png';

    const postLink = `/post.html?slug=${post.slug}`;

    return `
        <div class="col-md-4 d-flex align-items-stretch">
            <div class="card blog-card h-100 w-100">
                <img src="${imageUrl}" class="card-img-top" alt="${decodeHtml(post.titulo)}}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${decodeHtml(post.titulo)}</h5>
                    <p class="card-text flex-grow-1">${decodeHtml(post.resumo || '')}</p>
                    <a href="${postLink}" class="btn btn-outline-primary mt-auto">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}


export default async function initHomePage() {
    const container = document.getElementById('destaques-blog-container');
    if (!container) return;

    try {
        const data = await api.buscarPostsDestaque();

        if (data.posts && data.posts.length > 0) {
            const postsHtml = data.posts.map(createPostCard).join('');
            container.innerHTML = postsHtml;
        } else {
            container.innerHTML = '<p class="text-muted col-12 text-center">Nenhum artigo em destaque encontrado.</p>';
        }

    } catch (error) {
        // console.error("Erro ao buscar posts em destaque:", error);
        container.innerHTML = '<p class="text-danger col-12 text-center">Não foi possível carregar os artigos.</p>';
    }
}
