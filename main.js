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
