---
title: "Objeto USBDevice"
description: "- configuration Object (optional) - A [USBConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/USBConfiguration) object containing information about the currently select"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto USBDevice"
  - "configuration"
  - "configurationValue"
  - "configurationName"
  - "interfaces"
  - "interfaceNumber"
  - "alternate"
  - "alternateSetting"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/usb-device"
---

# Objeto USBDevice

- `configuration` Object (optional) - A [USBConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/USBConfiguration) object containing information about the currently selected configuration of a USB device.

  - `configurationValue` Integer - the configuration value of this configuration.

  - `configurationName` string - the name provided by the device to describe this configuration.

  - `interfaces` Object[] - An array of [USBInterface](https://developer.mozilla.org/en-US/docs/Web/API/USBInterface) objects containing information about an interface provided by the USB device.

    - `interfaceNumber` Integer - the interface number of this interface.

    - `alternate` Object - the currently selected alternative configuration of this interface.

      - `alternateSetting` Integer - the alternate setting number of this interface.

      - `interfaceClass` Integer - the class of this interface. See [USB.org](https://www.usb.org/defined-class-codes) for class code descriptions.

      - `interfaceSubclass` Integer - the subclass of this interface.

      - `interfaceProtocol` Integer - the protocol supported by this interface.

      - `interfaceName` string (optional) - the name of the interface, if one is provided by the device.

      - `endpoints` Object[] - an array containing instances of the [USBEndpoint interface](https://developer.mozilla.org/en-US/docs/Web/API/USBEndpoint) describing each of the endpoints that are part of this interface.

        - `endpointNumber` Integer - this endpoint's "endpoint number" which is a value from 1 to 15.

        - `direction` string - the direction in which this endpoint transfers data - can be either 'in' or 'out'.

        - `type` string - the type of this endpoint - can be either 'bulk', 'interrupt', or 'isochronous'.

        - `packetSize` Integer - the size of the packets that data sent through this endpoint will be divided into.

    - `alternates` Object[] - an array containing instances of the [USBAlternateInterface](https://developer.mozilla.org/en-US/docs/Web/API/USBAlternateInterface) interface describing each of the alternative configurations possible for this interface.

- `configurations` Object[] - An array of [USBConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/USBConfiguration) interfaces for controlling a paired USB device.

- `deviceClass` Integer - A classe de dispositivo para a interface de comunicação suportada pelo dispositivo.

- `deviceId` string - Identificador único deste dispositivo.

- `deviceProtocol` Integer - O protocolo do dispositivo para a interface de comunicação suportada pelo dispositivo.

- `deviceSubclass` Integer - A subclasse do dispositivo para a interface de comunicação suportada pelo dispositivo.

- `deviceVersionMajor` Integer - O número de versão principal do dispositivo como definido pelo fabricante do dispositivo.

- `deviceVersionMinor` Integer - O número de versão menor do dispositivo conforme definido pelo fabricante do dispositivo.

- `deviceVersionSubminor` Integer - O número de versão submenor do dispositivo conforme definido pelo fabricante do dispositivo.

- `manufacturerName` string (opcional) - O nome do fabricante do dispositivo.

- `productId` Integer - Identificador do produto USB.

- `productName` string (opcional) - Nome do dispositivo.

- `serialNumber` string (opcional) - Número serial do dispositivo USB.

- `usbVersionMajor` Integer - A versão principal do protocolo USB suportada pelo dispositivo.

- `usbVersionMinor` Integer - a versão menor do protocolo USB suportada pelo dispositivo.

- `usbVersionSubminor` Integer - a versão de submenor do protocolo USB suportada pelo dispositivo.

- `vendorId` Integer - Identificador do fabricante do USB.
