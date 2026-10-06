# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios.

Fecha de auditoria: 2026-10-06. Version: commit `6500b92` (unico de la historia), rama `main`.

## Rutas y simbolos relevantes

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `README.md` | Plantilla con campos `[PENDIENTE]` (estudiante, materia, motor) | Lectura directa |
| `GDD.md` | Plantilla de diseno con campos `[PENDIENTE]` | Lectura directa |
| `AGENTS.md` | Reglas de operacion del agente: preguntar motor/version/nombre/problema, leer docs antes de editar, no modificar hasta definir alcance | Lectura directa |
| `CONSIGNAS.md` | Consigna de la practica: 5 upgrades del catalogo, puerta de trabajo y paquetes en `docs/upgrades/` | Lectura directa |
| `docs/README.md` | Orden de trabajo de los artefactos de proceso (auditoria -> spec/plan -> matriz -> registro -> evidencia -> informe) | Lectura directa |
| `docs/*.md` | Plantillas de proceso, todas con marcadores `[PENDIENTE]` | Lectura directa |
| `Prompt1.md`, `Prompt2.md`, `Prompt3.md` | Prompts preparados por el estudiante para fases futuras; `Prompt1.md` completo con marcadores, `Prompt2.md` y `Prompt3.md` vacios | Lectura directa |
| `.gitignore` | Reglas comunes; no cubre `node_modules/` ni `dist/` | Lectura directa |
| Codigo de juego / `package.json` | **No existen** | `Test-Path package.json` = False; listado de directorios |

## Flujo observado

Todavia no hay flujo de juego. El unico flujo comprobado es el de la plantilla: un commit inicial (`6500b92`) con los archivos de proceso, sin proyecto asociado.

Flujo previsto (Fase 1, todavia no implementado): entrada por teclado -> escena Phaser -> sistemas de `src/domain/` (patrulla, vision, alerta) -> actualizacion de estado -> render/HUD. La capa de dominio debe poder ejecutarse y testearse sin Phaser.

## Pruebas y comandos disponibles

| Comando o prueba | Que verifica | Resultado inicial |
|---|---|---|
| `git status` / `git log --oneline` | Estado y version inicial | `6500b92`, 4 archivos sin trackear, ninguno trackeado modificado |
| `node --version` | Runtime disponible | v22.19.0 |
| `npm.cmd --version` | Gestor de paquetes | 11.6.0 (el `.ps1` falla por politica de ejecucion: usar `npm.cmd`) |
| `Test-Path package.json` | Existe proyecto JS | False |
| `npm.cmd run build` | Build | **No ejecutable aun**: sin `package.json` ni scripts |
| `npm.cmd test` | Suite | **No ejecutable aun**: sin framework de pruebas |

Validacion de referencia: **no es posible ejecutarla** en este estado porque no existe proyecto que compilar ni pruebas que correr. Se documenta aqui como impedimento comprobado y se reintentara al cerrar la Fase 1.

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados: repo con un solo commit (`6500b92`), `main` sincronizada con `origin/main`, sin codigo de juego ni `package.json`; Node 22.19 y npm 11.6 disponibles; remoto configurado (push prohibido por consigna); cuatro archivos sin trackear.
- Supuestos por verificar: que el stack base (Phaser + Vite + TypeScript + Vitest) puede instalarse con npm en este equipo sin bloqueos de red; que no hay otros cambios locales fuera de `git status`.
- Preguntas para consultar: nombre definitivo del proyecto (`Silent Corridor` vs. "Guardia de Sigilo" en `Prompt1.md`); si los archivos `Prompt*.md` deben versionarse o quedarse locales; si `CONSIGNAS.md` debe commitearse.
