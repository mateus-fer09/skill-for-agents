---
title: SDKs Oficiais e Suporte a Outras Linguagens
description: Bibliotecas oficiais e recomendadas pela Anthropic para Go, Java, PHP, C#/.NET, Kotlin e Ruby.
topics:
  - go
  - java
  - php
  - csharp
  - sdks
keywords:
  - anthropic-sdk-go
  - anthropic-java
  - anthropic-php
  - dotnet
related:
  - sdks_e_bibliotecas/sdk_python.md
  - sdks_e_bibliotecas/sdk_typescript.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/go
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/java
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/php
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/csharp
---

# SDKs Oficiais e Suporte a Outras Linguagens

Além dos SDKs de Python e TypeScript, a Anthropic mantém e apoia bibliotecas oficiais para os principais ecossistemas de desenvolvimento backend e corporativo.

---

## 1. SDK Go (`anthropic-sdk-go`)

Instalação:
```bash
go get github.com/anthropics/anthropic-sdk-go
```

Exemplo de Uso:
```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func main() {
	client := anthropic.NewClient(
		option.WithAPIKey(os.Getenv("ANTHROPIC_API_KEY")),
	)

	message, err := client.Messages.New(context.Background(), anthropic.MessageNewParams{
		Model:     anthropic.F(anthropic.ModelClaude_3_7_Sonnet_20250219),
		MaxTokens: anthropic.Int(1024),
		Messages: anthropic.F([]anthropic.MessageParam{
			Role:    anthropic.F(anthropic.MessageParamRoleUser),
			Content: anthropic.F([]anthropic.MessageContentUnionParam{
				anthropic.NewTextBlock("Explique interfaces e polimorfismo em Go."),
			}),
		}),
	})

	if err != nil {
		panic(err.Error())
	}

	fmt.Println(message.Content[0].Text)
}
```

---

## 2. SDK Java (`anthropic-java`)

Maven:
```xml
<dependency>
    <groupId>com.anthropic</groupId>
    <artifactId>anthropic-java</artifactId>
    <version>LATEST</version>
</dependency>
```

Gradle:
```groovy
implementation 'com.anthropic:anthropic-java:LATEST'
```

Exemplo de Uso:
```java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.Message;
import com.anthropic.models.MessageCreateParams;

public class Main {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
            .model("claude-3-7-sonnet-20250219")
            .maxTokens(1024)
            .addUserMessage("Qual a vantagem do uso de Records no Java 21?")
            .build();

        Message message = client.messages().create(params);
        System.out.println(message.content().get(0).text());
    }
}
```

---

## 3. SDK C# / .NET

Instalação via NuGet:
```bash
dotnet add package Anthropic.SDK
```

Exemplo:
```csharp
using Anthropic.SDK;
using Anthropic.SDK.Messaging;

var client = new AnthropicClient(); // Carrega ANTHROPIC_API_KEY automaticamente

var messages = new List<Message>
{
    new Message(RoleType.User, "Como funcionam span<T> e memory<T> em C#?")
};

var parameters = new MessageParameters()
{
    Model = "claude-3-7-sonnet-20250219",
    MaxTokens = 1024,
    Messages = messages
};

var response = await client.Messages.GetClaudeMessageAsync(parameters);
Console.WriteLine(response.Message.Content[0].Text);
```

---

## 4. SDK PHP

Instalação via Composer:
```bash
composer require anthropic-ai/anthropic-php
```

Exemplo:
```php
<?php
require 'vendor/autoload.php';

use Anthropic\Anthropic;

$client = Anthropic::client(getenv('ANTHROPIC_API_KEY'));

$response = $client->messages()->create([
    'model' => 'claude-3-7-sonnet-20250219',
    'max_tokens' => 1024,
    'messages' => [
        ['role' => 'user', 'content' => 'Explique os princípios SOLID em PHP 8.3.']
    ],
]);

echo $response['content'][0]['text'];
```

---

## Veja Também

- [`../sdks_e_bibliotecas/sdk_python.md`](../sdks_e_bibliotecas/sdk_python.md)
- [`../sdks_e_bibliotecas/sdk_typescript.md`](../sdks_e_bibliotecas/sdk_typescript.md)
- [`../sdks_e_bibliotecas/compatibilidade_openai_sdk.md`](../sdks_e_bibliotecas/compatibilidade_openai_sdk.md)
