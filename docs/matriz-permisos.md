# Matriz de permisos

Completa esta matriz antes de habilitar acciones de un agente. Una accion no declarada debe considerarse prohibida hasta consultar.

Contexto: estudiante (Nicolas Alcaraz), 2026-10-06. Autorizacion declarada: "todo salvo push/publicar".

| Accion | Estado | Alcance o justificacion |
|---|---|---|
| Leer archivos del proyecto | Permitida | Todo el repositorio |
| Buscar rutas y simbolos | Permitida | Todo el repositorio |
| Editar archivos previstos | Permitida | Docs de proceso, `.gitignore`, y `src/`, `tests/`, configs creadas en la Fase 1; respetar los planes aprobados |
| Ejecutar scripts documentados | Permitida | `node`, `npm.cmd`, `git` local (status/log/diff/checkout/merge), `tsc`, `vite`, `vitest` |
| Instalar dependencias | Permitida con limite | Solo la base del stack (Phaser, Vite, TypeScript, Vitest); cualquier otra: consultar |
| Usar red | Permitida con limite | Solo `npm install` del stack base; no publicar ni consultar servicios externos con credenciales |
| Publicar o subir cambios | Prohibida | Sin `git push`, sin despliegue ni publicacion; remoto existe pero no se usa para subir |
| Crear commits | Permitida | Locales, pequenos y revisables, uno por incremento; nunca `--force` ni en remoto |
| Eliminar archivos | Prohibida | Solo consultar; no borrar cambios preexistentes |
| Acceder a secretos o credenciales | Prohibida | No corresponde al trabajo |

## Condiciones de detencion

- Ambiguedad de diseno sin resolver: una spec sin aprobacion detiene la implementacion.
- Permiso faltante para una accion no declarada aqui.
- Conflicto de Git o cambios ajenos detectados en el working tree.
- Fallo de validacion que no puede reproducirse ni explicarse.
- Intento de push, publicacion, eliminacion o instalacion fuera de la base del stack.
