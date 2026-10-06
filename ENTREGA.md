Entregable
Un portafolio con al menos cinco paquetes de upgrade. Cada paquete incluye:

spec y plan versionados;
build, prueba o ejecución reproducible;
registro cronológico resumido;
diff o referencia de cambios autorizados;
matriz criterio-evidencia y salidas relevantes;
evidencia visual o telemetría cuando modifica cámara, animación, interfaz o feedback;
revisión final con limitaciones y decisión humana.
Entregá la URL del repositorio individual y el commit final en la plataforma antes del martes 6 de octubre de 2026 a las 23:59. Cada artefacto debe identificar la misma versión del proyecto. No se entregan secretos ni razonamientos internos privados.

Registrar en el box «Entrega» de esta página
Con la sesión iniciada como estudiante, bajá al final de esta consigna y completá «Tu entrega». No entregues en una página de lectura o en la guía de apoyo. Copiá esta estructura, completala y presioná «Registrar entrega»:

Repositorio individual: [URL]
Commit final: [HASH]

Upgrades completados:
1. [NOMBRE] — [RUTA DE LA CARPETA CON SPEC, PLAN Y EVIDENCIA]
2. [NOMBRE] — [RUTA]
3. [NOMBRE] — [RUTA]
4. [NOMBRE] — [RUTA]
5. [NOMBRE] — [RUTA]

Validación/build: [COMANDOS Y RESULTADOS; RUTA DE EVIDENCIA]
Evidencia visual o telemetría: [RUTAS/ENLACES CUANDO CORRESPONDA]
Limitaciones: [RESUMEN CONCRETO]
Verificá que la página muestre tu entrega registrada. El box admite texto y enlaces; el código, las specs y las pruebas deben estar en el repositorio/commit que indicás. Esta es una única entrega de los cinco upgrades, independiente de la práctica nueva de navegación que se entrega el 14/10.

Evidencia válida
estado y diferencias de Git;
comandos reproducibles con código de salida;
pruebas automatizadas y ejecución del producto;
logs de instrumentación relacionados con una hipótesis;
rutas y fragmentos necesarios para justificar decisiones;
registro de acciones, resultados, autorizaciones y correcciones humanas.
No alcanzan la afirmación del agente, una captura aislada, código sin ejecutar ni una prueba que no se vincula con un criterio.

Criterios de evaluación
Criterio	Evidencia esperada
Comprensión del repositorio y contexto económico	Auditoría, fuentes y supuestos actualizados
Especificación verificable	Alcance completo y relación criterio-prueba
Plan e implementación incremental	Pasos, diffs acotados y verificaciones intermedias
Validación y depuración	Reproducción, hipótesis cuando aplica y controles completos
Git y reversibilidad	Punto inicial/final, cambios preservados y recuperación explicada
Observabilidad	Acciones, resultados, duración, iteraciones y consumo disponible
Revisión crítica y transferencia	Decisiones humanas, límites y equivalentes fuera de la herramienta
Un producto ejecutable con trazabilidad insuficiente no satisface el laboratorio.

Repositorio individual: https://github.com/NicolasAlcaraz-Git/Practica-Updates-Agent.git
Commit final: [hash del commit de cierre — obtenerlo tras commitear y pushear este archivo con: git log -1 --format=%H]

Upgrades completados:
1. Patrulla con pausas y mirada direccional — docs/upgrades/01-patrulla/ (spec.md, plan.md, evidencia.md)
2. Medidor de alerta y estados del nivel — docs/upgrades/02-alerta/ (spec.md, plan.md, evidencia.md)
3. Cámara dinámica de tensión — docs/upgrades/03-camara/ (spec.md, plan.md, evidencia.md)
4. Cobertura y ruptura de línea de visión — docs/upgrades/04-cobertura/ (spec.md, plan.md, evidencia.md)
5. Escape de último momento y feedback de alivio — docs/upgrades/05-escape/ (spec.md, plan.md, evidencia.md)

Validación/build: npm run typecheck = exit 0; npm run build = exit 0; npm test = 6 archivos, 47 tests, 47 pasados. Salidas por incremento en docs/upgrades/01-patrulla/evidencia.md, docs/upgrades/02-alerta/evidencia.md, docs/upgrades/03-camara/evidencia.md, docs/upgrades/04-cobertura/evidencia.md y docs/upgrades/05-escape/evidencia.md; registro cronológico en docs/registro-intervencion.md.
Evidencia visual o telemetría: docs/upgrades/01-patrulla/evidencia.md (indicador de mirada), docs/upgrades/02-alerta/evidencia.md (barra/estados y tinte de cámara), docs/upgrades/03-camara/evidencia.md (zoom por estado), docs/upgrades/04-cobertura/evidencia.md (cono recortado, rojo/blanco), docs/upgrades/05-escape/evidencia.md (mensajes de cierre, flash y reset de alerta) — reproducción manual registrada y aprobada por el estudiante.
Limitaciones: sin capturas adjuntas ni audio (la evidencia visual es la reproducción manual registrada en cada evidencia.md); sin estado de derrota, animaciones ni assets (alcance decidido en cada spec); umbral de escape fijo en 75 y cono aproximado con 16 muestras (no calibrados con jugadores reales); 47 tests de dominio sin pruebas end-to-end de navegador; datos del estudiante (nombre, materia, comisión, año) pendientes en README.md.