# Master Index e Roteador de Conhecimento - Appmax API

Este arquivo é o **Roteador Principal de Conhecimento** da Skill Appmax API. Ele serve como ponto central de navegação rápida para agentes de IA localizarem exatamente o arquivo correto de acordo com a necessidade da tarefa de integração.

---

## Visão Geral da Tecnologia

A **Appmax** é uma plataforma completa de pagamentos, gateway, adquirente e antifraude para comércio eletrônico. A API REST permite:
- Processar pagamentos via **Cartão de Crédito** (com tokenização PCI-DSS e antifraude integrado), **Pix** (QR Code dinâmico e EMV), **Boleto Bancário** e **Apple Pay**;
- Gerenciar catálogo de **Clientes**, **Produtos** e **Pedidos** (incluindo pedido unificado em 1 passo e upsell 1-click);
- Operar cobrança recorrente e gestão de **Assinaturas** completas;
- Executar **Split de Pagamentos** para marketplaces com onboarding de recebedores, verificação KYC/Facematch, saldos, antecipações e saques bancários;
- Criar e distribuir aplicativos na **Loja de Aplicativos da Appmax** (AppStore) com autenticação OAuth2 e automação de credenciais de merchants;
- Receber eventos em tempo real via **Webhooks** e recuperar carrinhos com **Inteligência Artificial**.

---

## Regras Globais e Diretrizes Técnicas

1. **Autenticação Bearer**:
   - Todas as chamadas à API exigem o cabeçalho `Authorization: Bearer <access_token>`.
   - Obtenha o token via `POST https://admin.sandbox.appmax.com.br/api/v1/oauth/token` (Sandbox) ou `https://admin.appmax.com.br/api/v1/oauth/token` (Produção) passando `client_id` e `client_secret`.
   - **Não existem refresh tokens**: Quando o token expirar (`expires_in`), solicite um novo token com as mesmas credenciais.
2. **Ambientes**:
   - **Sandbox**: `https://admin.sandbox.appmax.com.br/api/v1` (usar chaves emitidas no sandbox).
   - **Produção**: `https://admin.appmax.com.br/api/v1` (usar chaves emitidas em produção).
3. **Segurança de Cartão (PCI-DSS & Appmax JS)**:
   - **Nunca envie dados brutos de cartão do backend**: Sempre utilize o script `appmax.min.js` no frontend para tokenizar o cartão (`POST /v1/payments/tokenize`) e capturar o IP real do cliente.
   - Envie apenas o `card_token` resultante para o endpoint de pagamento `POST /v1/payments/credit-card`.
4. **Identificadores (external-id & app_id)**:
   - `app_id` (Numerical ID) é usado em chamadas e configurações do aplicativo.
   - `external_id` (UUID v4) identifica a instalação específica do aplicativo em uma loja/merchant.
5. **Formatação de Moeda e Valores**:
   - Valores monetários são informados em formato decimal com ponto (ex: `150.00`) ou conforme explicitado em cada schema.
6. **Rate Limit**:
   - Respeite os limites da API e implemente retry com exponential backoff ao receber `HTTP 429 Too Many Requests`.

---

## Tabela de Roteamento por Intenção

Utilize a tabela abaixo para mapear a intenção do desenvolvedor diretamente para o arquivo especializado:

