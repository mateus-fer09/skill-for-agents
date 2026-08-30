---
title: "Visão Geral da API Appmax"
description: "Introdução à API da Appmax, ecossistema da Loja de Aplicativos e fluxo fundamental de pagamentos."
topics:
  - visao-geral
  - arquitetura
  - loja-de-aplicativos
  - fluxo-basico
keywords:
  - appmax
  - api
  - gateway
  - adquirencia
  - antifraude
  - loja de aplicativos
  - appstore
related:
  - ../index_master.md
  - por_onde_comecar.md
  - conceitos.md
  - identificadores_do_app.md
source_scope:
  - https://docs.appmax.com.br/
---

# Appmax API

## Documentação para desenvolvedores

Integre pagamentos, pedidos e clientes ao seu aplicativo com a API da Appmax.

- [Quickstart](../primeiros_passos/quickstart.md)
- [API Reference](../api/introducao.md)

- [Clientes](../api/clientes/criar_atualizar_cliente.md): Crie e atualize clientes vinculados ao seu aplicativo com dados de contato, endereços e documentos.
- [Pedidos](../api/pedidos/criar_pedido.md): Crie pedidos com produtos físicos ou digitais, consulte status e gerencie o ciclo completo.
- [Pagamentos](../api/pagamentos/cartao_credito.md): Processe pagamentos via cartão de crédito, Pix, boleto ou Apple Pay com antifraude integrado.
- [Recorrência](../api/assinaturas/criar_assinatura.md): Crie assinaturas com cobrança automática recorrente para modelos de negócio por assinatura.
- [Estornos](../api/estornos/criar_estorno.md): Solicite estornos totais ou parciais de pagamentos processados pela plataforma.
- [Webhooks](../guias_e_recursos/webhooks.md): Receba notificações em tempo real sobre mudanças de status de pedidos e pagamentos.

## Loja de Aplicativos

    
A Loja de Aplicativos da Appmax permite que terceiros criem aplicativos para oferecer serviços aos comerciantes, e que comerciantes adicionem funcionalidades extras às suas próprias lojas.

    
Gateway, antifraude e adquirência em um só lugar para entregar alta performance com simplicidade.

    [Criar seu aplicativo →](../aplicativos/criar_aplicativo.md)
  
  
    ![Desenvolvedora integrando a API](https://docs.appmax.com.br/images/programmer_woman.webp)
  

  
Como funciona

  
    
      1
      
        **Autentique**
        Obtenha um token Bearer com as credenciais do merchant
      
    
    
      2
      
        **Crie o cliente**
        Registre os dados do comprador
      
    
    
      3
      
        **Crie o pedido**
        Adicione produtos e vincule ao cliente
      
    
    
      4
      
        **Pague**
        Processe o pagamento com o método escolhido
      
    
  

  
    
Segurança

    
      
- Acesso restrito por par de chaves (<code>client_id</code> e <code>client_secret</code>).
      
- Chaves emitidas na instalação do app — armazene com segurança.
      
- Tokens temporários evitam expor credenciais nas requisições.
    
  
  
    
Próximos passos

- [Quickstart](../primeiros_passos/quickstart.md): Guia rápido para processar seu primeiro pagamento.
- [Exemplo completo](../exemplos/integracao_completa.md): Passo a passo com código pronto para copiar.
- [Conceitos](conceitos.md): Entenda os conceitos fundamentais da plataforma.

## Veja Também

- [Index Master](../index_master.md)
- [Por Onde Comecar](por_onde_comecar.md)
- [Conceitos](conceitos.md)
- [Identificadores Do App](identificadores_do_app.md)
