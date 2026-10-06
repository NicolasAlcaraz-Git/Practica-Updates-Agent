# Especificacion

Especificacion global de la practica. Cada upgrade ademas tiene su propia spec en `docs/upgrades/NN-nombre/spec.md`, que se aprueba antes de implementar.

## Problema

El prototipo base no comunica amenaza ni ritmo: no hay forma de anticipar la presencia de un guardia, de saber cuanto riesgo corre el jugador ni de advertir cuando una maniobra justa salvo la partida. Sin esos cinco upgrades, la situacion de sigilo/escape es ilegible para quien juega.

## Resultado esperado

Un prototipo jugable donde: la patrulla se anticipa con pausas y mirada direccional; el medidor de alerta muestra consecuencias visibles del peligro; la camara enmarca el momento de riesgo; la cobertura permite una decision activa de sigilo que rompe la linea de vision; y el escape de ultimo momento da feedback de alivio. Cada upgrade esta documentado como paquete revisable (spec, plan, evidencia) para que otra persona decida si integrarlo.

## Alcance

- Incluye:
  - Prototipo base minimo (Phaser 4 + Vite + TypeScript, Vitest) con jugador, un guardia en patrulla, colisiones y meta de escape.
  - Cinco upgrades: `01-patrulla`, `02-alerta`, `03-camara`, `04-cobertura`, `05-escape`.
  - Documentos de proceso: auditoria, especificacion, plan, matriz de permisos, registro, evidencia e informe final.
- No incluye: audio, menus, multiples niveles, assets producidos, publicacion o despliegue, dependencias fuera de la base del stack, commits en remoto.

## Restricciones

- Tecnicas: dominio en `src/domain/` independiente de Phaser; validacion con `tsc --noEmit`, `vite build` y `vitest run`; cambios pequenos con revision de `git diff` tras cada incremento.
- Operativas: sin push/publicar; sin eliminar archivos; una rama por upgrade con merge a main solo tras revisar diff y evidencia; detenerse ante ambiguedad de diseno, conflicto o permiso faltante.
- De calidad: cada criterio ligado a una prueba o ejecucion reproducible; sin instrumentacion residual en el cierre.

## Casos y criterios de aceptacion

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Camino principal | Prototipo base construido | Se ejecuta `npm.cmd run typecheck && npm.cmd run build && npm.cmd test` | Los tres comandos terminan sin error | Comandos y salidas en `evidencia.md` de la Fase 1 |
| Camino principal | Cada uno de los 5 upgrades | Se cierra su ciclo (spec -> plan -> implementacion -> validacion) | Existe `docs/upgrades/NN/{spec,plan,evidencia}.md` con matriz criterio-evidencia completa | Revision del paquete + diff de la rama |
| Caso limite | Alerta al maximo sin cobertura cercana | El jugador esta a la vista del guardia | Se activa el escenario de escape de ultimo momento con feedback de alivio | Prueba manual documentada (upgrade 05) |
| Error | Fallo detectado durante un incremento | Se reproduce de forma minima | Se registra hipotesis, correccion de causa minima y repeticion del caso | Seccion de depuracion en `evidencia.md` |
| Revision | Ciclo de un upgrade cerrado | Se contrastan criterios con evidencia | Decision humana explicita: integrar, corregir, revertir o descartar | `evidencia.md` + `registro-intervencion.md` |

## Invariantes

- El dominio del juego se puede testear sin levantar Phaser.
- `main` siempre compila: ningun merge deja `typecheck`, `build` o suite en rojo.
- Toda modificacion esta justificada por un criterio de la spec del upgrade en curso.
- No se agregan dependencias fuera de la base del stack.

## Preguntas abiertas

- Version exacta de las herramientas del stack: resuelta en el upgrade 01 (Phaser 4.2.1, Vite 8.3.3, TypeScript 7.0.2, Vitest 5.0.3).
- Umbrales numericos de alerta (se resuelven en la spec del upgrade 02).

Nota 2026-10-06: el nombre definitivo del proyecto es `Silent Corridor` (confirmado por el estudiante).
