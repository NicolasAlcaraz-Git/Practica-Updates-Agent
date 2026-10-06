# Plan de intervencion

## Objetivo del plan

Producir cinco upgrades revisables y evidencia suficiente para decidir su integracion, sin ampliar el alcance: una base minima que los sustenta, un ciclo por upgrade y validacion en cada incremento. El plan detalla la fase global; cada upgrade tiene su plan incremental en `docs/upgrades/NN-nombre/plan.md`.

## Cambios propuestos

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Fase 0: documentacion de proceso con hechos verificados | `README.md`, `GDD.md`, `docs/auditoria-repositorio.md`, `docs/especificacion.md`, `docs/plan.md`, `docs/matriz-permisos.md`, `docs/registro-intervencion.md`, `.gitignore` | Lectura cruzada; sin marcadores inventados | Completar docs con datos no verificados | Dato sin fuente: dejar `[PENDIENTE]` y consultar |
| 2 | Fase 1: prototipo base (Phaser + Vite + TS, Vitest) con jugador, guardia lineal, colisiones y meta | `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.ts`, `src/scenes/*`, `src/domain/*`, `tests/*` | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` | Instalacion bloqueada o version incompatible | Error de red/instalacion no resuelto en 2 intentos: consultar |
| 3 | Upgrade 01: patrulla con pausas y mirada direccional | `docs/upgrades/01-patrulla/*`, `src/domain/patrol.*`, escena afectada | Suite enfocada + build + ejecucion manual | Acoplar logica de patrulla a Phaser | La spec no esta aprobada por el estudiante |
| 4 | Upgrade 02: medidor de alerta y estados del nivel | `docs/upgrades/02-alerta/*`, `src/domain/alert.*`, HUD | Suite + build + ejecucion manual | Umbrales arbitrarios sin criterio | Sin acuerdo sobre los estados/umbrales |
| 5 | Upgrade 03: camara dinamica de tension | `docs/upgrades/03-camara/*`, `src/scenes/camera.*` | Suite + build + ejecucion manual | Efecto visual sin regla de comunicado | La camara no se justifica con un estado de riesgo |
| 6 | Upgrade 04: cobertura y ruptura de linea de vision | `docs/upgrades/04-cobertura/*`, `src/domain/vision.*`, escena | Suite + build + ejecucion manual | Raycast impreciso o costoso | Pruebas de vision no deterministicas sin resolver |
| 7 | Upgrade 05: escape de ultimo momento | `docs/upgrades/05-escape/*`, dominio + escena | Suite + build + ejecucion manual | Depende de 02 y 04 sin cerrar | Precondiciones de los upgrades previos no integradas |
| 8 | Cierre: evidencia global e informe | `docs/evidencia-pruebas.md`, `docs/informe-final.md` | Contraste criterio-evidencia completo | Declarar evidencia no verificada | Evidencia faltante: no cerrar |

## Orden de implementacion

Fase 0 -> Fase 1 -> 01 -> 02 -> 03 -> 04 -> 05 -> cierre. El orden por dependencias evita reimplementar: 01 define el ciclo del guardia, 02 aporta el estado de alerta que reutilizan 03, 04 y 05. Cada paso solo avanza cuando su validacion este en verde y el diff haya sido revisado; cada upgrade trabaja en su rama (`upgrade/NN-nombre`) y se mergea a `main` despues de la revision.

## Fuera de alcance

- Audio, menus, multiples niveles, assets producidos, redes, publicacion y despliegue.
- Dependencias ajenas a la base del stack (Phaser, Vite, TypeScript, Vitest).
- Commits en remoto o eliminacion de archivos existentes.
- Completar `docs/evidencia-pruebas.md` e `docs/informe-final.md` antes de cerrar los cinco ciclos.
