---
title: "Objeto HIDDevice"
description: "- deviceId string - Identificador único deste dispositivo."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto HIDDevice"
  - "deviceId"
  - "name"
  - "vendorId"
  - "productId"
  - "serialNumber"
  - "guid"
  - "collections"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/hid-device"
---

# Objeto HIDDevice

- `deviceId` string - Identificador único deste dispositivo.

- `name` string - Nome do dispositivo.

- `vendorId` Integer - Identificador do fabricante do USB.

- `productId` Integer - Identificador do produto USB.

- `serialNumber` string (opcional) - Número serial do dispositivo USB.

- `guid` string (opcional) - Identificador único para esta interface HID.  Um dispositivo pode possuir múltiplas interfaces HID.

- `collections` Object[] - an array of report formats. See [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/HIDDevice/collections) for more.

  - `usage` Integer - An integer representing the usage ID component of the HID usage associated with this collection.

  - `usagePage` Integer - An integer representing the usage page component of the HID usage associated with this collection.

  - `type` Integer - An 8-bit value representing the collection type, which describes a different relationship between the grouped items.

  - `children` Object[] - An array of sub-collections which takes the same format as a top-level collection.

  - `inputReports` Object[] - An array of inputReport items which represent individual input reports described in this collection.

  - `outputReports` Object[] - An array of outputReport items which represent individual output reports described in this collection.

  - `featureReports` Object[] - An array of featureReport items which represent individual feature reports described in this collection.
