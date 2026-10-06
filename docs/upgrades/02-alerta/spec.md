# Spec — Upgrade 02: Medidor de alerta y estados del nivel

Proyecto: Silent Corridor. Upgrade: 02-alerta. Fecha: 2026-10-06. Estado: **borrador, pendiente de revision del estudiante** (Prompt1-02: no implementar hasta aprobacion).

Precondiciones verificadas: update 01 integrada en `379aa6f` (escena, patrulla y guardia funcionando).

## Problema

El peligro no tiene consecuencias visibles: el jugador puede estar al lado del guardia o mirado por el y la pantalla no dice nada. Sin medidor ni estados, no hay forma de decidir cuanto arriesgar ni de leer cuando el nivel escalo.

## Intencion de diseño

Que las consecuencias del peligro sean visibles: un medidor que crece con el riesgo, cuatro estados legibles (tranquilo, sospecha, busqueda, alerta maxima) y un ambiente que cambia de aspecto al subir la alerta.

## Objetivo

Implementar un sistema de alerta en el dominio (sin Phaser) alimentado por proximidad y cono de mirada del guardia, y mostrarlo en escena con HUD y tinte de ambiente.

## Alcance

- Incluye:
  - `src/domain/alert.ts`: nivel continuo 0-100, umbrales en 25/50/75 y estados `tranquilo | sospecha | busqueda | alerta maxima`; subida proporcional al riesgo y decaida cuando no hay riesgo; tiempo inyectado (`tick(deltaMs, riesgo)`), sin `Date.now()`.
  - Fuente de riesgo en `src/domain/`: funcion pura `computeRisk(distanciaGuardiaJugador, enConoDeMirada)` con bonus por cono (usa la direccion de mirada existente de `Patrol.getGazeDirection()`). Sin raycast ni obstaculos: eso pertenece al upgrade 04.
  - HUD en `GameScene`: barra de alerta con color por estado y rotulo del estado actual.
  - Ambiente: tinte de fondo del nivel segun el estado (mas rojo a mayor alerta).
  - Tests Vitest de `src/domain/alert.ts` (tiempo inyectado, sin render).
  - Constantes de umbrales y tasas en `src/core/constants.ts`.
  - Paquete `docs/upgrades/02-alerta/{spec,plan,evidencia}.md`.
- No incluye:
  - Linea de visión con obstaculos, cobertura o quiebre de vision (upgrade 04).
  - Camara dinamica de tension (upgrade 03).
  - Escape de ultimo momento ni feedback de alivio (upgrade 05).
  - Cambios al comportamiento de la patrulla (velocidad, pausas, mirada) definido en la update 01.
  - Sonido, menus, persistencia entre niveles.

## Restricciones

- Tecnicas: dominio sin importar `phaser`; `typecheck`, `build` y `test` en verde al cerrar; HUD solo consume el estado del dominio (ningun calculo de riesgo dentro de la escena).
- Operativas: sin push, sin eliminar archivos, sin dependencias nuevas; rama/commits segun el flujo acordado (el estudiante realiza los commits).
- De calidad: los umbrales viven en una sola fuente de constantes; el nivel nunca sale de `[0, 100]`.

## Casos

### Caso normal

- Dado: el nivel arranca en `tranquilo` con alerta 0.
- Cuando: el jugador se acerca al guardia y entra en su cono de mirada.
- Entonces: el medidor sube, cruza 25/50/75 y el HUD y el tinte de fondo cambian a `sospecha`, `busqueda` y `alerta maxima` en ese orden; al alejarse el nivel decae hasta `tranquilo`.

### Caso limite

- Dado: el jugador pegado al guardia (distancia minima) con alerta en 100.
- Cuando: permanece ahi varios segundos.
- Entonces: el nivel se mantiene en 100 y en `alerta maxima` (sin reinicio ni oscilacion); si el guardia esta de espaldas (fuera del cono) la tasa de subida es menor pero sigue subiendo por proximidad.

### Error / cierre tecnico

- Dado: build, typecheck o suite.
- Cuando: se ejecutan `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.
- Entonces: ninguno falla; si falla, se detiene el ciclo y se depura por evidencia.

## Criterios de aceptacion

| # | Criterio (verificable) | Prueba prevista |
|---:|---|---|
| 1 | Build y suite en verde | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` |
| 2 | La alerta sube proporcionalmente al riesgo y el cono multiplica la subida | Tests de `src/domain/` con igual distancia y distinto valor de cono |
| 3 | Sin riesgo el nivel decae hasta 0 y vuelve a `tranquilo` | Test con `tick` y riesgo 0 |
| 4 | Los estados cambian exactamente en 25/50/75 (bordes inclusive) | Tests de transicion en cada umbral |
| 5 | Con riesgo persistente el nivel se satura en 100 sin reiniciarse | Test con ticks consecutivos en riesgo maximo |
| 6 | El nivel jamas sale de `[0, 100]` | Test de invariantes (riesgo negativo/extremo) |
| 7 | `src/domain/` no importa `phaser` | Busqueda de `phaser` en `src/domain/` + suite en Node |
| 8 | El HUD refleja el estado: barra, rotulo y color por estado | Ejecucion manual registrada (`npm.cmd run dev`) |
| 9 | El ambiente cambia de tinte segun el estado | Ejecucion manual registrada (activacion, transicion, estado posterior) |
| 10 | Sin cambios de comportamiento en la patrulla ni raycast | Revision de diff: `src/domain/patrol.ts` sin cambios de logica; ausencia de calculos de vision con obstaculos |
| 11 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` con matriz criterio-evidencia |

## Evidencia prevista

- Version inicial: `379aa6f`. Version final: commit de cierre del upgrade.
- Comandos: `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` con salidas.
- Ejecucion manual: reproduccion visual con activacion (que muestra el HUD en tranquilo), transiciones al acercarse (cruce de 25/50/75 con cambio de color) y estado posterior (decaida hasta tranquilo al alejarse).
- Diff: `git diff --stat` por incremento y matriz criterio -> evidencia en `evidencia.md`.

## Decisiones registradas

- 2026-10-06 (estudiante): fuente de alerta = proximidad + cono de mirada; 4 estados del GDD con umbrales 25/50/75; consecuencias = HUD + tinte de ambiente (sin tocar la patrulla); la update 01 quedo commiteada en `379aa6f` antes de arrancar esta.

## Preguntas abiertas

- Ninguna que bloquee. Tasas de subida/baja y radios se fijan numericamente en `plan.md`.
