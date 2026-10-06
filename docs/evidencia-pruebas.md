# Evidencia de pruebas

Relaciona cada criterio de aceptacion con una prueba o secuencia manual que otra persona pueda repetir. Las matrices completas (criterio -> comprobacion -> resultado) estan en `docs/upgrades/01-patrulla/evidencia.md`, `02-alerta`, `03-camara`, `04-cobertura` y `05-escape`.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Suite, tipos y build del proyecto (10 + 11 + 8 + 12 + 11 = 52 criterios por update) | `ac55177` | `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd test` | `npm.cmd install` y luego los tres comandos en la raiz | exit 0 en los tres; suite en verde | typecheck exit 0, build exit 0, 6 archivos / 47 tests en verde | Salidas por incremento en `docs/upgrades/*/evidencia.md` |
| 01: patrulla `A -> pausa -> B` con barrido de mirada y meta alcanzable | `379aa6f` | `npm.cmd test` + `npm.cmd run dev` | Levantar el dev server, observar al guardia y mover el jugador con WASD/flechas | Ciclo con pausa y barrido; colisiones; meta en verde | Tests del dominio en verde y verificacion visual sin incidencias (visto bueno de cierre) | `docs/upgrades/01-patrulla/evidencia.md` (criterios 1-10) |
| 02: alerta con estados 25/50/75, barra y tinte de ambiente | `068e205` | `npm.cmd test` + `npm.cmd run dev` | Acercarse al guardia, cruzar los umbrales, alejarse mas alla de 260 px | Barra/rotulo/tinte siguen el estado; decae al alejarse | Confirmado por el estudiante: "la barra funciona perfecta cumpliendo los puntos 1 2 y 3" | `docs/upgrades/02-alerta/evidencia.md` (criterios 1-11) |
| 03: camara centrada y zoom por estado (1 / 0.95 / 0.9 / 0.85) | `d160b96` | `npm.cmd test` + `npm.cmd run dev` | Moverse cerca y lejos del guardia; llevar el jugador a una esquina con alerta maxima | Transicion de zoom sin cortes; sin vacio fuera del corredor | Verificacion visual sin incidencias (visto bueno de cierre) | `docs/upgrades/03-camara/evidencia.md` (criterios 1-8) |
| 04: linea de visión con obstaculos (muros y cajas) gobierna la alerta | `bd4e500` | `npm.cmd test` + `npm.cmd run dev` | Metetrse detras de una caja con el guardia cerca; asomarse despues | Oculto = riesgo 0, alerta decae, jugador blanco; asomado = sube, jugador rojo; cono recortado | Verificacion visual sin incidencias ("todo correcto") | `docs/upgrades/04-cobertura/evidencia.md` (criterios 1-12) |
| 05: escape de ultimo momento (alerta >= 75 al llegar a la meta) | `ac55177` | `npm.cmd test` + `npm.cmd run dev` | Llegar a la meta con alerta baja; despues con alerta >= 75 | `LLEGASTE` sin flash; `ESCAPE JUSTO` + flash + barra a 0 que no vuelve a subir | Visto bueno del estudiante ("le doy el visto bueno") | `docs/upgrades/05-escape/evidencia.md` (criterios 1-11) |

## Fallos y limites pendientes

- Reproduccion: el agente no tiene navegador; la ejecucion visual la realizo el estudiante con `npm.cmd run dev` y quedo registrada por update en sus `evidencia.md` (sin capturas adjuntas).
- Impacto: 0 fallos abiertos en `typecheck`/`build`/`test` (47/47); limites conocidos y no bloqueantes documentados en cada evidencia (umbrales sin calibrar, cono con 16 muestras, sin audio, sin estado de derrota).
- Decision: aceptado por el estudiante con el visto bueno final del 2026-10-06; los limites quedan como trabajo futuro explicito.
