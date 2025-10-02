## frontend


## Configurando o Ambiente de Desenvolvimento

Este projeto é dividido em duas partes: `backend` e `frontend`. Elas devem ser executadas em terminais separados.

### Backend

1. Navegue até a pasta `backend/`.
2. Crie e ative um ambiente virtual: `python -m venv venv` e `source venv/bin/activate`.
3. Instale as dependências: `pip install -r requirements.txt`.
4. Copie `.env.example` para `.env` e preencha as variáveis.
5. Inicie o servidor: `python app.py`.
6. O backend estará rodando em `http://localhost:5000`.

### Frontend

1. Navegue até a pasta `frontend/`.
2. Instale as dependências (necessário apenas na primeira vez): `npm install`.
3. Inicie o servidor de desenvolvimento: `npm run dev`.
4. O frontend estará disponível em `http://localhost:3000`.


npm install express dotenv