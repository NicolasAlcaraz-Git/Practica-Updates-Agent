# Informe final

## Resultado

Prototipo jugable **Silent Corridor** (Phaser 4.2.1 + Vite + TypeScript + Vitest, sin motor formal): un corredor con jugador WASD/flechas, un guardia en patrulla con pausas y barrido de mirada, medidor de alerta con cuatro estados (25/50/75), camara que hace zoom segun el nivel de alerta, cajas de cobertura que cortan la linea de visión y cierre de nivel con escape de ultimo momento cuando se llega a la meta con la alerta al limite.

Los cinco upgrades se completaron y se verificaron contra su matriz criterio -> evidencia (52 criterios en total): `docs/upgrades/01-patrulla`, `02-alerta`, `03-camara`, `04-cobertura`, `05-escape`, cada uno con `spec.md`, `plan.md` y `evidencia.md`.

## Cambios y decisiones

- Cambios realizados: scaffold del stack base; dominios `src/domain/{patrol,alert,camera,vision,escape}.ts` con 47 tests; `src/core/constants.ts` (niveles, umbrales, vistas de HUD/camara/escape); `src/scenes/GameScene.ts` (jugador, guardia, alerta, camara, cono, cobertura, cierre); docs de proceso y de los cinco paquetes.
- Decisiones humanas relevantes: Phaser 4 en lugar de Phaser 3; nombre `Silent Corridor`; permisos "todo salvo push"; orden de implementacion 01 -> 05; cinco specs aprobadas una por una (incluye umbral de escape >= 75, sin estado de derrota, sin acciones nuevas del jugador); todos los commits realizados por el estudiante (`379aa6f`, `068e205`, `d160b96`, `1e912e1`, `bd4e500`, `ac55177`).
- Acciones del agente aceptadas, rechazadas o corregidas: aceptadas - exploracion, specs/planes, implementacion incremental con validacion y evidencias; rechazadas/restringidas - push y commits a cargo del estudiante, sin dependencias nuevas ni eliminacion de archivos; corregidas - en la 04 la regla "sin vision = riesgo 0" se implemento en `vision.ts` (`riskForGuardView`) para no tocar `alert.ts`, y una caja de cobertura se reposiciono tras verificar el pasaje.

## Validacion

- Camino principal: `npm.cmd run typecheck`, `npm.cmd run build` y `npm.cmd test` en verde (exit 0; 6 archivos, 47 tests) version tras version, con salidas registradas en cada `evidencia.md`.
- Caso limite: umbral de escape inclusivo (test 74.9 = `normal`, 75 = `escape`); riesgo 0 con la linea de vision cortada y decaida de la alerta hasta `tranquilo` (test de integracion); raycast que recorta el cono contra muros y cajas (tests de estructura).
- Version validada: `ac55177` ("Update5 terminada") + commit final de cierre de la entrega (hash en `ENTREGA.md`).

## Limites y riesgos pendientes

- Sin capturas de pantalla ni audio: la evidencia visual es la reproduccion manual del estudiante registrada en cada `evidencia.md` (visto bueno 2026-10-06, sin incidencias reportadas).
- Valores no calibrados con jugadores reales: umbrales 25/50/75, radio de riesgo 260 px, cono del cono dibujado con 16 muestras, umbral de escape 75.
- Sin estado de derrota, sin reinicio de escena ni congelacion post-cierre (decisiones de diseno explicitas); sin pruebas end-to-end de navegador (solo tests de dominio en Node).
- Pendientes administrativos: nombre/materia/comision/anio en `README.md` y hash del commit final en `ENTREGA.md` antes del 6/10/2026 23:59.
