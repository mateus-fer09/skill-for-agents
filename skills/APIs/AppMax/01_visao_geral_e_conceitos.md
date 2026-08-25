# Appmax — Visão Geral e Conceitos

## Modelo de integração

A Appmax combina gateway, antifraude e adquirência em uma plataforma de pagamentos orientada à instalação de aplicativos em lojas.

Fluxo conceitual:

```text
Desenvolvedor
  ↓
Cria aplicativo na AppStore
  ↓
Merchant instala e autoriza
  ↓
Appmax gera credenciais específicas da instalação
  ↓
Backend do integrador autentica com credenciais do merchant
  ↓
API transacional:
clientes → pedidos → pagamentos → pós-venda
```

## App público vs privado

### Aplicativo público

- Visível para usuários da AppStore.
- Indicado para plataformas utilizadas por vários merchants.
- Pode ser instalado diretamente pela loja de aplicativos.

### Aplicativo privado

- Não aparece na listagem pública.
- Acesso por link compartilhado.
- Indicado para integração própria ou para um merchant específico.

## Isolamento por merchant

Cada instalação gera um par de credenciais próprio. Um sistema multi-tenant deve manter associação segura, por exemplo:

```text
merchant_local_id
appmax_merchant_client_id
appmax_merchant_client_secret
external_id
installation_status
created_at
updated_at
```

Nunca reutilize credenciais de um merchant em chamadas de outro.

## Requisitos técnicos obrigatórios identificados

A integração deve contemplar:

- autenticação;
- fluxo de instalação;
- criação de cliente;
- criação de pedido;
- pagamento;
- tokenização/segurança de cartão;
- cálculo de parcelas quando aplicável;
- estorno;
- rastreio de pedido quando aplicável;
- webhooks.

Funcionalidades adicionais incluem:

- assinaturas;
- links de pagamento;
- upsell;
- split;
- recursos de recuperação de vendas.

## Valores monetários

A regra geral da API é trabalhar com centavos inteiros.

```text
R$ 1,00    → 100
R$ 25,90   → 2590
R$ 123,00  → 12300
```

Evite `float` para cálculos financeiros. Use inteiros em centavos ou tipos decimais controlados.

## Fluxo transacional mínimo

```text
1. autenticar merchant
2. criar/atualizar cliente
3. criar pedido
4. selecionar método de pagamento
5. processar pagamento
6. aguardar confirmação síncrona e/ou webhook
7. atualizar estado interno
```

## Segurança

- Guarde `client_secret` somente no backend.
- Não exponha credenciais em frontend.
- Tokens são temporários.
- Dados sensíveis de cartão devem ser tokenizados.
- Para tokenização server-side, considere escopo PCI-DSS.
- `external_id` não é segredo de autenticação, mas deve ser persistido corretamente como configuração da instalação.
