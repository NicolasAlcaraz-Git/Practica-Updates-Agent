# Spec — Upgrade 04: Cobertura y ruptura de línea de visión

Proyecto: Silent Corridor. Upgrade: 04-cobertura. Fecha: 2026-10-06. Estado: **borrador, pendiente de revision del estudiante** (Prompt1-04: no implementar hasta aprobacion).

Precondiciones verificadas: updates 01-03 integradas (`379aa6f`, `068e205`, `d160b96`); la alerta usa hoy `isInCone` **sin obstaculos** (limitacion registrada en la evidencia de la 02).

## Problema

El guardia "mira a traves" de los muros: esconderse no baja el peligro, asi que no existe la decision de sigilo de elegir una ruta cubierta. La cobertura actual (muros) no se percibe como opcion porque la linea de vision nunca se rompe.

## Intencion de diseño

Una decision activa de sigilo: el jugador elige moverse tras cobertura que corta la linea de visión; mientras no hay linea libre, la alerta deja de subir y decae. El cono del guardia se dibuja recortado por los obstaculos y el jugador recibe feedback de si esta visible u oculto.

## Objetivo

Implementar linea de visión real (raycast puro contra rectángulos) en `src/domain/`, alimentar la alerta con ella (reemplazando el cono obstaculo-ciego de la 02), agregar cajas de cobertura al nivel y mostrar cono recortado + indicador de visibilidad.

## Alcance

- Incluye:
  - `src/domain/vision.ts` (sin `phaser`):
    - `hasLineOfSight(from, to, obstacles)` — segmento vs AABB.
    - `rayHitDistance(origin, direction, obstacles, maxDist)` — distancia al primer obstaculo.
    - `visibleToGuard(origin, gaze, target, obstacles, radius, halfAngleDeg)` — cono **y** linea libre.
    - `sightPolygon(origin, gaze, halfAngleDeg, obstacles, maxDist, samples)` — puntos del cono recortado.
  - Regla de riesgo actualizada: `risk = computeRisk(distancia, visibleToGuard(...))`; **sin visión el riesgo es 0** (la alerta decae aunque el jugador este cerca del guardia).
  - `COVERS` en `src/core/constants.ts`: 2-3 cajas solidas que el jugador choca y que cortan la vision; misma lista de obstaculos para colision, vision y cono.
  - Feedback visual en `GameScene`: poligono del cono dibujado con `Graphics`, recalculado por frame, recortado por muros/cajas; color del jugador `rojo = visible` / `blanco = oculto`.
  - Tests Vitest de `src/domain/vision.ts` y del caso cobertura (caja entre guardia y jugador).
  - Paquete `docs/upgrades/04-cobertura/{spec,plan,evidencia}.md`.
- No incluye:
  - IA de busqueda, investigacion de posiciones, sonidos ni animaciones de alerta (upgrades no asignados).
  - Cambios al comportamiento de la patrulla, al HUD de alerta, a la camara ni al escape (05).
  - Acciones nuevas del jugador (solo WASD/flechas, como decidio el estudiante).
  - Assets: las cajas se dibujan como rectangulos, igual que los muros.

## Restricciones

- Tecnicas: dominio sin importar `phaser`; raycast determinista y testeable; `typecheck`, `build` y `test` en verde.
- Operativas: sin push, sin eliminar archivos, sin dependencias nuevas; commits por el estudiante.
- De calidad: sin calculos de vision dentro de la escena (la escena solo consume resultados del dominio); `patrol.ts` y `alert.ts` sin cambios de logica; sin `console.`.

## Casos

### Caso normal

- Dado: el jugador cruza a la vista del guardia (cono + linea libre).
- Entonces: el indicador pasa a rojo, la alerta sube con el bono de cono.
- Cuando: el jugador se mete detras de una caja o muro.
- Entonces: la linea se corta, el indicador pasa a blanco, la alerta deja de subir y decae hasta `tranquilo`.

### Caso limite

- Dado: el jugador muy cerca del guardia pero detras de una caja (distancia minima, sin linea libre).
- Cuando: permanece ahi.
- Entonces: riesgo 0, nivel de alerta en descenso; al asomarse (linea libre) vuelve a subir.
- Caso borde: el raycast rasante justo contra el borde de una caja cuenta como bloqueado (consistente con la colision).

### Error / cierre tecnico

- Dado: build, typecheck o suite.
- Cuando: se ejecutan `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.
- Entonces: ninguno falla; si falla, se detiene el ciclo y se depura por evidencia.

## Criterios de aceptacion

| # | Criterio (verificable) | Prueba prevista |
|---:|---|---|
| 1 | Build y suite en verde | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` |
| 2 | `hasLineOfSight` distingue linea libre de bloqueada (incluido obstaculo intermedio) | Tests: libre, bloqueado por muro, bloqueado por caja |
| 3 | `rayHitDistance` devuelve el primer impacto o `maxDist` sin impacto | Tests con muro en el camino y sin el |
| 4 | `visibleToGuard` exige cono **y** linea libre | Tests: dentro de cono visible; en cono pero tras caja = oculto; fuera de cono = oculto |
| 5 | Sin visión el riesgo es 0 (ruptura deja de subir la alerta) | Test de integracion de dominio: `computeRisk(dist, false)` con `visibleToGuard` en falso = 0; decaida con `AlertSystem` |
| 6 | Las cajas de cobertura estan en el nivel, se chocan y cortan la vision | Constante `COVERS` + test de vision con caja + colision en escena + verificacion manual |
| 7 | El cono recortado se dibuja y cambia con la posición del guardia | `sightPolygon` (test de estructura) + ejecucion manual |
| 8 | Indicador de visibilidad del jugador (rojo visible / blanco oculto) | Ejecucion manual registrada |
| 9 | La alerta deja de subir al romper la linea y decae | Ejecucion manual registrada (activacion, transicion, estado posterior) |
| 10 | Sin cambios en `patrol.ts`, `alert.ts` ni camara/HUD | Revision de diff: `git diff --name-only` sobre esos archivos; ausencia de `console.` |
| 11 | `src/domain/` sin `phaser` | Busqueda en `src/domain/*.ts` + suite en Node |
| 12 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` con matriz criterio-evidencia |

## Evidencia prevista

- Version inicial: `d160b96`. Version final: commit de cierre del upgrade.
- Comandos: `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` con salidas.
- Ejecucion manual: (1) cono recortado por muros/cajas al moverse el guardia, (2) rojo al entrar a la vista y blanco al metirse tras cobertura, (3) alerta que deja de subir y decae al romper la linea, (4) cajas chocaban al jugador.
- Diff: `git diff --stat` por incremento y matriz criterio -> evidencia en `evidencia.md`.

## Decisiones registradas

- 2026-10-06 (estudiante): la visión con raycast **reemplaza** al cono ciego de la 02 (alimenta la alerta); cobertura = cajas nuevas ademas de los muros; feedback = cono recortado + indicador del jugador; sin acciones nuevas (solo movimiento).

## Preguntas abiertas

- Ninguna que bloquee. Numero/posicion exactas de las cajas, muestras del poligono y radio de indicacion se fijan en `plan.md`.
