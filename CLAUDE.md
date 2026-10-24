# HazteElTiempo.cl

Web para estudiantes universitarios chilenos que quieren entender y mejorar su uso del tiempo. Es un trabajo grupal del ramo Pensamiento Visual (Diseño UDD) y participa en un concurso. Antes se llamaba Fstudent.

## Cómo está hecha

- Sitio estático: `index.html`, `style.css`, `textos.js`, `main.js` y la carpeta `img/`. Sin servidor ni build.
- jQuery 3.6.0, FontAwesome 6.5.1, tipografía Poppins (provisoria).
- Las pantallas se muestran y ocultan con las clases `seccion-oculta` y `seccion-activa`.
- Header en grilla `1fr auto 1fr`; las redes y el botón ES / EN van con `justify-self: end`. El alto del header se mide en JS y se guarda en `--alto-header`.
- Textos en español e inglés en `textos.js` (`TEXTOS.es` y `TEXTOS.en`). En el HTML cada texto lleva `data-t="clave"` (o `data-t-html`, `data-t-aria`); en JS se usan `t("clave")`, `lista("clave")` y `formatoNumero()` (coma en español, punto en inglés). Al cambiar de idioma se dispara el evento `cambioIdioma`.
- `main.js` está dividido en secciones numeradas:
  0. Idioma (`t`, `lista`, `aplicarIdioma`) y `APOYO_ESTUDIANTIL` (pendiente)
  1. Navegación y menú
  2. Sliders del día y gráfico de dona
  3. Test paso a paso (5 pasos, una pregunta por pantalla, paso 5 solo si el ánimo o la batería están bajos)
  4. Puntaje "Equilibrio de tu día" (`puntajeAreas`, `puntajeTotal`, `MEJORAS`, mensaje de bienestar)
  5. Pantalla de carga
  6. Simulador, calendario (.ics y Google Calendar) y compartir (`URL_SITIO` pendiente)
  7. Reinicio
  8. Explorar Chile: `DATOS_REGIONES` (pendientes, en `null`), `pintarMapa()`, `mostrarRegion()`, tooltip
  9. Vive un día: arreglo `MOMENTOS` (los textos de cada momento están en `textos.js`)
- Mapa de Chile: SVG inline con las 16 regiones (fuente fcortes/Chile-GeoJSON), `viewBox="56 0 148 760"`, regiones de norte a sur.
- Recorrido del día: `#dia-scroll` con un escenario sticky (`.dia-escenario`) y paneles de 100vh en `#dia-fondos`.
  - El momento activo se calcula como `Math.round((scrollTop - inicioSeccion) / alto)`.
  - La tarjeta se pliega con `#dia-plegar`, que activa `.plegada`.
  - Si una imagen falla, el panel recibe `.provisorio`.
  - El momento 02:00 reutiliza `dia-0030.jpg` con el estilo `madrugada`.
  - El bloque de Trabajo 18:00 está comentado hasta que exista `img/dia-1800.jpg`.

## Reglas de diseño

- Identidad definida en el manual de marca (paleta, Poppins 800/400/700, logo con reloj de arena, personaje con polerón naranjo, tono "Cercana · Honesta · Sin juicio"). Lo ya decidido:
  - Azul y blanco como personalidad, con fondo blanco dominante y una foto tenue de fondo en el inicio. Que no se vea aburrido ni corporativo tipo hotel.
  - Logo: reloj de arena pequeño, sin círculo alrededor.
  - Se usa una persona (estudiante), no una mascota.
  - El rojo significa "malo" y se usa lo mínimo. Nada de subrayados rojos.
  - El botón "Sí" del inicio es azul.
- Todos los colores van como variables CSS en `:root` (`--azul`, `--blanco`, `--texto`, `--malo`, etc.), para poder cambiar la paleta en un solo lugar.
- En la versión final las ilustraciones y fotos son 0 IA. Las imágenes actuales de `img/` son provisorias.

## Reglas de texto

- Español de Chile, cercano y corto. Sin rayas largas (—). Sin frases que suenen a IA.
- Puntaje siempre con escala y coma decimal: "5,2 de 10", nunca "5.2" solo. Se llama "Equilibrio de tu día".
- La web no diagnostica: orienta y deriva. Contactos de ayuda: Salud Responde 600 360 7777 y la línea \*4141 del Minsal (gratuita, 24/7).
- Fuentes de datos: ENUT 2023 (INE), ENJUV 2022 (INJUV), CASEN 2022, SUBTEL/Cadem 2024, Hjetland et al. 2025, Cordovez et al. 2023, Reyes-González et al. 2022. No inventar cifras: si falta un dato real, dejar un marcador visible `[DATO PENDIENTE]` y avisar.

## Forma de trabajar

- Antes de cambios grandes, guardar una copia o hacer commit si hay git.
- Cambios por partes, de a una tarea de `CAMBIOS.md` a la vez, y marcarla como hecha en ese archivo.
- Si una tarea necesita algo que no está en la carpeta (imagen, dato, enlace, color final), no inventarlo: avisar qué falta y seguir con la siguiente.
- Probar en celular (ancho 390 px) y en computador.
