# Spec — Upgrade 01: Patrulla con pausas y mirada direccional

Proyecto: Silent Corridor. Fase/upgrade: 01. Fecha: 2026-10-06. Estado: **borrador, pendiente de revision del estudiante** (Prompt1: no implementar hasta aprobacion).

## Problema

No existe codigo base: no hay prototipo que muestre amenaza ni ritmo. Sin una patrulla legible, el jugador no puede anticipar por donde pasa el guardia ni cuanto dura su recorrido; la situacion de sigilo no se comunica.

## Intencion de diseño

Que la patrulla presente patrones de movimiento claros y simples: un tramo lineal con pausa en cada extremo, durante la cual la mirada del guardia barre de lado a lado. Anticipacion visual y ritmo del recorrido, sin deteccion.

## Objetivo

Construir el prototipo base (stack y minijuego) e implementar sobre el la patrulla con pausas y mirada direccional, de modo que un observador pueda predecir el paso del guardia solo con mirar la pantalla.

## Alcance

- Incluye:
  - Scaffold del stack base: Vite + Phaser 4 + TypeScript + Vitest (solo dependencias de la base del stack).
  - Escena minima: corredor con paredes, jugador con movimiento (WASD/flechas), colision con paredes, meta de escape al final del corredor.
  - Un guardia con patrulla lineal `A <-> B`: pausa al llegar a cada extremo y durante la pausa barrido lateral de la mirada.
  - Logica de patrulla en `src/domain/` sin dependencia de Phaser, con tests unitarios de Vitest (tiempo inyectado por tick).
  - Constantes de ritmo (velocidad, duracion de pausa, amplitud/frecuencia del barrido) centralizadas y configurables.
  - Paquete `docs/upgrades/01-patrulla/{spec,plan,evidencia}.md`.
- No incluye:
  - Deteccion del jugador, medidor de alerta o estados de alerta (upgrade 02).
  - Camara dinamica (upgrade 03).
  - Linea de visión, cobertura ni raycast (upgrade 04).
  - Escape de ultimo momento ni feedback de alivio (upgrade 05).
  - Audio, menus, multiples niveles, assets producidos.
  - Versiones multiples de guardia o circuitos de waypoints.

## Restricciones

- Tecnicas: dominio en `src/domain/` sin importar `phaser`; `npm.cmd run typecheck`, `npm.cmd run build` y `npm.cmd test` en verde al cerrar; un incremento por vez con revision de `git diff`.
- Operativas: sin push/publicar, sin eliminar archivos, sin dependencias fuera de la base del stack; rama `upgrade/01-patrulla` y merge a `main` solo tras aprobacion.
- De calidad: valores de ritmo en una sola fuente de constantes; sin logica de patrulla duplicada en la escena.

## Casos

### Caso normal

- Dado: el guardia patrulla entre A y B con velocidad y pausa configurables.
- Cuando: el jugador recorre el corredor y espera el momento en que el guardia esta en pausa o de espaldas a su ruta.
- Entonces: el guardia alterna movimiento, pausa con barrido de mirada y vuelta; el jugador llega a la meta sin que el guardia reaccione (no hay deteccion).

### Caso limite

- Dado: el jugador y el guardia comparten el eje del corredor y el guardia entra en pausa junto a una pared.
- Cuando: el jugador intenta pasar durante la pausa con poco espacio.
- Entonces: no hay atravesamiento (colision activa en ambos), la pausa dura lo configurado y el guardia reanuda el mismo rumbo tras el barrido; el juego no se bloqueia.

### Error / cierre tecnico

- Dado: build, typecheck o suite.
- Cuando: se ejecutan `npm.cmd run typecheck`, `npm.cmd run build` o `npm.cmd test`.
- Entonces: ninguno falla; si falla, se detiene el ciclo y se depura por evidencia.

## Criterios de aceptacion

| # | Criterio (verificable) | Prueba prevista |
|---:|---|---|
| 1 | El proyecto instala y compila con el stack base | `npm.cmd install`, `npm.cmd run typecheck`, `npm.cmd run build` sin error |
| 2 | La suite corre sin red ni render | `npm.cmd test` en verde |
| 3 | La patrulla alterna `A -> pausa -> B -> pausa -> A` con los tiempos configurados | Test de `src/domain/` con ticks inyectados (sin Phaser) |
| 4 | Durante la pausa la mirada barre de lado a lado y se invierte el rumbo al reanudar | Test de dominio (estado de mirada) + ejecucion manual registrada |
| 5 | La direccion de la mirada en movimiento coincide con el rumbo | Test de dominio + ejecucion manual |
| 6 | El jugador se mueve con WASD/flechas, colisiona con paredes y alcanza la meta | Ejecucion manual documentada en `evidencia.md` |
| 7 | `src/domain/` no importa `phaser` y se testea en Node puro | Tests de dominio corren sin inicializar Phaser (chequeo de imports + suite) |
| 8 | No hay deteccion ni estado de alerta (se respeta el alcance) | Revision de diff: ausencia de codigos de vision/alerta; sin cambio de estado del jugador |
| 9 | Diffs acotados y trazables | Un commit por incremento, solo con autorizacion explicita del estudiante; `git diff --stat` por incremento en `evidencia.md` |
| 10 | Paquete de documentacion completo | Existencia de `spec.md`, `plan.md` y `evidencia.md` con matriz criterio-evidencia |

## Evidencia prevista

- Version inicial: `1fb8cd3`. Version final: commit de cierre de la rama `upgrade/01-patrulla`.
- Comandos y salidas: `npm.cmd install`, `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test`.
- Ejecucion manual: registro breve de lo observado (rumbo, pausa, barrido, llegada a meta) con hora y resultado.
- Diff: `git diff --stat main...upgrade/01-patrulla` y resumen por incremento.
- Matriz criterio -> evidencia y decision humana (integrar, corregir, revertir, descartar) en `evidencia.md`.

## Preguntas abiertas

- Ninguna que bloquee: decisiones tomadas por el estudiante (base + patrulla juntas, tramo lineal A<->B, barrido lateral en pausa, sin deteccion). Valores numericos de ritmo se fijan en `plan.md`.

## Decisiones registradas

- 2026-10-06: version del stack fijada tras el primer `npm install` (Phaser 4.2.1, Vite 8.3.3, TypeScript 7.0.2, Vitest 5.0.3). El estudiante eligio Phaser 4 sobre Phaser 3; spec, GDD, README y especificacion se actualizaron para no contradecir la instalacion real.
