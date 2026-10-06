# Evidencia — Upgrade 04: Cobertura y ruptura de línea de visión

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado: **cerrada — visto bueno del estudiante ("todo correcto", 2026-10-06) e integrada en `bd4e500`**.

## Versiones

- Version inicial: `1e912e1` ("Update4 validada").
- Estado actual del arbol: incrementos 1-4 integrados en `bd4e500` ("Update4 terminada"), con push a `origin/main`; arbol limpio al cierre de la update.

## Comandos y resultados (2026-10-06, tras el incremento 4)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | `dist/` generado; aviso informativo chunk >500 kB (Phaser) | 0 |
| `npm.cmd test` | 5 archivos, 43 tests, 43 pasados (28 previos + 15 nuevos) | 0 |

## Incrementos ejecutados y diff por incremento

| # | Incremento | Archivos | Validacion |
|---:|---|---|---|
| 1 | Dominio de vision | `src/domain/vision.ts` (nuevo, 173 lineas), `tests/vision.test.ts` (nuevo, 121 lineas, 15 tests) | 43/43 tests, typecheck exit 0 |
| 2 | Cobertura y riesgo | `src/core/constants.ts` (+`COVERS`, `OBSTACLES`), `src/scenes/GameScene.ts` (cajas dibujadas, colision sobre `OBSTACLES`, riesgo con `visibleToGuard` + `riskForGuardView`) | typecheck/build/test exit 0 |
| 3 | Feedback visual | `src/scenes/GameScene.ts` (+`updateSight` con poligono recortado, jugador rojo/blanco) | typecheck/build/test exit 0 |
| 4 | Revision final y evidencia | este archivo, `docs/registro-intervencion.md` | contraste de los 12 criterios |

Diff acumulado pendiente de commit: `src/core/constants.ts` +9/-1, `src/scenes/GameScene.ts` +44/-5, nuevos `src/domain/vision.ts`, `tests/vision.test.ts`, `docs/upgrades/04-cobertura/{spec,plan,evidencia}.md`.

## Ajustes respecto del plan (registrados, sin cambios de alcance)

- `COVERS[1]` movido de `x=250` a `x=200` tras verificar el pasaje bajo el muro (con x=250 quedaba un corredor de 16 px; con x=200 queda libre).
- La regla "sin vision = riesgo 0" se implemento como `riskForGuardView()` en `vision.ts` (no en `alert.ts`): el plan la describia dentro de `computeRisk`, pero el criterio 10 exige que `alert.ts` no cambie. Comportamiento = mismo, archivo protegido = mismo.

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Build y suite en verde | `typecheck`, `build`, `test` | **Cumple** (exit 0; 43/43) |
| 2 | `hasLineOfSight` distingue libre de bloqueada | Tests: `sin obstaculos...`, `un muro intermedio bloquea...`, `una caja de cobertura intermedia bloquea...`, `un obstaculo fuera del camino no bloquea` | **Cumple** |
| 3 | `rayHitDistance` devuelve primer impacto o `maxDist` | Tests: `devuelve la distancia al primer impacto` (39.5), `sin impacto devuelve maxDist`, `direccion cero devuelve 0` | **Cumple** |
| 4 | `visibleToGuard` exige cono y linea libre | Tests: visible al frente; en cono tras caja = oculto; fuera de cono = oculto; mas alla del radio = oculto | **Cumple** |
| 5 | Sin vision el riesgo es 0 y la alerta decae | Test de integracion: `riesgo 0 cuando el jugador no esta visible, y AlertSystem baja` (sube a 70, decae a `tranquilo` con riesgo 0) | **Cumple** |
| 6 | Cajas en el nivel, se chocan y cortan la vision | `COVERS` + doble test (caja bloquea LOS y `visibleToGuard`), colision sobre `OBSTACLES` en `collides`, dibujo en `create`; verificacion manual | **Cumple** (visual confirmado en el cierre) |
| 7 | Cono recortado se dibuja y se mueve con el guardia | `sightPolygon` (tests de estructura: 17 puntos, recorte central con muro, `[]` sin gaze) + ejecucion manual | **Cumple** (visual confirmado en el cierre) |
| 8 | Indicador rojo/blanco del jugador | `updateAlert` (`setFillStyle(visible ? 0xf44336 : 0xe8eef5)`); ejecucion manual | **Cumple** (visual confirmado en el cierre) |
| 9 | La alerta deja de subir al romper la linea y decae | Test de dominio (criterio 5) + ejecucion manual | **Cumple** (visual confirmado en el cierre) |
| 10 | Sin cambios en `patrol.ts`, `alert.ts` ni camara/HUD | `git diff --name-only 1e912e1 -- src/domain/patrol.ts src/domain/alert.ts` vacio; camara/HUD sin ediciones en este upgrade | **Cumple** |
| 11 | `src/domain/` sin `phaser` | Busqueda en `src/domain/*.ts`: 0; suite en Node | **Cumple** |
| 12 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` | **Cumple** con este archivo |

Sin instrumentacion residual: busqueda de `console.` en `src/` y `tests/`: 0 coincidencias.

## Reproduccion visual / telemetria (cambios de interfaz y feedback)

Cambios nuevos: cajas de cobertura, cono amarillo translucido del guardia, color del jugador. Reproduccion a cargo del estudiante con `npm.cmd run dev`:

1. **Activacion**: se ven 3 cajas nuevas (marrones) ademas de los muros; el cono amarillo del guardia se corta contra muros y cajas al moverse.
2. **Transicion**: al entrar al cono con linea libre el jugador pasa a rojo y la alerta sube; al meterte detras de una caja o muro el jugador vuelve a blanco, el cono se corta y la alerta deja de subir.
3. **Estado posterior**: alejandote, la alerta decae hasta `tranquilo`; la caja bloquea el paso (no se atraviesa).

Registro de la observacion del estudiante: **confirmado 2026-10-06** — aprobacion del cierre ("todo correcto, listo para la implementacion de 05"); sin incidencias reportadas de los puntos 1-3.

## Limites de esta evidencia

- Los criterios 6 (visual), 7 (visual), 8 y 9 dependen de la reproduccion manual que no puede ejecutar el agente (sin navegador en el entorno).
- El cono se dibuja con 16 muestras y borde recto (aproximacion); no hay animacion de barrido del cono (la mirada ya la resuelve el indicador de la 01).
- La colision del guardia con cajas no existe (su carril x=510 no atraviesa ninguna caja); si se mueve el carril, hay que revisarlo.
- El riesgo usa la distancia al centro del jugador con radio de peligro de 260 px; valores no calibrados con jugadores reales.
- Ningun criterio fue alterado para acomodar resultados.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Aprobar spec de la update 04 | Estudiante | 2026-10-06 | Prompt1-04 + spec |
| Autorizar plan y ciclo Prompt2 | Estudiante | 2026-10-06 | "ya hice commit... apruebo la spec" |
| Commits de los incrementos 1-4 | Estudiante | 2026-10-06 | `bd4e500` ("Update4 terminada"), push a `origin/main`; el agente no crea commits |
| Verificacion visual (`npm.cmd run dev`) | Estudiante | 2026-10-06 | "todo correcto"; sin incidencias reportadas |

## Decision recomendada del agente

**Integrada**: visto bueno del estudiante (2026-10-06) y `bd4e500`. Los 12 criterios tienen evidencia; los visuales (6-9) se cerraron con la verificacion manual del estudiante.
