---
title: Structured Outputs (JSON Schema Estrito)
description: Como garantir 100% de aderência a esquemas JSON estruturados com Structured Outputs, Pydantic, Zod e restrições de JSON Schema estrito.
topics:
  - structured-outputs
  - json-schema
  - strict-mode
  - pydantic
  - zod
keywords:
  - response_format
  - json_schema
  - strict
  - Pydantic
  - zod
  - zodResponseFormat
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../ferramentas_e_mcp/function_calling.md
  - ../exemplos/structured_data_extraction.md
source_scope:
  - https://developers.openai.com/api/docs/guides/structured-outputs.md
---

# Structured Outputs (Saídas Estruturadas com JSON Schema Estrito)

O recurso **Structured Outputs** garante que as respostas do modelo sigam com **100% de fidelidade** um esquema JSON definido pelo desenvolvedor, eliminando respostas malformadas ou campos ausentes.

---

## 1. Como Funciona o Modo Estrito (`strict: true`)

Quando `strict: true` é habilitado:
1. O modelo é constrangido durante o processo de amostragem de tokens (*grammar-constrained sampling*) para emitir exclusivamente tokens que satisfaçam o JSON Schema fornecido.
2. Todas as chaves do objeto devem ser listadas em `required`.
3. Não são permitidos campos dinâmicos não declarados (`additionalProperties: false` é obrigatório).

---

## 2. Implementação com Python e Pydantic

O SDK oficial do Python integra-se diretamente com classes `pydantic.BaseModel`:

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from openai import OpenAI

client = OpenAI()

class ItemAnalise(BaseModel):
    nome_modulo: str = Field(description="Nome do módulo ou pacote analisado.")
    vulnerabilidades: List[str] = Field(description="Lista de possíveis vulnerabilidades detectadas.")
    nivel_risco: str = Field(description="Nível de risco: 'BAIXO', 'MEDIO' ou 'ALTO'.")
    recomendacao: str = Field(description="Ação sugerida para mitigação.")

class RelatorioSeguranca(BaseModel):
    titulo: str
    total_modulos: int
    itens: List[ItemAnalise]

# Chamada estruturada com Responses API
response = client.responses.create(
    model="gpt-5.6",
    input="Analise os pacotes: express 4.17.1, lodash 4.17.15 e axios 0.21.1 para riscos de segurança conhecidos.",
    response_format=RelatorioSeguranca
)

# Objeto instanciado e validado
relatorio = response.output_parsed
print(f"Título: {relatorio.titulo}")
for item in relatorio.itens:
    print(f"- {item.nome_modulo} [{item.nivel_risco}]: {item.recomendacao}")
```

---

## 3. Implementação com TypeScript e Zod

```typescript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI();

const CalendarioEventoSchema = z.object({
  titulo: z.string().describe("Título da reunião ou evento"),
  data_inicio: z.string().describe("Data e hora no formato ISO 8601"),
  data_fim: z.string().describe("Data e hora de término em ISO 8601"),
  participantes: z.array(z.string().email()).describe("E-mails dos participantes"),
  localizacao: z.string().optional().describe("Link da sala virtual ou endereço físico")
});

async function main() {
  const response = await client.responses.create({
    model: "gpt-5.6",
    input: "Agende uma reunião de alinhamento com mateus@exemplo.com e ana@exemplo.com na próxima terça às 14h por 45 minutos no Google Meet.",
    response_format: zodResponseFormat(CalendarioEventoSchema, "calendario_evento")
  });

  const evento = JSON.parse(response.output_text);
  console.log("Evento estruturado gerado:", evento);
}

main();
```

---

## 4. Definição Manual em JSON Schema (cURL / REST)

```json
{
  "model": "gpt-5.6",
  "input": "Extraia dados do cliente: João Silva, 34 anos, joao@email.com",
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "cliente_dados",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "nome": { "type": "string" },
          "idade": { "type": "integer" },
          "email": { "type": "string" }
        },
        "required": ["nome", "idade", "email"],
        "additionalProperties": false
      }
    }
  }
}
```

---

## 5. Regras Obrigatórias de Esquemas Estritos

> [!IMPORTANT]
> 1. `additionalProperties: false` deve ser definido em todos os objetos do esquema.
> 2. Todas as propriedades definidas em `properties` **devem constar no array `required`**.
> 3. Campos opcionais devem ser modelados como unions com `null` (ex.: `type: ["string", "null"]`).
> 4. Profundidade máxima recomendada de aninhamento: até 5 níveis de objetos/arrays.

---

## 6. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
- [`../exemplos/structured_data_extraction.md`](../exemplos/structured_data_extraction.md)
