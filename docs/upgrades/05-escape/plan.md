# Plan — Upgrade 05: Escape de último momento y feedback de alivio

Proyecto: Silent Corridor. Aprobacion del estudiante: 2026-10-06 (spec `05-escape` aprobada con sus 4 decisiones y las 2 derivadas del agente; Prompt2 aplicado como en updates anteriores: un incremento por vez, validacion y diff, sin commits automaticos).
Spec base: `docs/upgrades/05-escape/spec.md`.

## Objetivo del plan

Poner la regla de cierre del nivel en el dominio (pura, testeable), despues consumirla en la escena: al entrar a la meta, el nivel se cierra una sola vez con el mensaje que corresponda y, en el caso escape, con flash + reset de alerta. Cada incremento toca solo sus archivos previstos; cualquier archivo fuera de plan obliga a consultar.

## Incrementos

| # | Incremento | Archivos previstos | Validacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Dominio de escape: `ESCAPE_ALERT_THRESHOLD`, `evaluateEscape` | `src/domain/escape.ts`, `tests/escape.test.ts` | `npm.cmd test`, `typecheck` | Umbral que se desincronice de `ALERT_CONFIG.alertaMaximaAt` | No poder expresar la regla de forma pura sin tocar `alert.ts` |
| 2 | Integracion en escena: `ESCAPE_VIEW`, mensaje, flash, reset de alerta, cierre unico | `src/core/constants.ts`, `src/scenes/GameScene.ts` | `typecheck`, `build`, `test` | Romper el HUD/H-t de la 02 o el feedback de visibilidad de la 04 | El reset/cierre altere criterios ya cerrados de la 02/04 |
| 3 | Revision final de diff y evidencia | `docs/upgrades/05-escape/evidencia.md` | `typecheck`, `build`, `test` + contraste criterio-evidencia | Evidencia incompleta o criterio sin prueba | Algum criterio sin evidencia verificable: no cerrar |

## Orden de implementacion

1 -> 2 -> 3. Tras cada incremento se ejecutan los comandos del estado, se muestra `git status`/`git diff --stat` y se registra en la evidencia. Los commits los realiza el estudiante.

## Valores iniciales (se ajustan con evidencia en el incremento 3)

- `ESCAPE_ALERT_THRESHOLD = 75`, identico a `ALERT_CONFIG.alertaMaximaAt` (la 02); un test de consistencia los ata.
- `evaluateEscape(alertLevel, goalReached)` -> `'escape' | 'normal' | null` (umbral inclusivo: 75 = escape).
- `ESCAPE_VIEW` en `constants.ts`:
  - escape: mensaje `ESCAPE JUSTO`, color `#8ee68e`, flash 500 ms (verde `r=140, g=255, b=170`).
  - normal: mensaje `LLEGASTE`, color `#e8eef5`, sin flash.
- Escena: bandera `levelClosed`; tras el escape se reemplaza `this.alert` por `new AlertSystem(ALERT_CONFIG)` (reset sin tocar `alert.ts`) y `updateAlert` deja de hacer `tick` (la alerta queda en 0); el HUD y el color del jugador siguen actualizandose.
- El jugador no se congela ni recibe input nuevo post-cierre (derivada aprobada).

## Fuera de alcance

- Archivos no listados (incluidos `src/domain/patrol.ts`, `alert.ts`, `vision.ts`, `camera.ts` y su logica, HUD de alerta de la 02, cobertura de la 04).
- Estado de derrota, reinicio de escena, audio, shake, animaciones, acciones nuevas del jugador.
- Commits, push, dependencias nuevas, eliminacion de archivos.