| Intenção do Desenvolvedor | Arquivo a Consultar |
|---|---|
| Visão geral, arquitetura e fluxo fundamental da Appmax | [`fundamentos/visao_geral.md`](fundamentos/visao_geral.md) |
| Orientação de início para lojistas ou desenvolvedores | [`fundamentos/por_onde_comecar.md`](fundamentos/por_onde_comecar.md) |
| Conceitos de negócio, entidades e requisitos técnicos | [`fundamentos/conceitos.md`](fundamentos/conceitos.md) |
| Diferenciar App ID, External ID e URLs do aplicativo | [`fundamentos/identificadores_do_app.md`](fundamentos/identificadores_do_app.md) |
| Entender e solucionar problemas com o `external-id` | [`fundamentos/external_id.md`](fundamentos/external_id.md) |
| Configurar e testar no Sandbox vs. Produção | [`fundamentos/ambientes_e_sandbox.md`](fundamentos/ambientes_e_sandbox.md) |
| Ciclo de vida e significados dos status de pedidos | [`fundamentos/status_pedidos.md`](fundamentos/status_pedidos.md) |
| Passo a passo rápido para o primeiro pagamento | [`primeiros_passos/quickstart.md`](primeiros_passos/quickstart.md) |
| Obter tokens OAuth2 e entender credenciais de app e merchant | [`primeiros_passos/autenticacao.md`](primeiros_passos/autenticacao.md) |
| Implementar `appmax.min.js` para tokenização e IP | [`primeiros_passos/appmax_js.md`](primeiros_passos/appmax_js.md) |
| Criar aplicativo público ou privado na AppStore | [`aplicativos/criar_aplicativo.md`](aplicativos/criar_aplicativo.md) |
| Validar URL de instalação e testar health check | [`aplicativos/validar_url_instalacao.md`](aplicativos/validar_url_instalacao.md) |
| Implementar endpoint de validação (Go, Node.js, PHP) | [`aplicativos/implementar_url_validacao.md`](aplicativos/implementar_url_validacao.md) |
| Fluxo de autorização de instalação pelo lojista | [`aplicativos/fluxo_instalacao.md`](aplicativos/fluxo_instalacao.md) |
| Configurar e processar o `url_callback` de instalação | [`aplicativos/callback_instalacao.md`](aplicativos/callback_instalacao.md) |
| Tratar reinstalação e reaproveitamento de lojas | [`aplicativos/reaproveitar_loja.md`](aplicativos/reaproveitar_loja.md) |
| Automatizar onboarding self-service de credenciais | [`aplicativos/automacao_credenciais.md`](aplicativos/automacao_credenciais.md) |
| Checklist para homologação e publicação em Produção | [`aplicativos/publicacao_producao.md`](aplicativos/publicacao_producao.md) |
| Introdução técnica e padrões da API REST | [`api/introducao.md`](api/introducao.md) |
| Cadastrar ou atualizar dados de clientes/compradores | [`api/clientes/criar_atualizar_cliente.md`](api/clientes/criar_atualizar_cliente.md) |
| Listar, consultar, criar, atualizar ou excluir produtos | [`api/produtos/listar_produtos.md`](api/produtos/listar_produtos.md) |
| Criar pedidos padrão com produtos, frete e desconto | [`api/pedidos/criar_pedido.md`](api/pedidos/criar_pedido.md) |
| Consultar dados completos e transações de um pedido | [`api/pedidos/consultar_pedido.md`](api/pedidos/consultar_pedido.md) |
| Entender fórmulas de cálculo de valor de pedidos | [`api/pedidos/calculo_valor_pedido.md`](api/pedidos/calculo_valor_pedido.md) |
| Criar upsell pós-compra (1-click buy) | [`api/pedidos/upsell.md`](api/pedidos/upsell.md) |
| Inserir código de rastreamento logístico no pedido | [`api/pedidos/codigo_rastreio.md`](api/pedidos/codigo_rastreio.md) |
| Criar cliente, pedido e pagamento em 1 chamada (Pedido Unificado) | [`api/pedidos/pedido_unificado.md`](api/pedidos/pedido_unificado.md) |
| Criar pedido unificado flexível com itens customizados | [`api/pedidos/pedido_unificado_flexivel.md`](api/pedidos/pedido_unificado_flexivel.md) |
| Consultar total líquido e saldos após taxas | [`api/pedidos/total_liquido_e_saldos.md`](api/pedidos/total_liquido_e_saldos.md) |
| Visão geral de pagamentos e pré-requisitos | [`api/pagamentos/visao_geral.md`](api/pagamentos/visao_geral.md) |
| Processar pagamento com Cartão de Crédito e Tokenização | [`api/pagamentos/cartao_credito.md`](api/pagamentos/cartao_credito.md) |
| Gerar cobrança instantânea via Pix (QR Code e EMV) | [`api/pagamentos/pix.md`](api/pagamentos/pix.md) |
| Emitir Boleto Bancário com código de barras e PDF | [`api/pagamentos/boleto.md`](api/pagamentos/boleto.md) |
| Consultar opções e valores de parcelamento com juros | [`api/pagamentos/parcelas.md`](api/pagamentos/parcelas.md) |
| Processar pagamentos via Apple Pay | [`api/pagamentos/apple_pay.md`](api/pagamentos/apple_pay.md) |
| Configurar arquivo `.well-known` para Apple Pay | [`api/pagamentos/apple_pay_dominio.md`](api/pagamentos/apple_pay_dominio.md) |
| Renderizar botão Apple Pay no frontend (Appmax JS) | [`api/pagamentos/apple_pay_appmax_js.md`](api/pagamentos/apple_pay_appmax_js.md) |
| Gerar sessão de merchant do Apple Pay | [`api/pagamentos/apple_pay_merchant_session.md`](api/pagamentos/apple_pay_merchant_session.md) |
| Criar, consultar, pausar, cancelar e gerenciar assinaturas | [`api/assinaturas/criar_assinatura.md`](api/assinaturas/criar_assinatura.md) |
| Pular ciclo ou desfazer skip de fatura em assinatura | [`api/assinaturas/pular_ciclo.md`](api/assinaturas/pular_ciclo.md) |
| Adicionar, remover ou alterar quantidade de produtos na assinatura | [`api/assinaturas/adicionar_produtos.md`](api/assinaturas/adicionar_produtos.md) |
| Solicitar estorno total ou parcial de pagamentos | [`api/estornos/criar_estorno.md`](api/estornos/criar_estorno.md) |
| Criar e consultar Links de Pagamento hospedados | [`api/links_pagamento/criar_link_pagamento.md`](api/links_pagamento/criar_link_pagamento.md) |
| Cadastrar recebedor de split de pagamentos (Fast Onboarding) | [`api/split/criar_recebedor.md`](api/split/criar_recebedor.md) |
| Gerar link de Facematch / KYC biométrico para recebedor | [`api/split/facematch_link.md`](api/split/facematch_link.md) |
| Consultar status cadastral e aprovação de recebedor | [`api/split/consultar_recebedor.md`](api/split/consultar_recebedor.md) |
| Configurar regras de divisão de pedido (Split Order) | [`api/split/criar_split_pedido.md`](api/split/criar_split_pedido.md) |
| Consultar saldos disponíveis e a liberar de recebedor | [`api/split/saldos.md`](api/split/saldos.md) |
| Simular e solicitar antecipação de recebíveis | [`api/split/solicitar_antecipacao.md`](api/split/solicitar_antecipacao.md) |
| Solicitar saque de saldo disponível para conta bancária | [`api/split/saque_disponivel.md`](api/split/saque_disponivel.md) |
| Consultar status de solicitações de saque | [`api/split/consultar_solicitacao_saque.md`](api/split/consultar_solicitacao_saque.md) |
| Extrair relatórios financeiros e de conciliação | [`api/relatorios/relatorios.md`](api/relatorios/relatorios.md) |
| Consultar gestão de saques e prazos de liquidação | [`api/saques/saques.md`](api/saques/saques.md) |
| Configurar webhooks e tratar notificações de eventos | [`guias_e_recursos/webhooks.md`](guias_e_recursos/webhooks.md) |
| Lidar com Rate Limit (HTTP 429) e throttling | [`guias_e_recursos/rate_limit.md`](guias_e_recursos/rate_limit.md) |
| Entender tabelas e regras de cálculo de parcelas | [`guias_e_recursos/calculo_parcelas.md`](guias_e_recursos/calculo_parcelas.md) |
| Integrar recuperação de carrinhos abandonados com IA | [`guias_e_recursos/recuperacao_vendas_ia.md`](guias_e_recursos/recuperacao_vendas_ia.md) |
| Consultar tabela completa de bancos homologados (COMPE) | [`guias_e_recursos/split_bancos_homologados.md`](guias_e_recursos/split_bancos_homologados.md) |
| Matriz de status e regras de transição de split | [`guias_e_recursos/split_status.md`](guias_e_recursos/split_status.md) |
| FAQ e dúvidas frequentes sobre split de pagamentos | [`guias_e_recursos/split_faq.md`](guias_e_recursos/split_faq.md) |
| Conectar Claude, Cursor ou Windsurf via servidor MCP | [`guias_e_recursos/ia_integracao.md`](guias_e_recursos/ia_integracao.md) |
| Especificação técnica das 13 ferramentas MCP Appmax | [`guias_e_recursos/ia_ferramentas_mcp.md`](guias_e_recursos/ia_ferramentas_mcp.md) |
| Recursos llms.txt para modelos de linguagem | [`guias_e_recursos/llms_txt_mcp.md`](guias_e_recursos/llms_txt_mcp.md) |
| FAQ geral e solução de problemas da API Appmax | [`guias_e_recursos/faq.md`](guias_e_recursos/faq.md) |
| Código pronto de integração completa de ponta a ponta | [`exemplos/integracao_completa.md`](exemplos/integracao_completa.md) |
| Código pronto de pagamento parcelado com cartão | [`exemplos/pagamento_parcelado.md`](exemplos/pagamento_parcelado.md) |
| Código pronto de checkout com múltiplos itens e frete | [`exemplos/checkout_multiplos_produtos.md`](exemplos/checkout_multiplos_produtos.md) |

