# Evidencia — Upgrade 03: Cámara dinámica de tensión

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado: **implementacion completa, verificacion Prompt3 hecha; pendiente verificacion visual del estudiante y commits**.

## Versiones

- Version inicial: `068e205` ("Update2 terminada").
- Estado actual del arbol: incrementos 1-4 **sin commit** (los commits los realiza el estudiante).
- Nota: tambien quedan sin commit los ajustes de registro/evidencia que confirman la verificacion visual de la update 02.

## Comandos y resultados (2026-10-06, tras el incremento 4)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | `dist/` generado; aviso informativo chunk >500 kB (Phaser) | 0 |
| `npm.cmd test` | 4 archivos, 28 tests, 28 pasados (21 previos + 7 nuevos) | 0 |

## Incrementos ejecutados y diff por incremento

| # | Incremento | Archivos | Validacion |
|---:|---|---|---|
| 1 | Dominio de camara | `src/domain/camera.ts` (nuevo, 17 lineas), `tests/camera.test.ts` (nuevo, 59 lineas, 7 tests) | 28/28 tests, typecheck exit 0 |
| 2 | Constantes y seguimiento | `src/core/constants.ts` (+`CAMERA_VIEW`, `CAMERA_SMOOTH_PER_SEC`), `src/scenes/GameScene.ts` (+`updateCamera` con lerp de scroll y zoom) | typecheck/build/test exit 0 |
| 3 | Limites del nivel | `src/scenes/GameScene.ts` (+`setBounds(0,0,960,540)` en `create`) | typecheck/build/test exit 0 |
| 4 | Revision final y evidencia | este archivo, `docs/registro-intervencion.md` | contraste de los 8 criterios |

Diff acumulado pendiente de commit: `src/core/constants.ts` +9, `src/scenes/GameScene.ts` +15, nuevos `src/domain/camera.ts`, `tests/camera.test.ts`, `docs/upgrades/03-camara/{spec,plan,evidencia}.md`.

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Build y suite en verde | `typecheck`, `build`, `test` | **Cumple** (exit 0; 28/28) |
| 2 | Zoom por estado distinto y monotonico | Tests: `devuelve el zoom objetivo de cada estado`, `es monotono decreciente: a mayor alerta, menor zoom` | **Cumple** (1 > 0.95 > 0.9 > 0.85) |
| 3 | `lerp` estable en `[0,1]` y extremos | Tests: `t=0 devuelve el valor actual y t=1 el objetivo`, `interpola el punto medio`, `recorta t fuera de [0,1]`, `smoothT` (2 tests) | **Cumple** |
| 4 | `src/domain/camera.ts` sin `phaser` | Busqueda de `phaser` en `src/domain/`: 0; suite en Node | **Cumple** |
| 5 | Camara dentro de los limites del nivel | `setBounds(0,0,GAME_WIDTH,GAME_HEIGHT)` en `GameScene.create`; ejecucion manual en esquinas | **Cumple en codigo**; verificacion visual en esquinas pendiente |
| 6 | Transicion visual sin cortes (activacion, transicion, estado posterior) | Ejecucion manual | **Pendiente de verificacion visual del estudiante** |
| 7 | Sin cambios de gameplay ni de logica previa | `git diff --name-only 068e205 -- src/domain/patrol.ts src/domain/alert.ts` vacio; `updatePlayer/updateAlert` sin cambios de comportamiento; sin `console.` | **Cumple** |
| 8 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` | **Cumple** con este archivo |

## Reproduccion visual / telemetria (cambios de interfaz y feedback)

Cambios nuevos: seguimiento suave de la cámara y zoom out segun estado. Reproduccion a cargo del estudiante con `npm.cmd run dev`:

1. **Activacion**: al cargar, la cámara centra al jugador (sin salto ni pantalla en negro).
2. **Transicion**: al acercarse al guardia la vista se ensancha gradualmente al cruzar 25/50/75 (sin cortes bruscos) y al alejarse vuelve al encuadre inicial.
3. **Estado posterior**: con la alerta en `tranquilo` el zoom queda en 1 y el jugador siempre queda encuadrado al moverse.
4. **Esquina**: al llevar el jugador a una esquina con alerta maxima no se ve vacio fuera del corredor.

Registro de la observacion del estudiante: pendiente (fila en "Decisiones humanas").

## Limites de esta evidencia

- Los criterios 5 (visual en esquinas) y 6 dependen de la reproduccion manual que no puede ejecutar el agente (sin navegador en el entorno).
- El seguimiento centra al jugador: no hay paneo hacia el guardia ni shake (fuera de alcance de esta spec).
- El zoom en `tranquilo` es 1: con la ventana del navegador distinta de 960x540, Phaser escala el canvas; el encuadre relativo es el correcto.
- Valores de zoom y suavidad son iniciales del plan; no se calibraron con jugadores reales.
- Ningun criterio fue alterado para acomodar resultados.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Aprobar spec de la update 03 | Estudiante | 2026-10-06 | Prompt1-03 + spec |
| Autorizar plan y ciclo Prompt2 | Estudiante | 2026-10-06 | "seguir con plan.md y Prompt2 como hasta ahora" |
| Commits de los incrementos 1-4 | Estudiante | Pendiente | El agente no crea commits |
| Verificacion visual (`npm.cmd run dev`) | Estudiante | Pendiente | Completar seccion visual 1-4 |

## Decision recomendada del agente

**Integrar** una vez que confirmes la verificacion visual y hagas el commit. Los criterios 1-4, 7 y 8 ya tienen evidencia completa; 5 y 6 quedan a la espera de tu observacion. Si algo se ve mal en pantalla, adjunta esa reproduccion y lo depuro antes del cierre.
