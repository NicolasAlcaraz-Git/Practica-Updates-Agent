# Spec — Upgrade 05: Escape de último momento y feedback de alivio

Proyecto: Silent Corridor. Upgrade: 05-escape. Fecha: 2026-10-06. Estado: **borrador, pendiente de revision del estudiante** (Prompt1-05: no implementar hasta aprobacion).

Precondiciones verificadas: updates 01-03 integradas (`379aa6f`, `068e205`, `d160b96`); update 04 implementada y validada (pendiente de commit del estudiante); hoy llegar a la meta solo la pone verde (`src/scenes/GameScene.ts`, `updatePlayer`, `goalReached`) y **nada cierra el nivel**; `alerta maxima` (>=75) solo tiñe camara y HUD via `ALERT_VIEW`; `AlertSystem` no expone reset.

## Problema

El ciclo de tension no tiene desenlace: llegar a la meta con la alerta al limite se siente igual que llegar tranquilo. El GDD promete "superar el umbral de escape cierra el nivel con feedback de alivio", pero el codigo actual no cierra ni premia la maniobra ajustada.

## Intencion de diseno

Dos cierres diferenciados: **escape** (llegar a la meta con alerta >= 75: mensaje de alivio, flash de camara y alerta a 0) y **cierre normal** (llegar con alerta baja: mensaje simple). Sin estado de derrota: la tension la pone solo llegar ajustado.

## Objetivo

Implementar la regla de cierre del nivel en `src/domain/` (pura, testeable) y consumirla en `GameScene`: al entrar a la meta evalua el nivel de alerta, muestra el mensaje que corresponda, aplica el feedback de alivio (texto + flash + reset de alerta) en el caso escape y cierra la actualizacion de la alerta.

## Alcance

- Incluye:
  - `src/domain/escape.ts` (sin `phaser`):
    - `ESCAPE_ALERT_THRESHOLD = 75` (mismo umbral de `alerta maxima` de la 02).
    - `evaluateEscape(alertLevel, goalReached)` -> `'escape' | 'normal' | null`: con meta y nivel >= 75 = `'escape'`; con meta y nivel < 75 = `'normal'`; sin meta = `null`.
  - `src/core/constants.ts`: constantes de vista del cierre (texto, duracion del flash, colores) agrupadas tipo `ESCAPE_VIEW`.
  - `GameScene`:
    - Al entrar a la meta (ya esta el detector `insideGoal`), una sola vez: `evaluateEscape` decide el cierre.
    - Escape: mensaje de alivio a pantalla + flash de camara + alerta reiniciada a 0 (la escena reemplaza su `AlertSystem` por una instancia nueva; **`alert.ts` sin cambios**) + fin de la actualizacion de la alerta (queda cerrada en 0).
    - Cierre normal: mensaje simple + meta en verde (como hoy).
    - Sin congelacion del jugador: luego del cierre sigue recibiendo input (decision del Prompt1, revocable al revisar la spec).
  - Tests Vitest de `src/domain/escape.ts` (umbrales, sin meta, casos limite).
  - Paquete `docs/upgrades/05-escape/{spec,plan,evidencia}.md`.
- No incluye:
  - Estado de derrota / "atrapado" / reinicio automatico de escena (decidido: no existe).
  - Audio, shake de camara, animaciones ni assets (rectangulos y textos del sistema, como hasta ahora).
  - Cambios a `patrol.ts`, `alert.ts`, `camera.ts`, `vision.ts` ni a su logica; nada de HUD de alerta de la 02.
  - Acciones nuevas del jugador (solo WASD/flechas).

## Restricciones

- Tecnicas: dominio sin importar `phaser`; regla de cierre pura y testeable; `typecheck`, `build` y `test` en verde.
- Operativas: sin push, sin eliminar archivos, sin dependencias nuevas; commits por el estudiante.
- De calidad: sin logica de cierre dentro del dominio de la escena (la escena solo consume `evaluateEscape`); sin `console.`.

## Casos

### Caso normal

- Dado: el jugador llega a la meta con alerta `tranquilo`/`sospecha` (< 75).
- Entonces: cierre normal, mensaje simple y meta en verde; sin flash ni alivio.

### Caso limite

- Dado: el jugador llega a la meta con la alerta justo en 75 (o en 100).
- Entonces: `evaluateEscape` devuelve `'escape'` (umbral inclusivo): mensaje de alivio, flash de camara, alerta a 0 y la alerta deja de actualizarse.
- Caso borde: 74.9 = `'normal'`; 75.0 = `'escape'`.

### Error / cierre tecnico

- Dado: build, typecheck o suite.
- Cuando: se ejecutan `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.
- Entonces: ninguno falla; si falla, se detiene el ciclo y se depura por evidencia.

## Criterios de aceptacion

| # | Criterio (verificable) | Prueba prevista |
|---:|---|---|
| 1 | Build y suite en verde | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` |
| 2 | `evaluateEscape` devuelve `'escape'` con nivel >= 75 y meta | Tests: 75, 80, 100 con meta = `'escape'` |
| 3 | `evaluateEscape` devuelve `'normal'` con nivel < 75 y meta | Tests: 0, 74.9 = `'normal'` |
| 4 | Sin meta no hay cierre | Tests: cualquier nivel sin meta = `null` |
| 5 | Escape muestra mensaje de alivio + flash + reset de alerta | Ejecucion manual registrada + reinstantiacion de `AlertSystem` en el diff |
| 6 | Cierre normal muestra mensaje simple y meta en verde | Ejecucion manual registrada |
| 7 | La alerta queda cerrada en 0 tras el escape (no vuelve a subir) | Ejecucion manual registrada (telemetria: barra en 0 tras el escape) |
| 8 | El cierre ocurre una sola vez por partida | Bandera en escena (hoy `goalReached`) + revision de diff |
| 9 | Sin cambios en `patrol.ts`, `alert.ts`, `vision.ts`, `camera.ts` ni en el HUD | `git diff --name-only` sobre esos archivos; ausencia de `console.` |
| 10 | `src/domain/escape.ts` sin `phaser` | Busqueda en `src/domain/escape.ts` + suite en Node |
| 11 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` con matriz criterio-evidencia |

## Evidencia prevista

- Version inicial: commit de cierre de la 04 (verificando con `git log --oneline` antes de arrancar). Version final: commit de cierre del upgrade.
- Comandos: `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` con salidas.
- Ejecucion manual: (1) llegada con alerta baja -> mensaje simple, (2) llegada con alerta >= 75 -> mensaje de alivio + flash + barra a 0, (3) la alerta no sube mas despues del escape, (4) llegada repetida a la meta no repite mensajes.
- Diff: `git diff --stat` por incremento y matriz criterio -> evidencia en `evidencia.md`.

## Decisiones registradas

- 2026-10-06 (estudiante, Prompt1): umbral de escape = **alerta >= 75 al llegar a la meta**; llegada con alerta baja = **cierre normal sin alivio**; feedback = **texto + flash de camara + reset de alerta a 0**; **no existe estado de derrota**.
- Derivada del Prompt1 (revocable al revisar): sin congelacion del jugador post-cierre; la alerta queda cerrada en 0 (deja de actualizarse).

## Preguntas abiertas

- Ninguna que bloquee. Textos exactos, duracion del flash y estilo visual se fijan en `plan.md`.