---

## Mapa de Contexto e Catálogo de Arquivos

Abaixo encontra-se a descrição operacional detalhada de cada arquivo pertencente a esta Skill:

### 1. Fundamentos (`fundamentos/`)
- [`fundamentos/visao_geral.md`](fundamentos/visao_geral.md): Visão macro da Appmax, gateway, antifraude, adquirente e ecossistema de apps.
- [`fundamentos/por_onde_comecar.md`](fundamentos/por_onde_comecar.md): Orientação estratégica para lojistas e desenvolvedores de apps.
- [`fundamentos/conceitos.md`](fundamentos/conceitos.md): Definições estruturais de Merchants, Lojas/Sites, Aplicativos e Requisitos Técnicos Obrigatórios.
- [`fundamentos/identificadores_do_app.md`](fundamentos/identificadores_do_app.md): Diferenciação entre App ID (UUID vs. Numerical ID) e URLs cadastradas.
- [`fundamentos/external_id.md`](fundamentos/external_id.md): Funcionamento, geração, escopo e troubleshooting do `external-id`.
- [`fundamentos/ambientes_e_sandbox.md`](fundamentos/ambientes_e_sandbox.md): URLs de sandbox/produção, cartões de teste e homologação.
- [`fundamentos/status_pedidos.md`](fundamentos/status_pedidos.md): Ciclo de vida e transições de status (`pending`, `paid`, `authorized`, `refunded`, etc.).

