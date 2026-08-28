---
title: Files API — Upload e Gerenciamento de Arquivos Pesados
description: Guia completo para utilização da Files API da Google Gemini API para upload de arquivos pesados (até 2GB por arquivo), ciclo de vida (PROCESSING/ACTIVE/FAILED), polling de estado, listagem e deleção.
---

# Files API — Upload e Gerenciamento de Arquivos Pesados

## 1. Visão Geral da Files API

A **Files API** permite carregar arquivos de mídia de grande porte (áudios longos, vídeos em alta definição, PDFs densos e repositórios de código) para serem referenciados posteriormente em múltiplas chamadas de `generate_content`.

### 1.1. Limites e Características Técnicas

| Característica | Especificação |
| :--- | :--- |
| **Tamanho Máximo por Arquivo** | 2 GB (2.147.483.648 bytes) |
| **Armazenamento Total por Projeto** | 20 GB |
| **Tempo de Retenção (TTL)** | 48 horas (após esse período o arquivo é automaticamente expurgado) |
| **Custo de Upload e Armazenamento** | Gratuito (cobrança ocorre apenas pelos tokens processados no `generate_content`) |
| **Suporte a Inline vs Files API** | Arquivos >20MB DEVEM usar a Files API obrigatoriamente |

---

## 2. Ciclo de Vida do Arquivo (`FileState`)

```text
[ Upload do Arquivo ]
          │
          ▼
┌───────────────────┐
│    PROCESSING     │ ◄─── Vídeos e áudios pesados são decodificados
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐ ┌────────┐
│ ACTIVE │ │ FAILED │
└────────┘ └────────┘
    │           │
    │           └─── Erro no encoding / arquivo corrompido
    ▼
[ Pronto para generateContent ]
```

---

## 3. Upload de Arquivos

### 3.1. Python (`google-genai`)
```python
import time
from google import genai

client = genai.Client()

# Upload simples
uploaded_file = client.files.upload(
    file="documento_corporativo.pdf",
    config={"display_name": "Manual Corporativo 2025"}
)

print(f"Nome do arquivo no sistema: {uploaded_file.name}")
print(f"URI do arquivo: {uploaded_file.uri}")
print(f"Estado inicial: {uploaded_file.state.name}")

# Polling de segurança para arquivos de vídeo ou áudio
while uploaded_file.state.name == "PROCESSING":
    print("Processando arquivo nos servidores do Google...")
    time.sleep(3)
    uploaded_file = client.files.get(name=uploaded_file.name)

if uploaded_file.state.name == "ACTIVE":
    print("Arquivo pronto para inferência!")
```

### 3.2. TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function uploadAndPoll() {
  let file = await ai.files.upload({
    file: 'video_demonstracao.mp4',
    mimeType: 'video/mp4',
  });

  console.log(`Arquivo criado: ${file.name}, Estado: ${file.state}`);

  // Polling de estado
  while (file.state === 'PROCESSING') {
    console.log('Aguardando processamento do vídeo...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    file = await ai.files.get({ name: file.name! });
  }

  if (file.state === 'ACTIVE') {
    console.log('Arquivo ativo e pronto para uso!');
  } else {
    throw new Error(`Falha no processamento: ${file.state}`);
  }
}

uploadAndPoll().catch(console.error);
```

---

## 4. Gerenciamento e Listagem de Arquivos

### 4.1. Listar Arquivos do Projeto

#### Python
```python
from google import genai

client = genai.Client()

# Listar todos os arquivos ativos no projeto
for f in client.files.list():
    print(f"ID: {f.name} | Display: {f.display_name} | Tamanho: {f.size_bytes} bytes | Expira em: {f.expiration_time}")
```

#### TypeScript
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function listFiles() {
  const fileList = await ai.files.list();
  for await (const f of fileList) {
    console.log(`Nome: ${f.name} | Display: ${f.displayName} | Expira: ${f.expirationTime}`);
  }
}

listFiles().catch(console.error);
```

### 4.2. Exclusão Explícita de Arquivos

#### Python
```python
from google import genai

client = genai.Client()

# Deletar arquivo pelo ID (ex: "files/abc123xyz")
client.files.delete(name="files/abc123xyz")
print("Arquivo deletado com sucesso.")
```

#### TypeScript
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function deleteFile(fileName: string) {
  await ai.files.delete({ name: fileName });
  console.log(`Arquivo ${fileName} excluído.`);
}

deleteFile('files/abc123xyz').catch(console.error);
```

---

## 5. Tabela Completa de MIME Types Suportados

| Categoria | Extensões Comuns | MIME Type Oficial |
| :--- | :--- | :--- |
| **Imagens** | `.png`, `.jpeg`, `.jpg`, `.webp`, `.heic` | `image/png`, `image/jpeg`, `image/webp`, `image/heic` |
| **Áudio** | `.mp3`, `.wav`, `.aac`, `.flac`, `.ogg` | `audio/mp3`, `audio/wav`, `audio/aac`, `audio/flac`, `audio/ogg` |
| **Vídeo** | `.mp4`, `.mov`, `.avi`, `.webm`, `.mkv` | `video/mp4`, `video/quicktime`, `video/x-msvideo`, `video/webm` |
| **Documentos**| `.pdf`, `.txt`, `.csv`, `.html`, `.md` | `application/pdf`, `text/plain`, `text/csv`, `text/html`, `text/markdown` |
| **Código** | `.py`, `.js`, `.ts`, `.json`, `.java`, `.cpp` | `text/x-python`, `application/json`, `text/javascript` |
