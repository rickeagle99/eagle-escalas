# Integração Eagle Escalas + NewSky

A integração foi preparada para manter a chave do NewSky fora do código público.

## Arquitetura

- `index.html` carrega o cliente `newsky.js`.
- `newsky.js` faz chamadas somente para `/api/newsky/...`.
- `functions/api/newsky/[[path]].js` funciona como proxy serverless.
- A variável `NEWSKY_API_TOKEN` deve existir somente como Secret/Environment Variable no provedor de hospedagem.

A chave **não deve** ser colocada em `app.js`, `newsky.js`, HTML, CSS ou qualquer arquivo versionado.

## Deploy recomendado

O repositório pode continuar público e ser publicado com Cloudflare Pages/Pages Functions.

1. Conecte `rickeagle99/eagle-escalas` ao Cloudflare Pages.
2. Publique o diretório raiz do projeto como site estático.
3. Ative Functions para o projeto (a pasta `functions/` já está no repositório).
4. Em **Settings → Environment variables**, crie o Secret:
   - Nome: `NEWSKY_API_TOKEN`
   - Valor: **sua nova chave do NewSky**
5. Faça um novo deploy.
6. Abra **Administração → Integração NewSky**.
7. Clique em **Testar conexão**.
8. Depois use **Sincronizar voos**.

Não coloque a chave em GitHub Secrets esperando que ela apareça automaticamente no Pages: o segredo precisa ser cadastrado também no ambiente de execução do provedor que hospeda as Functions.

## Segurança

A chave antiga que foi compartilhada anteriormente deve ser revogada/rotacionada. A nova chave deve ser cadastrada diretamente no provedor de hospedagem e nunca enviada para o chat ou commitada no GitHub.

## Escopo atual

A primeira etapa integra a leitura dos voos pelo endpoint de API de voos por período. Ela não executa operações de escrita no NewSky nem tenta usar endpoints administrativos não confirmados.

Depois de validar a conexão, podemos adicionar sincronização de pilotos, frota e associação automática de voos às escalas, conforme os endpoints disponíveis para a conta da Eagle.
