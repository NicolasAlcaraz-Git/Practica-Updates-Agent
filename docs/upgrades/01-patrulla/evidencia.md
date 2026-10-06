# Evidencia — Upgrade 01: Patrulla con pausas y mirada direccional

Proyecto: Silent Corridor. Fecha: 2026-10-06. Estado del documento: **checkpoint del incremento 1** (el upgrade esta incompleto; Prompt3 aplicado a lo implementado hasta ahora, sin inventar resultados).

## Versiones

- Version inicial: `1fb8cd3` (main). Spec borrador commiteada en `127695a`.
- Estado actual del arbol: **sin commit** para este incremento (los commits los realiza el estudiante; ver "Decisiones humanas").

## Comandos ejecutados (2026-10-06 17:46)

| Comando | Resultado real | Exit |
|---|---|---|
| `npm.cmd install` | phaser@4.2.1, typescript@7.0.2, vite@8.3.3, vitest@5.0.3; 0 vulnerabilidades | 0 |
| `npm.cmd run typecheck` | sin salida de error | 0 |
| `npm.cmd run build` | 1.375.48 kB en `dist/assets/index-*.js`; aviso informativo de chunk >500 kB (esperado: Phaser) | 0 |
| `npm.cmd test` | 1 archivo, 1 test, 1 pasado | 0 |

## Criterio -> comprobacion -> resultado real

| # | Criterio (spec) | Comprobacion | Resultado real |
|---:|---|---|---|
| 1 | Proyecto instala y compila con el stack base | `install`, `typecheck`, `build` | **Cumple** (exit 0 en los tres) |
| 2 | Suite corre sin red ni render | `npm.cmd test` | **Cumple** (Vitest en Node, 1/1) |
| 3 | Patrulla alterna `A -> pausa -> B -> pausa -> A` | Test de `src/domain/` con ticks | **No verificable aun**: `src/domain/` no existe (incremento 3) |
| 4 | Pausa con barrido de mirada e inversion de rumbo | Test de dominio + ejecucion manual | **No verificable aun** (incrementos 3-4) |
| 5 | Direccion de la mirada coincide con el rumbo | Test de dominio + ejecucion manual | **No verificable aun** (incrementos 3-4) |
| 6 | Jugador se mueve, colisiona y alcanza la meta | Ejecucion manual | **No verificable aun**: `src/main.ts` solo muestra el titulo (incremento 2) |
| 7 | `src/domain/` sin importar `phaser`, testeable en Node puro | Busqueda de referencias + suite | **Cumple parcialmente**: no existe `src/domain/` ni codigo con `phaser` fuera de `src/main.ts`; el criterio completo se prueba en el incremento 3 |
| 8 | Sin deteccion ni estado de alerta | Busqueda en `src/` de `vision|alert|detect|camera` | **Cumple**: 0 coincidencias |
| 9 | Diffs acotados y trazables, commit por incremento con autorizacion | `git status --short`, `git diff --stat` | **Pendiente de decision humana**: diff listo, commit sin crear (Prompt3) |
| 10 | Paquete documental completo (`spec`, `plan`, `evidencia`) | Existencia de archivos | **Cumple** con la creacion de este archivo |

## Reproduccion visual / telemetria

- Cambios de camara, animacion o feedback en este incremento: **ninguno**. La unica interfaz nueva es el titulo `Silent Corridor` centrado en pantalla (escena scaffold).
- Reproduccion visual pendiente: a partir del incremento 2 (escena jugable) se registra ejecucion manual con hora, y para los cambios de mirada/pausa del incremento 4 se registra activacion, finalizacion y estado posterior del barrido.

## Diff

- Trackeados modificados: `GDD.md`, `README.md`, `docs/especificacion.md`, `docs/upgrades/01-patrulla/spec.md` (+10/-6 en total; cambio de version de stack y decisiones de la spec).
- Nuevos (sin trackear): `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `src/core/constants.ts`, `tests/scaffold.test.ts`, `docs/upgrades/01-patrulla/plan.md`.
- Ignorados correctamente por `.gitignore`: `node_modules/`, `dist/`.
- Sin trackear a proposito (locales): `Prompt1.md`, `Prompt2.md`, `Prompt3.md`.

## Limites de esta evidencia

- Solo los criterios 1, 2 y 8 estan verificados hoy; 3, 4, 5 y 6 requieren los incrementos 3 y 4; 9 depende de tu commit; 7 se cierra con los tests de dominio.
- El build pasa pero el arranque en navegador no fue verificado todavia (el sandbox no abre pantalla); la verificacion visual queda para la ejecucion manual que registre el estudiante en los incrementos 2 y 4.
- Ningun criterio fue alterado ni redefinido para encajar con el resultado.

## Decisiones humanas

| Decision | Quien | Fecha | Nota |
|---|---|---|---|
| Elegir Phaser 4 en lugar de Phaser 3 | Estudiante | 2026-10-06 | Spec/GDD/README/especificacion actualizados |
| Autorizar incremento 1 (Prompt2) | Estudiante | 2026-10-06 | Implementado y validado |
| Commit del incremento 1 | Estudiante | Pendiente | El agente no crea commits sin autorizacion |
| Autorizar incremento 2 | Estudiante | Pendiente | Siguiente paso del plan |

## Decision recomendada del agente

Checkpoint: **corregir o integrar** el incremento 1 segun tu revision del diff. El upgrade 01 sigue abierto: faltan los incrementos 2 a 5.
