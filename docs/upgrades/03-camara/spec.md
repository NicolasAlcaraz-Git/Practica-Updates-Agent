# Spec — Upgrade 03: Cámara dinámica de tensión

Proyecto: Silent Corridor. Upgrade: 03-camara. Fecha: 2026-10-06. Estado: **borrador, pendiente de revision del estudiante** (Prompt1-03: no implementar hasta aprobacion).

Precondiciones verificadas: updates 01 (`379aa6f`) y 02 (`068e205`) integradas; la alerta y sus estados funcionan y fueron verificados visualmente.

## Problema

La cámara es fija y siempre muestra lo mismo: cuando la alerta sube, el encuadre no aporta información ni sensación de riesgo. El jugador no percibe por la cámara que algo cambio.

## Intencion de diseño

Un encuadre util durante un momento de riesgo: la cámara sigue al jugador con suavidad y, segun el estado de alerta, ensancha la vista para mostrar más contexto a medida que crece el peligro; al volver a `tranquilo`, recupera el encuadre inicial.

## Objetivo

Implementar camara de seguimiento con zoom por estado de alerta, determinista (logica de encuadre en dominio puro) y acotada a los limites del nivel, sin tocar gameplay ni la logica existente.

## Alcance

- Incluye:
  - `src/domain/camera.ts`: logica pura del encuadre — `zoomForState(state, view)` y `lerp(current, target, t)` con `t` en `[0,1]`; sin `phaser`.
  - `CAMERA_VIEW` en `src/core/constants.ts`: zoom objetivo por estado (`tranquilo: 1`, y zoom out leve al subir) y factor de suavidad por segundo.
  - Seguimiento en `GameScene`: la cámara principal sigue la posicion del jugador con lerp y aplica el zoom del estado actual; transiciones continuas (nunca un salto instantaneo).
  - `setBounds` de la cámara al tamano del nivel (0,0,960,540): sin vacio visible al hacer zoom out ni desborde en esquinas.
  - Tests Vitest de `src/domain/camera.ts`.
  - Paquete `docs/upgrades/03-camara/{spec,plan,evidencia}.md`.
- No incluye:
  - Shake/temblor, paneo hacia el guardia, efectos de escape o alivio (upgrade 05).
  - Cambios al jugador, guardia, alerta o HUD (salvo el dato de estado que ya existe).
  - Audio, menus, cutscenes.

## Restricciones

- Tecnicas: dominio sin importar `phaser`; `typecheck`, `build` y `test` en verde; la cámara solo consume `getLevel()/getState()` y la posicion del jugador.
- Operativas: sin push, sin eliminar archivos, sin dependencias nuevas; commits por el estudiante.
- De calidad: `src/domain/patrol.ts` y `src/domain/alert.ts` sin cambios de logica; sin variables globales; el zoom nunca sale de `CAMERA_VIEW`.

## Casos

### Caso normal

- Dado: nivel en `tranquilo` (zoom objetivo 1).
- Cuando: la alerta sube a `sospecha`, `busqueda` y `alerta maxima`.
- Entonces: el zoom objetivo baja gradualmente (zoom out) hasta el valor del estado, siempre interpolado; al volver a `tranquilo` regresa a 1 sin saltos.

### Caso limite

- Dado: jugador en una esquina del corredor con la alerta al maximo.
- Cuando: la cámara aplica el zoom out maximo.
- Entonces: el encuadre se ajusta a los limites del nivel (no se ve negro ni fuera de las paredes) y el zoom queda estable en el valor del estado.

### Error / cierre tecnico

- Dado: build, typecheck o suite.
- Cuando: se ejecutan `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.
- Entonces: ninguno falla; si falla, se detiene el ciclo y se depura por evidencia.

## Criterios de aceptacion

| # | Criterio (verificable) | Prueba prevista |
|---:|---|---|
| 1 | Build y suite en verde | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` |
| 2 | Cada estado tiene zoom objetivo distinto y monotono (a mayor alerta, menor zoom) | Tests de `zoomForState` sobre los 4 estados |
| 3 | `lerp` interpola dentro de `[0,1]` y es estable en los extremos | Tests de `lerp` (t=0, t=1, t intermedio, extrapolacion recortada) |
| 4 | `src/domain/camera.ts` sin `phaser` | Busqueda de `phaser` en `src/domain/` + suite en Node |
| 5 | La cámara sigue al jugador dentro de los limites del nivel | Codigo con `setBounds(0,0,960,540)` + ejecucion manual en esquinas |
| 6 | Transicion visual: acercar/bajar alerta cambia el zoom suavemente (activacion, transicion, estado posterior) | Ejecucion manual registrada (`npm.cmd run dev`) |
| 7 | Sin cambios de gameplay ni de logica previa | Revision de diff: `patrol.ts`, `alert.ts`, `GameScene.updatePlayer/updateAlert` sin cambios de comportamiento |
| 8 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` con matriz criterio-evidencia |

## Evidencia prevista

- Version inicial: `068e205`. Version final: commit de cierre del upgrade.
- Comandos: `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` con salidas.
- Ejecucion manual: reproduccion visual con (1) encuadre inicial en `tranquilo`, (2) zoom out progresivo al subir la alerta sin cortes, (3) regreso al encuadre inicial al alejarse, (4) esquina del nivel sin vacio visible.
- Diff: `git diff --stat` por incremento y matriz criterio -> evidencia en `evidencia.md`.

## Decisiones registradas

- 2026-10-06 (estudiante): gatillante = estado de alerta (reutiliza la 02); comportamiento = seguimiento con lerp + zoom out leve por estado (sin shake); encuadre acotado a los limites del nivel.

## Preguntas abiertas

- Ninguna que bloquee. Valores de zoom por estado y factor de suavidad se fijan en `plan.md`.
