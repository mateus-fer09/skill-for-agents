---
title: Referência da Files API
description: Endpoints para upload, consulta de metadados, download de conteúdo e exclusão de arquivos persistentes na Claude Platform.
topics:
  - files-api
  - endpoints
  - file-upload
keywords:
  - POST /v1/files
  - GET /v1/files
  - GET /v1/files/<built-in function id>
  - DELETE /v1/files/<built-in function id>
related:
  - mensagens_e_prompting/arquivos_e_pdf.md
  - managed_agents/configuracao_e_ambientes.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/files
  - https://platform.claude.com/docs/en/api/files
---

# Referência da Files API

---

## Endpoints Disponíveis

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/v1/files` | Faz upload de um arquivo (`multipart/form-data`) |
| `GET` | `/v1/files` | Lista todos os arquivos enviados no workspace |
| `GET` | `/v1/files/{file_id}` | Recupera os metadados de um arquivo específico |
| `GET` | `/v1/files/{file_id}/content` | Faz download do conteúdo binário do arquivo |
| `DELETE` | `/v1/files/{file_id}` | Exclui permanentemente um arquivo |

---

## Exemplo de Objeto `File`

```json
{
  "id": "file_01XFDUDYJgAACzvnptvVoYEL",
  "object": "file",
  "bytes": 524288,
  "created_at": 1740000000,
  "filename": "relatorio_auditoria.pdf",
  "purpose": "assistants",
  "mime_type": "application/pdf"
}
```

---

## Veja Também

- [`../mensagens_e_prompting/arquivos_e_pdf.md`](../mensagens_e_prompting/arquivos_e_pdf.md)
