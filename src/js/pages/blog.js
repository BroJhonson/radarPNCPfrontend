// frontend/src/js/pages/blog.js

import { API_BASE_URL } from '../config.js';
import { decodeHtml } from '../modules/utils.js'; 

// Função para criar o HTML de um único card de post
function createPostCard(post) {
    if (!post.slug) return '';

    // Decide se a imagem é externa (http) ou local
    const imageUrl = post.imagem_destaque 
        ? (post.imagem_destaque.startsWith('http') 
            ? post.imagem_destaque 
            : `./static/images/${post.imagem_destaque}`)
        : 'https://i.postimg.cc/XqFpk2fX/grtrtrf564.png'; // Imagem padrão

    // Data formatada dd/mm/yyyy
    function formatDateBR(isoString) {
        if (!isoString) return '--/--/----';
        const [y, m, d] = isoString.slice(0, 10).split('-');
        return `${d}/${m}/${y}`;
    }
    const postDate = formatDateBR(post.data_publicacao);

    const postLink = `/post.html?slug=${post.slug}`;

    return `
        <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <article class="blog-post-summary-grid w-100">
                <a href="${postLink}" class="text-decoration-none">
                    <img src="${imageUrl}" alt="${post.titulo}" class="img-fluid rounded-top blog-grid-image">
                </a>
                <div class="p-3">
                    <p class="text-muted small mb-1">
                        Categoria: 
                        <a href="/blog.html?categoria=${post.categoria_slug}">
                            ${post.categoria_nome || 'Sem categoria'}
                        </a>
                    </p>
                    <h2 class="h5 blog-post-title mb-2">
                        <a href="${postLink}" class="text-decoration-none link-dark">
                            ${decodeHtml(post.titulo)}
                        </a>
                    </h2>
                    <p class="blog-post-meta text-muted small">
                        <i class="bi bi-calendar3"></i> ${postDate}
                    </p>
                </div>
            </article>
        </div>
    `;
}

// Sidebar (categorias e tags)
async function loadSidebarData() {
    const categoryList = document.getElementById('category-list');
    const tagCloud = document.getElementById('tag-cloud');

    // Categorias
    try {
        const response = await fetch(`${API_BASE_URL}/api/categorias`);
        const data = await response.json();
        if (data.categorias) {
            categoryList.innerHTML = data.categorias.map(cat => 
                `<li><a href="/blog.html?categoria=${cat.slug}">${cat.nome}</a></li>`
            ).join('');
        }
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        categoryList.innerHTML = '<li>Falha ao carregar.</li>';
    }

    // Tags
    try {
        const response = await fetch(`${API_BASE_URL}/api/tags`);
        const data = await response.json();
        if (data.tags) {
            tagCloud.innerHTML = data.tags.map(tag => 
                `<a href="/blog.html?tag=${tag.nome}" class="tag-item">${tag.nome}</a>`
            ).join(' ');
        }
    } catch (error) {
        console.error("Erro ao carregar tags:", error);
        tagCloud.innerHTML = '<span class="text-danger">Falha ao carregar.</span>';
    }
}

