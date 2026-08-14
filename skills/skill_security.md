---
name: seguranca-app-fullstack
description: Use esta skill sempre que a tarefa envolver segurança de aplicações web — planejar a arquitetura de segurança de uma feature nova, implementar autenticação, autorização, pagamentos, integração com APIs externas ou acesso a banco de dados, ou analisar/auditar um projeto existente para ver se segue boas práticas de segurança. Cobre segurança no cliente (XSS, CSRF, armazenamento seguro), no backend (validação, injeção, rate limiting, headers), em banco de dados, e em fluxos de pagamento. Consulte esta skill tanto para CRIAR código seguro desde o início quanto para REVISAR/AUDITAR código já existente em busca de vulnerabilidades — mesmo que o usuário não use as palavras "segurança" ou "vulnerabilidade" explicitamente, ex.: "cria uma rota de login", "integra com o Stripe", "essa API tá pronta pra produção?", "monta a autenticação do app".
---

# Segurança de aplicações — cliente, backend, APIs, pagamentos e banco de dados

Vulnerabilidade de segurança quase nunca é um bug óbvio — é uma checagem que "não deu tempo" de fazer, uma validação que ficou só no frontend, um preço que veio do cliente e foi aceito sem conferir. Esta skill existe pra essas checagens virem por padrão, não como uma etapa extra que só acontece se alguém lembrar de pedir.

Esta skill tem três modos de uso — identifique qual se aplica à tarefa:

- **Planejar**: antes de desenhar uma feature que toca em autenticação, dados sensíveis, pagamento ou dado de terceiros, pense em "o que um usuário mal-intencionado tentaria aqui?" antes de desenhar o fluxo feliz.
- **Criar**: ao implementar, aplique os padrões das seções abaixo diretamente — eles não são um passo extra depois de "fazer funcionar", são parte de fazer funcionar corretamente.
- **Analisar/auditar**: ao revisar um projeto existente, use a seção 8 (checklist de auditoria) como roteiro e reporte achados por severidade (crítico / alto / médio / baixo), com o arquivo e a linha quando possível.

---

## 1. Segurança no cliente (frontend)

- **XSS (Cross-Site Scripting)**: nunca renderize HTML vindo de input de usuário sem sanitizar. Em React, isso significa evitar `dangerouslySetInnerHTML` — se for genuinamente necessário (ex.: editor rich text), sanitize com uma lib confiável (DOMPurify) antes de renderizar, nunca confie que o conteúdo já veio limpo do backend.
  ```tsx
  // Errado: conteúdo do usuário direto no DOM
  <div dangerouslySetInnerHTML={{ __html: comment.body }} />

  // Certo: sanitizado antes de renderizar
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
  ```
  React já escapa strings normais automaticamente (`{comment.body}`), então prefira isso sempre que não precisar de HTML de verdade.
- **Nunca guarde token de sessão/JWT em `localStorage` ou `sessionStorage`** se o app tiver qualquer risco de XSS (ou seja, quase sempre) — qualquer script injetado consegue ler `localStorage`. Prefira cookie `httpOnly` + `Secure` + `SameSite=Strict/Lax`, que scripts no browser não conseguem ler.
- **CSRF**: se usar cookies pra autenticação, proteja requisições que mudam estado (POST/PUT/DELETE) com `SameSite` no cookie e, quando o cookie não for suficiente, um token CSRF validado no backend.
- **Nunca coloque segredo, chave privada de API ou credencial de banco no código do frontend** — tudo que vai pro bundle é público, mesmo minificado. Só chaves públicas (ex.: chave publishable do Stripe) podem estar no cliente.
- **Clickjacking**: garanta que o backend envie `X-Frame-Options` ou `Content-Security-Policy: frame-ancestors` apropriados pra páginas sensíveis (login, checkout).
- **Dependências de terceiros no frontend** (scripts, widgets, SDKs) rodam com acesso total à página — antes de adicionar um script de terceiro, considere o que ele pode ler/alterar na página.

---

## 2. Autenticação e autorização

