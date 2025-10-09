// src/js/main.js

import { setupGlobalFeatures } from './modules/global.js';
import initRadarPage from './pages/radar.js';
import initBlogPage from './pages/blog.js';
import initPostPage from './pages/post.js';
import initContatoPage from './pages/contato.js';
import initHomePage from './pages/home.js';

document.addEventListener('DOMContentLoaded', () => {
    // console.log("DOM Carregado. Orquestrador JS iniciado.");

    // 1. Executa funcionalidades globais em todas as páginas
    setupGlobalFeatures();

    // 2. Roteador simples baseado na classe do <body>
    //    Ele verifica qual página está ativa e chama o módulo JS correspondente.
    const bodyClassList = document.body.classList;

    if (bodyClassList.contains('page-home')) {
        initHomePage();
    } else if (bodyClassList.contains('page-busca-licitacoes')) {
        initRadarPage();
    } else if (bodyClassList.contains('page-blog')) {
        initBlogPage();
    } else if (bodyClassList.contains('page-post-individual')) {
        initPostPage();
    } else if (bodyClassList.contains('page-contato')) {
        initContatoPage();
    }
});