---
title: Ferramentas Hospedadas (Web Search, File Search, Code Interpreter)
description: Guia de ferramentas nativas executadas na infraestrutura gerenciada da OpenAI (Web Search para busca em tempo real, File Search com Vector Stores e Code Interpreter com Python Sandbox).
topics:
  - hosted-tools
  - web-search
  - file-search
  - code-interpreter
  - vector-stores
keywords:
  - web_search
  - file_search
  - code_interpreter
  - vector_store_ids
  - Python sandbox
related:
  - ../ferramentas_e_mcp/function_calling.md
  - ../ferramentas_e_mcp/mcp_e_conectores.md
  - ../referencia_api/arquivos_e_vector_stores.md
source_scope:
  - https://developers.openai.com/api/docs/guides/tools.md
  - https://developers.openai.com/api/docs/guides/tools-web-search.md
  - https://developers.openai.com/api/docs/guides/tools-file-search.md
  - https://developers.openai.com/api/docs/guides/tools-code-interpreter.md
---

# Ferramentas Hospedadas (Hosted Tools)

A OpenAI disponibiliza ferramentas nativas executadas e gerenciadas diretamente em sua infraestrutura segura, sem exigir servidores adicionais por parte do desenvolvedor.

---

## 1. Web Search (`type: "web_search"`)

Permite ao modelo buscar informações atualizadas na web antes de responder.

### Exemplo em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Quais foram os principais anúncios de tecnologia divulgados nesta semana?",
    tools=[
        {"type": "web_search"}
    ]
)

print(response.output_text)
```

O modelo inclui automaticamente citações e links das fontes consultadas.

---

## 2. File Search (`type: "file_search"`)

Conecta o modelo a **Vector Stores** (bancos vetoriais gerenciados pela OpenAI) para Retrieval-Augmented Generation (RAG) automático sobre documentos corporativos (PDFs, planilhas, arquivos de texto).

### Exemplo de Criação de Vector Store e Consulta

```python
from openai import OpenAI

client = OpenAI()

# 1. Upload do arquivo
arquivo = client.files.create(
    file=open("manual_do_sistema.pdf", "rb"),
    purpose="user_data"
)

# 2. Criar Vector Store e associar arquivo
vector_store = client.vector_stores.create(
    name="Manuais Técnicos",
    file_ids=[arquivo.id]
)

# 3. Consultar com File Search na Responses API
response = client.responses.create(
    model="gpt-5.6",
    input="Qual é a política de rotação de senhas descrita no manual?",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": [vector_store.id]
        }
    ]
)

print(response.output_text)
```

---

## 3. Code Interpreter (`type: "code_interpreter"`)

Disponibiliza um ambiente isolado (sandbox) com interpretador Python 3, permitindo ao modelo:
- Escrever e executar scripts Python em tempo real.
- Processar dados tabulares (Pandas, NumPy).
- Gerar gráficos e visualizações (Matplotlib, Seaborn).
- Resolver problemas matemáticos complexos com exatidão programática.

### Exemplo em Python

```python
response = client.responses.create(
    model="gpt-5.6",
    input="Calcule o valor presente líquido (VPL) de um investimento com fluxo inicial de -R$ 100.000 e retornos de R$ 30.000 ao ano por 5 anos com taxa de desconto de 12% ao ano.",
    tools=[
        {"type": "code_interpreter"}
    ]
)

print(response.output_text)
```

---

## 4. Combinando Múltiplas Ferramentas Hospedadas

O modelo pode coordenar diversas ferramentas nativas em conjunto:

```python
response = client.responses.create(
    model="gpt-5.6",
    input="Busque a cotação do dólar hoje e gere um gráfico comparando com as taxas dos últimos 30 dias.",
    tools=[
        {"type": "web_search"},
        {"type": "code_interpreter"}
    ]
)
```

---

## 5. Referências Cruzadas

- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
- [`../ferramentas_e_mcp/mcp_e_conectores.md`](../ferramentas_e_mcp/mcp_e_conectores.md)
- [`../referencia_api/arquivos_e_vector_stores.md`](../referencia_api/arquivos_e_vector_stores.md)
