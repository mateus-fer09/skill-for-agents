---
title: "Objeto SerialPort"
description: "- portId string - Identificador único para a porta."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto SerialPort"
  - "portId"
  - "portName"
  - "displayName"
  - "vendorId"
  - "productId"
  - "serialNumber"
  - "usbDriverName"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/serial-port"
---

# Objeto SerialPort

- `portId` string - Identificador único para a porta.

- `portName` string - Nome da porta.

- `displayName` string (optional) - A string suitable for display to the user for describing this device.

- `vendorId` string (optional) - The USB vendor ID.

- `productId` string (optional) - The USB product ID.

- `serialNumber` string (opcional) - Número serial do dispositivo USB.

- `usbDriverName` string (optional) *macOS* - Represents a single serial port on macOS can be enumerated by multiple drivers.

- `deviceInstanceId` string (optional) *Windows* - A stable identifier on Windows that can be used for device permissions.
