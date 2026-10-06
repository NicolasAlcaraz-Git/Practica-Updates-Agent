# Evidencia — Upgrade 01: Patrulla con pausas y mirada direccional

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado: **implementacion completa, verificacion Prompt3 hecha; pendiente la verificacion visual manual del estudiante y sus commits**.

## Versiones

- Version inicial de la practica: `1fb8cd3`. Punto de partida del upgrade: spec/plan en `127695a`; scaffold validado y commiteado por el estudiante en `dcf1965` ("Update1 validada").
- Estado final del arbol: incrementos 2-5 **sin commit** (los commits los realiza el estudiante; ver "Decisiones humanas").

## Comandos y resultados (2026-10-06, tras el incremento 5)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | `dist/` generado; aviso informativo chunk >500 kB (Phaser, no es fallo) | 0 |
| `npm.cmd test` | 2 archivos, 8 tests, 8 pasados | 0 |

Comandos del incremento 1 (registrados en el checkpoint previo): `npm.cmd install` exit 0 con phaser@4.2.1, typescript@7.0.2, vite@8.3.3, vitest@5.0.3.

## Incrementos ejecutados y diff por incremento

| # | Incremento | Archivos | Validacion |
|---:|---|---|---|
| 1 | Scaffold del stack base | `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `src/core/constants.ts`, `tests/scaffold.test.ts` (commit `dcf1965`) | typecheck/build/test exit 0 |
| 2 | Escena del corredor | `src/scenes/GameScene.ts` (nuevo), `src/core/constants.ts` (+19: `WALLS`, `PLAYER_*`, `GOAL`), `src/main.ts` (escena scaffold -> `GameScene`) | typecheck/build/test exit 0 |
| 3 | Dominio de patrulla | `src/domain/patrol.ts` (nuevo, 126 lineas), `tests/patrol.test.ts` (nuevo, 101 lineas, 7 tests) | 8/8 tests, typecheck/build exit 0 |
| 4 | Integracion del guardia | `src/scenes/GameScene.ts` (guardia + indicador de mirada) | typecheck/build/test exit 0 |
| 5 | Constantes de ritmo | `src/core/constants.ts` (+`GUARD_*`), `src/scenes/GameScene.ts` (config centralizada) | typecheck/build/test exit 0 |

Diff acumulado pendiente de commit: `src/core/constants.ts` +29, `src/main.ts` (+22/-18), nuevos `src/domain/patrol.ts` (126 lineas), `src/scenes/GameScene.ts` (130 lineas), `tests/patrol.test.ts` (101 lineas).

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Instala y compila con el stack base | `install`, `typecheck`, `build` | **Cumple** (exit 0) |
| 2 | Suite sin red ni render | `npm.cmd test` | **Cumple** (8/8 en Node) |
| 3 | Patrulla `A -> pausa -> B -> pausa -> A` con tiempos configurados | Tests: `avanza de A a B...`, `la pausa dura exactamente pauseDurationMs...`, `ciclo completo A -> pausa -> B -> pausa -> A`, `un tick no mayor que la pausa no la cancela` | **Cumple** en dominio |
| 4 | Pausa con barrido lateral e inversion de rumbo | Test: `durante la pausa la mirada barre de lado a lado cada sweepHalfDuration` + verificacion visual | **Cumple en dominio**; visual pendiente (ver abajo) |
| 5 | La mirada en movimiento coincide con el rumbo | Test: `en movimiento la mirada apunta al rumbo de avance` + verificacion visual | **Cumple en dominio**; visual pendiente |
| 6 | Jugador mueve, colisiona con paredes y alcanza la meta | `typecheck`/`build`; verificacion visual de WASD, colisiones y cambio de color de la meta | **Parcial**: codigo presente y compila; **verificacion visual pendiente del estudiante** |
| 7 | `src/domain/` sin importar `phaser`, testeable en Node puro | Busqueda de `phaser` en `src/domain/` (0 coincidencias) + suite en Node sin render | **Cumple** |
| 8 | Sin deteccion ni estado de alerta | Busqueda de `vision|alert|detect|camera` en `src/` (0 coincidencias); estado del jugador no cambia por el guardia | **Cumple** |
| 9 | Diffs acotados, commit por incremento con autorizacion | Tabla de incrementos arriba; commits sin crear | **Pendiente de decision humana** |
| 10 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` | **Cumple** con este archivo |

## Reproduccion visual / telemetria (cambios de interfaz y feedback)

Cambios de interfaz en este upgrade: indicador de mirada del guardia (punto amarillo) y cambio de color de la meta al alcanzarla. Camara y animaciones: sin cambios (camara fija). Reproduccion a cargo del estudiante con `npm.cmd run dev`:

1. **Activacion**: al cargar se ve el corredor, el jugador (blanco), el guardia (rojo) arriba/abajo del corredor central con el punto amarillo al frente.
2. **Transicion**: durante el movimiento el punto amarillo sigue el rumbo; al llegar a un extremo el guardia se detiene y el punto salta de lado a lado 3 veces (1200 ms / 400 ms) y luego retoma en sentido inverso.
3. **Estado posterior**: el jugador atraviesa las dos brechas del corredor sin atravesar paredes; al entrar en la franja derecha la meta pasa de amarillo a verde y permanece asi.

Registro de la observacion del estudiante: pendiente (fila en "Decisiones humanas").

## Limites de esta evidencia

- Los criterios 4, 5 y 6 quedan **parcialmente** verificados: los tests cubren el dominio, pero la reproduccion visual no pudo ejecutarse desde el agente (no hay navegador en el entorno); depende del estudiante.
- No hay test automatizado de movimiento del jugador ni de colisiones (logica en `GameScene`, fuera del alcance de dominio definido en la spec).
- No se verifico rendimiento ni accesibilidad fuera de lo pedido.
- Ningun criterio fue alterado para acomodar resultados.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Phaser 4 en lugar de Phaser 3 | Estudiante | 2026-10-06 | Docs actualizados |
| Autorizar incremento 1 (Prompt2) | Estudiante | 2026-10-06 | Commiteado en `dcf1965` |
| Autorizar completar los incrementos 2-5 de la update 01 | Estudiante | 2026-10-06 | "Termina la update 01" |
| Commits de los incrementos 2-5 | Estudiante | Pendiente | El agente no crea commits |
| Verificacion visual (`npm.cmd run dev`) | Estudiante | Pendiente | Completar fila 1-3 de la seccion visual |

## Decision recomendada del agente

**Integrar** una vez que (a) confirmes la verificacion visual y (b) hagas el commit. Criterios 1, 2, 3, 7, 8 y 10 ya tienen evidencia completa; 4, 5 y 6 dependen de tu observacion y 9 de tu commit. Si algo se ve mal en pantalla, lo depuro con esa reproduccion antes del cierre.
