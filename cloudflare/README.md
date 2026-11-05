# Ativar o assistente com IA gratuita

O site continua hospedado no GitHub Pages. O Worker abaixo conecta o chat ao
Workers AI sem expor chaves de API no navegador ou no repositório. A cota
gratuita publicada pela Cloudflare é de 10.000 Neurons por dia; ao atingir o
limite, as respostas de IA ficam indisponíveis até a renovação da cota.

## Publicar o Worker

1. Crie uma conta Cloudflare e habilite Workers AI no painel.
2. Instale o Node.js se ainda não estiver instalado.
3. Abra um terminal na pasta `cloudflare` deste repositório.
4. Execute `npx wrangler@latest login` e autorize o terminal no navegador.
5. Execute `npx wrangler@latest deploy`.
6. Copie a URL pública `workers.dev` exibida ao final.

O modelo usa o binding `AI` da Cloudflare. Nenhuma chave de provedor precisa
ser criada ou salva no código. Um limite aproximado de 10 requisições por
minuto por endereço IP também está configurado.

## Conectar o site ao Worker

Abra `chat-config.js` na raiz do repositório e coloque a URL do Worker,
incluindo o caminho `/api/chat`, por exemplo:

```js
window.LEOBYTE_CHAT_API_URL = "https://leobyte-tecnologia-chat.SUA-CONTA.workers.dev/api/chat";
```

Substitua `SUA-CONTA` pela parte correspondente da URL mostrada pelo Wrangler e
publique a alteração no GitHub. A URL do Worker não é uma chave secreta. Nunca
coloque tokens ou senhas nesse arquivo.

Enquanto a URL estiver vazia, o site mantém as respostas automáticas existentes
e informa que a IA aguarda configuração. A IA só fica ativa depois que o Worker
for implantado e `chat-config.js` apontar para a URL correta.

O Worker aceita solicitações somente da origem do site GitHub Pages configurada
no código. Se o site passar a usar domínio próprio, atualize `SITE_ORIGIN` em
`worker.js` e implante novamente.
