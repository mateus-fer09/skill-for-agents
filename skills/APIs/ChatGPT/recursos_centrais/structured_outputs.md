---
title: "Structured Outputs: Garantia Estrita de Esquema JSON"
description: "Guia exaustivo de Structured Outputs na OpenAI API. Configuração de response_format com JSON Schema estrito (strict: true), integração nativa com Pydantic no Python (client.beta.chat.completions.parse) e Zod no TypeScript/Node.js (zodResponseFormat), regras de validação, limitações suportadas e tratamento de recusas (refusals)."
topics: ["structured-outputs", "json-schema", "pydantic", "zod", "strict-mode", "type-safety", "refusals"]
keywords: ["strict: true", "json_schema", "response_format", "client.beta.chat.completions.parse", "zodResponseFormat", "additionalProperties: false", "Pydantic BaseModel"]
source_scope: "OpenAI API Docs: Guides > Structured Outputs, JSON Schema Validation & SDK Helpers"
---

# Structured Outputs: Garantia Estrita de Esquema JSON

O **Structured Outputs** é um recurso arquitetural da OpenAI que garante **100% de conformidade** entre a saída gerada pelo modelo e um esquema JSON Schema pré-definido. Diferente do modo JSON genérico (`type: "json_object"`), o Structured Outputs não alucina chaves inexistentes, não omite campos obrigatórios e não altera os tipos definidos.

---

## 1. Structured Outputs vs Modo JSON Tradicional

| Característica | Structured Outputs (`type: "json_schema"`, `strict: true`) | JSON Mode (`type: "json_object"`) |
| :--- | :--- | :--- |
| **Garantia de Esquema** | **100% Determinística** (Constrained Decoding via autômato) | Não determinística (Garante apenas sintaxe JSON válida) |
| **Campos Obrigatórios** | Todos os campos definidos em `required` são sempre gerados | Campos podem ser omitidos aleatoriamente |
| **Tipagem Estrita** | Strings, números, booleans e enums respeitam o schema | Tipos podem sofrer coerção indesejada |
| **Integração com SDK** | Suporte direto a Pydantic (Python) e Zod (TypeScript) | Parsing manual de strings JSON |
| **Tratamento de Recusas** | Campo explícito `parsed.refusal` quando há violação de segurança | Recusa misturada no texto JSON |

---

## 2. Regras e Restrições Obrigatórias do JSON Schema Estrito

Para que um esquema seja válido em `strict: true`, ele deve cumprir as seguintes restrições:

1. **`additionalProperties: false` em todos os objetos:**
   - Todo schema de objeto deve conter obrigatoriamente a propriedade `"additionalProperties": false`.
2. **Todos os campos devem estar em `required`:**
   - Não são permitidos campos opcionais implícitos. Para campos anuláveis, utilize uniões de tipos explícitas com `null` (ex: `["string", "null"]` ou `Optional[str] = None` no Pydantic).
3. **Profundidade e Complexidade:**
   - Máximo de 5 níveis de aninhamento de objetos.
   - Máximo de 500 propriedades totais no schema.
4. **Palavras-chave NÃO suportadas em `strict: true`:**
   - `patternProperties`, `minProperties`, `maxProperties`, `minLength`, `maxLength`, `format` (exceto quando especificado), `minimum`/`maximum` (como restrição de decodificação).

---

## 3. Implementação em Python com Pydantic (`openai.beta.chat.completions.parse`)

O SDK Python oferece o método de conveniência `.parse()`, que realiza a serialização do schema Pydantic e a deserialização tipada do resultado.

### 3.1. Exemplo de Extração de Entidades Médicas

