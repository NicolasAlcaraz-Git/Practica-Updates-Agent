# Evidencia — Upgrade 02: Medidor de alerta y estados del nivel

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado: **cerrada — verificacion visual confirmada por el estudiante e integrada en `068e205`**.

## Versiones

- Version inicial: `379aa6f` ("Update 1 terminada").
- Estado actual del arbol: incrementos 1-4 **sin commit** (los commits los realiza el estudiante).
- Commits intermedios de esta update: ninguno todavia.

## Comandos y resultados (2026-10-06, tras el incremento 4)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | `dist/` generado; aviso informativo chunk >500 kB (Phaser) | 0 |
| `npm.cmd test` | 3 archivos, 21 tests, 21 pasados (8 de la update 01 + 13 nuevos) | 0 |

## Incrementos ejecutados y diff por incremento

| # | Incremento | Archivos | Validacion |
|---:|---|---|---|
| 1 | Dominio de alerta | `src/domain/alert.ts` (nuevo, 98 lineas), `tests/alert.test.ts` (nuevo, 129 lineas, 13 tests) | 21/21 tests, typecheck exit 0 |
| 2 | Integracion de riesgo en escena | `src/scenes/GameScene.ts` (+`updateAlert` con distancia y cono), `src/core/constants.ts` (+`RISK_*`, `ALERT_CONFIG`) | typecheck/build/test exit 0 |
| 3 | HUD y ambiente | `src/scenes/GameScene.ts` (barra, rotulo, overlay de tinte), `src/core/constants.ts` (+`ALERT_VIEW`, colores centralizados) | typecheck/build/test exit 0 |
| 4 | Revision final y evidencia | este archivo, `docs/registro-intervencion.md` | contraste de los 11 criterios |

Diff acumulado pendiente de commit: `src/core/constants.ts` +23, `src/scenes/GameScene.ts` +60, nuevos `src/domain/alert.ts`, `tests/alert.test.ts`, `docs/upgrades/02-alerta/{spec,plan,evidencia}.md`.

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Build y suite en verde | `typecheck`, `build`, `test` | **Cumple** (exit 0; 21/21) |
| 2 | La alerta sube proporcional y el cono multiplica | Tests: `sube proporcionalmente al riesgo`, `el cono multiplica el riesgo y nunca supera 1` | **Cumple** |
| 3 | Sin riesgo decae hasta 0 y vuelve a `tranquilo` | Test: `sin riesgo decae hasta 0 y vuelve a tranquilo` | **Cumple** |
| 4 | Estados cambian exactamente en 25/50/75 | Test: `los cuatro estados cambian exactamente en 25/50/75` (bordes 24.99/25/49.99/50/74.99/75) | **Cumple** |
| 5 | Riesgo persistente satura en 100 sin reiniciar | Test: `con riesgo persistente se satura en 100 sin reiniciarse` | **Cumple** |
| 6 | El nivel jamas sale de `[0, 100]` | Test: `invariantes: riesgo fuera de rango y dt invalido` + clamp en `tick` | **Cumple** |
| 7 | `src/domain/` sin importar `phaser` | Busqueda de `phaser` en `src/domain/*.ts`: 0 coincidencias; suite en Node | **Cumple** |
| 8 | HUD refleja el estado (barra, rotulo, color) | Codigo en `GameScene.updateAlert`; verificacion visual | **Pendiente de verificacion visual del estudiante** |
| 9 | Ambiente cambia de tinte segun estado | Overlay `ambient` con alpha 0/0.05/0.10/0.16 desde `ALERT_VIEW`; verificacion visual | **Pendiente de verificacion visual del estudiante** |
| 10 | Sin cambios en la patrulla ni raycast | `git diff --name-only 379aa6f -- src/domain/patrol.ts` vacio; busqueda de `raycast|obstacle|lineOfSight`: 0; busqueda de `console.`: 0 (sin instrumentacion residual) | **Cumple** |
| 11 | Paquete documental completo | Existencia de `spec.md`, `plan.md`, `evidencia.md` | **Cumple** con este archivo |

## Reproduccion visual / telemetria (cambios de interfaz y feedback)

Cambios nuevos: barra de alerta (arriba a la izquierda), rotulo de estado con valor, y overlay rojo sobre el nivel. Reproduccion a cargo del estudiante con `npm.cmd run dev`:

1. **Activacion**: al cargar, barra verde a 0 con rotulo `tranquilo 0` y sin tinte rojo.
2. **Transicion**: al acercarse al guardia (especialmente frente a su mirada) la barra crece y cambia verde -> amarillo -> naranja -> rojo al cruzar 25/50/75; el rotulo muestra `sospecha`, `busqueda`, `alerta maxima` con el valor redondeado; el fondo se tiñe progresivamente de rojo.
3. **Estado posterior**: al alejarse mas alla del radio de riesgo (260 px) la barra baja hasta 0, vuelve a `tranquilo` y el tinte desaparece.

Registro de la observacion del estudiante: **confirmado 2026-10-06** — "la barra funciona perfecta cumpliendo los puntos 1 2 y 3".

## Limites de esta evidencia

- Los criterios 8 y 9 dependen de la reproduccion visual que no puede ejecutar el agente (sin navegador en el entorno).
- La fuente de riesgo es proximidad + cono, no line de vision con obstaculos: el comportamiento real de "te vio / no te vio" llega con el upgrade 04.
- El cono no distingue paredes: el guardia puede "mirar a traves" de un muro hasta entonces; queda registrado como limite conocido y fuera de alcance de esta spec.
- Tasas y radios son valores iniciales del plan; no se calibraron con jugadores reales.
- Ningun criterio fue alterado para acomodar resultados.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Aprobar spec de la update 02 | Estudiante | 2026-10-06 | Prompt1-02 + spec |
| Autorizar plan y ciclo Prompt2 | Estudiante | 2026-10-06 | "seguir Prompt2 como hicimos anteriormente" |
| Commits de los incrementos 1-4 | Estudiante | Pendiente | El agente no crea commits |
| Verificacion visual (`npm.cmd run dev`) | Estudiante | 2026-10-06 | Confirmada: puntos 1-3 OK (commit `068e205`) |

## Decision recomendada del agente

**Integrar** una vez que confirmes la verificacion visual y hagas el commit. Los criterios 1-7, 10 y 11 ya tienen evidencia completa; 8 y 9 quedan a la espera de tu observacion. Si algo se ve mal en pantalla, adjunta esa reproduccion y lo depuro antes del cierre.
