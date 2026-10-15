$(document).ready(function() {

    // --- 1. Scrollytelling Navegación ---
    function revelarYScrollear(ocultar, mostrar) {
        $(ocultar).addClass("seccion-oculta").removeClass("seccion-activa");
        $(mostrar).removeClass("seccion-oculta").addClass("seccion-activa");
        
        // Scroll suave al top de la nueva sección
        $('html, body').animate({
            scrollTop: $(mostrar).offset().top - 80 // Descuento de 80px por el Header fijo
        }, 800);
    }

    function mostrarPasoScroll(mostrar, dotId) {
        $(mostrar).removeClass("paso-oculto").addClass("paso-activo");
        $(dotId).addClass("activo");
        
        $('html, body').animate({
            scrollTop: $(mostrar).offset().top - 100
        }, 800);
    }

    $("#btn-comenzar").click(function() { revelarYScrollear("#pantalla-bienvenida", "#pantalla-contexto"); });
    $("#btn-ir-al-test").click(function() { revelarYScrollear("#pantalla-contexto", "#pantalla-test"); });
    $("#btn-paso-2").click(function() { mostrarPasoScroll("#paso-2", "#dot-2"); });
    $("#btn-paso-3").click(function() { mostrarPasoScroll("#paso-3", "#dot-3"); });

    // --- 2. Lógica de Sliders y Gráfico Dona (Reloj Visual) ---
    $(".slider-tiempo").each(function() { $(this).data("old", $(this).val()); });

    $(".slider-tiempo").on("input", function() {
        let currentSlider = $(this);
        let idSpan = currentSlider.attr("id").replace("horas-", "val-");
        
        // Recalcular total
        let sueno = parseFloat($("#horas-sueno").val());
        let estudio = parseFloat($("#horas-estudio").val());
        let trabajo = parseFloat($("#horas-trabajo").val());
        let traslado = parseFloat($("#horas-traslado").val());
        let ocio = parseFloat($("#horas-ocio").val());
        
        let sum = sueno + estudio + trabajo + traslado + ocio;

        if (sum > 24) {
            // Bloqueo: revertir valor
            currentSlider.val(currentSlider.data("old"));
            $("#alerta-horas").removeClass("oculta");
        } else {
            // Permitir cambio
            currentSlider.data("old", currentSlider.val());
            $("#" + idSpan).text(currentSlider.val());
            $("#total-horas-dona").text(sum);
            $("#alerta-horas").addClass("oculta");
            
            // Si llega a 24 exacto, texto en verde
            if(sum === 24) {
                $("#total-horas-dona").css("color", "var(--success-green)");
            } else {
                $("#total-horas-dona").css("color", "var(--text-main)");
            }

            // ACTUALIZAR GRÁFICO CIRCULAR CON CSS CONIC-GRADIENT
            let degSueno = (sueno / 24) * 360;
            let degEstudio = degSueno + ((estudio / 24) * 360);
            let degTrabajo = degEstudio + ((trabajo / 24) * 360);
            let degTraslado = degTrabajo + ((traslado / 24) * 360);
            let degOcio = degTraslado + ((ocio / 24) * 360);

            let gradientStr = `conic-gradient(
                var(--c-sueno) 0deg ${degSueno}deg,
                var(--c-estudio) ${degSueno}deg ${degEstudio}deg,
                var(--c-trabajo) ${degEstudio}deg ${degTrabajo}deg,
                var(--c-traslado) ${degTrabajo}deg ${degTraslado}deg,
                var(--c-ocio) ${degTraslado}deg ${degOcio}deg,
                #e2e8f0 ${degOcio}deg 360deg
            )`;
            
            $("#reloj-dona").css("background", gradientStr);
        }
    });

    // Disparar evento para pintar gráfico inicial al cargar la web
    $("#horas-sueno").trigger("input");

    // --- 3. Caritas y Batería ---
    $(".carita").click(function() {
        $(".carita").removeClass("seleccionada");
        $(this).addClass("seleccionada");
    });

    $("#slider-bateria").on("input", function() {
        let nivel = $(this).val();$("#nivel-bateria").css("width", nivel + "%");
        if(nivel < 20) { $("#nivel-bateria").css("background", "var(--accent-coral)"); } 
        else if (nivel < 60) { $("#nivel-bateria").css("background", "#fbbf24"); } 
        else { $("#nivel-bateria").css("background", "var(--success-green)"); }
    });

    // --- 4. Pantalla de Carga y Resultados ---
    const frasesCarga = [
        "¿Sabías que dormir bien consolida la memoria de estudio?",
        "El ocio no es pérdida de tiempo, previene el 'Burnout' académico.",
        "Cruzando tu nivel de estrés con la Encuesta Nacional de Salud...",
        "Calculando tu índice de calidad de vida..."
    ];

    $("#btn-ver-resultados").click(function() {
        // En lugar de scrollear, la carga la ponemos arriba reemplazando todo para concentrar al usuario
        $("#pantalla-test").addClass("seccion-oculta").removeClass("seccion-activa");
        $("#pantalla-carga").removeClass("seccion-oculta").addClass("seccion-activa");
        $('html, body').scrollTop(0);

        let fraseIndex = 0;
        $("#frase-carga").text(frasesCarga[0]);

        let intervalo = setInterval(() => {
            fraseIndex++;
            if (fraseIndex < frasesCarga.length) {
                $("#frase-carga").fadeOut(300, function() {
                    $(this).text(frasesCarga[fraseIndex]).fadeIn(300);
                });
            }
        }, 1800);

        // Termina la carga y muestra resultados
        setTimeout(() => {
            clearInterval(intervalo);
            revelarYScrollear("#pantalla-carga", "#pantalla-resultados");
        }, 7000);
    });
// --- 5. Simulador y Plan de Acción ---
    
    $("#btn-descubrelo").click(function() {
        revelarYScrollear("#pantalla-resultados", "#pantalla-guia");
        dibujarBarras(); // Llenar barras al entrar a la vista
    });

    // Variables de colores para la barra
    const colores = {
        sueno: "var(--c-sueno)",
        estudio: "var(--c-estudio)",
        trabajo: "var(--c-trabajo)",
        traslado: "var(--c-traslado)",
        ocio: "var(--c-ocio)"
    };

    function dibujarBarras() {
        // Leer valores reales de los sliders
        let h = {
            sueno: parseFloat($("#horas-sueno").val()),
            estudio: parseFloat($("#horas-estudio").val()),
            trabajo: parseFloat($("#horas-trabajo").val()),
            traslado: parseFloat($("#horas-traslado").val()),
            ocio: parseFloat($("#horas-ocio").val())
        };

        // Crear la barra original
        construirBarra("#barra-actual", h);
        actualizarProyeccion(h);
    }

    function construirBarra(selector, valores) {
        $(selector).empty();
        for (const [actividad, horas] of Object.entries(valores)) {
            if(horas > 0) {
                let porcentaje = (horas / 24) * 100;
                $(selector).append(
                    `<div class="segmento-barra" style="width: ${porcentaje}%; background-color: ${colores[actividad]};" title="${actividad}: ${horas}h"></div>`
                );
            }
        }
    }

    // Escuchar los interruptores
    $(".toggle-mejora").change(function() {
        let h = {
            sueno: parseFloat($("#horas-sueno").val()),
            estudio: parseFloat($("#horas-estudio").val()),
            trabajo: parseFloat($("#horas-trabajo").val()),
            traslado: parseFloat($("#horas-traslado").val()),
            ocio: parseFloat($("#horas-ocio").val())
        };
        actualizarProyeccion(h);
    });

    function actualizarProyeccion(h) {
        let notaBase = 5.2; // La nota que sacó en el ejemplo
        let bonus = 0;

        // Reglas de simulación
        if ($("#toggle-sueno").is(":checked")) {
            h.sueno += 1;
            h.ocio = Math.max(0, h.ocio - 1); // Quita de ocio/pantalla
            bonus += 0.8;
        }
        
        if ($("#toggle-deporte").is(":checked")) {
            h.ocio += 0.3; // Representa tiempo activo
            h.traslado = Math.max(0, h.traslado - 0.3);
            bonus += 0.5;
        }

        if ($("#toggle-estudio").is(":checked")) {
            h.estudio = Math.max(0, h.estudio - 0.5); // Más eficiente
            h.ocio += 0.5; // Libera ocio
            bonus += 0.6;
        }

        // Evitar pasarse de 24 en las sumas por decimales
        construirBarra("#barra-proyectada", h);
        
        // Animación de la nota
        let nuevaNota = (notaBase + bonus).toFixed(1);
        $("#nota-proyectada").text(nuevaNota);
        
        // Feedback de color en la nota
        if(nuevaNota >= 6.5) {
            $("#nota-proyectada").css("color", "var(--success-green)");
        } else {
            $("#nota-proyectada").css("color", "#fbbf24");
        }
    }

    // --- 6. Reiniciar Todo ---
    $("#btn-reiniciar").click(function() {
        // Apagar todos los interruptores
        $(".toggle-mejora").prop("checked", false);
        
        // Volver a valores por defecto en sliders
        $("#horas-sueno").val(8).trigger('input');
        $("#horas-estudio").val(6).trigger('input');
        $("#horas-trabajo").val(2).trigger('input');
        $("#horas-traslado").val(2).trigger('input');
        $("#horas-ocio").val(2).trigger('input');
        
        // Reset de Caritas y Batería
        $(".carita").removeClass("seleccionada");
        $("#slider-bateria").val(50).trigger('input');

        // Scroll top y esconder secciones
        $('html, body').animate({ scrollTop: 0 }, 500, function() {$("section").removeClass("seccion-activa").addClass("seccion-oculta");
            $("#pantalla-bienvenida").removeClass("seccion-oculta").addClass("seccion-activa");
            
            // Reset de los pasos internos del test
            $(".paso-activo").removeClass("paso-activo").addClass("paso-oculto");
            $("#paso-1").removeClass("paso-oculto").addClass("paso-activo");
            $(".circulo").removeClass("activo");
            $("#dot-1").addClass("activo");
        });
    });
});
// =====================================================================
// --- 7. Explorar Chile: mapa interactivo por región ---
// =====================================================================
$(document).ready(function() {

    // DATOS DE EJEMPLO: reemplazar por los valores reales procesados
    // desde CASEN 2022 (estudiantes, trabaja, solo), ENUT 2023 (sueño, traslado)
    // y ENJUV 2022 (deporte). Los porcentajes van de 0 a 100.
    const datosRegiones = {
        15: { nombre: "Arica y Parinacota", estudiantes: 14000,  sueno: 38, deporte: 34, trabaja: 31, solo: 12, traslado: 28 },
        1:  { nombre: "Tarapacá",           estudiantes: 22000,  sueno: 40, deporte: 33, trabaja: 33, solo: 13, traslado: 30 },
        2:  { nombre: "Antofagasta",        estudiantes: 45000,  sueno: 36, deporte: 37, trabaja: 29, solo: 15, traslado: 32 },
        3:  { nombre: "Atacama",            estudiantes: 15000,  sueno: 37, deporte: 32, trabaja: 30, solo: 11, traslado: 27 },
        4:  { nombre: "Coquimbo",           estudiantes: 52000,  sueno: 39, deporte: 31, trabaja: 32, solo: 14, traslado: 34 },
        5:  { nombre: "Valparaíso",         estudiantes: 140000, sueno: 42, deporte: 30, trabaja: 31, solo: 22, traslado: 41 },
        13: { nombre: "Metropolitana",      estudiantes: 620000, sueno: 45, deporte: 29, trabaja: 35, solo: 16, traslado: 52 },
        6:  { nombre: "O'Higgins",          estudiantes: 48000,  sueno: 38, deporte: 28, trabaja: 34, solo: 10, traslado: 38 },
        7:  { nombre: "Maule",              estudiantes: 62000,  sueno: 37, deporte: 27, trabaja: 33, solo: 12, traslado: 36 },
        16: { nombre: "Ñuble",              estudiantes: 30000,  sueno: 36, deporte: 28, trabaja: 30, solo: 15, traslado: 33 },
        8:  { nombre: "Biobío",             estudiantes: 120000, sueno: 41, deporte: 31, trabaja: 29, solo: 19, traslado: 47 },
        9:  { nombre: "La Araucanía",       estudiantes: 60000,  sueno: 38, deporte: 30, trabaja: 28, solo: 18, traslado: 35 },
        14: { nombre: "Los Ríos",           estudiantes: 28000,  sueno: 35, deporte: 33, trabaja: 27, solo: 21, traslado: 29 },
        10: { nombre: "Los Lagos",          estudiantes: 50000,  sueno: 36, deporte: 32, trabaja: 31, solo: 14, traslado: 31 },
        11: { nombre: "Aysén",              estudiantes: 5000,   sueno: 33, deporte: 38, trabaja: 35, solo: 17, traslado: 18 },
        12: { nombre: "Magallanes",         estudiantes: 10000,  sueno: 32, deporte: 40, trabaja: 34, solo: 20, traslado: 20 }
    };

    // Indicadores que aparecen en la tarjeta (en este orden)
    const indicadores = [
        { clave: "sueno",    icono: "fa-moon",        color: "var(--c-sueno)",     frase: "duermen menos de 6 horas" },
        { clave: "deporte",  icono: "fa-heart-pulse", color: "#ec4899",            frase: "hacen deporte cada semana" },
        { clave: "trabaja",  icono: "fa-briefcase",   color: "var(--c-trabajo)",   frase: "estudian y trabajan" },
        { clave: "solo",     icono: "fa-house-user",  color: "var(--accent-purple)", frase: "viven solos" },
        { clave: "traslado", icono: "fa-bus",         color: "var(--c-traslado)",  frase: "tardan más de 1 hora en trasladarse" }
    ];

    const nombresTema = { sueno: "duermen poco", deporte: "hacen deporte", trabaja: "estudian y trabajan", solo: "viven solos" };

    let temaActual = "sueno";
    let regionActual = 8; // Biobío por defecto

    // Escala de color: de azul muy pálido a azul profundo
    const colorMin = [219, 234, 254]; // #dbeafe
    const colorMax = [30, 64, 175];   // #1e40af

    function colorEscala(valor, min, max) {
        let t = (max === min) ? 0.5 : (valor - min) / (max - min);
        let rgb = colorMin.map((c, i) => Math.round(c + (colorMax[i] - c) * t));
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    function pintarMapa() {
        let valores = Object.values(datosRegiones).map(r => r[temaActual]);
        let min = Math.min(...valores), max = Math.max(...valores);

        for (const [codigo, region] of Object.entries(datosRegiones)) {
            let color = colorEscala(region[temaActual], min, max);
            $(`.region-mapa[data-region="${codigo}"]`).css("fill", color);
            $(`.item-region[data-region="${codigo}"] .muestra-color`).css("background", color);
        }
    }

    function mostrarRegion(codigo) {
        regionActual = codigo;
        let region = datosRegiones[codigo];

        // Resaltar en el mapa (se mueve al final para quedar por encima de las vecinas)
        $(".region-mapa").removeClass("activa");
        let pathActivo = $(`.region-mapa[data-region="${codigo}"]`).addClass("activa");
        pathActivo.appendTo("#mapa-chile");

        // Resaltar en la lista
        $(".item-region").removeClass("activo");
        $(`.item-region[data-region="${codigo}"]`).addClass("activo");

        // Tarjeta
        $("#nombre-region").text(region.nombre);
        $("#total-estudiantes").text(region.estudiantes.toLocaleString("es-CL"));

        let html = "";
        indicadores.forEach(ind => {
            let pct = region[ind.clave];
            let deDiez = Math.round(pct / 10);
            let personas = "";
            for (let i = 0; i < 10; i++) {
                let estilo = i < deDiez ? `style="color: ${ind.color}"` : "";
                personas += `<i class="fa-solid fa-person" ${estilo}></i>`;
            }
            html += `
                <div class="fila-indicador">
                    <div class="fila-texto">
                        <span class="frase"><i class="fa-solid ${ind.icono}" style="color: ${ind.color}"></i> ${deDiez} de cada 10 ${ind.frase}</span>
                        <span class="pct">${pct}%</span>
                    </div>
                    <div class="hilera-personas" aria-hidden="true">${personas}</div>
                </div>`;
        });
        $("#filas-indicadores").html(html);
    }

    // Botones de tema
    $(".tema-btn").click(function() {
        $(".tema-btn").removeClass("activo");
        $(this).addClass("activo");
        temaActual = $(this).data("tema");
        pintarMapa();
    });

    // Clic en el mapa o en la lista
    $("#mapa-chile").on("click", ".region-mapa", function() {
        mostrarRegion($(this).data("region"));
    });
    $("#mapa-chile").on("keydown", ".region-mapa", function(e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mostrarRegion($(this).data("region")); }
    });
    $(".item-region").click(function() {
        mostrarRegion($(this).data("region"));
    });

    // Tooltip al pasar el cursor por el mapa
    $("#mapa-chile").on("mousemove", ".region-mapa", function(e) {
        let region = datosRegiones[$(this).data("region")];
        let caja = $(".columna-mapa")[0].getBoundingClientRect();
        $("#tooltip-mapa")
            .text(`${region.nombre}: ${region[temaActual]}% ${nombresTema[temaActual]}`)
            .css({ left: e.clientX - caja.left, top: e.clientY - caja.top })
            .removeClass("oculta-tooltip");
    });
    $("#mapa-chile").on("mouseleave", ".region-mapa", function() {
        $("#tooltip-mapa").addClass("oculta-tooltip");
    });

    // Navegación: abrir Explorar Chile desde el menú
    $("#link-explorar").click(function(e) {
        e.preventDefault();
        $("section").removeClass("seccion-activa").addClass("seccion-oculta");
        $("#pantalla-explorar").removeClass("seccion-oculta").addClass("seccion-activa");
        $(".navegacion a").removeClass("activo");
        $(this).addClass("activo");
        $("html, body").scrollTop(0);
    });

    // Volver al inicio desde el logo
    $("#logo-inicio").click(function() {
        $("section").removeClass("seccion-activa").addClass("seccion-oculta");
        $("#pantalla-bienvenida").removeClass("seccion-oculta").addClass("seccion-activa");
        $(".navegacion a").removeClass("activo");
        $("html, body").scrollTop(0);
    });

    // Botón de la tarjeta: ir al test
    $("#btn-explorar-test").click(function() {
        $(".navegacion a").removeClass("activo");
        $("section").removeClass("seccion-activa").addClass("seccion-oculta");
        $("#pantalla-contexto").removeClass("seccion-oculta").addClass("seccion-activa");
        $("html, body").scrollTop(0);
    });

    // Estado inicial
    pintarMapa();
    mostrarRegion(regionActual);
});

