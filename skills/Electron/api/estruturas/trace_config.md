---
title: "Objeto TraceConfig"
description: "- recording_mode string (opcional) - Pode ser record-until-full , record-continuously , record-as-much-as-possible ou trace-to-console . O padrão é record-until-full ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto TraceConfig"
  - "recording_mode"
  - "trace_buffer_size_in_kb"
  - "trace_buffer_size_in_events"
  - "enable_argument_filter"
  - "included_categories"
  - "excluded_categories"
  - "included_process_ids"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/trace-config"
---

# Objeto TraceConfig

- `recording_mode` string (opcional) - Pode ser `record-until-full`, `record-continuously`, `record-as-much-as-possible` ou `trace-to-console`. O padrão é `record-until-full`.

- `trace_buffer_size_in_kb` number (opcional) - tamanho máximo do buffer de gravação de rastro em kilobytes. O padrão é 100MB.

- `trace_buffer_size_in_events` number (opcional) - tamanho máximo do buffer de gravação de rastro em events.

- `enable_argument_filter` boolean (opcional) - se verdadeiro, filtra dados de evento de acordo com uma lista específica de eventos que foram manualmente avaliados para não incluir nenhum PII. See [the implementation in Chromium](https://chromium.googlesource.com/chromium/src/+/main/services/tracing/public/cpp/trace_event_args_allowlist.cc) for specifics.

- `included_categories` string[] (opcional) - uma lista de categorias de rastreamento para incluir. Pode incluir padrões glob-like usando `*` no final do nome da categoria. Veja [categorias de rastreamento](https://chromium.googlesource.com/chromium/src/+/main/base/trace_event/builtin_categories.h) para a lista de categorias.

- `excluded_categories` string[] (opcional) - uma lista de categorias de rastreamento a excluir. Pode incluir padrões glob-like usando `*` no final do nome da categoria. Veja [categorias de rastreamento](https://chromium.googlesource.com/chromium/src/+/main/base/trace_event/builtin_categories.h) para a lista de categorias.

- `included_process_ids` número[] (opcional) - uma lista de IDs de processo a incluir no rastreamento. Se não especificado, rastreie todos os processos.

- `histogram_names` string[] (opcional) - uma lista de nomes de [histogramas](https://chromium.googlesource.com/chromium/src.git/+/HEAD/tools/metrics/histograms/README.md) para reportar com o rastreamento.

- `memory_dump_config` Record<string, any> (optional) - if the `disabled-by-default-memory-infra` category is enabled, this contains optional additional configuration for data collection. See the [Chromium memory-infra docs](https://chromium.googlesource.com/chromium/src/+/main/docs/memory-infra/memory_infra_startup_tracing.md#the-advanced-way) for more information.

Um exemplo de TraceConfig que corresponde aproximadamente ao que as Chrome DevTools registram:

```javascript
{  
  recording_mode: 'record-until-full',  
  included_categories: [  
    'devtools.timeline',  
    'disabled-by-default-devtools.timeline',  
    'disabled-by-default-devtools.timeline.frame',  
    'disabled-by-default-devtools.timeline.stack',  
    'v8.execute',  
    'blink.console',  
    'blink.user_timing',  
    'latencyInfo',  
    'disabled-by-default-v8.cpu_profiler',  
    'disabled-by-default-v8.cpu_profiler.hires'  
  ],  
  excluded_categories: ['*']  
}  

```
