---
title: "Índice Master e Roteador Semântico — Pine Script v5 / v6"
description: "Roteador de intenções técnicas, catálogo de símbolos, namespaces e guia de navegação modular para desenvolvimento Pine Script."
category: "Index & Routing"
version: "Pine Script v5 / v6"
tags:
  - index
  - routing
  - reference
  - pine-script
---

# Índice Master e Roteador Semântico de Conhecimento

Este arquivo serve como o ponto central de roteamento para qualquer agente de IA ou desenvolvedor que precise localizar rapidamente a documentação exaustiva, sintaxe, regras de compilação e exemplos práticos para Pine Script v5 e v6.

---

## Tabela de Roteamento por Intenção do Usuário

| Intenção do Desenvolvedor | Tópico Principal | Arquivo de Destino |
|---|---|---|
| Criar um novo indicador básico com overlay e plots | Declaração e primeiro indicador | `primeiros_passos/introducao_e_primeiro_indicador.md` |
| Organizar a estrutura do código, identação e Pine Editor | Estrutura léxica e compilador | `primeiros_passos/estrutura_do_script_e_compilador.md` |
| Entender como o Pine executa barra a barra e lida com ticks | Modelo de execução e cálculo de barras | `modelo_de_execucao_e_series/modelo_de_execucao_barras.md` |
| Acessar valores passados de variáveis e tratar valores `na` | Time series e operador histórico `[]` | `modelo_de_execucao_e_series/time_series_e_operador_historico.md` |
| Executar lógica apenas no fechamento da barra ou na última barra | Estados de barra (`barstate.*`) | `modelo_de_execucao_e_series/bar_states_e_ciclo_de_vida.md` |
| Resolver erros de tipo (`series` vs `simple` vs `const`) | Sistema de tipos e qualificadores | `sistema_de_tipos_e_sintaxe/sistema_de_tipos_e_qualificadores.md` |
| Manter valores persistentes entre barras sem resetar (`var`/`varip`) | Declaração e reatribuição (`:=`) | `sistema_de_tipos_e_sintaxe/declaracao_de_variaveis_e_reassociacao.md` |
| Usar operadores lógicos, ternários e precedência | Operadores aritméticos e lógicos | `sistema_de_tipos_e_sintaxe/operadores_aritmeticos_e_logicos.md` |
| Criar ramificações condicionais (`if`, `else if`, `switch`) | Estruturas condicionais | `sistema_de_tipos_e_sintaxe/estruturas_condicionais_if_switch.md` |
| Iterar sobre coleções ou calcular laços repetitivos | Laços `for`, `for...in` e `while` | `sistema_de_tipos_e_sintaxe/estruturas_de_repeticao_for_while.md` |
| Criar funções personalizadas com múltiplos retornos (UDFs) | Funções definidas pelo usuário | `sistema_de_tipos_e_sintaxe/funcoes_definidas_pelo_usuario_udf.md` |
| Definir estruturas de dados personalizadas (classes/structs) | Objetos e User-Defined Types (UDT) | `estruturas_de_dados_avancadas/objetos_e_user_defined_types_udt.md` |
| Criar seleções tipadas e menus dropdown seguros | Enums tipados e `input.enum()` | `estruturas_de_dados_avancadas/enums_e_tipagem_enumerada.md` |
| Criar vetores dinâmicos, filas, pilhas e cálculos estatísticos | Arrays dinâmicos (`array.*`) | `estruturas_de_dados_avancadas/arrays_vetores_dinamicos.md` |
| Trabalhar com matrizes 2D, determinantes e regressão | Matrizes e álgebra linear (`matrix.*`) | `estruturas_de_dados_avancadas/matrizes_e_algebra_linear.md` |
| Armazenar pares chave-valor com busca rápida O(1) | Dicionários e mapas (`map.*`) | `estruturas_de_dados_avancadas/maps_dicionarios_chave_valor.md` |
| Implementar métodos orientados a objetos encadeáveis (`.`) | Métodos de tipo (`method`) | `estruturas_de_dados_avancadas/metodos_orientacao_a_objetos.md` |
| Desenhar curvas, velas personalizadas, formas e caracteres | Plotagem gráfica avançada | `visualizacao_e_elementos_graficos/plotagem_e_linhas_graficas.md` |
| Criar nuvens de tendência, preenchimentos e fundos dinâmicos | Preenchimentos e `bgcolor()` | `visualizacao_e_elementos_graficos/preenchimentos_e_backgrounds.md` |
| Desenhar linhas de suporte/resistência, zonas e polígonos | Linhas, Caixas e Polilinhas (`line/box/polyline`) | `visualizacao_e_elementos_graficos/linhas_caixas_e_polilinhas.md` |
| Criar painéis HUD, placares e etiquetas de preço dinâmicas | Rótulos (`label.*`) e Tabelas (`table.*`) | `visualizacao_e_elementos_graficos/rotulos_labels_e_tabelas.md` |
| Adicionar configurações customizadas no painel do usuário | Inputs e configurações de script | `entradas_alertas_e_dados_externos/inputs_e_configuracoes_do_usuario.md` |
| Configurar alertas para automação de ordens e webhooks | Sistema de alertas e mensagens dinâmicas | `entradas_alertas_e_dados_externos/sistema_de_alertas.md` |
| Importar dados de outros tempos gráficos ou ativos sem repainting | Multi-timeframe e `request.security()` | `entradas_alertas_e_dados_externos/multi_timeframe_request_security.md` |
| Declarar uma estratégia quantitativa com comissões e slippage | Estrutura de estratégias | `estrategias_e_backtesting/estrutura_de_estrategias.md` |
| Programar entradas a mercado, stops, alvos e trailing stops | Ordens e posições (`strategy.entry/exit`) | `estrategias_e_backtesting/ordens_e_posicoes_strategy_entry_exit.md` |
| Analisar métricas de performance e evitar repainting em backtest | Métricas e validação de backtest | `estrategias_e_backtesting/metricas_e_repainting_em_estrategias.md` |
| Criar e exportar funções modulares em bibliotecas públicas/privadas | Criação e publicação de bibliotecas | `bibliotecas_boas_praticas_e_troubleshooting/criacao_e_publicacao_de_bibliotecas.md` |
| Otimizar código lento, limites de memória e padrão de escrita | Guia de estilo e limites de runtime | `bibliotecas_boas_praticas_e_troubleshooting/guia_de_estilo_e_otimizacao.md` |
| Diagnosticar e corrigir erros de compilação ou runtime | Catálogo de erros e soluções | `bibliotecas_boas_praticas_e_troubleshooting/catalogo_de_erros_e_solucoes.md` |
| Atualizar código antigo de Pine v3/v4 para Pine v5 e v6 | Guia de migração e conversão | `bibliotecas_boas_praticas_e_troubleshooting/migracao_para_pine_v5_e_v6.md` |

