# 🔗 Encurtador de URL

Um serviço de encurtamento de URLs moderno, seguro e escalável. Transforma URLs longas em códigos curtos e únicos com 7 caracteres, armazenando os mapeamentos em MongoDB.

## 🚀 Stack Técnico

| Componente | Tecnologia |
|---|---|
| **Framework** | Fastify 5.8.4 |
| **Runtime** | Node.js + TypeScript |
| **Database** | MongoDB 7.1.1 |
| **Validação** | Zod 4.3.6 |
| **API Docs** | OpenAPI + Scalar |
| **Testing** | Vitest 4.1.4 |
| **Logging** | Pino + pino-pretty |

## 📁 Estrutura do /server

```
server/
├── src/
│   ├── app.ts                 # Configuração do Fastify (swagger, tipos, plugins)
│   ├── server.ts              # Bootstrap do servidor (listen na porta 3000)
│   ├── env.ts                 # Validação de variáveis de ambiente
│   ├── database/
│   │   └── mongo.ts           # Plugin Fastify para conexão MongoDB
│   ├── models/
│   │   └── url-schema.ts      # Schema Zod do documento (com validação de URL)
│   ├── routes/
│   │   ├── short-url.ts       # POST /short (encurta URL)
│   │   └── get-shorted-url.ts # GET /:shortCode (redireciona)
│   └── utils/
│       └── crypto.ts          # Geração de slug (encode, shuffle, XOR)
├── docker-compose.yml         # MongoDB container
├── tsconfig.json              # Configuração TypeScript
└── package.json
```

### 🔐 Algoritmo de Geração do Slug

1. **ObjectId → Número**: Converte o ObjectId do MongoDB em um inteiro usando XOR de seus bytes
2. **Shuffle com Secret**: Aplica um shuffle criptográfico usando `SHUFFLE_SECRET` (XOR + multiplicação não-linear) para evitar previsibilidade
3. **Base62 Encoding**: Codifica em base 62 (a-z, A-Z, 0-9) para gerar 7 caracteres

**Resultado**: Slug determinístico, único e alfanumérico.

---

## ✅ Requisitos - Implementação

### Requisitos Funcionais

| # | Requisito | Status | Detalhes |
|---|-----------|--------|----------|
| 1 | Encurtar URL válida | ✅ | `POST /short` com validação Zod |
| 2 | Gerar slug único de 7 caracteres | ✅ | Algoritmo shuffle + base62 em `crypto.ts` |
| 3 | Redirecionar para URL original | ✅ | `GET /:shortCode` retorna 301 redirect |
| 4 | Erro quando slug não existe | ✅ | Resposta 404 JSON estruturada |
| 5 | Registrar data de criação | ✅ | Campo `createdAt` no schema MongoDB |

### Requisitos Não Funcionais

| # | Requisito | Status | Implementação |
|---|-----------|--------|---|
| 1 | Slug com 7 caracteres | ✅ | `CODE_LENGTH = 7` em `crypto.ts` |
| 2 | Apenas alfanuméricos [a-zA-Z0-9] | ✅ | `BASE_CHARS` com 62 caracteres |
| 3 | Resposta < 200ms (redirecionamento) | ⚠️ | MongoDB com índice único (não há benchmarks) |
| 4 | Validar protocolo HTTP/HTTPS | ✅ | `z.string().url()` valida origem |
| 5 | Evitar colisão de slugs | ✅ | Índice único: `{ shortCode: 1, unique: true }` |
| 6 | Persistência em banco | ✅ | MongoDB com replica set ready |
| 7 | Respostas JSON padronizadas | ✅ | Todas rotas retornam JSON estruturado |
| 8 | Logs para observabilidade | ✅ | Pino com `pino-pretty` em desenvolvimento |
| 9 | Execução em Docker | ✅ | `docker-compose.yml` com MongoDB |

---

## 🛠️ Variáveis de Ambiente

### Backend (server/.env)

```env
# Database
MONGO_URI=mongodb://root:root@localhost:27017/shorter_url?authSource=admin

# Environment: development | test | production
ENVIRONMENT=development

# Secret for URL shuffling (hexadecimal)
SHUFFLE_SECRET=0x5f3759df

# Base URL for shortened links (without trailing slash)
# In production, use your domain: https://yourdomain.com
BASE_URL=http://localhost:3333

# Server port
PORT=3333
```