### 2. Primeiros Passos (`primeiros_passos/`)
- [`primeiros_passos/quickstart.md`](primeiros_passos/quickstart.md): Passo a passo inicial para gerar token, criar cliente, pedido e efetuar pagamento.
- [`primeiros_passos/autenticacao.md`](primeiros_passos/autenticacao.md): Obtenção de token Bearer via OAuth2 (`/oauth/token`), chaves de app e de merchant.
- [`primeiros_passos/appmax_js.md`](primeiros_passos/appmax_js.md): Utilização do `appmax.min.js` para tokenização de cartão e coleta de IP do comprador.

### 3. Aplicativos e AppStore (`aplicativos/`)
- [`aplicativos/criar_aplicativo.md`](aplicativos/criar_aplicativo.md): Criação de apps públicos e privados no painel da AppStore.
- [`aplicativos/validar_url_instalacao.md`](aplicativos/validar_url_instalacao.md): Teste sintético de validação de URL do app disparado pela Appmax.
- [`aplicativos/implementar_url_validacao.md`](aplicativos/implementar_url_validacao.md): Implementação do endpoint de health check em Go, Node.js e PHP.
- [`aplicativos/fluxo_instalacao.md`](aplicativos/fluxo_instalacao.md): Fluxo de autorização do merchant na AppStore e troca de `auth_token`.
- [`aplicativos/callback_instalacao.md`](aplicativos/callback_instalacao.md): Recebimento de credenciais via parâmetro `url_callback`.
- [`aplicativos/reaproveitar_loja.md`](aplicativos/reaproveitar_loja.md): Reinstalação de apps e vinculação a lojas/sites existentes.
- [`aplicativos/automacao_credenciais.md`](aplicativos/automacao_credenciais.md): Serviço automatizado para onboarding self-service de lojistas.
- [`aplicativos/publicacao_producao.md`](aplicativos/publicacao_producao.md): Checklist de go-live e migração para produção.

