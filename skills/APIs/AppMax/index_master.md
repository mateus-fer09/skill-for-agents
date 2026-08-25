# Appmax API — Índice Mestre para Agentes de IA

> Base reorganizada a partir da documentação pública da Appmax consultada em 24/08/2026.
> Objetivo: funcionar como roteador de contexto para agentes com Tool Calling, RAG e geração de integrações.

## Propósito geral

A Appmax oferece uma API de pagamentos integrada a um modelo de AppStore. O integrador cria um aplicativo e, a partir da instalação desse app em uma loja/merchant, recebe credenciais específicas daquele merchant. Essas credenciais são então usadas para operações transacionais como criação de clientes, pedidos, pagamentos, assinaturas, estornos, links de pagamento e split.

O modelo é diferente de gateways em que cada conta recebe uma única chave estática: na Appmax existe separação entre:

- **credenciais do aplicativo**: usadas no fluxo de instalação;
- **credenciais do merchant**: usadas nas operações da API após a instalação;
- **token Bearer temporário**: emitido por OAuth2 Client Credentials e válido por 1 hora;
- **`external_id` / `external-id`**: identificador da instalação da aplicação em uma loja.

## Regras absolutas

1. Não use credenciais do app para criar clientes, pedidos ou pagamentos.
2. Não use credenciais do merchant para iniciar o fluxo de instalação do app.
3. Tokens Bearer expiram em aproximadamente 1 hora.
4. A API não utiliza refresh token no fluxo documentado; ao expirar, gere um novo token com `client_id` e `client_secret`.
5. Em chamadas autenticadas, use `Authorization: Bearer {TOKEN}`.
6. Em JSON, use `Content-Type: application/json` e `Accept: application/json`.
7. Valores monetários usados nas rotas transacionais devem ser tratados conforme o contrato da rota; a regra geral documentada é valor inteiro em centavos.
8. Um pedido deve estar associado a um cliente previamente criado.
9. Guarde o `customer_id` e o `order_id`; eles são usados nas etapas seguintes.
10. Para cartão, não transporte PAN/CVV diretamente pelo backend normal do checkout; use tokenização. Tokenização server-side implica requisitos PCI-DSS.
11. Para split, crie o split antes de o pedido chegar ao status `aprovado`.
12. Pedidos com split não aceitam estorno parcial; apenas estorno total.
13. O split é calculado sobre o valor líquido do pedido após taxas da Appmax.
14. Um recebedor só deve participar de split após onboarding/KYC concluído.
15. O `external_id` é gerado pelo integrador durante o health check e deve ser persistido associado ao merchant.
16. `external_id` no JSON e `external-id` em header representam o mesmo identificador.
17. Para Pix, derive o cronômetro a partir de `pix_expiration_date`; não fixe uma duração local.
18. Para boleto, disponibilize o `pdf_url` por redirecionamento/download; a documentação recomenda não embutir o PDF em iframe.
19. Para alteração de produtos em assinatura, respeite o estado operacional da assinatura e as restrições de cobrança em andamento.
20. Alterar endereço da assinatura altera o cadastro do cliente e afeta operações futuras ligadas a esse cliente.

## URLs base

| Ambiente | Auth | API |
|---|---|---|
| Sandbox | `https://auth.sandboxappmax.com.br` | `https://api.sandboxappmax.com.br` |
| Produção | `https://auth.appmax.com.br` | `https://api.appmax.com.br` |

## Mapa de contexto

### `01_visao_geral_e_conceitos.md`
Leia **SE** a pergunta envolver arquitetura geral da Appmax, AppStore, app público/privado, conceitos de merchant, segurança, fluxo global ou requisitos obrigatórios.

### `02_ambientes_autenticacao_e_headers.md`
Leia **SE** a pergunta envolver sandbox, produção, OAuth2, token Bearer, `client_id`, `client_secret`, expiração de token, headers, envelopes de resposta ou códigos HTTP.

### `03_appstore_instalacao_external_id.md`
Leia **SE** a pergunta envolver criação/instalação de aplicativo, `/app/authorize`, `/app/client/generate`, callback, health check, `external_key`, `url_callback`, `external_id`, reutilização de loja ou geração de credenciais.

### `04_clientes_produtos_pedidos.md`
Leia **SE** a pergunta envolver clientes, catálogo de produtos, criação/consulta de pedido, cálculo de valor, rastreio, `customer_id`, `order_id`, SKU ou `unit_value`.

### `05_pagamentos_appmax_js_parcelas.md`
Leia **SE** a pergunta envolver cartão, tokenização, Pix, boleto, Apple Pay, cálculo de parcelas, Appmax JS, QR Code, linha digitável ou fluxo de pagamento.

### `06_webhooks_eventos.md`
Leia **SE** a pergunta envolver webhooks, eventos de pedido/pagamento/cliente/assinatura, payload recebido, `event`, `event_type`, `site_id`, `app_id`, `partner_merchant` ou processamento assíncrono.

### `07_assinaturas.md`
Leia **SE** a pergunta envolver recorrência, criar/consultar/pausar/reativar/cancelar assinatura, ciclos, mudança de periodicidade, dia de cobrança, endereço, tag ou produtos de assinatura.

### `08_estornos_e_links_pagamento.md`
Leia **SE** a pergunta envolver refund/estorno ou links de pagamento hospedados pela Appmax.

### `09_split_pagamentos.md`
Leia **SE** a pergunta envolver marketplace, recipient/recebedor, KYC/facematch, split, saldos, saque, antecipação, `recipient_hash`, `partner_total` ou status de onboarding.

### `10_status_erros_e_regras.md`
Leia **SE** a pergunta envolver códigos HTTP, erros, status, invariantes, validações, comportamento em falha ou regras que devem ser aplicadas antes de chamar uma rota.

### `11_exemplos_integracao.md`
Leia **SE** o agente precisar gerar código, pseudocódigo ou descrever um fluxo completo de integração ponta a ponta.

### `12_fontes_e_cobertura.md`
Leia **SE** precisar verificar de onde uma informação veio, quais páginas foram mapeadas, quais páginas apresentaram erro de coleta ou onde confirmar uma informação diretamente na documentação oficial.

## Estratégia recomendada para agentes

1. Leia este arquivo.
2. Classifique a intenção da pergunta.
3. Consulte apenas 1–3 módulos diretamente relacionados.
4. Antes de gerar código:
   - valide ambiente;
   - valide tipo de credencial;
   - valide unidade monetária;
   - valide IDs pré-requisitos;
   - valide restrições específicas da rota.
5. Para pagamentos com cartão, consulte sempre `05_pagamentos_appmax_js_parcelas.md`.
6. Para integrações multi-merchant, consulte sempre `03_appstore_instalacao_external_id.md`.
7. Para marketplaces, consulte sempre `09_split_pagamentos.md`.