- **MONGO_URI**: String de conexão MongoDB
- **ENVIRONMENT**: Ativa Swagger em `development`
- **SHUFFLE_SECRET**: Seed hexadecimal (32 bits) para o shuffle do slug
- **BASE_URL**: URL base para os links encurtados (importante para produção)
- **PORT**: Porta onde o servidor irá rodar

### Frontend (web/.env)

```env
# API Base URL (backend server)
# For production, use your deployed backend URL: https://api.yourdomain.com
VITE_API_URL=http://localhost:3333
```

- **VITE_API_URL**: URL do backend para requisições da API

---

## 📚 Endpoints da API

### 1. Encurtar URL
**POST** `/short`

Request:
```json
{
  "longUrl": "https://www.example.com/very/long/url"
}
```

Response (201):
```json
{
  "shortUrl": "http://localhost:3333/abc1234"
}
```

Erros (400):
```json
{
  "message": "Invalid URL provided"
}
```

---

### 2. Redirecionar
**GET** `/:shortCode`

Response (301): Redirect para `longUrl`

Erro (404):
```json
{
  "message": "Short URL not found"
}
```

---

## 🐳 Infraestrutura (docker-compose.yml)

```yaml
services:
  mongodb:
    image: mongo:8
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
```

Inicia MongoDB com usuário root/root e volume persistente.

---

## 🧪 Testes

```bash
npm run test  # Roda com .env.test
```

Cobertura atual:
- ✅ POST /short: validação de URL, campo obrigatório
- ✅ GET /:shortCode: retrieval, 404 not found

Pendente:
- ⚠️ Testes de colisão de slug
- ⚠️ Benchmark de latência
- ⚠️ Edge cases de caracteres especiais

---

## 📖 Documentação da API

Em desenvolvimento, acesse:
```
http://localhost:3333/docs
```

*Powered by Scalar API Reference*

---

## 🚀 Como Rodar

### Desenvolvimento Local

#### Backend

```bash
# 1. Navegar para o diretório do servidor
cd server

# 2. Copiar arquivo de exemplo e configurar variáveis
cp .env.example .env
# Edite o .env conforme necessário

# 3. Instalar dependências
npm install

# 4. Iniciar MongoDB (Docker)
docker compose up -d

# 5. Rodar servidor em modo desenvolvimento
npm run dev

# Servidor estará em http://localhost:3333
# Documentação da API: http://localhost:3333/docs
```

#### Frontend

```bash
# 1. Navegar para o diretório web
cd web

# 2. Copiar arquivo de exemplo e configurar variáveis
cp .env.example .env
# O padrão já aponta para http://localhost:3333

# 3. Instalar dependências
npm install

# 4. Rodar em modo desenvolvimento
npm run dev

# Aplicação estará em http://localhost:5173
```

### Produção

#### Backend

```bash
# 1. Configurar variáveis de ambiente de produção
# Edite .env com:
# - BASE_URL com seu domínio (ex: https://short.ly)
# - MONGO_URI com banco de produção
# - ENVIRONMENT=production

# 2. Instalar dependências
npm install --production

# 3. Compilar TypeScript (opcional, mas recomendado)
npm run build

# 4. Rodar servidor compilado
npm start

# Ou usar tsx diretamente (desenvolvimento)
npm run start:dev
```

#### Frontend

```bash
# 1. Configurar variáveis de ambiente de produção
# Edite .env com:
# - VITE_API_URL com a URL do seu backend (ex: https://api.yourdomain.com)

# 2. Instalar dependências
npm install

# 3. Build para produção
npm run build

# 4. Os arquivos estarão em dist/ prontos para deploy
# Pode usar serviços como Vercel, Netlify, ou servir com nginx
```

### Scripts Disponíveis

#### Backend
- `npm run dev` - Modo desenvolvimento com hot reload
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Roda versão compilada (produção)
- `npm run start:dev` - Roda com tsx (sem compilação)
- `npm test` - Executa testes

#### Frontend
- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