// Função para renderizar os controles de paginação
function renderPagination(currentPage, totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    container.innerHTML = '';
    if (totalPages <= 1) return;

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Função para criar um item de página
    const createPageItem = (page, text = page, disabled = false, active = false) => {
        const li = document.createElement('li');
        li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${text}</a>`;
        return li;
    };

    // Botão "Anterior"
    ul.appendChild(createPageItem(currentPage - 1, 'Anterior', currentPage === 1));
    
    // Lógica para mostrar números de página com "..."
    const pagesToShow = [];
    const range = 2; // Quantos números antes e depois da página atual

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
            pagesToShow.push(i);
        }
    }

    let lastPage = 0;
    for (const pageNum of pagesToShow) {
        if (lastPage + 1 < pageNum) {
            // Adiciona "..." se houver um salto nos números
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = `<span class="page-link">...</span>`;
            ul.appendChild(li);
        }
        ul.appendChild(createPageItem(pageNum, pageNum, false, pageNum === currentPage));
        lastPage = pageNum;
    }

    // Botão "Próxima"
    ul.appendChild(createPageItem(currentPage + 1, 'Próxima', currentPage === totalPages));
    
    nav.appendChild(ul);
    container.appendChild(nav);
}


// NOVO: Função refatorada para buscar posts, agora reutilizável
async function fetchAndDisplayPosts() {
    const postsContainer = document.getElementById('posts-container');
    const loadingIndicator = document.getElementById('loading-posts');
    
    loadingIndicator.style.display = 'block';
    postsContainer.innerHTML = '';

    try {
        const params = new URLSearchParams(window.location.search);
        const categoriaSlug = params.get('categoria');
        const tagNome = params.get('tag');
        const searchTerm = params.get('q'); // <-- NOVO: Lê o parâmetro de busca
        const page = params.get('page') || '1'; // Pega a página da URL

        let apiUrl = `${API_BASE_URL}/api/posts`;
        const queryParams = [];
        if (categoriaSlug) queryParams.push(`categoria=${categoriaSlug}`);
        if (tagNome) queryParams.push(`tag=${encodeURIComponent(tagNome)}`);
        if (searchTerm) queryParams.push(`q=${encodeURIComponent(searchTerm)}`); // <-- NOVO: Adiciona a busca à URL da API

        if (queryParams.length > 0) {
            apiUrl += `?${queryParams.join('&')}`;
        }

        queryParams.push(`page=${page}`); // Adiciona a página à chamada da API
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
        
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
            const postsHtml = data.posts.map(createPostCard).join('');
            postsContainer.innerHTML = postsHtml;
            renderPagination(data.pagina_atual, data.total_paginas);
        } else {
            // Mensagem mais útil se for uma busca
            const message = searchTerm 
                ? `Nenhum post encontrado para a busca: "${decodeHtml(searchTerm)}".`
                : 'Nenhum post encontrado.';
            postsContainer.innerHTML = `<p class="text-center">${message}</p>`;
            document.getElementById('pagination-container').innerHTML = ''; // Limpa paginação
        }

    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        postsContainer.innerHTML = '<p class="text-center text-danger">Falha ao carregar os posts.</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Página principal do blog
export default async function initBlogPage() {
    const postsContainer = document.getElementById('posts-container');
    const loadingIndicator = document.getElementById('loading-posts');
    
    if (!postsContainer) return;

    // Sidebar em paralelo
    loadSidebarData();

    // <-- INÍCIO DO NOVO CÓDIGO PARA O FORMULÁRIO DE BUSCA -->
    const searchForm = document.getElementById('blog-search-form');
    const searchInput = searchForm.querySelector('input[name="q"]');

    // Preenche o campo de busca se houver um 'q' na URL ao carregar a página
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has('q')) {
        searchInput.value = currentParams.get('q');
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página
        
        const searchTerm = searchInput.value.trim();
        const url = new URL(window.location);
        
        // Atualiza o parâmetro 'q' na URL
        url.searchParams.set('q', searchTerm);

        // Remove filtros de tag/categoria para fazer uma nova busca geral
        url.searchParams.delete('tag');
        url.searchParams.delete('categoria');

        // Atualiza a URL no navegador sem recarregar a página
        history.pushState({}, '', url);

        // Chama a função para buscar e exibir os resultados
        fetchAndDisplayPosts();
    });
    // <-- FIM DO NOVO CÓDIGO PARA O FORMULÁRIO DE BUSCA -->

    // NOVO: Adiciona um listener no contêiner da paginação
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.addEventListener('click', function(event) {
        event.preventDefault();
        const target = event.target;
        
        // Verifica se o clique foi em um link de página
        if (target.tagName === 'A' && target.hasAttribute('data-page')) {
            const page = target.getAttribute('data-page');
            const url = new URL(window.location);
            url.searchParams.set('page', page);
            
            // Atualiza a URL e busca os posts da nova página
            history.pushState({}, '', url);
            fetchAndDisplayPosts();
            window.scrollTo(0, 0); // Rola para o topo
        }
    });

    loadingIndicator.style.display = 'block';
    postsContainer.innerHTML = '';

    try {
        // --- Captura filtros da URL ---
        const params = new URLSearchParams(window.location.search);
        const categoriaSlug = params.get('categoria');
        const tagNome = params.get('tag');

        // --- Monta URL da API ---
        let apiUrl = `${API_BASE_URL}/api/posts`;
        const queryParams = [];
        if (categoriaSlug) queryParams.push(`categoria=${categoriaSlug}`);
        if (tagNome) queryParams.push(`tag=${encodeURIComponent(tagNome)}`);
        if (queryParams.length > 0) apiUrl += `?${queryParams.join('&')}`;

        // --- Faz a requisição ---
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
        
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
            const postsHtml = data.posts.map(createPostCard).join('');
            postsContainer.innerHTML = postsHtml;
        } else {
            postsContainer.innerHTML = '<p class="text-center">Nenhum post encontrado.</p>';
        }

    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        postsContainer.innerHTML = '<p class="text-center text-danger">Falha ao carregar os posts.</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}
