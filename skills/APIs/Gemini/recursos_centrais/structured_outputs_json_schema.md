---
title: Structured Outputs — Garantia de Saídas Estruturadas com JSON Schema
description: Guia completo para forçar respostas JSON estritas na Google Gemini API usando Pydantic em Python e Schemas JSON declarativos em TypeScript/Node.js com response_mime_type e response_schema.
---

# Structured Outputs — Garantia de Saídas Estruturadas com JSON Schema

## 1. Visão Geral

O recurso de **Structured Outputs** (Saídas Estruturadas) garante que o modelo responda estritamente de acordo com uma estrutura formal (JSON Schema). O Gemini utiliza decodificação com restrição gramatical (*constrained decoding*), eliminando a ocorrência de JSON inválido, campos ausentes ou texto extra fora do JSON.

```text
┌────────────────────────────────────────────────────────┐
│                   CONFIGURAÇÃO REQUERIDA               │
│  - response_mime_type = "application/json"             │
│  - response_schema = PydanticModel / JSON Schema       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               CONSTRAINED DECODING ENGINE              │
│  (Força a geração token a token dentro da gramática)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               RESPOSTA 100% VÁLIDA GARANTIDA           │
│  { "nome": "...", "itens": [...], "status": "CONCLUIDO"│
└────────────────────────────────────────────────────────┘
```

---

## 2. Implementação em Python com Pydantic

No SDK `google-genai`, você pode passar diretamente uma classe Pydantic para `response_schema`.

```python
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

client = genai.Client()

# 1. Definição do Enum
class StatusPedido(str, Enum):
    PENDENTE = "PENDENTE"
    PROCESSANDO = "PROCESSANDO"
    ENVIADO = "ENVIADO"
    CANCELADO = "CANCELADO"

# 2. Definição do Schema de Item
class ItemPedido(BaseModel):
    produto: str = Field(description="Nome do produto")
    quantidade: int = Field(description="Quantidade solicitada", ge=1)
    preco_unitario: float = Field(description="Preço unitário em BRL")

# 3. Definição do Schema Principal
class PedidoExtraido(BaseModel):
    id_pedido: str = Field(description="Identificador único do pedido")
    cliente: str = Field(description="Nome completo do comprador")
    email: Optional[str] = Field(None, description="E-mail de contato")
    itens: List[ItemPedido] = Field(description="Lista de itens comprados")
    status: StatusPedido = Field(description="Status atual do pedido")
    valor_total: float = Field(description="Soma total calculada")

# 4. Execução da Geração com Schema
texto_email = """
Olá, aqui é o Roberto Silva (roberto.silva@empresa.com).
Gostaria de confirmar o pedido PED-9821.
Comprei 2 unidades do Teclado Mecânico RGB por R$ 350,00 cada
e 1 Mouse Sem Fio por R$ 150,00.
O total deu R$ 850,00 e o status está como PROCESSANDO.
"""

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=f"Extraia os dados estruturados do seguinte e-mail:
{texto_email}",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=PedidoExtraido
    )
)

print("JSON Puro Retornado:")
print(response.text)

# 5. Desserialização direta no objeto tipado
pedido = PedidoExtraido.model_validate_json(response.text)
print(f"
Cliente validado: {pedido.cliente}")
print(f"Quantidade de itens: {len(pedido.itens)}")
```

---

## 3. Implementação em TypeScript (`@google/genai`)

No SDK `@google/genai`, o schema é declarado usando os tipos do enum `Type`.

```typescript
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({});

// 1. Definição declarativa do JSON Schema
const schemaPedido: Schema = {
  type: Type.OBJECT,
  properties: {
    idPedido: { type: Type.STRING, description: 'Identificador único do pedido' },
    cliente: { type: Type.STRING, description: 'Nome do cliente' },
    email: { type: Type.STRING, description: 'E-mail do comprador' },
    status: {
      type: Type.STRING,
      enum: ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'CANCELADO'],
    },
    itens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          produto: { type: Type.STRING },
          quantidade: { type: Type.INTEGER },
          precoUnitario: { type: Type.NUMBER },
        },
        required: ['produto', 'quantidade', 'precoUnitario'],
      },
    },
    valorTotal: { type: Type.NUMBER },
  },
  required: ['idPedido', 'cliente', 'status', 'itens', 'valorTotal'],
};

async function extrairPedido() {
  const textoEmail = `
    Pedido PED-9821 para Roberto Silva (roberto.silva@empresa.com).
    Itens: 2 Teclados Mecânicos a R$ 350 cada e 1 Mouse Sem Fio a R$ 150.
    Status: PROCESSANDO. Total: R$ 850.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Extraia os dados estruturados do texto:
${textoEmail}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schemaPedido,
    },
  });

  const pedido = JSON.parse(response.text!);
  console.log('Objeto JSON parseado com sucesso:', pedido);
}

extrairPedido().catch(console.error);
```

---

## 4. Implementação via cURL / REST API

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [{"text": "Gere uma lista de 3 capitais da Europa com população."}]
    }],
    "generationConfig": {
      "responseMimeType": "application/json",
      "responseSchema": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "cidade": { "type": "STRING" },
            "pais": { "type": "STRING" },
            "populacao": { "type": "INTEGER" }
          },
          "required": ["cidade", "pais", "populacao"]
        }
      }
    }
  }'
```
