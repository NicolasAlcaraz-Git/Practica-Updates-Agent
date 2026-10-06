# Plan — Upgrade 02: Medidor de alerta y estados del nivel

Proyecto: Silent Corridor. Aprobacion del estudiante: 2026-10-06 (spec `02-alerta` aprobada; Prompt2 aplicado como en la update 01: un incremento por vez, validacion y diff, sin commits automaticos).
Spec base: `docs/upgrades/02-alerta/spec.md`.

## Objetivo del plan

Alimentar el medidor con un riesgo calculado en dominio puro, mostrarlo como HUD y ambiente, y dejar toda la logica testeable sin Phaser. Cada incremento toca solo sus archivos previstos; cualquier archivo fuera de plan obliga a consultar.

## Incrementos

| # | Incremento | Archivos previstos | Validacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Dominio de alerta: nivel 0-100, umbrales 25/50/75, estados, `computeRisk(distancia, enCono)` | `src/domain/alert.ts`, `tests/alert.test.ts` | `npm.cmd test`, `typecheck` | Umbrales o tasas mal definidos que obliguen a reescribir la spec | Los criterios 2-6 no se pueden expresar como tests deterministas |
| 2 | Integracion de riesgo en escena: distancia jugador-guardia + cono con `Patrol.getGazeDirection()`, instancia de `AlertSystem` por frame | `src/scenes/GameScene.ts`, `src/core/constants.ts` (+`ALERT_*`, `RISK_*`) | `typecheck`, `build`, `test` | Calcular riesgo dentro de la escena en vez de consumirlo del dominio | La escena necesite logica de riesgo no representable en `src/domain/` |
| 3 | HUD y ambiente: barra + rotulo con color por estado + overlay de tinte del nivel | `src/scenes/GameScene.ts` | `typecheck`, `build`, `test` | HUD acoplado al estado sin pasar por el dominio | El HUD calcule umbrales o colores propios fuera de constantes |
| 4 | Revision final de diff, comprobacion de criterios y evidencia | `docs/upgrades/02-alerta/evidencia.md` | `typecheck`, `build`, `test` + contraste criterio-evidencia | Evidencia incompleta sin criterio sin prueba | Algum criterio sin evidencia verificable: no cerrar |

## Orden de implementacion

1 -> 2 -> 3 -> 4. Tras cada incremento se ejecutan los comandos disponibles en ese estado, se muestra `git status`/`git diff --stat` y se espera el visto bueno antes de continuar (o la autorizacion explicita de cerrar el upgrade completo). Los commits los realiza el estudiante.

## Valores iniciales (se ajustan con evidencia en el incremento 4)

- `RISK_RADIUS = 260` px; `risk = clamp(1 - distancia/RISK_RADIUS, 0, 1)`.
- Cono: media-angulo 50 grados; `risk *= CONE_BONUS (1.6)` si el jugador esta en el cono, tope 1.
- Tasas: sube `35/s * risk`, baja `18/s` cuando `risk == 0`.
- Umbrales: `tranquilo < 25 <= sospecha < 50 <= busqueda < 75 <= alerta maxima`.

## Fuera de alcance

- Archivos no listados en la tabla (incluidos `src/domain/patrol.ts` y docs de otras updates).
- Vision con obstaculos, camara, escape, sonido, cambios de la patrulla.
- Commits, push, dependencias nuevas, eliminacion de archivos.
