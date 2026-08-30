---
title: "Conceitos de Negócio e Requisitos Técnicos"
description: "Conceitos fundamentais da plataforma Appmax, estrutura de entidades e requisitos técnicos obrigatórios."
topics:
  - conceitos
  - entidades
  - requisitos-tecnicos
  - padroes-arquiteturais
keywords:
  - merchants
  - aplicativos
  - instalacoes
  - pedidos
  - clientes
  - webhooks
  - requisitos
related:
  - ../index_master.md
  - visao_geral.md
  - por_onde_comecar.md
  - identificadores_do_app.md
source_scope:
  - https://docs.appmax.com.br/guides/conceitos
---

# Conceitos de negócio

## O que é a API da Appmax?

A API da Appmax permite criar e gerenciar clientes, pedidos, pagamentos e outros recursos essenciais para o funcionamento de uma loja. Ela é pensada para que desenvolvedores integrem de forma eficiente, garantindo segurança e flexibilidade através da criação de um aplicativo.

## Tipos de aplicativos

##### Aplicativo privado

Ideal para desenvolvedores que desejam integrar e processar vendas exclusivamente em seus próprios ambientes. Esse tipo de app não fica disponível públicamente na base da Appmax, podendo ser acessado apenas por meio de um link compartilhado pelo próprio desenvolvedor.

Permite que parceiros criem soluções personalizadas sem expô-las ao público, garantindo uma experiência mais segura, exclusiva e otimizada.

##### Aplicativo público

Um aplicativo que ficará disponível para toda a base de clientes da Appmax. Com ele, desenvolvedores podem oferecer suas soluções de forma ampla, permitindo que qualquer lojista utilize o app diretamente através da plataforma.

| Característica       | Aplicativo público                                            | Aplicativo privado                                                       |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Exibição na AppStore | Visível para todos os usuários                                | Não aparece na listagem, acesso somente pelo link exclusivo              |
| Forma de acesso      | Disponível na página oficial da Loja de Aplicativos da Appmax | Acesso apenas por link de compartilhamento                               |
| Instalação           | Instalação direta pela Loja de aplicativos da Appmax          | Instalado através de link compartilhado pelo desenvolvedor               |

## Benefícios da AppStore

- Personalização da experiência da loja.
- Integração com serviços externos.
- Adição de recursos diretamente no painel de administração.

## Segurança

- O acesso à API é restrito por par de chaves.
- As chaves são emitidas na instalação do aplicativo e devem ser armazenadas de forma segura.
- O uso de tokens temporários garante que credenciais não fiquem expostas em requisições.

## Requisitos técnicos obrigatórios
| Requisito                | Descrição                                                                     |
| ------------------------ | ----------------------------------------------------------------------------- |
| Autenticação             | Seguir o fluxo de autenticação e autorização descrito na documentação         |
| Segurança Appmax JS      | Implementar o Appmax.js no front-end para proteger dados sensíveis do cartão  |
| Criação de cliente       | Registrar os dados do comprador antes de criar pedidos                        |
| Criação de pedido        | Registrar a compra vinculada a um cliente                                     |
| Pagamentos               | Processar pagamentos via cartão, Pix, boleto ou Apple Pay                    |
| Cálculo de parcelas      | Consultar a rota de parcelas para garantir valores corretos                   |
| Estorno de pagamentos    | Implementar estornos via API ou painel                                        |
| Código de rastreio       | Atualizar pedidos com códigos de rastreio para liberação de saques            |
| Webhooks                 | Receber notificações de eventos em tempo real                                 |

## Funcionalidades opcionais

- **Recorrência:** cobranças periódicas automáticas (em fase beta).
- **Link de pagamento por API:** URL para pagamento rápido sem carrinho completo (em fase beta).
- **Upsell:** estratégia de vendas complementares vinculada a pedidos existentes.
- **Recuperação de vendas com IA:** recuperação de carrinhos abandonados usando inteligência artificial (em fase beta).

## Veja Também

- [Index Master](../index_master.md)
- [Visao Geral](visao_geral.md)
- [Por Onde Comecar](por_onde_comecar.md)
- [Identificadores Do App](identificadores_do_app.md)