---

## Mapa Rápido de Namespaces Built-in

| Namespace | Propósito Principal | Módulo Relacionado |
|---|---|---|
| `ta.*` | Análise técnica (médias móveis, RSI, MACD, desvio padrão, etc.) | `sistema_de_tipos_e_sintaxe/`, `primeiros_passos/` |
| `math.*` | Funções matemáticas puras (abs, round, floor, ceil, sin, cos, pow) | `sistema_de_tipos_e_sintaxe/operadores_aritmeticos_e_logicos.md` |
| `request.*` | Dados externos, outros timeframes (`security`), finanças corporativas e economia | `entradas_alertas_e_dados_externos/multi_timeframe_request_security.md` |
| `strategy.*` | Funções de backtesting de estratégias, ordens, posições e métricas | `estrategias_e_backtesting/` |
| `array.*` | Manipulação de vetores dinâmicos unidimensionais | `estruturas_de_dados_avancadas/arrays_vetores_dinamicos.md` |
| `matrix.*` | Matrizes bidimensionais e operações de álgebra linear | `estruturas_de_dados_avancadas/matrizes_e_algebra_linear.md` |
| `map.*` | Tabelas de dispersão chave-valor associativas | `estruturas_de_dados_avancadas/maps_dicionarios_chave_valor.md` |
| `line.*` | Desenho e manipulação dinâmica de segmentos de linha | `visualizacao_e_elementos_graficos/linhas_caixas_e_polilinhas.md` |
| `box.*` | Desenho de retângulos e zonas de suporte/resistência | `visualizacao_e_elementos_graficos/linhas_caixas_e_polilinhas.md` |
| `polyline.*` | Desenho de figuras geométricas contínuas e polígonos | `visualizacao_e_elementos_graficos/linhas_caixas_e_polilinhas.md` |
| `label.*` | Criação de caixas de texto flutuantes no gráfico | `visualizacao_e_elementos_graficos/rotulos_labels_e_tabelas.md` |
| `table.*` | Construção de dashboards e tabelas fixas no painel | `visualizacao_e_elementos_graficos/rotulos_labels_e_tabelas.md` |
| `input.*` | Parâmetros customizáveis para a interface do usuário | `entradas_alertas_e_dados_externos/inputs_e_configuracoes_do_usuario.md` |
| `str.*` | Concatenação, formatação e manipulação de cadeias de caracteres | `entradas_alertas_e_dados_externos/sistema_de_alertas.md` |
| `color.*` | Criação de cores RGB, transparência e gradientes dinâmicos | `visualizacao_e_elementos_graficos/preenchimentos_e_backgrounds.md` |
| `barstate.*` | Variáveis booleanas do ciclo de vida e estado da barra | `modelo_de_execucao_e_series/bar_states_e_ciclo_de_vida.md` |
| `timeframe.*` | Propriedades do tempo gráfico atual (período, multiplicador) | `entradas_alertas_e_dados_externos/multi_timeframe_request_security.md` |
| `syminfo.*` | Metadados do ativo (ticker, ponto, moeda, tipo de mercado) | `entradas_alertas_e_dados_externos/sistema_de_alertas.md` |
