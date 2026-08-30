---
title: "Objeto Certificado"
description: "- data string - Dados codificados em PEM"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto Certificado"
  - "data"
  - "issuer"
  - "issuerName"
  - "issuerCert"
  - "subject"
  - "subjectName"
  - "serialNumber"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/certificate"
---

# Objeto Certificado

- `data` string - Dados codificados em PEM

- `issuer` [CertificatePrincipal](/pt/docs/latest/api/structures/certificate-principal) - Issuer principal

- `issuerName` string - Nome Comum do Emissor

- `issuerCert` Certificate - Emissor do certificado (se não for auto-assinado)

- `subject` [CertificatePrincipal](/pt/docs/latest/api/structures/certificate-principal) - Subject principal

- `subjectName` string - Nome Comum do Sujeito

- `serialNumber` string - Valor Hex representado em uma string

- `validStart` number - Data de validação do certificado em segundos

- `validExpiry` number - Data de expiração do certificado em segundos

- `fingerprint` string - Impressão digital do certificado
