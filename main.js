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