- **Hash de senha**: sempre bcrypt, argon2 ou scrypt — nunca MD5/SHA sem salt, nunca texto plano. A senha em texto puro não deve existir em nenhum log, nenhuma variável de debug, nenhum lugar além da requisição original.
- **Rate limiting em login e reset de senha**, pra dificultar força bruta e enumeração de usuários. Mensagens de erro genéricas ("usuário ou senha inválidos"), nunca revelando se o e-mail existe ou não.
- **Autorização é sempre verificada no servidor**, nunca só escondendo um botão no frontend. Se o usuário A pode acessar `/api/orders/123`, confirme no backend que o pedido 123 pertence ao usuário A — não assuma que, só porque o frontend não mostra o link, ninguém vai chamar a rota direto (esse é o clássico IDOR — Insecure Direct Object Reference).
  ```ts
  // Errado: retorna o pedido sem checar dono
  const order = await db.orders.findById(orderId);
  return res.json(order);

  // Certo: confirma que o pedido pertence ao usuário autenticado
  const order = await db.orders.findById(orderId);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }
  return res.json(order);
  ```
- **Tokens de acesso de curta duração + refresh token**, com forma de revogar sessões (logout de verdade invalida o token, não só apaga do cliente).
- **IDs sensíveis não devem ser previsíveis/sequenciais** quando servem pra identificar recurso de outro usuário (prefira UUID a incremento simples), pra dificultar enumeração.

---

## 3. Backend e APIs

- **Valide e sanitize toda entrada na borda** (body, query, params, headers) — trate toda requisição como potencialmente hostil, mesmo que venha do seu próprio frontend, porque qualquer um pode chamar a API direto.
- **Injeção**: nunca concatene input do usuário em query SQL, comando de shell, ou expressão de NoSQL — use query parametrizada/ORM, nunca `db.query("... WHERE id = " + userInput)`. Mesma lógica vale pra comandos de sistema: nunca passe input de usuário direto pra `exec`/`child_process` sem validação e escaping rígidos.
- **CORS explícito**: liste as origens permitidas, nunca `Access-Control-Allow-Origin: *` numa API que lida com dado autenticado.
- **Headers de segurança** (ex.: via `helmet` no Express): `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`.
- **Rate limiting** em endpoints públicos e caros (login, busca, envio de e-mail, criação de recurso), pra evitar abuso e negação de serviço.
- **Erros não vazam detalhe interno**: nunca devolva stack trace, query SQL ou path de arquivo na resposta pro cliente em produção — logue isso internamente, devolva uma mensagem genérica pra fora.
- **Dependências**: pacotes desatualizados com CVE conhecida são uma das formas mais comuns de comprometimento. Ao revisar um projeto, rodar `npm audit` (ou equivalente) faz parte da checagem, e adicionar uma dependência nova é o momento de checar se ela é mantida e não tem alternativa mais segura.
- **HTTPS em todo lugar** — nunca transmita credencial, token ou dado sensível em texto claro.

---

## 4. Banco de dados

- **Query parametrizada sempre**, nunca string concatenada com input do usuário — isso vale pra SQL, mas também pra queries dinâmicas de NoSQL (ex.: MongoDB aceitando operadores como `$where` vindos direto do body sem validação é injeção também).
- **Princípio do menor privilégio**: o usuário de banco que a aplicação usa não deveria ter permissão de `DROP`/`ALTER` se só precisa de `SELECT`/`INSERT`/`UPDATE`. Serviços diferentes (app, migração, analytics) idealmente têm credenciais diferentes com escopo diferente.
- **Dado sensível (PII, token, dado de pagamento) é criptografado em repouso** quando o campo permitir, e nunca aparece em log de aplicação ou de banco.
- **Backups têm o mesmo nível de proteção que o banco principal** — um backup público ou mal protegido anula qualquer segurança do banco em produção.

---

## 5. Pagamentos

- **Nunca deixe dado de cartão (número, CVV, validade) tocar no seu servidor.** Use os componentes/SDK do processador de pagamento (ex.: Stripe Elements, Checkout hospedado) pra que o dado de cartão vá direto do cliente pro processador — isso tira a aplicação do escopo pesado de compliance PCI-DSS.
- **O preço/valor é sempre definido no servidor, nunca aceito do cliente.** Se o frontend manda `{ productId: "abc", amount: 100 }`, o backend busca o preço real do produto no banco e ignora (ou audita) o `amount` recebido — confiar no valor que veio do cliente é convite pra qualquer um pagar o que quiser.
  ```ts
  // Errado: confia no valor mandado pelo cliente
  await stripe.paymentIntents.create({ amount: req.body.amount, currency: "brl" });

  // Certo: valor vem da fonte de verdade no servidor
  const product = await db.products.findById(req.body.productId);
  await stripe.paymentIntents.create({ amount: product.priceInCents, currency: "brl" });
  ```
