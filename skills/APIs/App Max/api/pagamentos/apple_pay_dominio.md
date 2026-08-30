---
title: "Configuração de Domínios para Apple Pay (.well-known)"
description: "Como hospedar o arquivo apple-developer-merchantid-domain-association no servidor para homologação do domínio pela Apple."
topics:
  - apple-pay
  - configuracao-dominio
  - well-known
  - verificacao-apple
keywords:
  - .well-known
  - apple-developer-merchantid-domain-association
  - apple pay domain
  - verificacao de dominio
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/apple-pay-dominio
---

# Configuração de domínios para Apple Pay

Para habilitar o Apple Pay em sua loja, é necessário disponibilizar o arquivo
`.well-known/apple-developer-merchantid-domain-association` na raiz de **cada
domínio** onde o botão de pagamento será exibido.

> **Obrigatório em todos os modelos de integração**
>
> Esse passo é necessário mesmo se você instala o aplicativo da Appmax via
> AppStore (modelo integrado, com `client_id`/`external_id` por loja). O que
> muda entre os modelos é apenas quem cadastra o domínio junto à Apple — o
> arquivo `.well-known`, você sempre publica. Veja
> [Pagamento com Apple Pay](apple_pay.md) para o fluxo
> completo e a distinção entre modelos.
---

## Para que serve esse arquivo?

Esse arquivo é exigido pela Apple como parte do processo de verificação de
domínio. Ele comprova que a Appmax tem autorização para processar pagamentos
Apple Pay nos domínios informados.

A Apple utiliza esse arquivo para validar que o domínio está vinculado
corretamente ao **Merchant ID** configurado pela Appmax. Sem ele, o botão
"Pagar com Apple Pay" não funciona no ambiente de produção — a PaymentSheet
não abre, ou a validação do domínio falha a cada tentativa de transação.

> **O `.well-known` não é o Apple Token**
>
> O Apple Token é o cartão tokenizado, gerado a cada transação (veja
> [Pagamento com Apple Pay](apple_pay.md)). O `.well-known`
> é um arquivo **estático**, o mesmo em todos os domínios, vinculado ao
> `merchantIdentifier` da Appmax — não à transação.
---

## 1. Conteúdo do arquivo

Salve o texto abaixo em um arquivo chamado
`apple-developer-merchantid-domain-association` (sem extensão). É o mesmo
conteúdo para todos os domínios da sua implementação:

<CopyBlock>
7b2276657273696f6e223a312c227073704964223a2238383637324534354136323336423032384645463731323938334343354338354339334633353231433430374142313338414543354144434641334330334442222c22637265617465644f6e223a313735323630333939333937337d
</CopyBlock>

> **Copie exatamente como está**
>
> O conteúdo é validado pela Apple — um espaço ou quebra de linha a mais
> invalida a verificação do domínio.
---

## 2. Publicar o arquivo em cada domínio

O arquivo deve ser publicado no seguinte caminho em **cada domínio** onde o
Apple Pay será utilizado, sem alterar o nome do arquivo:

```
https://<domínio-da-loja>/.well-known/apple-developer-merchantid-domain-association
```

Exemplos:

- `https://dominio1.com.br/.well-known/apple-developer-merchantid-domain-association`
- `https://dominio2.com.br/.well-known/apple-developer-merchantid-domain-association`
- `https://loja3.com.br/.well-known/apple-developer-merchantid-domain-association`

---

## 3. Verificar acessibilidade

Após publicar o arquivo, confirme que ele está acessível:

```bash
curl -I https://<domínio-da-loja>/.well-known/apple-developer-merchantid-domain-association
```

A resposta esperada deve conter:

- `HTTP/2 200 OK` (ou `HTTP/1.1 200 OK`)
- `Content-Type: text/plain`
- Nenhum redirecionamento (nem `301`/`302` de `http` para `https`, nem de
  `www` para o domínio raiz ou vice-versa)

---

## 4. Cadastro do domínio junto à Apple

Com o arquivo publicado e acessível, o cadastro do domínio junto à Apple
muda conforme o seu modelo de integração:

- **Modelo integrado** (instalação via AppStore): o cadastro é feito pela
  Appmax, por API, assim que o domínio é informado na
  [instalação do aplicativo](../../aplicativos/fluxo_instalacao.md) (parâmetro `domain_name` ou
  `domain_names`). Basta que o arquivo já esteja publicado quando isso
  acontecer.
- **Fluxo direto**: você mesmo cadastra o domínio no painel de desenvolvedor
  da Apple, na sua própria conta Apple. A Apple valida o arquivo
  `.well-known` na hora do cadastro.

Em ambos os casos, se o domínio da loja mudar, o novo domínio é tratado como
um domínio novo — republique o arquivo `.well-known` nele e registre-o
novamente (não é necessário criar um novo merchant).

---

## Boas práticas

- **HTTPS é obrigatório**: o domínio deve responder apenas via conexão
  segura.
- **Evite redirecionamentos**: a URL deve responder diretamente com status
  200, sem passar por `www`, `http→https` ou qualquer outro redirect antes
  de chegar ao arquivo.
- **Não altere o conteúdo do arquivo**: ele é validado pela Apple byte a byte.
- **Content-Type**: sirva o arquivo como `text/plain`.
- **Cache-Control sugerido**: `public, max-age=3600`.

Em caso de dúvidas, entre em contato com o suporte técnico da Appmax.

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
