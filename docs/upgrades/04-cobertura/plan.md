# Plan — Upgrade 04: Cobertura y ruptura de línea de visión

Proyecto: Silent Corridor. Aprobacion del estudiante: 2026-10-06 (spec `04-cobertura` aprobada; Prompt2 aplicado como en updates anteriores: un incremento por vez, validacion y diff, sin commits automaticos).
Spec base: `docs/upgrades/04-cobertura/spec.md`.

## Objetivo del plan

Poner la linea de vision en el dominio (pura, testeable), usarla como fuente de la alerta, agregar cajas de cobertura solidas y recien despues dibujar el cono recortado. Cada incremento toca solo sus archivos previstos; cualquier archivo fuera de plan obliga a consultar.

## Incrementos

| # | Incremento | Archivos previstos | Validacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Dominio de vision: `hasLineOfSight`, `rayHitDistance`, `visibleToGuard`, `sightPolygon` | `src/domain/vision.ts`, `tests/vision.test.ts` | `npm.cmd test`, `typecheck` | Raycast con bordes ambiguos que se contradiga con la colision | Los criterios 2-4 no se pueden expresar de forma determinista |
| 2 | Cobertura y riesgo: `COVERS`, lista unica de obstaculos (colision + vision), riesgo con `visibleToGuard` | `src/core/constants.ts`, `src/scenes/GameScene.ts` | `typecheck`, `build`, `test` | Cambiar la regla de riesgo rompe criterios de la 02 | El nuevo riesgo deja de cumplir los tests/criterios ya cerrados de la 02 |
| 3 | Feedback visual: cono recortado con `Graphics` + color del jugador (rojo/blanco) | `src/scenes/GameScene.ts` | `typecheck`, `build`, `test` | Poligono costoso o parpadeante por frame | El dibujo obliga a calculos de vision dentro de la escena |
| 4 | Revision final de diff y evidencia | `docs/upgrades/04-cobertura/evidencia.md` | `typecheck`, `build`, `test` + contraste criterio-evidencia | Evidencia incompleta sin criterio sin prueba | Algum criterio sin evidencia verificable: no cerrar |

## Orden de implementacion

1 -> 2 -> 3 -> 4. Tras cada incremento se ejecutan los comandos del estado, se muestra `git status`/`git diff --stat` y se registra en la evidencia. Los commits los realiza el estudiante.

## Valores iniciales (se ajustan con evidencia en el incremento 4)

- `COVERS` (solidos, choque del jugador y corte de vision):
  - `{ x: 200, y: 150, w: 70, h: 70 }` (arriba-izquierda)
  - `{ x: 250, y: 390, w: 70, h: 70 }` (abajo-izquierda, antes del hueco del muro)
  - `{ x: 740, y: 330, w: 70, h: 70 }` (derecha, zona de meta)
  - Verificacion previa: ninguna se superpone al carril del guardia (x=510) ni a los huecos de `WALLS`.
- Obstaculos = `WALLS + COVERS` para colision, raycast y cono (misma fuente).
- Vision: `sightPolygon` con 16 muestras sobre la media-angulo (`RISK_CONE_HALF_DEG`); epsilon de 0.5 px para contar el contacto como bloqueado.
- Riesgo: `risk = computeRisk(dist, visibleToGuard(...))` -> sin vision, riesgo 0.

## Fuera de alcance

- Archivos no listados (incluidos `src/domain/patrol.ts`, `src/domain/alert.ts` y su logica, camara, HUD, escape).
- IA de busqueda, animaciones, sonido, acciones nuevas del jugador.
- Commits, push, dependencias nuevas, eliminacion de archivos.