- **Webhooks de pagamento sempre verificam assinatura** (ex.: `stripe.webhooks.constructEvent` com o signing secret) antes de processar o evento — sem isso, qualquer um pode forjar uma notificação de "pagamento aprovado" chamando seu endpoint direto.
- **Idempotência**: operações de cobrança usam uma chave de idempotência, pra um retry de rede (ou duplo clique do usuário) não gerar cobrança duplicada.
- **Dinheiro é inteiro, não ponto flutuante.** Trabalhe em centavos (inteiro) internamente, nunca `float`/`double` pra valor monetário, pra evitar erro de arredondamento.
- **Nunca logue número de cartão, CVV ou dado sensível de pagamento** — nem mascarado incorretamente, nem em log de debug "temporário".

---

## 6. Segredos e configuração

- Segredos (chaves de API, string de conexão de banco, signing secrets) vivem em variáveis de ambiente ou um gerenciador de segredos — nunca commitados no repositório, nem mesmo em um branch antigo ou arquivo de exemplo com valor real.
- `.env` está no `.gitignore` desde o primeiro commit do projeto, não adicionado depois que alguém já commitou um segredo.
- Segredos diferentes por ambiente (dev/staging/produção) — vazamento de uma chave de teste não deveria comprometer produção.

---

## 7. Armadilhas comuns (evite)

- Validar só no frontend e assumir que ninguém vai chamar a API direto.
- Confiar em preço, quantidade ou qualquer valor sensível mandado pelo cliente num fluxo de pagamento.
- Guardar JWT/token de sessão em `localStorage` num app com qualquer superfície de XSS.
- Usar `dangerouslySetInnerHTML` (ou equivalente) com conteúdo de usuário não sanitizado.
- Concatenar input de usuário em query de banco ou comando de shell.
- Processar webhook de pagamento sem verificar a assinatura.
- CORS liberado com `*` numa API autenticada.
- Checar permissão só no frontend (esconder um botão) sem checar de novo no backend.
- Logar senha, token, número de cartão ou qualquer dado sensível, mesmo "só durante o debug".
- Deixar erro interno (stack trace, query, path) vazar na resposta da API.

---

## 8. Checklist de auditoria (modo "analisar")

Ao revisar um projeto existente, percorra e reporte o que falhar, com severidade:

**Autenticação/Autorização**
- [ ] Senhas com hash forte (bcrypt/argon2), nunca texto plano ou hash fraco
- [ ] Toda rota que retorna/altera dado de um recurso confere se o usuário autenticado é dono/tem permissão
- [ ] Rate limiting em login, cadastro e reset de senha
- [ ] Tokens de sessão podem ser revogados (logout invalida de verdade)

**Cliente**
- [ ] Nenhum `dangerouslySetInnerHTML`/`innerHTML` com conteúdo de usuário não sanitizado
- [ ] Token de sessão não está em `localStorage`/`sessionStorage` sem justificativa
- [ ] Nenhuma chave privada/segredo no código do frontend

**Backend/API**
- [ ] Toda entrada (body/query/params) é validada no servidor, não só no cliente
- [ ] Nenhuma query monta SQL/comando por concatenação de string com input do usuário
- [ ] CORS restrito às origens esperadas
- [ ] Respostas de erro não vazam stack trace/detalhe interno em produção
- [ ] Dependências sem CVE crítica conhecida em aberto

**Banco de dados**
- [ ] Usuário de aplicação no banco tem só o privilégio necessário
- [ ] Dado sensível não aparece em log de aplicação

**Pagamentos** (se aplicável)
- [ ] Dado de cartão nunca toca o servidor da aplicação
- [ ] Valor cobrado vem do servidor, não do cliente
- [ ] Webhook de pagamento verifica assinatura
- [ ] Operação de cobrança usa chave de idempotência

**Segredos**
- [ ] Nenhum segredo commitado no repositório (histórico incluído)
- [ ] `.env` no `.gitignore`