// frontend/server.js
const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // O frontend rodará na porta 3000

// Serve os arquivos estáticos (css, js, images) da pasta /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota genérica para servir QUALQUER página .html na raiz
app.get('/:pageName.html', (req, res) => {
    const pageFile = path.join(__dirname, `${req.params.pageName}.html`);
    res.sendFile(pageFile, (err) => {
        // Se o arquivo não for encontrado, envia nosso 404.html customizado
        if (err) {
            res.status(404).sendFile(path.join(__dirname, '404.html'));
        }
    });
});

// Middleware para capturar todas as outras rotas não encontradas
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
    console.log(`🚀 Servidor frontend rodando em http://localhost:${port}`);
});