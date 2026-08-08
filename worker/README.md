# Eagle Escalas → Cloudflare Worker → NewSky

## 1. Instalar Wrangler

```bash
npm install -g wrangler
wrangler login
```

## 2. Entrar na pasta do Worker

```bash
cd worker
```

## 3. Configurar a API Key com segurança

Nunca coloque a chave no GitHub.

```bash
npx wrangler secret put NEWSKY_API_TOKEN
```

Quando o terminal pedir, cole a **nova** API Key do NewSky. Ela será armazenada como Secret do Cloudflare.

## 4. Publicar

```bash
npx wrangler deploy
```

O Cloudflare fornecerá uma URL parecida com:

`https://eagle-escalas-newsky.<sua-conta>.workers.dev`

## 5. Configurar o frontend

No arquivo `newsky.js`, altere apenas:

```js
const API = 'https://eagle-escalas-newsky.<sua-conta>.workers.dev';
```

Não coloque a API Key nesse arquivo.

## Fluxo final

GitHub Pages → Cloudflare Worker → NewSky API

O navegador nunca recebe a API Key.

## Endpoints

- `GET /status` — verifica se o secret está configurado.
- `GET /test` — testa a autenticação no NewSky.
- `POST /flights` — consulta voos dos últimos N dias (máximo 90).

## Observação

O Worker usa o endpoint `/flights/bydate` do NewSky para a primeira integração. Operações de escrita/alteração no NewSky só devem ser adicionadas após confirmação dos endpoints suportados pela API da companhia.
