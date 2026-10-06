# Evidencia — Upgrade 05: Escape de último momento y feedback de alivio

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado: **implementacion completa, verificacion Prompt3 hecha; pendiente verificacion visual del estudiante y commits**.

## Versiones

- Version inicial: `bd4e500` ("Update4 terminada", incluye spec y plan de la 05).
- Estado actual del arbol: incrementos 1-3 **sin commit** (los commits los realiza el estudiante). Archivos: `src/domain/escape.ts`, `tests/escape.test.ts`, `src/core/constants.ts`, `src/scenes/GameScene.ts`, `docs/upgrades/05-escape/{plan,evidencia}.md`, `docs/registro-intervencion.md`.

## Comandos y resultados (2026-10-06, tras el incremento 3)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | `dist/` generado; aviso informativo chunk >500 kB (Phaser) | 0 |
| `npm.cmd test` | 6 archivos, 47 tests, 47 pasados (43 previos + 4 nuevos) | 0 |

## Incrementos ejecutados y diff por incremento

| # | Incremento | Archivos | Validacion |
|---:|---|---|---|
| 1 | Dominio de escape | `src/domain/escape.ts` (10 lineas), `tests/escape.test.ts` (27 lineas, 4 tests: 12 asserts) | 47/47 tests, typecheck exit 0 |
| 2 | Integracion en escena | `src/core/constants.ts` (+`ESCAPE_VIEW` 15 lineas), `src/scenes/GameScene.ts` (+34/-1: `levelClosed`, cierre con `evaluateEscape`, mensaje, flash, reset de `AlertSystem`, guard de `tick`) | typecheck/build/test exit 0 |
| 3 | Revision final y evidencia | este archivo, `docs/registro-intervencion.md` | contraste de los 11 criterios |

Diff acumulado pendiente de commit: `src/core/constants.ts` +15, `src/scenes/GameScene.ts` +34/-1; nuevos `src/domain/escape.ts`, `tests/escape.test.ts`, `docs/upgrades/05-escape/{plan,evidencia}.md`.

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Build y suite en verde | `typecheck`, `build`, `test` | **Cumple** (exit 0; 47/47) |
| 2 | `evaluateEscape` devuelve `'escape'` con nivel >= 75 y meta | Tests: 75, 80, 100 = `'escape'` | **Cumple** |
| 3 | `evaluateEscape` devuelve `'normal'` con nivel < 75 y meta | Tests: 0, 49, 74.9 = `'normal'` | **Cumple** |
| 4 | Sin meta no hay cierre | Tests: 0/75/100 sin meta = `null` | **Cumple** |
| 5 | Escape muestra mensaje de alivio + flash + reset de alerta | Diff de `GameScene` (`showEndMessage`, `cameras.main.flash`, `new AlertSystem(ALERT_CONFIG)`); ejecucion manual | **Cumple en codigo**; visual pendiente |
| 6 | Cierre normal muestra mensaje simple y meta en verde | Diff de `GameScene` (rama `'normal'` + `setFillStyle(0x2e7d32)` existente); ejecucion manual | **Cumple en codigo**; visual pendiente |
| 7 | La alerta queda cerrada en 0 tras el escape | Diff: `levelClosed` + guard en `updateAlert` (sin `tick`, HUD sigue leyendo la instancia nueva = 0); ejecucion manual | **Cumple en codigo**; visual pendiente |
| 8 | El cierre ocurre una sola vez por partida | Bandera `goalReached` (previa) que gatea el unico bloque de cierre | **Cumple** |
| 9 | Sin cambios en `patrol.ts`, `alert.ts`, `vision.ts`, `camera.ts` ni en el HUD | `git diff --name-only bd4e500` sobre esos archivos: vacio; `constants.ts` y `GameScene.ts` unicos modificados; sin `console.` | **Cumple** |
| 10 | `src/domain/escape.ts` sin `phaser` | Busqueda de `phaser`: 0; suite en Node | **Cumple** |
| 11 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` | **Cumple** con este archivo |

Sin instrumentacion residual: busqueda de `console.` en `src/` y `tests/`: 0 coincidencias. Test de consistencia `ESCAPE_ALERT_THRESHOLD === ALERT_CONFIG.alertaMaximaAt` en verde (umbral atado a la 02).

## Reproduccion visual / telemetria (cambios de interfaz y feedback)

Cambios nuevos: mensajes de cierre, flash de camara, barra que se reinicia. Reproduccion a cargo del estudiante con `npm.cmd run dev`:

1. **Activacion**: llega a la meta con alerta baja (tranquilo/sospecha) -> mensaje `LLEGASTE` centrado y meta verde, sin flash.
2. **Transicion**: deja que la alerta llegue a >=75 (a la vista del guardia) y llega a la meta -> mensaje `ESCAPE JUSTO`, flash verde de 500 ms y la barra vuelve a 0 (`tranquilo 0`).
3. **Estado posterior**: despues del escape la alerta no vuelve a subir aunque el guardia te vea; el jugador sigue moviendose (no se congela).
4. **Unicidad**: caminar sobre la meta de nuevo no repite mensaje ni flash.

Registro de la observacion del estudiante: pendiente (fila en "Decisiones humanas").

## Limites de esta evidencia

- Los criterios 5, 6 y 7 dependen de la reproduccion manual que no puede ejecutar el agente (sin navegador en el entorno).
- El "cierre" es una pantalla de mensaje sin congelar al jugador ni reiniciar la escena (decision aprobada: sin freeze, sin estado de derrota).
- El reset de alerta se logra reemplazando la instancia de `AlertSystem` desde la escena (para no tocar `alert.ts`); cualquier estado futuro dentro de `AlertSystem` se perderia al hacerlo.
- El mensaje se dibuja en coordenadas de mundo con `depth 30`; con el zoom de la 04 la camara esta en 0.85-1.0, el texto escala un poco pero queda centrado.
- Ningun criterio fue alterado para acomodar resultados.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Aprobar spec de la update 05 (4 decisiones + 2 derivadas) | Estudiante | 2026-10-06 | "todo correcto, listo para la implementacion de 05" |
| Commit de la 04 | Estudiante | 2026-10-06 | `bd4e500` |
| Commits de los incrementos 1-3 de la 05 | Estudiante | Pendiente | El agente no crea commits |
| Verificacion visual (`npm.cmd run dev`) | Estudiante | Pendiente | Completar seccion visual 1-4 |

## Decision recomendada del agente

**Integrar** una vez que confirmes la verificacion visual (4 puntos) y hagas el commit. Los criterios 1-4, 8-11 ya tienen evidencia completa; 5-7 quedan a la espera de tu observacion. Con esto se cierra la ultima update del plan (`01 -> 02 -> 03 -> 04 -> 05`) y queda el cierre general: completar tu nombre/materia/comision/anio en `README.md`.
