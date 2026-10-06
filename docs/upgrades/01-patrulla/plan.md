# Plan — Upgrade 01: Patrulla con pausas y mirada direccional

Proyecto: Silent Corridor. Aprobacion del estudiante: 2026-10-06 (Prompt2: autoriza un incremento por vez, sin commits automaticos).
Spec base: `docs/upgrades/01-patrulla/spec.md`.

## Objetivo del plan

Satisfacer los 10 criterios de la spec con incrementos chicos y validables: primero el stack, luego la escena, luego el dominio de patrulla, luego la integracion visual y por ultimo el cierre con evidencia. Cada incremento toca solo sus archivos previstos; cualquier archivo fuera de plan obliga a consultar.

## Incrementos

| # | Incremento | Archivos previstos | Validacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Scaffold del stack base + smoke test | `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `src/core/constants.ts`, `tests/scaffold.test.ts` | `npm.cmd install`, `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` | Instalacion de red bloqueada o version incompatible | Error de instalacion/build sin causa comprendida en 2 intentos |
| 2 | Escena del corredor: paredes, jugador con WASD/flechas, colisiones y meta | `src/scenes/GameScene.ts`, `src/core/constants.ts` | typecheck + build + suite + ejecucion manual | Colision mal calibrada (atrasos o atravesamiento) | El jugador atraviesa paredes y no se corrige con la API de Phaser |
| 3 | Dominio de patrulla: estados `moving`/`pausing`, rumbo A<->B, barrido de mirada, tiempo inyectado | `src/domain/patrol.ts`, `tests/patrol.test.ts` | typecheck + suite (tests de tick, sin render) | Tiempo acoplado a `Date.now()` o a Phaser | La logica no puede probarse sin render: reescribir antes de seguir |
| 4 | Integracion del guardia en escena: sprite, direccion de mirada en movimiento, pausa con barrido lateral | `src/scenes/GameScene.ts`, `src/domain/patrol.ts` (adaptacion minima), `tests/patrol.test.ts` | typecheck + build + suite + ejecucion manual | Duplicar logica de dominio dentro de la escena | La escena necesite lógica de patrulla no representable en `src/domain/` |
| 5 | Constantes de ritmo centralizadas, revision final de diff y evidencia | `src/core/constants.ts`, `docs/upgrades/01-patrulla/evidencia.md` | typecheck + build + suite + ejecucion manual + matriz criterio-evidencia | Evidencia incompleta o criterio sin prueba | Algum criterio de la spec sin evidencia verificable: no cerrar |

## Orden de implementacion

Incremento 1 -> 2 -> 3 -> 4 -> 5. Solo avanza el siguiente despues de que el estudiante revise diff y validacion del actual (Prompt2) y autorice. Tras cada incremento valido con los comandos disponibles en ese estado y muestro `git diff --stat` y el diff relevante; no se crea commit automatico.

## Fuera de alcance

- Cualquier archivo no listado en la tabla de incrementos (p. ej. `README.md`, docs de proceso, `Prompt*.md`).
- Deteccion, alerta, camara, linea de vision, cobertura y escape (upgrades 02-05).
- Commits, push, instalaciones fuera de la base del stack, eliminacion de archivos.