### 4. API Reference - Clientes e Produtos (`api/clientes/`, `api/produtos/`)
- [`api/introducao.md`](api/introducao.md): Convenções REST, headers, autenticação e formato de resposta da API.
- [`api/clientes/criar_atualizar_cliente.md`](api/clientes/criar_atualizar_cliente.md): `POST /v1/customers` - Cadastro e atualização de compradores.
- [`api/produtos/listar_produtos.md`](api/produtos/listar_produtos.md): `GET /v1/products` - Catálogo paginado com filtros.
- [`api/produtos/consultar_produto.md`](api/produtos/consultar_produto.md): `GET /v1/products/{id}` - Detalhamento de produto e variações.
- [`api/produtos/criar_produto.md`](api/produtos/criar_produto.md): `POST /v1/products` - Criação de produtos físicos e digitais.
- [`api/produtos/atualizar_produto.md`](api/produtos/atualizar_produto.md): `PUT /v1/products/{id}` - Alteração de dados de produtos.
- [`api/produtos/excluir_produto.md`](api/produtos/excluir_produto.md): `DELETE /v1/products/{id}` - Exclusão lógica (soft-delete).

### 5. API Reference - Pedidos (`api/pedidos/`)
- [`api/pedidos/criar_pedido.md`](api/pedidos/criar_pedido.md): `POST /v1/orders` - Criação de pedido com itens, frete e desconto.
- [`api/pedidos/consultar_pedido.md`](api/pedidos/consultar_pedido.md): `GET /v1/orders/{order_id}` - Detalhes completos do pedido e transações.
- [`api/pedidos/calculo_valor_pedido.md`](api/pedidos/calculo_valor_pedido.md): Regras matemáticas e validações de cálculo de valor.
- [`api/pedidos/upsell.md`](api/pedidos/upsell.md): `POST /v1/orders/upsell` - Upsell 1-click após aprovação de pedido.
- [`api/pedidos/codigo_rastreio.md`](api/pedidos/codigo_rastreio.md): `POST /v1/orders/shipping-tracking-code` - Envio de rastreio logístico.
- [`api/pedidos/pedido_unificado.md`](api/pedidos/pedido_unificado.md): `POST /v1/orders/unified-order` - Cliente, pedido e pagamento atômicos.
- [`api/pedidos/pedido_unificado_flexivel.md`](api/pedidos/pedido_unificado_flexivel.md): Pedido unificado com customização dinâmica de itens.
- [`api/pedidos/total_liquido_e_saldos.md`](api/pedidos/total_liquido_e_saldos.md): Cálculo de taxas líquidas e saldos de pedidos.

### 6. API Reference - Pagamentos (`api/pagamentos/`)
- [`api/pagamentos/visao_geral.md`](api/pagamentos/visao_geral.md): Métodos disponíveis e requisitos operacionais.
- [`api/pagamentos/cartao_credito.md`](api/pagamentos/cartao_credito.md): Tokenização e cobrança via cartão de crédito com antifraude.
- [`api/pagamentos/pix.md`](api/pagamentos/pix.md): `POST /v1/payments/pix` - Emissão de QR Code e código EMV.
- [`api/pagamentos/boleto.md`](api/pagamentos/boleto.md): `POST /v1/payments/boleto` - Emissão de boleto bancário com linha digitável e PDF.
- [`api/pagamentos/parcelas.md`](api/pagamentos/parcelas.md): `POST /v1/payments/installments` - Consulta de planos e simulação de juros.
- [`api/pagamentos/apple_pay.md`](api/pagamentos/apple_pay.md): `POST /v1/payments/apple-pay` - Processamento de token Apple Pay.
- [`api/pagamentos/apple_pay_dominio.md`](api/pagamentos/apple_pay_dominio.md): Hospedagem do arquivo `.well-known` para validação de domínio na Apple.
- [`api/pagamentos/apple_pay_appmax_js.md`](api/pagamentos/apple_pay_appmax_js.md): Integração do botão oficial Apple Pay no frontend com JS.
- [`api/pagamentos/apple_pay_merchant_session.md`](api/pagamentos/apple_pay_merchant_session.md): Validação de sessão do merchant para transação Apple Pay.

