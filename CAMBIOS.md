# Cambios pendientes · HazteElTiempo.cl

Salen del testeo con compañeros y del plan de mejoras. Marcar con [x] lo que quede hecho.

## A. Se pueden hacer ya

### 1. Base visual
- [x] Pasar todos los colores de `style.css` a variables en `:root`, con una paleta provisoria azul y blanco. El rojo queda solo como `--malo`.
- [x] Quitar cualquier subrayado rojo.
- [x] Actualizar FontAwesome a 6.5.1.

### 2. Inicio
- [x] Título en dos líneas: "¿Eres estudiante y te gustaría" / "mejorar tu uso del tiempo?". La segunda línea más grande y en el color de acento.
- [x] Botón "Sí" corto, grande, azul y centrado bajo el título.
- [x] Dejar preparado un fondo con foto tenue (`img/fondo-inicio.jpg`) con capa blanca encima. Mientras no exista la foto, fondo blanco.

### 3. Dato de contexto
- [x] El 66,8% grande y debajo, como segundo título, "¡Eso es más de 2 meses seguidos pegado a una pantalla al año!".
- [x] Cambiar el párrafo largo por tres íconos en fila: 3 minutos · Anónimo · Resultados al tiro.
- [x] "Empezar el test" como el elemento más fuerte de la pantalla, con una animación suave.
- [x] Quitar el morado y el rojo de esta pantalla.

### 4. Test en 5 pasos (unos 4 minutos)
- [x] Paso 1, tu perfil: edad, ¿solo estudias o también trabajas?, región. Solo botones, sin escribir.
- [x] Paso 2, tu día: los sliders y el reloj actuales, sumando deporte y celular.
- [x] Paso 3, tus hábitos: cuatro preguntas de toque rápido:
  - celular en la cama antes de dormir
  - postergar tareas
  - planificar la semana
  - días con deporte
- [x] Paso 4, cómo te sientes: caritas y batería. La batería pregunta "¿Cómo te sientes al final del día?", con "Agotado" a la izquierda y "Lleno de energía" a la derecha.
- [x] Paso 5, solo si hace falta: aparece si el ánimo es bajo o la batería está bajo 30% (ver punto 6).
- [x] Indicador de avance "02 / 05" con tiempo restante estimado.
- [x] Avance automático al tocar una respuesta, sin botón "Siguiente" donde se pueda.

### 5. Resultado
- [x] Mostrar "5,2 de 10" con el nombre "Equilibrio de tu día", en vez de "Tu calificación general".
- [x] Barra de 0 a 10 con tres franjas (atención, puede mejorar, bien) y una marca donde está la persona. Colores de estado apagados.
- [x] Frase hacia adelante calculada con el simulador, por ejemplo "Con dos cambios podrías llegar a 6,5".

### 6. Preguntas de bienestar (condicionales)
- [x] ¿Hace cuánto te sientes así? (unos días · unas semanas · más de un mes)
- [x] ¿Qué crees que más influye? (carga académica · trabajo · dormir poco · estar lejos de mi familia o mi ciudad · otro)
- [x] ¿Cuentas con alguien a quien recurrir? (sí · a veces · no)
- [x] Mensaje según respuestas:
  - Si es algo puntual, un consejo práctico.
  - Si dura más de un mes o no tiene apoyo, sugerir hablar con un profesional y mostrar el apoyo psicológico de su universidad, Salud Responde 600 360 7777 y la línea \*4141.
  - "Lejos de la familia" se trata como contexto, no como algo negativo.

### 7. "Vive un día" como sección propia
- [x] Sacar "Un día que te alcanza" de la página de resultados y llevarlo al menú, junto a Explorar Chile, con el nombre "Vive un día".
- [x] Agregar un interruptor arriba: "Con buenos hábitos" / "Con malos hábitos". Usa los datos `bien` y `mal` que ya tiene cada momento.
- [x] Al final, las horas de sueño lado a lado (7,5 h contra 5 h) y un botón para hacer el test.

### 8. Plan de acción
- [x] Cada cambio activado en el simulador muestra "Agregarlo a mi calendario" con dos opciones:
  - descargar un archivo .ics con evento semanal
  - enlace directo a Google Calendar
- [x] Compartir con texto ya escrito para WhatsApp e Instagram que invite a hacer el test.

### 9. Inglés
- [x] Botón ES / EN en el menú. Todos los textos en un solo archivo (`textos.js`) con las dos versiones, y el cambio sin recargar.
- [x] Orden: inicio, test y resultados primero; Explorar Chile y Vive un día después.

### 10. Explorar Chile
- [x] El mapa se colorea solo por cantidad de estudiantes de educación superior. Sacar los botones de tema.
- [x] Al pasar el cursor se ve ese número.
- [x] Al tocar una región se abre una ficha con tres bloques:
  - Cómo son los estudiantes: N° de estudiantes, % que estudia y trabaja, % que duerme poco.
  - Dónde estudian: N° de universidades, IP y CFT, con enlaces.
  - Dónde pedir apoyo: servicios de apoyo estudiantil, Salud Responde y \*4141.
- [x] Mientras no haya datos reales, mostrar `[DATO PENDIENTE]`.

## B. Necesitan algo del equipo

Pedírselo a Jose cuando se llegue a esa tarea:

| Falta | Para qué |
|---|---|
| ~~Paleta final (códigos HEX) y tipografías~~ (recibido y aplicado) | Reemplazar la paleta provisoria de las variables |
| Logo del reloj de arena en SVG (hay una versión provisoria hecha a partir del manual) | Header y pestaña del navegador (favicon) |
| ~~Foto o timelapse propio para el inicio~~ (recibido: img/fondo-inicio.jpg) | Fondo tenue del inicio |
| Ilustraciones 0 IA de la persona y escenas | Reemplazar las imágenes provisorias de Vive un día |
| `img/dia-1800.jpg` | Activar el momento Trabajo 18:00 |
| Enlace del Google Form de sugerencias | Insertar el formulario |
| Datos reales por región (SIES, CASEN, ENUT) | Reemplazar `datosRegiones` |
| Enlaces de apoyo estudiantil por institución | Ficha de cada región |
| Revisión de las preguntas de bienestar por alguien de salud mental | Antes de publicar |
