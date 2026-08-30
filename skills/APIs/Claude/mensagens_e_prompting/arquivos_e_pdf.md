---
title: Files API e Suporte Nativo a PDF
description: Upload e processamento persistente de arquivos, análise visual e textual de documentos PDF, OCR e limites operacionais.
topics:
  - files-api
  - pdf
  - visual-document-analysis
  - ocr
keywords:
  - Files API
  - PDF support
  - document parsing
  - visual pdf
related:
  - mensagens_e_prompting/messages_api.md
  - referencia_api/endpoints_files.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/files
  - https://platform.claude.com/docs/pt-BR/build-with-claude/pdf-support
---

# Files API e Suporte Nativo a PDF

A Claude Platform oferece suporte de primeira classe para ingestão, análise e interpretação de documentos PDF e arquivos em múltiplos formatos.

---

## 1. Suporte Nativo a PDF na Messages API

Você pode enviar documentos PDF diretamente dentro do array `content` das mensagens codificados em base64:

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 2048,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "document",
          "source": {
            "type": "base64",
            "media_type": "application/pdf",
            "data": "JVBERi0xLjQKJ..."
          }
        },
        {
          "type": "text",
          "text": "Analise este relatório trimestral e resuma os principais indicadores de EBITDA e fluxo de caixa livre."
        }
      ]
    }
  ]
}
```

### Recursos do Motor de PDF da Anthropic
- **Compreensão Textual e Visual**: Extrai texto digital e analisa visualmente tabelas, gráficos, fluxogramas e diagramas incorporados no PDF.
- **OCR Integrado**: Reconhece texto em PDFs escaneados ou contendo imagens de baixa resolução.
- **Limite de Páginas**: Suporta até **100 páginas** por documento PDF enviado diretamente na requisição.

---

## 2. Files API (`/v1/files`) para Arquivos Persistentes

Para arquivos que serão referenciados repetidamente ou em sessões de Managed Agents, utilize a **Files API**:

### Upload de Arquivo:

```bash
curl https://api.anthropic.com/v1/files \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: files-2025-01-01" \
     -F "file=@contrato_auditoria.pdf" \
     -F "purpose=assistants"
```

### Resposta de Upload:

```json
{
  "id": "file_01XFDUDYJgAACzvnptvVoYEL",
  "object": "file",
  "bytes": 1048576,
  "created_at": 1740000000,
  "filename": "contrato_auditoria.pdf",
  "purpose": "assistants"
}
```

---

## Veja Também

- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../referencia_api/endpoints_files.md`](../referencia_api/endpoints_files.md)
- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