### 7. API Reference - Assinaturas e Recorrência (`api/assinaturas/`)
- [`api/assinaturas/listar_assinaturas.md`](api/assinaturas/listar_assinaturas.md): `GET /v1/subscriptions` - Listagem paginada com filtros.
- [`api/assinaturas/criar_assinatura.md`](api/assinaturas/criar_assinatura.md): `POST /v1/subscriptions` - Criação de assinatura a partir de pedido aprovado.
- [`api/assinaturas/consultar_assinatura.md`](api/assinaturas/consultar_assinatura.md): `GET /v1/subscriptions/{id}` - Detalhes e ciclos da assinatura.
- [`api/assinaturas/pausar_assinatura.md`](api/assinaturas/pausar_assinatura.md): `PATCH /v1/subscriptions/{id}/pause` - Pausa temporária.
- [`api/assinaturas/reativar_assinatura.md`](api/assinaturas/reativar_assinatura.md): `PATCH /v1/subscriptions/{id}/activate` - Retomada de cobranças.
- [`api/assinaturas/cancelar_assinatura.md`](api/assinaturas/cancelar_assinatura.md): `PATCH /v1/subscriptions/{id}/cancel` - Cancelamento definitivo.
- [`api/assinaturas/alterar_dia_cobranca.md`](api/assinaturas/alterar_dia_cobranca.md): `PATCH /v1/subscriptions/{id}/charge-day` - Ajuste de vencimento.
- [`api/assinaturas/alterar_periodicidade.md`](api/assinaturas/alterar_periodicidade.md): `PATCH /v1/subscriptions/{id}/frequency` - Alteração de periodicidade.
- [`api/assinaturas/pular_ciclo.md`](api/assinaturas/pular_ciclo.md): `PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip` - Pulo de fatura agendada.
- [`api/assinaturas/desfazer_skip_ciclo.md`](api/assinaturas/desfazer_skip_ciclo.md): `PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip` - Restauração de ciclo.
- [`api/assinaturas/atualizar_endereco.md`](api/assinaturas/atualizar_endereco.md): `PATCH /v1/subscriptions/{id}/address` - Atualização de endereço de entrega.
- [`api/assinaturas/atualizar_tag.md`](api/assinaturas/atualizar_tag.md): `PATCH /v1/subscriptions/{id}/tag` - Definição de apelidos/tags.
- [`api/assinaturas/produtos_disponiveis.md`](api/assinaturas/produtos_disponiveis.md): `GET /v1/subscriptions/{id}/available-products` - Itens para cross-sell.
- [`api/assinaturas/adicionar_produtos.md`](api/assinaturas/adicionar_produtos.md): `POST /v1/subscriptions/{id}/products` - Inclusão de itens no plano.
- [`api/assinaturas/alterar_quantidade_produto.md`](api/assinaturas/alterar_quantidade_produto.md): `PATCH /v1/subscriptions/{id}/products/{variantId}/quantity` - Volume de itens.
- [`api/assinaturas/remover_produto.md`](api/assinaturas/remover_produto.md): `DELETE /v1/subscriptions/{id}/products/{variantId}` - Exclusão de item.

### 8. API Reference - Estornos e Links de Pagamento (`api/estornos/`, `api/links_pagamento/`)
- [`api/estornos/criar_estorno.md`](api/estornos/criar_estorno.md): `POST /v1/orders/refund-request` - Reembolso total ou parcial.
- [`api/links_pagamento/criar_link_pagamento.md`](api/links_pagamento/criar_link_pagamento.md): `POST /v1/payment-link` - Geração de checkout hospedado.
- [`api/links_pagamento/consultar_link_pagamento.md`](api/links_pagamento/consultar_link_pagamento.md): `GET /v1/payment-link/{payment_link_id}/orders` - Status e pedidos do link.

