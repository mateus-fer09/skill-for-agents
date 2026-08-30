---
title: Exemplo Completo — Extração Estruturada com Pydantic e Structured Outputs
description: Código Python executável demonstrando extração de dados complexos e aninhados de documentos de texto com 100% de garantia de esquema usando Pydantic.
topics:
  - examples
  - structured-outputs
  - pydantic
  - data-extraction
keywords:
  - Pydantic
  - BaseModel
  - response_format
  - output_parsed
  - strict
related:
  - ../responses_api/structured_outputs.md
  - ../responses_api/introducao_e_quickstart.md
source_scope:
  - https://developers.openai.com/api/docs/guides/structured-outputs.md
---

# Exemplo Completo — Extração Estruturada com Pydantic

Demonstração prática de como extrair dados complexos, aninhados e tipados a partir de texto desestruturado (como faturas ou contratos) com **Structured Outputs** e **Pydantic**.

---

## Código Fonte Completo (`extracao_fatura.py`)

```python
import json
from typing import List, Optional
from pydantic import BaseModel, Field
from openai import OpenAI

# =========================================================
# 1. DEFINIÇÃO DO SCHEMA PYDANTIC
# =========================================================

class ItemFatura(BaseModel):
    descricao: str = Field(description="Descrição detalhada do produto ou serviço.")
    quantidade: int = Field(description="Quantidade de unidades adquiridas.")
    valor_unitario: float = Field(description="Preço unitário em reais.")
    valor_total_item: float = Field(description="Subtotal calculado para este item.")

class FaturaExtratada(BaseModel):
    numero_nota: str = Field(description="Identificador ou número da NF-e.")
    data_emissao: str = Field(description="Data de emissão da fatura (formato AAAA-MM-DD).")
    nome_fornecedor: str = Field(description="Razão social ou nome do prestador.")
    cnpj_fornecedor: Optional[str] = Field(None, description="CNPJ se identificado.")
    nome_cliente: str = Field(description="Nome ou razão social do comprador.")
    itens: List[ItemFatura] = Field(description="Lista de itens descritos na nota.")
    valor_total_fatura: float = Field(description="Soma total da nota fiscal.")
    metodo_pagamento: str = Field(description="Forma de pagamento (ex.: Boleto, PIX, Cartão).")

# =========================================================
# 2. TEXTO DESESTRUTURADO DE ENTRADA
# =========================================================

texto_nota = """
NOTA FISCAL DE SERVIÇOS ELETRÔNICA - Nº 2026-00891
Emitida em: 25/08/2026
Prestador: Tech Cloud Soluções em TI Ltda (CNPJ: 12.345.678/0001-99)
Tomador: Nexus Desenvolvimento de Software S.A.

Discriminativo de Serviços:
1. Licença Servidor Dedicado Enterprise v4 - 2 unidades a R$ 1.500,00 cada. Total: R$ 3.000,00
2. Suporte Técnico 24x7 Especializado Cloud - 1 mês a R$ 850,00. Total: R$ 850,00
3. Configuração de Cluster Kubernetes - 1 serviço a R$ 2.400,00. Total: R$ 2.400,00

Valor Total do Documento: R$ 6.250,00
Condição de Pagamento: Transferência Bancária via PIX em até 10 dias úteis.
"""

# =========================================================
# 3. EXTRAÇÃO ESTRUTURADA VIA RESPONSES API
# =========================================================

client = OpenAI()

print("Enviando requisição com Structured Outputs...")
response = client.responses.create(
    model="gpt-5.6",
    instructions="Você é um extrator de dados fiscais estrito e de alta precisão.",
    input=f"Extraia todos os dados da nota fiscal a seguir:\n\n{texto_nota}",
    response_format=FaturaExtratada
)

# 4. Acessar os dados tipados diretamente
fatura: FaturaExtratada = response.output_parsed

print("\n=== FATURA EXTRAÍDA COM SUCESSO ===")
print(f"Nota: {fatura.numero_nota} | Emissão: {fatura.data_emissao}")
print(f"Fornecedor: {fatura.nome_fornecedor} ({fatura.cnpj_fornecedor})")
print(f"Cliente: {fatura.nome_cliente}")
print(f"Total: R$ {fatura.valor_total_fatura:.2f} via {fatura.metodo_pagamento}")
print("\nItens:")
for i, item in enumerate(fatura.itens, 1):
    print(f"  {i}. {item.descricao} | Qtd: {item.quantidade} x R$ {item.valor_unitario:.2f} = R$ {item.valor_total_item:.2f}")

# Exportar para JSON puro
print("\nJSON Serializado:")
print(json.dumps(fatura.model_dump(), indent=2, ensure_ascii=False))
```

---

## Referências Relacionadas

- [`../responses_api/structured_outputs.md`](../responses_api/structured_outputs.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
