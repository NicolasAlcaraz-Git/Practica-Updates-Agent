# Plantilla PIAPC para repositorios individuales

Este repositorio prepara un proyecto academico de videojuegos independiente de motor, lenguaje y tipo de juego.

## Como usarla

1. Crea un repositorio individual desde esta plantilla y conserva el commit inicial.
2. Completa los datos de este archivo y de `GDD.md` cuando la consigna defina el problema de diseno.
3. Agrega el proyecto creado con el motor elegido, sin mezclar archivos de otros motores.
4. Incorpora al `.gitignore` las reglas oficiales o recomendadas para ese motor.
5. Completa los documentos de `docs/` en el orden indicado por `docs/README.md`.
6. Conserva commits pequenos y revisables durante el desarrollo.

## Datos del proyecto

- Estudiante: [PENDIENTE]
- Materia, comision y anio: [PENDIENTE]
- Nombre del proyecto: Silent Corridor
- Motor y version: Sin motor formal; Phaser 4.2.1 + Vite 8.3.3 + TypeScript 7.0.2 + Vitest 5.0.3 (Node 22.19, npm 11.6)
- Estado: Fase 0 (documentacion de proceso) completada; prototipo base pendiente

## Descripcion

Prototipo de sigilo y escape en 2D: el jugador atraviesa un corredor evitando a los guardias en patrulla,
usa cobertura para romper la linea de vision y gestiona un medidor de alerta que crece con el riesgo.
El ciclo de juego se completa con un escape de ultimo momento cuando la alerta esta al limite.

La practica consiste en cinco upgrades de diseno (patrulla con pausas, medidor de alerta, camara de tension,
cobertura y ruptura de linea de vision, escape de ultimo momento) desarrollados como intervenciones revisables
y documentados en `docs/upgrades/`.

## Requisitos y ejecucion

- Node.js 22.x y npm 11.x.
- En PowerShell usar `npm.cmd` (la politica de ejecucion bloquea `npm.ps1`).
- Comandos previstos (disponibles tras la Fase 1):
  - `npm.cmd install` — instalar dependencias del stack base.
  - `npm.cmd run dev` — servidor de desarrollo con recarga.
  - `npm.cmd run build` — compilacion de produccion.
  - `npm.cmd run typecheck` — chequeo de tipos (`tsc --noEmit`).
  - `npm.cmd test` — suite con Vitest.

## Controles

[PENDIENTE: se define con el prototipo base. Movimiento con flechas/WASD, interaccion con tecla definida.]

## Creditos

- [PENDIENTE: assets, tipografias, plugins y referencias de terceros.]

## Entrega o demostracion

No se publica ni se despliega. La evidencia se registra en `docs/evidencia-pruebas.md` y en `docs/upgrades/*/evidencia.md`.
