# GDD simplificado

## Juego y experiencia

- Genero y situacion de juego: Accion/stealth 2D en vista superior. Un infiltrado cruza un corredor vigilado hasta una zona de escape.
- Rol del jugador: moverse, elegir rutas con cobertura y decidir cuanto arriesgarse antes de ser detectado.
- Experiencia buscada: tension creciente mientras la alerta sube y alivio al escapar con un margen ajustado.

## Comportamiento a resolver

- Entidad: guardia en patrulla (mas jugador, cobertura y HUD de alerta como soporte).
- Problema actual: sin la practica no hay comportamiento; la base actual es un prototipo minimo con una patrulla lineal sin pausas ni direccion de mirada.
- Comportamiento esperado: patrullas legibles con pausas y mirada direccional, alerta visible, camara que enmarca el riesgo, cobertura que rompe la linea de vision y escape de ultimo momento.

## Reglas

- Estados, condiciones o eventos relevantes: guardia en `patrulla` (tramo, pausa, rumbo), jugador en `oculto`/`expuesto`; nivel con estados de alerta `tranquilo` / `sospecha` / `busqueda` / `alerta maxima`.
- Accion del jugador o del entorno: avanzar, usar cobertura para interrumpir la linea de vision, alejarse del area de riesgo. El guardia patrulla con pausas y gira la mirada en cada rumbo.
- Resultado esperado: la amenaza se anticipa visualmente; perder la linea de vision baja la alerta; superar el umbral de escape cierra el nivel con feedback de alivio.
- Caso limite: el jugador queda a vista del guardia con la alerta al maximo y sin cobertura cercana (escape de ultimo momento).

## Limites

- Fuera de alcance: audio, menu, multiples niveles, red/publicacion, assets producidos, IA con planificacion.
- Restricciones tecnicas: sin motor formal (Phaser 3 + Vite + TypeScript); dominio en `src/domain/` independiente de Phaser; sin dependencias fuera de la base del stack; sin push ni despliegue.
- Criterios de aceptacion: los cinco upgrades con `spec.md`, `plan.md` y `evidencia.md` en `docs/upgrades/`, cada uno con build, suite y ejecucion verificados.

## Preguntas abiertas

- [Confirmar nombre definitivo: `Silent Corridor` vs. "Guardia de Sigilo" usado en `Prompt1.md`.]
- [Definir controles y dimensiones del corredor con el prototipo base.]
- [Definir umbrales exactos de alerta en la spec del upgrade 02.]

El GDD delimita la intencion de diseno. La especificacion y el plan convierten esa intencion en una intervencion tecnica verificable.
