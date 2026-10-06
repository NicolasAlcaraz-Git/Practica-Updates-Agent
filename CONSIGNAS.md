Situación problemática
Cada estudiante elige al menos cinco upgrades distintos del catálogo de esta consigna y los desarrolla en su repositorio individual. Debe conducir cada intervención sin aceptar código por autoridad del agente: explorar, especificar, planificar, modificar incrementalmente, validar, depurar si falla, revisar diferencias y registrar decisiones.

Los upgrades abarcan conducta expresiva, feedback, cámara, interacción y tensión. No se publica ni despliega el resultado.

Objetivo
Producir al menos cinco mejoras revisables y evidencia suficiente para que otra persona pueda decidir si integrarlas. El aprendizaje evaluado es el proceso transferible, no el uso de una interfaz particular.

N.º	Upgrade	Qué debe aportar
1	Patrulla con pausas y mirada direccional	Anticipación visual y ritmo del recorrido.
2	Cámara dinámica de tensión	Encuadre útil durante un momento de riesgo.
3	Cobertura y ruptura de línea de visión	Una decisión activa de sigilo.
4	Medidor de alerta y estados del nivel	Consecuencias visibles del peligro.
5	Escape de último momento	Feedback de alivio ante una maniobra ajustada.

Restricciones
Trabajar sólo sobre el alcance asignado y conservar cambios preexistentes.
Leer las instrucciones, especificación y arquitectura del proyecto antes de editar.
No agregar dependencias, publicar, desplegar, eliminar ni crear commits sin autorización.
No leer ni registrar credenciales o datos privados.
Mantener el dominio independiente del motor.
Usar cambios pequeños y revisar el diff después de cada incremento.
Detenerse ante ambigüedad de diseño, conflicto concurrente o permiso faltante.
Declarar herramienta y modelo cuando estén disponibles; OpenCode es una opción, no un requisito conceptual.

Procedimiento
Antes de implementar cada upgrade, completá esta puerta de trabajo:

intención declarada → requisito verificable → spec revisada
→ plan aprobado → build → evidencia
Un prompt no reemplaza la spec. Si una propuesta del agente parece correcta pero no tiene alcance, criterio o evidencia, todavía no puede aceptarse.

Establecer el punto inicial. Registrá fecha, versión, rama, estado de Git, entorno y cambios preexistentes. Ejecutá la validación de referencia o documentá por qué no es posible.
Explorar. Mapeá entradas, dominio, integración, pruebas, configuración e instrucciones. Seguí definiciones y usos relacionados con la incidencia. Separá evidencia, supuestos y preguntas.
Preparar contexto. Justificá cada fuente seleccionada, respetá jerarquía global/proyecto/tarea y sintetizá hallazgos con rutas. Actualizá la síntesis cuando una prueba contradiga un supuesto.
Especificar. Definí problema, objetivo, alcance, fuera de alcance, restricciones, casos límite, criterios de aceptación y prueba prevista para cada uno. Consultá decisiones de diseño abiertas.
Planificar. Dividí el trabajo en incrementos con archivos previstos, validación, riesgo y condición de detención.
Implementar. Realizá un incremento por vez. Después de cada uno, ejecutá la comprobación más cercana y revisá el diff. Rechazá cambios no justificados.
Depurar por evidencia. Si aparece un fallo, conservá una reproducción mínima; formulá una hipótesis con predicción; instrumentá sólo lo necesario; corregí la causa mínima y repetí el caso.
Validar. Ejecutá formato comprobado, lint o análisis estático, compilación, prueba enfocada, suite y producto según corresponda. Registrá comandos, resultados y omisiones.
Revisar. Contrastá criterios con evidencia, arquitectura con cambios y alcance con archivos. Identificá regresiones, riesgos, instrumentación residual y efectos no cubiertos por Git.
Cerrar. Registrá estado final, duración, iteraciones, decisiones humanas y recomendación: integrar, corregir, revertir o descartar. Repetí el ciclo para cinco upgrades distintos.

Cómo armar cada paquete
Conservá una carpeta por upgrade en tu repositorio individual:

docs/upgrades/
  01-nombre-upgrade/
    spec.md
    plan.md
    evidencia.md
  02-nombre-upgrade/
    spec.md
    plan.md
    evidencia.md
  ... hasta completar al menos cinco upgrades distintos

Documento	Qué incluir
spec.md	Problema, intención, objetivo, alcance, fuera de alcance, restricciones, caso normal, caso límite, criterios de aceptación y evidencia prevista.
plan.md	Incrementos pequeños, archivos previstos, validación, riesgos y condiciones para detenerse.
evidencia.md	Versión inicial/final, comandos y resultados, build/ejecución, registro breve, diff, matriz criterio-evidencia y decisión humana.

Criterios de evaluación
Criterio	Evidencia esperada
Comprensión del repositorio y contexto económico	Auditoría, fuentes y supuestos actualizados
Especificación verificable	Alcance completo y relación criterio-prueba
Plan e implementación incremental	Pasos, diffs acotados y verificaciones intermedias
Validación y depuración	Reproducción, hipótesis cuando aplica y controles completos
Git y reversibilidad	Punto inicial/final, cambios preservados y recuperación explicada
Observabilidad	Acciones, resultados, duración, iteraciones y consumo disponible
Revisión crítica y transferencia	Decisiones humanas, límites y equivalentes fuera de la herramienta

Errores frecuentes
Tratar el prompt como documento de requisitos.
Aceptar una propuesta del agente sin contrastar rutas, símbolos o supuestos.
Implementar un efecto visual antes de definir qué regla comunica.
Considerar una apariencia correcta como sustituto de build, prueba o revisión.