### 9. API Reference - Split de Pagamentos (`api/split/`, `api/relatorios/`, `api/saques/`)
- [`api/split/criar_recebedor.md`](api/split/criar_recebedor.md): `POST /v1/recipient` - Onboarding de recebedor com conta bancária.
- [`api/split/criar_recebedor_flexivel.md`](api/split/criar_recebedor_flexivel.md): Cadastro flexível para estruturas customizadas de marketplace.
- [`api/split/facematch_link.md`](api/split/facematch_link.md): `POST /v1/recipient/{hash}/facematch-link` - Link de biometria KYC.
- [`api/split/consultar_recebedor.md`](api/split/consultar_recebedor.md): `GET /v1/recipient/{hash}/status` - Situação cadastral do recebedor.
- [`api/split/criar_split_pedido.md`](api/split/criar_split_pedido.md): `POST /v1/orders/{orderId}/split-order` - Divisão de valores do pedido.
- [`api/split/saldos.md`](api/split/saldos.md): `GET /v1/recipient/{hash}/balances` - Consulta de saldos disponível e futuro.
- [`api/split/simular_antecipacao.md`](api/split/simular_antecipacao.md): Simulação de antecipação de recebíveis.
- [`api/split/solicitar_antecipacao.md`](api/split/solicitar_antecipacao.md): `POST /v1/recipient/{hash}/withdraw-request/anticipation` - Efetivação de antecipação.
- [`api/split/saque_disponivel.md`](api/split/saque_disponivel.md): `POST /v1/recipient/{hash}/withdraw-request/available` - Transferência para conta bancária.
- [`api/split/consultar_solicitacao_saque.md`](api/split/consultar_solicitacao_saque.md): `GET /v1/withdraw-request/{id}` - Consulta de saque.
- [`api/relatorios/relatorios.md`](api/relatorios/relatorios.md): Relatórios consolidados de vendas, taxas e conciliação.
- [`api/saques/saques.md`](api/saques/saques.md): Gestão operacional de saques e liquidação.

### 10. Guias, Recursos, IA e Exemplos (`guias_e_recursos/`, `exemplos/`)
- [`guias_e_recursos/webhooks.md`](guias_e_recursos/webhooks.md): Catálogo completo de eventos de webhook, assinaturas e retries.
- [`guias_e_recursos/rate_limit.md`](guias_e_recursos/rate_limit.md): Limites de requisições, headers e backoff.
- [`guias_e_recursos/calculo_parcelas.md`](guias_e_recursos/calculo_parcelas.md): Regras de juros e repasse ao comprador.
- [`guias_e_recursos/recuperacao_vendas_ia.md`](guias_e_recursos/recuperacao_vendas_ia.md): Ativação de recuperação automática de carrinhos com IA.
- [`guias_e_recursos/split_visao_geral.md`](guias_e_recursos/split_visao_geral.md): Arquitetura geral e fluxo de split para marketplaces.
- [`guias_e_recursos/split_status.md`](guias_e_recursos/split_status.md): Matriz de status de recebedores e saques.
- [`guias_e_recursos/split_bancos_homologados.md`](guias_e_recursos/split_bancos_homologados.md): Lista completa de códigos COMPE de bancos aceitos.
- [`guias_e_recursos/split_faq.md`](guias_e_recursos/split_faq.md): FAQ de regras de estorno, chargeback e saldos no split.
- [`guias_e_recursos/ia_integracao.md`](guias_e_recursos/ia_integracao.md): Integração com Claude, Cursor e Windsurf via MCP.
- [`guias_e_recursos/ia_ferramentas_mcp.md`](guias_e_recursos/ia_ferramentas_mcp.md): 13 ferramentas MCP para agentes autônomos.
- [`guias_e_recursos/llms_txt_mcp.md`](guias_e_recursos/llms_txt_mcp.md): Uso de `llms.txt` e estratégias de prompting para IA.
- [`guias_e_recursos/faq.md`](guias_e_recursos/faq.md): FAQ geral e resolução de dúvidas da API.
- [`exemplos/integracao_completa.md`](exemplos/integracao_completa.md): Código de ponta a ponta (Token -> Cliente -> Pedido -> Pagamento).
- [`exemplos/pagamento_parcelado.md`](exemplos/pagamento_parcelado.md): Código funcional para cálculo de parcelas e envio de cobrança parcelada.
- [`exemplos/checkout_multiplos_produtos.md`](exemplos/checkout_multiplos_produtos.md): Código funcional para pedidos com múltiplos itens, frete e desconto.