// =====================================================================
// --- 8. Un día que te alcanza: recorrido ilustrado con scroll ---
// =====================================================================
$(document).ready(function() {

    // Cada momento usa como fondo la ilustración "img/dia-HHMM.jpg"
    // (por ejemplo img/dia-2300.jpg). Mientras no exista, se ve un fondo provisorio.
    // "ejemplo: true" marca los datos que hay que reemplazar por el valor real.
    const momentos = [
        {
            archivo: "dia-0800.jpg", hora: "08:00", titulo: "Traslado",
            dato: "5 de 10", texto: "estudiantes tardan más de 1 hora en trasladarse", ejemplo: true,
            fuente: "ENUT 2023",
            cielo: ["#fbcfe8", "#fed7aa"],
            mal:  { titulo: "Si viajas pegado al celular", icono: "fa-mobile-screen",
                    lista: ["Llegas con la cabeza saturada", "Sientes que el viaje fue tiempo perdido"] },
            bien: { titulo: "Si escuchas un podcast", icono: "fa-headphones",
                    lista: ["El viaje se vuelve un rato útil", "Repasas sin darte cuenta"] }
        },
        {
            archivo: "dia-1030.jpg", hora: "10:30", titulo: "Clases y estudio",
            dato: "59%", texto: "de los universitarios de un estudio se pone objetivos de estudio",
            fuente: "Reyes-González, Meneses-Báez y Díaz-Mujica (2022)",
            cielo: ["#bae6fd", "#e0f2fe"],
            mal:  { titulo: "Si estudias con todo abierto", icono: "fa-bell",
                    lista: ["Saltas entre pestañas y notificaciones", "Estudiar te toma más tiempo"] },
            bien: { titulo: "Si planificas la semana", icono: "fa-list-check",
                    lista: ["Sabes qué hacer y cuándo", "Los que rinden mejor priorizan y descansan"] }
        },
        {
            archivo: "dia-1330.jpg", hora: "13:30", titulo: "Almuerzo y pausa",
            dato: "1 h", texto: "al día dedican los estudiantes a comer", ejemplo: true,
            fuente: "ENUT 2023",
            cielo: ["#7dd3fc", "#bae6fd"],
            mal:  { titulo: "Si comes frente al computador", icono: "fa-laptop",
                    lista: ["No hay una pausa real", "La tarde se hace más pesada"] },
            bien: { titulo: "Si almuerzas con otros", icono: "fa-utensils",
                    lista: ["Recargas energía para la tarde", "Compartes y bajas el estrés"] }
        },
        {
            archivo: "dia-1600.jpg", hora: "16:00", titulo: "Tareas pendientes",
            dato: "4 de 6", texto: "áreas del bienestar son más bajas en quienes más postergan",
            fuente: "Cordovez, Ramírez y Villafaña (2023), estudiantes chilenos",
            cielo: ["#bae6fd", "#fde68a"],
            mal:  { titulo: "Si lo dejas para después", icono: "fa-hourglass-end",
                    lista: ["Se acumula el estrés", "Baja tu sensación de propósito"] },
            bien: { titulo: "Si partes por lo más corto", icono: "fa-list-check",
                    lista: ["Empezar se hace más fácil", "Avanzas y te queda tiempo libre"] }
        },
        {
            archivo: "dia-1930.jpg", hora: "19:30", titulo: "Deporte",
            dato: "150 min", texto: "de actividad física a la semana recomienda la OMS",
            fuente: "Organización Mundial de la Salud (2020)",
            cielo: ["#fb7185", "#7c3aed"],
            mal:  { titulo: "Si pasas todo el día sentado", icono: "fa-couch",
                    lista: ["Aumenta el cansancio", "Cuesta más soltar el estrés"] },
            bien: { titulo: "Si sales a moverte", icono: "fa-person-running",
                    lista: ["Bastan 20 a 30 minutos al día", "Mejora tu ánimo y tu descanso"] }
        },
        {
            archivo: "dia-2100.jpg", hora: "21:00", titulo: "Celular y redes",
            dato: "66,8%", texto: "de los jóvenes de 16 a 29 años está más de 4 h al día en internet",
            fuente: "SUBTEL y Cadem (2024)",
            cielo: ["#4c1d95", "#312e81"],
            mal:  { titulo: "Si scrolleas sin parar", icono: "fa-mobile-screen",
                    lista: ["El tiempo se escapa sin darte cuenta", "Se te pasa la hora de dormir"] },
            bien: { titulo: "Si te pones un límite", icono: "fa-guitar",
                    lista: ["Recuperas tiempo para lo que te gusta", "Llegas más tranquilo a la hora de dormir"] }
        },
        {
            archivo: "dia-2300.jpg", hora: "23:00", titulo: "Antes de dormir",
            dato: "+59%", texto: "más riesgo de insomnio por cada hora de pantalla en la cama",
            fuente: "Hjetland et al. (2025), Frontiers in Psychiatry",
            cielo: ["#1e1b4b", "#312e81"],
            mal:  { titulo: "Si usas el celular", icono: "fa-mobile-screen",
                    lista: ["Duermes 24 minutos menos", "Te cuesta más concentrarte al otro día"] },
            bien: { titulo: "Si lo dejas 30 min antes", icono: "fa-book-open",
                    lista: ["Te duermes más rápido", "Descansas mejor y rindes más"] }
        },
        {
            archivo: "dia-0030.jpg", hora: "00:30", titulo: "Pasada la medianoche",
            dato: "−36 min", texto: "de sueño ya perdió quien lleva 1 h y media con el celular en la cama",
            fuente: "Hjetland et al. (2025): cerca de 24 min menos de sueño por cada hora de pantalla en la cama",
            cielo: ["#0f172a", "#1e1b4b"],
            mal:  { titulo: "Si sigues con el celular", icono: "fa-mobile-screen",
                    lista: ["Te dijiste que a las 23:30 te dormías", "Cada video te quita un poco más de sueño"] },
            bien: { titulo: "Si cumpliste tu hora", icono: "fa-bed",
                    lista: ["Ya llevas 1 hora durmiendo", "Tu cuerpo empezó a recuperarse"] }
        },
        {
            archivo: "dia-0030.jpg", estilo: "madrugada", hora: "02:00", titulo: "Madrugada",
            dato: "2,5 h", texto: "menos de sueño por quedarte con el celular hasta las 02:00",
            barras: [
                { etiqueta: "Te dormiste a las 23:30", horas: 7.5, tipo: "bien" },
                { etiqueta: "Te dormiste a las 02:00", horas: 5,   tipo: "mal" }
            ],
            fuente: "National Sleep Foundation (Hirshkowitz et al., 2015). Cálculo con alarma a las 07:00",
            cielo: ["#0f172a", "#0f172a"],
            mal:  { titulo: "Si te duermes a las 02:00", icono: "fa-mobile-screen",
                    lista: ["Dormirás 5 h, bajo lo recomendado", "Mañana partes cansado y con sueño"] },
            bien: { titulo: "Si te dormiste a tu hora", icono: "fa-moon",
                    lista: ["Dormirás 7,5 h, dentro de lo recomendado", "Mañana partes con energía"] }
        }
    ];

    // Etapa de las 18:00 (Trabajo): se activa al tener la ilustración img/dia-1800.jpg.
    // Para usarla, pega este bloque dentro de "momentos", entre la de las 16:00 y la de las 19:30.
    /*
        {
            archivo: "dia-1800.jpg", hora: "18:00", titulo: "Trabajo",
            dato: "3 de 10", texto: "estudiantes estudian y trabajan", ejemplo: true,
            fuente: "CASEN 2022",
            cielo: ["#fdba74", "#fb7185"],
            mal:  { titulo: "Si trabajas sin ordenar la semana", icono: "fa-battery-quarter",
                    lista: ["Terminas restando horas de sueño", "Todo se junta al final"] },
            bien: { titulo: "Si fijas bloques en la semana", icono: "fa-calendar-days",
                    lista: ["Sabes cuándo estudias y cuándo trabajas", "Baja el estrés"] }
        }
    */

    const CARPETA = "img/";
    const $seccion = $("#dia-scroll");
    if (!$seccion.length) return;

    // Fondos (ilustración o fondo provisorio) y puntos de la línea del día
    momentos.forEach((m, i) => {
        let fondo = $(`
            <div class="dia-fondo ${m.estilo || ""}" data-i="${i}" style="background-image:url('${CARPETA + m.archivo}')">
                <img src="${CARPETA + m.archivo}" alt="Ilustración: ${m.titulo}, mal hábito a la izquierda y buen hábito a la derecha">
            </div>`);
        fondo.find("img").on("error", function() {
            fondo.addClass("provisorio").css("background", `linear-gradient(to bottom, ${m.cielo[0]}, ${m.cielo[1]})`);
            fondo.append(`
                <div class="mitad-provisoria mal"><i class="fa-solid ${m.mal.icono}"></i><small>Falta ${CARPETA + m.archivo}</small></div>
                <div class="mitad-provisoria bien"><i class="fa-solid ${m.bien.icono}"></i></div>`);
        });
        $("#dia-fondos").append(fondo);

        $("#dia-puntos").append(
            `<li><button type="button" class="dia-punto" data-i="${i}"><span>${m.hora} · ${m.titulo}</span></button></li>`);
    });

    // Mostrar un momento en el escenario
    let actual = -1;
    function mostrarMomento(i) {
        if (i === actual) return;
        actual = i;
        let m = momentos[i];

        $(".dia-punto").removeClass("activo");
        $(`.dia-punto[data-i="${i}"]`).addClass("activo");

        let $t = $("#dia-tarjeta").addClass("cambiando");
        setTimeout(() => {
            $("#dia-hora").text(m.hora);
            $("#dia-titulo").text(m.titulo);
            $("#dia-dato").text(m.dato);
            $("#dia-texto").text(m.texto);
            $("#dia-ejemplo").toggle(!!m.ejemplo);
            $("#dia-mal-titulo").text(m.mal.titulo);
            $("#dia-bien-titulo").text(m.bien.titulo);
            $("#dia-mal-lista").html(m.mal.lista.map(t => `<li>${t}</li>`).join(""));
            $("#dia-bien-lista").html(m.bien.lista.map(t => `<li>${t}</li>`).join(""));
            $("#dia-fuente").text("Fuente: " + m.fuente);
            if (m.barras) {
                const MAX = 9; // escala de 0 a 9 horas
                let filas = m.barras.map(br => `
                    <div class="barra-sueno ${br.tipo}">
                        <span class="barra-etiqueta">${br.etiqueta}</span>
                        <div class="barra-pista">
                            <div class="barra-zona" style="left:${7 / MAX * 100}%; width:${2 / MAX * 100}%"></div>
                            <div class="barra-relleno" style="width:${br.horas / MAX * 100}%"></div>
                        </div>
                        <span class="barra-valor">${String(br.horas).replace(".", ",")} h</span>
                    </div>`).join("");
                $("#dia-barras").html(filas + '<p class="barra-nota"><span></span> Lo recomendado: 7 a 9 h</p>').show();
            } else {
                $("#dia-barras").empty().hide();
            }
            $t.removeClass("cambiando");
        }, 250);

        $("#dia-sigue").css("visibility", i === momentos.length - 1 ? "hidden" : "visible");
    }

    // Qué momento corresponde según cuánto se ha bajado
    function alHacerScroll() {
        if (!$seccion.is(":visible")) return;
        let alto = $(window).height();
        let avance = $(window).scrollTop() - $seccion.offset().top;
        let i = Math.round(avance / alto);
        i = Math.max(0, Math.min(momentos.length - 1, i));
        mostrarMomento(i);
    }
    $(window).on("scroll resize", alHacerScroll);

    // Clic en la línea del día: salta a ese momento
    $("#dia-puntos").on("click", ".dia-punto", function() {
        let i = $(this).data("i");
        let destino = $seccion.offset().top + i * $(window).height();
        $("html, body").animate({ scrollTop: destino }, 700);
    });

    // Plegar y desplegar la tarjeta
    $("#dia-plegar").click(function() {
        let plegada = $("#dia-tarjeta").toggleClass("plegada").hasClass("plegada");
        $(this).attr("aria-expanded", !plegada);
    });

    // En celular la tarjeta parte plegada para dejar ver la ilustración
    if (window.matchMedia("(max-width: 700px)").matches) {
        $("#dia-tarjeta").addClass("plegada");
        $("#dia-plegar").attr("aria-expanded", false);
    }

    // Al entrar a la pantalla de resultados, dejar listo el primer momento
    mostrarMomento(0);
});
