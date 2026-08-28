---
title: "Code Interpreter: Sandbox Seguro de Execução de Código Python"
description: "Guia completo da ferramenta Code Interpreter na OpenAI API. Execução segura de scripts Python em sandbox isolado, análise estatística, processamento de dados (Pandas/Numpy), geração de gráficos (Matplotlib/Seaborn), manipulação de arquivos de entrada e download de artefatos gerados."
topics: ["code-interpreter", "python-sandbox", "data-analysis", "data-visualization", "assistants-tools", "file-download"]
keywords: ["code_interpreter", "tools: [{type: 'code_interpreter'}]", "matplotlib", "pandas", "file_outputs", "client.files.content"]
source_scope: "OpenAI API Docs: Assistants > Tools > Code Interpreter, Sandboxing & File Artifacts"
---

# Code Interpreter: Sandbox Seguro de Execução de Código Python

O **Code Interpreter** equipa os modelos da OpenAI com um ambiente sandbox isolado e seguro de execução Python. O assistente pode escrever código, executar, inspecionar o resultado (stdout/stderr), depurar erros em tempo real e gerar arquivos como gráficos PNG, planilhas Excel e relatórios PDF.

---

## 1. Capacidades do Ambiente Sandbox

- **Runtime:** Python 3.10+ em container Linux seguro, sem acesso à internet externa.
- **Bibliotecas Pré-instaladas:** Mais de 100 pacotes populares de ciência de dados e engenharia: `pandas`, `numpy`, `scipy`, `matplotlib`, `seaborn`, `scikit-learn`, `openpyxl`, `sympy`, `Pillow`, `fpdf`, `reportlab`, etc.
- **Ciclo de Vida do Container:** O estado do interpretador persiste durante toda a vida útil da sessão da Thread, permitindo que variáveis, funções e arquivos intermediários sejam reutilizados em mensagens subsequentes.

---

## 2. Implementação Completa em Python (Upload de CSV, Análise e Download de Gráfico)

```python
import os
from openai import OpenAI

client = OpenAI()

# 1. Fazer upload de uma planilha de dados para o propósito 'assistants'
with open("vendas_anual.csv", "rb") as f:
    csv_file = client.files.create(
        file=f,
        purpose="assistants"
    )
print(f"Arquivo CSV enviado: {csv_file.id}")

# 2. Criar Assistente habilitado com Code Interpreter e recurso de arquivos
assistant = client.beta.assistants.create(
    name="Cientista de Dados",
    instructions="Você analisa dados financeiros, calcula métricas estatísticas e sempre gera gráficos explicativos em alta resolução.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
    tool_resources={
        "code_interpreter": {
            "file_ids": [csv_file.id]
        }
    }
)

# 3. Criar Thread e solicitar geração de relatório gráfico
thread = client.beta.threads.create()

client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Analise a coluna 'receita' por 'regiao', plote um gráfico de barras comparativo e salve a imagem PNG."
)

# 4. Executar e aguardar o término do Run
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id
)

# 5. Recuperar a resposta e identificar arquivos de saída gerados
if run.status == "completed":
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    latest_msg = messages.data[0]

    for content_block in latest_msg.content:
        if content_block.type == "text":
            print("Resposta do Assistente:
", content_block.text.value)

            # Verificar se há citações ou referências a arquivos
            for annotation in content_block.text.annotations:
                if annotation.type == "file_path":
                    file_id = annotation.file_path.file_id
                    print(f"Arquivo gerado detectado: {file_id}")
                    
                    # 6. Baixar o arquivo binário gerado (PNG / CSV / PDF)
                    image_data = client.files.content(file_id)
                    with open("grafico_gerado.png", "wb") as f_out:
                        f_out.write(image_data.read())
                    print("Gráfico salvo com sucesso em 'grafico_gerado.png'!")
```

---

## 3. Inspeção de Passos de Execução (*Run Steps*)

É possível inspecionar o código Python exato que o modelo executou e o output do interpretador consultando os `run_steps`:

```python
steps = client.beta.threads.runs.steps.list(
    thread_id=thread.id,
    run_id=run.id
)

for step in steps.data:
    if step.step_details.type == "tool_calls":
        for tool_call in step.step_details.tool_calls:
            if tool_call.type == "code_interpreter":
                print("=== CÓDIGO PYTHON GERADO ===")
                print(tool_call.code_interpreter.input)
                print("=== LOGS DE SAÍDA (STDOUT) ===")
                for output in tool_call.code_interpreter.outputs:
                    if output.type == "logs":
                        print(output.logs)
```

---

## 4. Custos e Limitações de Segurança

1. **Preço:** O Code Interpreter é tarifado em US$ 0,03 por sessão de Thread ativa por dia.
2. **Restrições de Rede:** O ambiente não possui conectividade de rede externa (não é possível fazer `pip install` em tempo de execução nem requisições `requests.get()` externas).
3. **Limites de Memória e CPU:** Execuções possuem teto de tempo de execução (timeout de ~120s) e limites de memória para evitar sobrecargas.
