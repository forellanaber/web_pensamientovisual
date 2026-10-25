# Generar las imágenes de "Vive un día"

Lee CLAUDE.md y VIVE-UN-DIA.md. Tu tarea es generar todas las imágenes del recorrido con la API de imágenes de OpenAI, guardarlas en img/dia/ con los nombres que pide VIVE-UN-DIA.md y conectarlas a la sección.

## Antes de empezar
- La API key está en el archivo .env como OPENAI_API_KEY. Nunca la escribas en otro archivo ni la muestres. Agrega .env a .gitignore.
- Revisa en la documentación oficial de OpenAI cuál es el modelo de imagen actual que acepta imágenes de referencia (edición con varias imágenes de entrada) y fondo transparente en PNG. Usa ese.
- Referencias para TODAS las generaciones: img/personaje.png (el personaje oficial) y, para los escenarios, la primera imagen de escenario aprobada.

## Script
Escribe generar_imagenes.py (o .js, lo que sea más simple en este computador) que:
1. Lea una lista de piezas desde imagenes.json (nombre de archivo, tipo, prompt).
2. Genere cada pieza mandando las imágenes de referencia, en PNG con fondo transparente, y la guarde en img/dia/.
3. Se salte las que ya existen, para poder retomar si se corta.
4. Reintente hasta 3 veces si la API falla, esperando entre intentos.
5. Escriba un registro en img/dia/registro.txt: archivo, hora, intento, ok o error.
6. Se detenga si gasta más de 80 imágenes en total (límite de seguridad).

## Bloque de estilo (va al inicio de cada prompt)
Hand-drawn illustration in the exact style of the reference character: wobbly cobalt blue marker outlines (#1F3FD1), flat fills with visible crayon texture, orange #FF7A1A as the only accent color, black only for hair and glasses, white fills, lots of white space, no shading, no gradients, no text. Transparent background, clean edges.

## Reglas de encuadre
- Personaje: cuerpo completo, vista lateral mirando a la derecha, de pie, sentado o acostado sobre una línea de suelo plana en el borde inferior. Mismo tamaño y proporciones en todas. Igual al personaje de referencia: pelo negro desordenado, lentes redondos, nariz naranja, polerón naranja, jeans claros con contorno azul, mochila azul con llavero de reloj de arena, cordones naranjos.
- Escenarios: vista lateral, piezas anchas tipo escenografía de juego de scroll lateral, apoyadas en la misma línea de suelo, sin personas.
- Cordillera y ciudad: franjas muy anchas (formato horizontal) que se puedan repetir hacia el lado.

## Lista de piezas
Arma imagenes.json a partir de VIVE-UN-DIA.md y del arreglo momentos de main.js:
- cordillera.png, ciudad.png
- escenario-HHMM.png por cada parada de día, según el lugar de ese momento (casa, paradero con micro, sala de clases, casino, biblioteca, plaza o gimnasio, casa de tarde) y escenario-dormitorio.png
- personaje-HHMM-bien.png y personaje-HHMM-mal.png por cada parada de día y de noche. La acción sale de los textos bien/mal de cada momento y de la tabla de la noche. Bien: descansado, de buen ánimo. Mal: cansado, encorvado, con el celular.

## Orden de trabajo
1. FASE DE PRUEBA (con Jose despierta): genera solo cordillera.png, escenario-0800.png, personaje-0800-bien.png y personaje-0800-mal.png. Muéstralas y espera su aprobación. Si pide cambios, ajusta el bloque de estilo y repite.
2. FASE NOCTURNA (cuando Jose apruebe): genera todo lo demás sin preguntar.
3. Revisa cada imagen generada mirándola tú mismo. Si el personaje no se parece al de referencia, el fondo no es transparente, aparece texto o la vista no es lateral, bórrala y regenérala (máximo 2 veces por pieza). Si sigue mal, déjala anotada.
4. Conecta las imágenes en la sección "Vive un día" reemplazando los rectángulos de prueba, y revisa el recorrido completo con Playwright en 1440 px y 390 px.
5. Haz un commit con git al terminar cada grupo (fondos, escenarios, personajes).

## Al terminar
Deja un archivo RESUMEN-NOCHE.md con:
- Imágenes generadas y cuántas se repitieron
- Las que quedaron dudosas y por qué
- Cuántas llamadas a la API se hicieron en total
- Capturas del recorrido para revisar en la mañana