```python
from typing import List, Optional
from pydantic import BaseModel, Field
from openai import OpenAI

client = OpenAI()

# 1. Definição do modelo de dados Pydantic
class Medicamento(BaseModel):
    nome: str = Field(description="Nome comercial ou genérico do medicamento")
    dosagem: str = Field(description="Ex: 500mg, 10ml")
    frequencia: str = Field(description="Ex: 8 em 8 horas")
    observacoes: Optional[str] = Field(default=None, description="Recomendações especiais de uso")

class ReceitaMedica(BaseModel):
    paciente_nome: str
    medico_crm: str
    diagnostico: str
    medicamentos: List[Medicamento]
    retorno_em_dias: int

# 2. Invocação com validação estrita
completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "Você é um assistente de digitalização de prontuários médicos. Extraia as informações estruturadas da receita."
        },
        {
            "role": "user",
            "content": "Receita do Dr. Carlos Silva CRM 12345-SP para o paciente João Souza. Diagnóstico: Amigdalite aguda. Prescrevo Amoxicilina 500mg a cada 8 horas por 7 dias (tomar após as refeições) e Dipirona 1g se dor a cada 6h. Retorno em 10 dias."
        }
    ],
    response_format=ReceitaMedica,
)

# 3. Acesso aos dados 100% tipados
receita: ReceitaMedica = completion.choices[0].message.parsed

# Tratamento de recusa por segurança (Safety Refusal)
if completion.choices[0].message.refusal:
    print(f"O modelo recusou a requisição: {completion.choices[0].message.refusal}")
else:
    print(f"Paciente: {receita.paciente_nome}")
    print(f"Diagnóstico: {receita.diagnostico}")
    for med in receita.medicamentos:
        print(f"- {med.nome} ({med.dosagem}) -> {med.frequencia} [Obs: {med.observacoes}]")
    print(f"Retorno previsto: {receita.retorno_em_dias} dias")
```

---

## 4. Implementação em TypeScript / Node.js com Zod (`zodResponseFormat`)

### 4.1. Exemplo de Análise de Sentimento e Ticket de Suporte

```typescript
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI();

// 1. Definição do Schema com Zod
const TicketTriagemSchema = z.object({
  clienteId: z.string().describe('Identificador do cliente ou e-mail'),
  categoria: z.enum(['FINANCEIRO', 'SUPORTE_TECNICO', 'COMERCIAL', 'CANCELAMENTO']),
  urgencia: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']),
  resumoProblema: z.string().describe('Resumo claro em uma frase'),
  acoesRecomendadas: z.array(z.string()).describe('Lista de passos para a equipe de atendimento'),
  requerEscalacaoHumana: z.boolean(),
});

type TicketTriagem = z.infer<typeof TicketTriagemSchema>;

async function analisarTicket() {
  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Você é o motor de triagem automática da central de suporte.',
      },
      {
        role: 'user',
        content: 'Cliente carlos@empresa.com: Nosso servidor de produção caiu após a atualização da API de pagamentos e estamos perdendo vendas! Precisamos de um retorno urgente.',
      },
    ],
    response_format: zodResponseFormat(TicketTriagemSchema, 'ticket_triagem'),
  });

  const parsedTicket: TicketTriagem | null = completion.choices[0].message.parsed;

  if (completion.choices[0].message.refusal) {
    console.warn('Requisição recusada:', completion.choices[0].message.refusal);
    return;
  }

  console.log('Ticket Estruturado:', parsedTicket);
  console.log('Categoria:', parsedTicket?.categoria);
  console.log('Urgência:', parsedTicket?.urgencia);
}

analisarTicket();
```

---

## 5. Implementação via REST API com JSON Schema Puro (cURL)

```bash
curl https://api.openai.com/v1/chat/completions   -H "Content-Type: application/json"   -H "Authorization: Bearer $OPENAI_API_KEY"   -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Extraia o evento: Reunião de alinhamento com equipe de engenharia amanhã às 14h na sala 3B."
      }
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "evento_agenda",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "titulo": { "type": "string" },
            "horario": { "type": "string" },
            "local": { "type": "string" },
            "participantes": {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          "required": ["titulo", "horario", "local", "participantes"],
          "additionalProperties": false
        }
      }
    }
  }'
```

---

## 6. Tratamento de Erros e Casos de Borda

1. **Campos Opcionais (`nullable`):**
   - No Pydantic: Use `Optional[T] = None`. O SDK gera `"type": ["string", "null"]` e mantém o campo em `required`.
   - No Zod: Use `z.string().nullable()`. Nunca use `.optional()` puro sem `.nullable()`, pois todos os campos devem estar em `required`.
2. **Enums Estritos:**
   - Limite opções de texto com `Literal` ou `Enum` no Python / `z.enum([...])` no TypeScript para prevenir alucinações de constantes.
3. **Recusas de Moderação (`refusal`):**
   - Sempre verifique a propriedade `message.refusal`. Se o prompt violar políticas de uso, o modelo não gerará o JSON e retornará uma mensagem de recusa em texto plano.
