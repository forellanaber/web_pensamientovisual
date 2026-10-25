Lee CLAUDE.md. Construye desde cero una sección nueva llamada "Vive un día": un recorrido horizontal por el día completo de un estudiante universitario, de 08:00 a 07:00 del día siguiente, inspirado en https://tse-retreat.webflow.io/. El usuario baja con la rueda del mouse y el recorrido avanza hacia el lado.

## Ubicación
- Pantalla propia en el menú, al lado de "Explorar Chile", con el mismo sistema de clases seccion-oculta / seccion-activa.
- Sácala de la página de resultados: ahí deja solo un botón "Vive un día" que lleve a esta sección.
- No borres el código del scroll vertical actual. Comenta el bloque y deja una nota de que lo reemplaza esta sección.

## Técnica
- GSAP y ScrollTrigger desde CDN, con versión fija. La sección queda fija (pin) y el scroll vertical mueve el recorrido en horizontal.
- Todo el código nuevo va en una sección numerada de main.js: "9. Vive un día". Los estilos van en un bloque comentado de style.css.
- Colores solo con las variables de :root.
- Respeta prefers-reduced-motion: en ese caso, las paradas se muestran una debajo de otra, sin parallax ni animaciones.

## Capas (parallax)
1. Cielo: un degradé hecho por código, no una imagen. Cambia de color según la hora: mañana celeste claro, tarde cálida, noche azul profundo, madrugada casi negra, y se aclara de nuevo hacia las 07:00.
2. #capa-cordillera: img/dia/cordillera.png, la más lenta.
3. #capa-ciudad: img/dia/ciudad.png, velocidad media.
4. #capa-calle: los escenarios de cada parada, uno al lado del otro sobre una misma línea de suelo, con el personaje caminando. Es la más rápida.
El personaje queda fijo en el tercio izquierdo de la pantalla y el mundo se mueve detrás de él. Al pasar a cada parada, su imagen cambia con un fundido suave.

## Interruptor de hábitos
- Arriba al centro: "Buenos hábitos" / "Malos hábitos". Por defecto, buenos.
- Al cambiarlo:
  - Cambia la imagen del personaje en todas las paradas.
  - Cambian los objetos marcados con data-version="bien" o "mal".
  - Cambian los textos de cada parada.
  - El cielo de la versión mala se oscurece un poco más.
  - No reinicia el recorrido ni mueve el scroll.

## Paradas del día
Reutiliza los textos del arreglo momentos de main.js (hora, titulo, dato, texto, ejemplo, fuente, bien, mal) para 08:00, 10:30, 13:30, 16:00, 19:30 y 21:00. Si existe img/dia-1800.jpg, agrega también la parada Trabajo 18:00.

## Paradas de la noche
Reemplazan a las de 23:00, 00:30 y 02:00 que hay hoy en momentos. Desde las 23:00 el escenario es un dormitorio.

| Hora | Buenos hábitos | Malos hábitos |
|---|---|---|
| 23:00 | Deja el celular y lee un rato. | En la cama con el celular. Cada hora de pantalla en la cama sube un 59% el riesgo de insomnio y quita 24 minutos de sueño. |
| 23:30 | Se duerme. Empieza el primer ciclo de sueño, de unos 90 minutos. | Sigue en el celular, con la cara iluminada por la pantalla. |
| 00:30 | Sueño profundo: la fase más reparadora. Se concentra en el primer tercio de la noche. | Sigue despierto. |
| 02:00 | Va en su segundo ciclo. | Recién se duerme. |
| 04:30 | Aumenta el sueño REM, la fase de los sueños, que se asocia a ordenar lo aprendido. | Va en su primer ciclo de sueño profundo. |
| 07:00 | Despierta con 7,5 horas, cerca de 5 ciclos completos. | El despertador lo saca a mitad de ciclo: 5 horas, unos 3 ciclos. Se pierde gran parte del REM, que se concentra al final de la noche. |

Fuentes para la noche: Hjetland et al. (2025), Frontiers in Psychiatry; Institute of Medicine (2006), Sleep Physiology.

## Cada parada
- Visible siempre: la hora, un número o dato grande y una frase corta.
- Al tocar o hacer clic: se abre una tarjeta plegable con el detalle, el ejemplo y la fuente. Usa el mismo comportamiento de tarjeta plegada que ya existe (#dia-plegar / .plegada) como referencia.
- Una sola tarjeta abierta a la vez.

## Hipnograma (solo de noche)
- Un SVG abajo de la pantalla que aparece desde las 23:00 y se dibuja a medida que avanza el scroll (stroke-dasharray / stroke-dashoffset).
- Niveles de arriba hacia abajo: Despierto, Liviano, REM, Profundo, con etiquetas pequeñas a la izquierda.
- Versión buena: se duerme a las 23:30, 5 ciclos de unos 90 minutos. Más sueño profundo en los primeros ciclos y más REM en los últimos.
- Versión mala: despierto hasta las 02:00, luego 3 ciclos, cortado a las 07:00 durante una fase REM.
- Al cambiar el interruptor, la línea se redibuja con una transición.

## Batería
- Durante la noche, sobre el personaje, una batería que se carga mientras duerme. Usa el mismo diseño de la batería del test.
- Llega a cerca de 95% en la versión buena y 55% en la mala.
- Rótulo pequeño debajo: "Ilustrativo".

## Barra del día
- Fija abajo, de 08:00 a 07:00, con un punto por parada.
- Marca dónde va el personaje y permite saltar a cada parada con scroll suave.
- La parte de la noche va en un tono más oscuro.

## Final
- Después de las 07:00: las dos baterías lado a lado, "7,5 h" contra "5 h", y una frase: "La diferencia empieza mucho antes de dormir".
- Botón "Hacer el test" que lleva al test.

## Imágenes
Carpeta img/dia/ con estos nombres:
- cordillera.png, ciudad.png
- escenario-HHMM.png para cada parada de día (por ejemplo escenario-0800.png) y escenario-dormitorio.png para la noche
- personaje-HHMM-bien.png y personaje-HHMM-mal.png para cada parada, de día y de noche
Mientras no existan, usa rectángulos de color con el nombre del archivo escrito encima, del mismo tamaño que tendría la imagen, para poder probar el recorrido completo.

## Celular (menos de 700 px)
- El mismo recorrido horizontal, con deslizamiento del dedo.
- El interruptor queda arriba, más compacto.
- La tarjeta de detalle sube como una hoja desde abajo.
- El hipnograma y la barra del día se achican sin taparse.

## Al terminar
1. Prueba con Live Server en computador y en 390 px de ancho.
2. Marca la tarea en CAMBIOS.md.
3. Dame la lista exacta de imágenes que faltan, con su nombre y qué debe mostrar cada una, para generarlas.
