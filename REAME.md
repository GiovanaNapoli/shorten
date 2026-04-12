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

## 🛠️ Variáveis de Ambiente (env.ts)

Obrigatórias para rodar o servidor:

```env
MONGO_URI=mongodb://root:root@localhost:27017/shorten_url?authSource=admin
ENVIRONMENT=development|test|production
SHUFFLE_SECRET=0x12345678
```

- **MONGO_URI**: String de conexão MongoDB
- **ENVIRONMENT**: Ativa Swagger em `development`
- **SHUFFLE_SECRET**: Seed hexadecimal (32 bits) para o shuffle do slug

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
  "shortUrl": "http://localhost:3000/abc1234"
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
http://localhost:3000/docs
```

*Powered by Scalar API Reference*

---

## 🚀 Como Rodar

```bash
# 1. Instalar dependências
cd server
npm install

# 2. Iniciar MongoDB (Docker)
docker compose up -d

# 3. Rodar servidor
npm run dev  # (configure este script se necessário)

# Servidor estará em http://localhost:3000
```
