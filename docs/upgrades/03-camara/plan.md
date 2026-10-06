# Plan — Upgrade 03: Cámara dinámica de tensión

Proyecto: Silent Corridor. Aprobacion del estudiante: 2026-10-06 (spec `03-camara` aprobada; Prompt2 aplicado como en updates anteriores: un incremento por vez, validacion y diff, sin commits automaticos).
Spec base: `docs/upgrades/03-camara/spec.md`.

## Objetivo del plan

Separar la logica de encuadre (dominio puro, testeable) de su aplicacion en escena, y acotar la camara a los limites del nivel. Cada incremento toca solo sus archivos previstos; cualquier archivo fuera de plan obliga a consultar.

## Incrementos

| # | Incremento | Archivos previstos | Validacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Dominio de camara: `zoomForState`, `lerp` (t recortado a `[0,1]`), `smoothT` | `src/domain/camera.ts`, `tests/camera.test.ts` | `npm.cmd test`, `typecheck` | Zoom no monotono que contradiga la spec | Los criterios 2-3 no se pueden expresar como tests |
| 2 | Constantes y seguimiento: `CAMERA_VIEW`, `CAMERA_SMOOTH_PER_SEC`, lerp de scroll y zoom en el loop | `src/core/constants.ts`, `src/scenes/GameScene.ts` | `typecheck`, `build`, `test` | Salto inicial de camara en el primer frame | La interpolacion produce un corte visible o un valor fuera de `CAMERA_VIEW` |
| 3 | Limites del nivel | `src/scenes/GameScene.ts` (`setBounds`) | `typecheck`, `build`, `test` | Zoom out que descubre vacio fuera de los limites | No se puede acotar sin romper el seguimiento |
| 4 | Revision final de diff y evidencia | `docs/upgrades/03-camara/evidencia.md` | `typecheck`, `build`, `test` + contraste criterio-evidencia | Evidencia incompleta sin criterio sin prueba | Algum criterio sin evidencia verificable: no cerrar |

## Orden de implementacion

1 -> 2 -> 3 -> 4. Tras cada incremento se ejecutan los comandos del estado, se muestra `git status`/`git diff --stat` y se registra en la evidencia. Los commits los realiza el estudiante.

## Valores iniciales (se ajustan con evidencia en el incremento 4)

- `CAMERA_VIEW = { tranquilo: 1, sospecha: 0.95, busqueda: 0.9, alerta maxima: 0.85 }` (monotono decreciente).
- `CAMERA_SMOOTH_PER_SEC = 6` -> `t = clamp(6 * dtSeg, 0, 1)` por frame.
- Seguimiento: scroll objetivo centrado en el jugador; `setBounds(0, 0, 960, 540)` recorta el desborde.

## Fuera de alcance

- Archivos no listados (incluidos `src/domain/patrol.ts`, `src/domain/alert.ts` y su logica).
- Shake, paneo hacia el guardia, efectos de escape/alivio, audio, menus.
- Commits, push, dependencias nuevas, eliminacion de archivos.
