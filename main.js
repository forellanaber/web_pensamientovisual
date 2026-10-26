// =====================================================================
// --- 0. Idioma: los textos salen de textos.js ---
// =====================================================================
let idioma = "es";
try { idioma = localStorage.getItem("idioma") === "en" ? "en" : "es"; } catch (e) { /* sin almacenamiento */ }

// Texto por clave, con valores opcionales: t("test.quedan", { n: 3 })
function t(clave, valores) {
    let texto = TEXTOS[idioma][clave];
    if (texto === undefined) texto = TEXTOS.es[clave];
    if (texto === undefined) return clave;
    if (valores) texto = texto.replace(/\{(\w+)\}/g, (m, k) => (valores[k] !== undefined ? valores[k] : m));
    return texto;
}
// Listas y objetos de textos (momentos, consejos, etc.)
function lista(clave) {
    return TEXTOS[idioma][clave] !== undefined ? TEXTOS[idioma][clave] : TEXTOS.es[clave];
}
// Números: coma decimal en español ("5,2"), punto en inglés ("5.2")
function formatoNumero(n, decimales) {
    let texto = (decimales === undefined) ? String(Math.round(n * 10) / 10) : n.toFixed(decimales);
    return idioma === "es" ? texto.replace(".", ",") : texto;
}

// Pone en la página los textos del idioma actual y avisa al resto del código
function aplicarIdioma() {
    document.documentElement.lang = idioma;
    $("[data-t]").each(function() { $(this).text(t(this.getAttribute("data-t"))); });
    $("[data-t-html]").each(function() { $(this).html(t(this.getAttribute("data-t-html"))); });
    $("[data-t-aria]").each(function() { this.setAttribute("aria-label", t(this.getAttribute("data-t-aria"))); });
    $(".btn-idioma [data-idioma]").each(function() {
        $(this).toggleClass("activo", this.getAttribute("data-idioma") === idioma);
    });
    $(document).trigger("cambioIdioma");
}

$(document).on("click", "#btn-idioma", function() {
    idioma = (idioma === "es") ? "en" : "es";
    try { localStorage.setItem("idioma", idioma); } catch (e) { /* sin almacenamiento */ }
    aplicarIdioma();
});

// =====================================================================
// Apoyo estudiantil por región: servicios de apoyo psicológico o de bienestar
// de cada universidad, IP y CFT. PENDIENTE (lo entrega el equipo).
// Formato: { 13: [ { nombre: "Universidad X, apoyo psicológico", url: "https://..." } ], ... }
// Mientras esté vacío, el sitio muestra un texto general.
// =====================================================================
const APOYO_ESTUDIANTIL = {
    1: [
        { nombre: "Bienestar Estudiantil UNAP", url: "https://www.unap.cl" },
        { nombre: "Servicio de Salud Estudiantil Santo Tomás Iquique", url: "https://www.santotomas.cl" }
    ]
};

$(document).ready(function() {

    // --- 1. Navegación entre pantallas ---
    function revelarYScrollear(ocultar, mostrar) {
        $(ocultar).addClass("seccion-oculta").removeClass("seccion-activa");
        $(mostrar).removeClass("seccion-oculta").addClass("seccion-activa");

        // Scroll suave al top de la nueva sección
        $('html, body').animate({
            scrollTop: $(mostrar).offset().top - 80 // Descuento de 80px por el Header fijo
        }, 800);
    }

    // Menú: muestra una sección y marca su enlace
    function mostrarSeccion(selector, $enlace) {
        $("section").removeClass("seccion-activa").addClass("seccion-oculta");
        $(selector).removeClass("seccion-oculta").addClass("seccion-activa");
        $(".navegacion a").removeClass("activo");
        if ($enlace) $enlace.addClass("activo");
        $("html, body").scrollTop(0);
        $(window).trigger("scroll");
        if (selector === "#pantalla-explorar" && typeof pintarMapa === "function") {
            pintarMapa();
        }
        if (typeof ScrollTrigger !== "undefined") {
            setTimeout(function() { ScrollTrigger.refresh(); }, 80);
        }
    }

    $("#link-explorar").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-explorar", $(this));
    });
    $("#link-vive").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-vive", $(this));
    });
    $("#link-quienes").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-quienes", $(this));
    });
    $("#link-sugerencias").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-sugerencias", $(this));
    });
    $(".btn-ir-vive").click(function() {
        mostrarSeccion("#pantalla-vive", $("#link-vive"));
    });
    $("#logo-inicio").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-bienvenida");
    });
    // Botones que llevan al test (ficha de región y cierre de Vive un día)
    $("#btn-explorar-test, #btn-vive-test").click(function() {
        mostrarSeccion("#pantalla-contexto");
    });

    // El alto del header cambia en celular (el menú puede ocupar dos líneas): se mide y se guarda en --alto-header
    function medirHeader() {
        document.documentElement.style.setProperty("--alto-header", $(".header-principal").outerHeight() + "px");
    }
    medirHeader();
    $(window).on("resize load", medirHeader);
    $(document).on("cambioIdioma", medirHeader);

    $("#btn-comenzar").click(function() { revelarYScrollear("#pantalla-bienvenida", "#pantalla-contexto"); });

    // El personaje del inicio reacciona cuando el cursor (o el teclado) llega al botón "Sí"
    $("#btn-comenzar, .inicio-personaje")
        .on("mouseenter focus", function() { $(".inicio-contenido").addClass("reacciona"); })
        .on("mouseleave blur", function() { $(".inicio-contenido").removeClass("reacciona"); });
    $("#btn-ir-al-test").click(function() {
        revelarYScrollear("#pantalla-contexto", "#pantalla-test");
        empezarTest();
    });

    // --- 2. Sliders del día y gráfico de dona (reloj) ---
    const CLAVES = ["sueno", "estudio", "trabajo", "traslado", "ocio", "deporte", "celular"];
    const VALORES_INICIALES = { sueno: 7, estudio: 6, trabajo: 2, traslado: 2, ocio: 1, deporte: 1, celular: 3 };

    function leerHoras() {
        let h = {};
        CLAVES.forEach(k => { h[k] = parseFloat($("#horas-" + k).val()) || 0; });
        return h;
    }
    function sumaHoras(h) {
        return CLAVES.reduce((total, k) => total + (h[k] || 0), 0);
    }

    // Pinta la parte llena del slider (ver .slider-tiempo en style.css)
    function llenarSlider(el) {
        let min = parseFloat(el.min) || 0, max = parseFloat(el.max) || 100;
        el.style.setProperty("--lleno", ((parseFloat(el.value) - min) / (max - min)) * 100 + "%");
    }

    function pintarDona(h) {
        let total = sumaHoras(h);
        let grados = 0;
        let tramos = CLAVES.map(k => {
            let desde = grados;
            grados += (h[k] / 24) * 360;
            return `var(--c-${k}) ${desde}deg ${grados}deg`;
        });
        tramos.push(`var(--gris-vacio) ${grados}deg 360deg`);
        $("#reloj-dona").css("background", `conic-gradient(${tramos.join(", ")})`);

        $("#total-horas-dona").text(formatoNumero(total)).css("color", total === 24 ? "var(--bien-texto)" : "var(--texto)");
        let libres = 24 - total;
        $("#horas-libres").text(libres > 0 ? t("dona.sinAsignar", { n: formatoNumero(libres) }) : t("dona.completo"));
    }

    function pintarValoresSliders() {
        CLAVES.forEach(k => {
            $("#val-" + k).text(formatoNumero(parseFloat($("#horas-" + k).val())));
            llenarSlider($("#horas-" + k)[0]);
        });
    }

    $(".slider-tiempo").on("input", function() {
        let clave = $(this).data("clave");
        let h = leerHoras();
        let maximo = 24 - (sumaHoras(h) - h[clave]);

        if (h[clave] > maximo) {
            // No se puede pasar de 24 horas: el slider se queda en el máximo posible
            h[clave] = maximo;
            $(this).val(maximo);
            $("#alerta-horas").removeClass("oculta");
        } else if (sumaHoras(h) < 24) {
            $("#alerta-horas").addClass("oculta");
        }

        $("#val-" + clave).text(formatoNumero(h[clave]));
        llenarSlider(this);
        pintarDona(h);
    });

    function reiniciarSliders() {
        CLAVES.forEach(k => { $("#horas-" + k).val(VALORES_INICIALES[k]); });
        pintarValoresSliders();
        $("#alerta-horas").addClass("oculta");
        pintarDona(leerHoras());
    }
    reiniciarSliders();

    // --- 3. Test paso a paso ---
    // Cada .test-pantalla es una pregunta. Las opciones guardan la respuesta y avanzan solas.
    let respuestas = {};
    let historial = [];   // pantallas visitadas, para el botón Volver
    let actual = 0;
    const $pantallas = $(".test-pantalla");

    // Paso 5: solo si el ánimo es bajo (carita 1 o 2) o la batería está bajo 30%
    function necesitaPaso5() {
        return (respuestas.animo !== undefined && respuestas.animo <= 2) ||
               (respuestas.bateria !== undefined && respuestas.bateria < 30);
    }

    function pantallaCuenta(i) {
        return $pantallas.eq(i).data("paso") !== 5 || necesitaPaso5();
    }

    function siguienteIndice(desde) {
        for (let i = desde + 1; i < $pantallas.length; i++) {
            if (pantallaCuenta(i)) return i;
        }
        return -1;
    }

    function actualizarAvance() {
        let $p = $pantallas.eq(actual);
        $("#test-paso-num").text("0" + $p.data("paso"));

        // Tiempo: lo que queda desde esta pantalla, y avance hecho para la barra
        let restante = 0, hecho = 0;
        $pantallas.each(function(i) {
            if (!pantallaCuenta(i)) return;
            let seg = $(this).data("segundos") || 10;
            if (i >= actual) restante += seg; else hecho += seg;
        });
        $("#test-tiempo").text(restante >= 60 ? t("test.quedan", { n: Math.round(restante / 60) }) : t("test.quedaMenos"));
        $("#test-barra-relleno").css("width", (hecho / (hecho + restante)) * 100 + "%");
        $("#test-volver").toggleClass("invisible", historial.length === 0);

        // El botón de la batería dice "Seguir" si viene el paso 5
        if ($p.data("id") === "bateria") actualizarBotonBateria();
    }

    function mostrarPantalla(i) {
        actual = i;
        $pantallas.removeClass("activa").eq(i).addClass("activa");
        actualizarAvance();
        let arriba = $("#pantalla-test").offset().top;
        if ($(window).scrollTop() > arriba) $("html, body").scrollTop(arriba);
    }

    function empezarTest() {
        historial = [];
        mostrarPantalla(0);
    }

    function siguiente() {
        let i = siguienteIndice(actual);
        if (i === -1) { terminarTest(); return; }
        historial.push(actual);
        mostrarPantalla(i);
    }

    $("#test-volver").click(function() {
        if (historial.length) mostrarPantalla(historial.pop());
    });

    $("#pantalla-test").on("click", "[data-siguiente]", siguiente);

    // Tocar una opción: guarda la respuesta y avanza
    let avanzando = null;
    $("#pantalla-test").on("click", ".opcion", function() {
        let $opcion = $(this);
        let campo = $opcion.closest(".opciones").data("campo");
        let valor = $opcion.data("valor");

        $opcion.siblings().removeClass("elegida");
        $opcion.addClass("elegida");
        respuestas[campo] = valor;

        if (campo === "ocupacion") {
            // Si solo estudia, el slider de trabajo no aplica
            let soloEstudia = valor === "estudia";
            $("#grupo-trabajo").toggle(!soloEstudia);
            if (soloEstudia) $("#horas-trabajo").val(0).trigger("input");
            else if (parseFloat($("#horas-trabajo").val()) === 0) $("#horas-trabajo").val(VALORES_INICIALES.trabajo).trigger("input");
        }

        clearTimeout(avanzando);
        avanzando = setTimeout(siguiente, 350);
    });

    // Batería
    function pintarBateria(nivel) {
        $("#nivel-bateria").css("width", nivel + "%");
        $("#valor-bateria").text(nivel + "%");
        llenarSlider($("#slider-bateria")[0]);
        let color = nivel < 30 ? "var(--estado-atencion)" : (nivel < 60 ? "var(--estado-mejorar)" : "var(--estado-bien)");
        $("#nivel-bateria").css("background", color);
    }
    function actualizarBotonBateria() {
        respuestas.bateria = parseInt($("#slider-bateria").val(), 10);
        let clave = necesitaPaso5() ? "test.seguirCorto" : "test.verResultados";
        $("#texto-btn-bateria").attr("data-t", clave).text(t(clave));
    }
    $("#slider-bateria").on("input", function() {
        pintarBateria(parseInt($(this).val(), 10));
        actualizarBotonBateria();
    });
    pintarBateria(50);

    // --- 4. Puntaje: "Equilibrio de tu día" (de 0 a 10) ---
    // Cada área va de 0 a 10 y pesa distinto en el total.
    // Referencias para los cortes: sueño de 7 a 9 h (National Sleep Foundation) y
    // 150 min de actividad física a la semana (OMS). Los pesos y cortes son una
    // propuesta del equipo: conviene revisarlos antes de publicar.
    // =====================================================================
    // --- Diagnóstico y Puntajes Personalizados (6 Áreas) ---
    // =====================================================================
    const AREAS_ORDEN = ["descanso", "estudio", "trabajo", "traslado", "ocio", "deporte"];
    const CLAVE_HORA = { descanso: "sueno", estudio: "estudio", trabajo: "trabajo", traslado: "traslado", ocio: "ocio", deporte: "deporte" };
    const PESOS = { descanso: 0.25, estudio: 0.20, trabajo: 0.15, traslado: 0.10, ocio: 0.15, deporte: 0.15 };
    const limitar = n => Math.max(0, Math.min(10, n));

    function evaluarArea(k, r) {
        r = r || {};
        let hDict = r.horas || {};
        let h = (hDict[CLAVE_HORA[k]] !== undefined) ? hDict[CLAVE_HORA[k]] : 0;
        let esEs = (typeof idioma === "undefined" || idioma === "es");

        let dict = (typeof TEXTOS !== "undefined" && TEXTOS[idioma] && TEXTOS[idioma].tarjetasDiagnostico)
            ? TEXTOS[idioma].tarjetasDiagnostico
            : (typeof TEXTOS !== "undefined" ? TEXTOS.es.tarjetasDiagnostico : {});
        let data = (dict && dict[k]) || (typeof TEXTOS !== "undefined" && TEXTOS.es && TEXTOS.es.tarjetasDiagnostico && TEXTOS.es.tarjetasDiagnostico[k]);

        if (!data || !data.rangos) {
            return { horas: h, estado: "", nivel: "bien", puntos: 10, texto: "", fuentes: [] };
        }

        let rangoEncontrado = data.rangos.find(rg => h >= rg.min && h <= rg.max) || data.rangos[0];
        let estado = rangoEncontrado.estado;
        let fuentes = data.fuentes || [];

        let pts = 10;
        let oraciones = [rangoEncontrado.texto];

        if (k === "descanso") {
            if (h >= 7 && h <= 9) {
                pts = (h === 8) ? 10.0 : (9.2 + (1 - Math.abs(h - 8)) * 0.8);
                if (r.celularCama === 0) {
                    pts = Math.min(10.0, pts + 0.5);
                    oraciones.push(esEs
                        ? "Tu hábito de no usar pantallas en la cama favorece la conciliación rápida del sueño profundo y un ritmo circadiano saludable."
                        : "Avoiding screens in bed supports prompt deep-sleep onset and a healthy circadian rhythm.");
                } else if (r.celularCama === 1) {
                    pts -= 0.6;
                    oraciones.push(esEs
                        ? "Sin embargo, el uso ocasional del celular en la cama puede retrasar la liberación de melatonina y fragmentar el descanso."
                        : "However, occasional screen use in bed can delay melatonin release and fragment sleep.");
                } else if (r.celularCama === 2) {
                    pts -= 1.3;
                    oraciones.push(esEs
                        ? "Señalas que usas frecuentemente el celular en la cama; el consenso médico de la Sleep Foundation advierte que la luz azul suprime la fase REM, intensificando el cansancio al despertar."
                        : "Frequent screen use in bed suppresses REM sleep due to blue light, increasing morning fatigue according to the Sleep Foundation.");
                }
            } else if (h < 7) {
                pts = Math.max(2.0, 8.5 - (7 - h) * 1.5);
                if (r.celularCama >= 1) {
                    pts -= (r.celularCama === 2 ? 1.2 : 0.6);
                    oraciones.push(esEs
                        ? "Sumado al déficit de horas, el celular en la cama agrava la fatiga cognitiva y la vulnerabilidad al estrés académico (AASM / Sleep Foundation)."
                        : "Combined with hour deficit, screens in bed worsen cognitive fatigue and vulnerability to stress (AASM / Sleep Foundation).");
                }
                if (r.bateria !== undefined && r.bateria < 35) {
                    pts -= 0.5;
                    oraciones.push(esEs
                        ? "Tu baja reserva de energía al terminar el día (" + r.bateria + "%) es una consecuencia directa de este déficit acumulado."
                        : "Your low end-of-day battery (" + r.bateria + "%) directly reflects this accumulated sleep debt.");
                }
            } else {
                pts = Math.max(4.0, 8.8 - (h - 9) * 1.2);
                if (r.bateria !== undefined && r.bateria < 40) {
                    oraciones.push(esEs
                        ? "Pese al alto volumen de horas, una baja energía puede indicar sueño poco profundo o fragmentado (Sleep Foundation)."
                        : "Despite high sleep hours, low reported energy suggests poor sleep quality or fragmentation (Sleep Foundation).");
                }
            }
        } else if (k === "estudio") {
            if (h >= 2 && h <= 5.5) {
                pts = (h >= 2.5 && h <= 4.5) ? 10.0 : 9.2;
                if (r.planificar === 2) {
                    pts = Math.min(10.0, pts + 0.5);
                    oraciones.push(esEs
                        ? "Tu hábito de planificar la semana potencia tu rendimiento sin sobrecargar tus tiempos de descanso."
                        : "Planning your week maximizes academic efficiency without sacrificing rest.");
                } else if (r.planificar === 0) {
                    pts -= 0.7;
                    oraciones.push(esEs
                        ? "Aunque tu tiempo de estudio es adecuado, la falta de planificación puede generar picos imprevistos de estrés antes de evaluaciones."
                        : "While study hours are adequate, lacking weekly planning can trigger pre-exam stress spikes.");
                }
                if (r.postergar === 2) {
                    pts -= 1.0;
                    oraciones.push(esEs
                        ? "Procrastinar tareas puede provocarte ansiedad; la técnica Pomodoro (bloques de 25 min) te ayudará a sostener el foco."
                        : "Frequent procrastination may trigger anxiety; 25-min Pomodoro blocks will help sustain focus.");
                }
            } else if (h < 2) {
                pts = Math.max(2.5, 7.8 - (2 - h) * 2.2);
                if (r.postergar === 2) {
                    pts -= 1.0;
                    oraciones.push(esEs
                        ? "La postergación frecuente acentúa el riesgo de cramming nocturno de última hora, afectando la retención a largo plazo (Athenify)."
                        : "Frequent procrastination raises the risk of late-night cramming, harming long-term retention (Athenify).");
                }
            } else {
                pts = Math.max(3.0, 7.5 - (h - 5.5) * 1.2);
                if (r.planificar === 2) {
                    pts = Math.min(10.0, pts + 0.6);
                    oraciones.push(esEs
                        ? "Una buena planificación te ayuda a gestionar esta alta carga, pero recuerda incluir pausas activas para evitar el agotamiento."
                        : "Good planning helps manage this load, but remember to schedule active breaks to prevent burnout.");
                }
            }
        } else if (k === "trabajo") {
            let soloEstudia = (r.ocupacion === "estudia" || h === 0);
            if (soloEstudia) {
                pts = 10.0;
                oraciones = [
                    esEs
                        ? "No dedicas horas a trabajo remunerado, lo que te permite mayor disponibilidad horaria para organizar tus estudios, ocio y descanso."
                        : "You dedicate yourself exclusively to studying, allowing flexible time management for academics, leisure, and rest.",
                    esEs
                        ? "Los datos de la Encuesta CASEN e INJUV muestran que los estudiantes de dedicación exclusiva cuentan con mejores condiciones para consolidar hábitos saludables y avance curricular oportuno."
                        : "CASEN and INJUV data show exclusive students have better flexibility for healthy routines and timely graduation."
                ];
            } else {
                if (h <= 4) {
                    pts = 9.5 - (h - 1) * 0.4;
                    oraciones.push(esEs
                        ? "Según la Encuesta Nacional sobre Uso del Tiempo (ENUT - INE), una jornada laboral moderada entrega autonomía financiera con bajo riesgo de canibalizar el tiempo académico."
                        : "INE's Time Use Survey (ENUT) shows moderate student work provides financial autonomy with low risk of hurting studies.");
                } else {
                    pts = Math.max(3.0, 6.5 - (h - 4) * 1.0);
                    if (hDict.sueno && hDict.sueno < 7) {
                        pts -= 1.0;
                        oraciones.push(esEs
                            ? "Esta carga laboral ya está comprometiendo tus horas de sueño (" + formatoNumero(hDict.sueno, 1) + " h), elevando el riesgo de sobrecarga según evidencia de CASEN."
                            : "This heavy workload is already cutting into your sleep hours (" + formatoNumero(hDict.sueno, 1) + " h), raising burnout risk according to CASEN data.");
                    }
                }
            }
        } else if (k === "traslado") {
            let esRM = (r.region === "13" || r.region === 13);
            if (h <= 1.0) {
                pts = 10.0 - h * 0.8;
                oraciones.push(esEs
                    ? "Según la Encuesta CASEN, tus tiempos breves de traslado te otorgan hasta 1,5 horas útiles adicionales al día respecto al promedio de transporte público."
                    : "According to CASEN data, short commutes grant you up to 1.5 extra useful hours daily compared to public transit averages.");
            } else if (h <= 2.2) {
                pts = Math.max(6.0, 8.5 - (h - 1.0) * 1.5);
                if (esRM) {
                    oraciones.push(esEs
                        ? "En la Región Metropolitana, los datos de CASEN sitúan el promedio de traslado urbano entre 50 y 70 minutos por viaje. Convertir estos tramos en descanso auditivo reduce el estrés de la congestión."
                        : "In the Metropolitan Region, CASEN places daily urban commutes between 50-70 min per trip. Using transit for relaxing audio mitigates congestion stress.");
                }
            } else {
                pts = Math.max(2.5, 5.5 - (h - 2.2) * 1.3);
                oraciones.push(esEs
                    ? "La evidencia de CASEN y ENUT confirma que traslados superiores a 2,5 horas diarias conllevan una pérdida crítica de horas de sueño y fatiga postural acumulada."
                    : "CASEN and ENUT evidence confirms daily commutes over 2.5 hours cause critical loss of sleep and cumulative physical fatigue.");
            }
        } else if (k === "ocio") {
            let cel = hDict.celular || 0;
            if (h >= 1.5 && h <= 3.5) {
                pts = (h >= 2 && h <= 3) ? 10.0 : 9.3;
                oraciones.push(esEs
                    ? "El Programa Vida Saludable de la UdeC destaca que el ocio sin pantallas actúa como regulador neurobiológico frente a la ansiedad y el estrés."
                    : "UdeC's Healthy Living Program highlights that screen-free leisure acts as a neurobiological regulator against anxiety.");
            } else if (h < 1.5) {
                pts = Math.max(2.5, 8.0 - (1.5 - h) * 3.5);
                if (cel >= 4) {
                    pts -= 0.8;
                    oraciones.push(esEs
                        ? "Registras " + formatoNumero(cel, 1) + " h de celular frente a solo " + formatoNumero(h, 1) + " h de ocio desconectado. La 10ª Encuesta de Juventudes (INJUV) señala que la navegación en redes no reemplaza el valor reparador del ocio activo."
                        : "You log " + formatoNumero(cel, 1) + " h of phone use vs " + formatoNumero(h, 1) + " h of offline leisure. INJUV survey shows social feeds do not provide true cognitive recovery.");
                }
            } else {
                pts = Math.max(4.0, 7.8 - (h - 3.5) * 1.1);
                if (cel >= 5) {
                    pts -= 1.0;
                    oraciones.push(esEs
                        ? "Un volumen muy elevado de ocio ligado a pantallas puede inducir fatiga visual y posponer horarios de estudio y descanso."
                        : "High screen-dominated leisure may induce eye strain and push back sleep and study schedules.");
                }
            }
        } else if (k === "deporte") {
            let dias = r.diasDeporte !== undefined ? parseInt(r.diasDeporte, 10) : 1;
            let minutosDiarios = Math.round(h * 60);

            if (minutosDiarios < 18 || dias === 0) {
                pts = Math.max(2.0, 3.2 + (minutosDiarios / 18) * 1.5);
                oraciones.push(esEs
                    ? "La 10ª Encuesta de Juventudes de INJUV alerta que el sedentarismo afecta a más del 60% de los estudiantes. La OMS/OPS aconseja empezar con caminatas ágiles de 15 a 20 minutos al día."
                    : "INJUV's Youth Survey warns that sedentarism affects over 60% of students. WHO/PAHO guidelines recommend starting with 15-20 min brisk walks.");
            } else if (minutosDiarios <= 50) {
                pts = 8.5 + (dias >= 3 ? 1.5 : (dias >= 1 ? 0.7 : 0));
                if (dias >= 3) {
                    oraciones.push(esEs
                        ? "Entrenar " + dias + " o más días por semana cumple a cabalidad con la recomendación de 150 a 300 min semanales de la OMS/OPS, fortaleciendo el sistema cardiovascular y la retención cognitiva."
                        : "Exercising " + dias + " or more days a week meets WHO/PAHO recommendations of 150-300 min/week, boosting cardiovascular fitness and cognitive retention.");
                } else {
                    oraciones.push(esEs
                        ? "Tu duración por sesión es excelente; la OMS recomienda sumar un día extra a la semana para sostener el beneficio cardiorrespiratorio."
                        : "Session length is great; WHO recommends adding an extra day per week to maintain cardiorespiratory benefits.");
                }
            } else if (minutosDiarios <= 90) {
                pts = 9.0;
            } else {
                pts = 8.0;
                oraciones.push(esEs
                    ? "Mantienes una alta exigencia física. La OMS aconseja complementar este nivel con una adecuada hidratación y suficiente descanso muscular."
                    : "High physical output. WHO recommends balancing this with adequate hydration, nutrition, and rest.");
            }
        }

        pts = limitar(Math.round(pts * 10) / 10);
        let textoFinal = oraciones.join(" ");
        let nivelArea = (pts < 4.5) ? "atencion" : (pts < 7.0 ? "mejorar" : "bien");

        return {
            horas: h,
            estado: estado,
            nivel: nivelArea,
            puntos: pts,
            texto: textoFinal,
            fuentes: fuentes
        };
    }

    function puntajeAreas(r) {
        let res = {};
        AREAS_ORDEN.forEach(k => {
            let ev = evaluarArea(k, r);
            res[k] = ev.puntos;
        });
        return res;
    }

    function puntajeTotal(r) {
        let areas = puntajeAreas(r);
        let total = 0;
        for (const k in PESOS) {
            if (areas[k] !== undefined) {
                total += areas[k] * PESOS[k];
            }
        }
        return Math.round(total * 10) / 10;
    }

    // Franjas de la barra: atención (0 a 4.5), puede mejorar (4.5 a 7), bien (7 a 10)
    function nivel(p) { return p < 4.5 ? "atencion" : (p < 7 ? "mejorar" : "bien"); }

    // Cambios del simulador: cada uno modifica una copia de las respuestas
    function quitarHoras(h, cantidad, desde) {
        desde.forEach(k => {
            let quita = Math.min(cantidad, h[k]);
            h[k] -= quita;
            cantidad -= quita;
        });
    }
    const MEJORAS = {
        sueno: {
            aplicar(r) {
                r.horas.sueno += 1;
                quitarHoras(r.horas, 1, ["celular", "ocio", "traslado", "estudio"]);
                r.celularCama = Math.max(0, (r.celularCama || 0) - 1);
            }
        },
        deporte: {
            aplicar(r) {
                r.diasDeporte = Math.max(r.diasDeporte || 0, 3);
                r.horas.deporte += 0.5;
                quitarHoras(r.horas, 0.5, ["celular", "ocio", "traslado"]);
            }
        },
        estudio: {
            aplicar(r) {
                r.postergar = Math.max(0, (r.postergar ?? 1) - 1);
                let libera = Math.min(0.5, r.horas.estudio);
                r.horas.estudio -= libera;
                r.horas.ocio += libera;
            }
        },
        planificar: {
            aplicar(r) { r.planificar = 2; }
        }
    };

    function conMejoras(r, ids) {
        let copia = JSON.parse(JSON.stringify(r));
        ids.forEach(id => MEJORAS[id].aplicar(copia));
        return copia;
    }

    // El par de cambios que más sube el puntaje
    function mejorPar(r) {
        let ids = Object.keys(MEJORAS);
        let mejor = { ids: [], total: puntajeTotal(r) };
        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                let total = puntajeTotal(conMejoras(r, [ids[i], ids[j]]));
                if (total > mejor.total) mejor = { ids: [ids[i], ids[j]], total: total };
            }
        }
        return mejor;
    }

    // Mensaje de bienestar (paso 5). La web no diagnostica: orienta y deriva.
    function htmlContactos() {
        return `
            <ul class="contactos-ayuda">
                <li><i class="fa-solid fa-phone"></i> <span><strong>Salud Responde</strong> <a href="tel:6003607777">600 360 7777</a></span></li>
                <li><i class="fa-solid fa-phone"></i> <span><strong>${t("bien.linea")} <a href="tel:*4141">*4141</a></strong> ${t("bien.linea4141")}</span></li>
            </ul>`;
    }

    function htmlApoyoInstitucion() {
        let apoyos = APOYO_ESTUDIANTIL[respuestas.region] || [];
        if (apoyos.length) {
            let items = apoyos.map(a => `<li><a href="${a.url}" target="_blank" rel="noopener">${a.nombre} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>`).join("");
            return `<p>${t("bien.apoyoRegion")}</p><ul class="apoyo-instituciones">${items}</ul>`;
        }
        return `<p>${t("bien.apoyoGeneral")}</p>`;
    }

    function mostrarBienestar() {
        let $caja = $("#caja-bienestar");
        if (!necesitaPaso5() || !respuestas.bienApoyo) { $caja.prop("hidden", true).empty(); return; }

        let derivar = respuestas.bienDuracion === "mes" || respuestas.bienApoyo === "no";
        let consejos = lista("consejos");
        let html = "";

        if (derivar) {
            html += `<h3><i class="fa-solid fa-hand-holding-heart"></i> ${t("bien.tituloDerivar")}</h3>`;
            if (respuestas.bienFactor === "lejos") html += `<p>${t("bien.contextoLejos")}</p>`;
            html += `<p>${t("bien.derivar")}</p>`;
            html += htmlApoyoInstitucion();
            html += `<p>${t("bien.tambienLlamar")}</p>` + htmlContactos();
        } else {
            html += `<h3><i class="fa-solid fa-seedling"></i> ${t("bien.tituloConsejo")}</h3>`;
            if (respuestas.bienFactor === "lejos") html += `<p>${t("bien.contextoLejos")}</p>`;
            html += `<p>${consejos[respuestas.bienFactor] || consejos.otro}</p>`;
            if (respuestas.bienApoyo === "aveces") html += `<p>${t("bien.aVeces")}</p>`;
            html += `<p class="nota-contactos">${t("bien.siSigue")}</p>` + htmlContactos();
        }

        $caja.html(html).prop("hidden", false).toggleClass("derivar", derivar);
    }

    // "Así repartes tu día": una barra por actividad, con los colores de arena
    function pintarReparto() {
        let h = respuestas.horas;
        let max = Math.max(1, ...CLAVES.map(k => h[k]));
        let filas = CLAVES.filter(k => h[k] > 0).map(k => `
            <div class="reparto-fila">
                <span class="reparto-nombre">${t("act." + k)}</span>
                <div class="reparto-pista"><div class="reparto-barra" style="width: ${h[k] / max * 100}%; background: var(--c-${k});"></div></div>
                <span class="reparto-horas">${formatoNumero(h[k])} h</span>
            </div>`).join("");
        $("#reparto-filas").html(filas);
    }

    function mostrarResultados(animar) {
        let total = puntajeTotal(respuestas);
        let esEs = (typeof idioma === "undefined" || idioma === "es");

        mostrarBienestar();
        pintarReparto();
        $("#nota-final-global").text(formatoNumero(total, 1));
        $("#texto-diagnostico").text(lista("diagnostico")[nivel(total)]);

        // La marca parte en 0 y se desliza hasta el puntaje
        if (animar) {
            $("#escala-marca").css("left", "0%");
            setTimeout(() => $("#escala-marca").css("left", total * 10 + "%"), 400);
        } else {
            $("#escala-marca").css("left", total * 10 + "%");
        }

        let par = mejorPar(respuestas);
        if (par.ids.length && par.total - total >= 0.3) {
            let cambios = par.ids.map(id => t(`mejora.${id}Nombre`)).join(t("res.y"));
            $("#frase-adelante").html(t("res.frase", { nota: formatoNumero(par.total, 1), cambios: cambios }));
        } else {
            $("#frase-adelante").text(t("res.fraseMantener"));
        }

        // Renderizado personalizado de las 6 tarjetas de diagnóstico
        for (const k of AREAS_ORDEN) {
            let ev = evaluarArea(k, respuestas);
            let $tarjeta = $('.tarjeta-categoria[data-area="' + k + '"]');
            $tarjeta.removeClass("nivel-atencion nivel-mejorar nivel-bien").addClass("nivel-" + ev.nivel);

            let badgeTexto = formatoNumero(ev.puntos, 1) + "/10 · " + ev.estado;
            $tarjeta.find(".nota-cat").text(badgeTexto);
            $tarjeta.find(".tarjeta-detalle").text(ev.texto);

            let fuentesHtml = "";
            if (ev.fuentes && ev.fuentes.length > 0) {
                fuentesHtml = '<i class="fa-solid fa-database"></i> <strong>' + (esEs ? "Bases de datos:" : "Databases:") + '</strong> ';
                let links = ev.fuentes.map(f => '<a href="' + f.url + '" target="_blank" rel="noopener">' + f.nombre + ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>');
                fuentesHtml += links.join(" · ");
            }
            $tarjeta.find(".tarjeta-fuente").html(fuentesHtml);
        }
    }

    // --- 5. Pantalla de carga ---
    function terminarTest() {
        respuestas.horas = leerHoras();

        // En lugar de scrollear, la carga la ponemos arriba reemplazando todo para concentrar al usuario
        $("#pantalla-test").addClass("seccion-oculta").removeClass("seccion-activa");
        $("#pantalla-carga").removeClass("seccion-oculta").addClass("seccion-activa");
        $('html, body').scrollTop(0);

        let frases = lista("carga.frases");
        let fraseIndex = 0;
        $("#frase-carga").text(frases[0]);

        let intervalo = setInterval(() => {
            fraseIndex++;
            if (fraseIndex < frases.length) {
                $("#frase-carga").fadeOut(300, function() {
                    $(this).text(lista("carga.frases")[fraseIndex]).fadeIn(300);
                });
            }
        }, 1800);

        // Termina la carga y muestra resultados
        setTimeout(() => {
            clearInterval(intervalo);
            mostrarResultados(true);
            revelarYScrollear("#pantalla-carga", "#pantalla-resultados");
        }, 7000);
    }

    // --- 6. Simulador y plan de acción ---
    function irAlPlan() {
        revelarYScrollear("#pantalla-resultados", "#pantalla-guia");
        dibujarBarras();
    }
    $("#btn-descubrelo, #btn-ver-plan").click(irAlPlan);

    function dibujarBarras() {
        if (!respuestas.horas) respuestas.horas = leerHoras();
        construirBarra("#barra-actual", respuestas.horas);
        actualizarProyeccion();
    }

    function construirBarra(selector, horas) {
        $(selector).empty();
        CLAVES.forEach(k => {
            if (horas[k] > 0) {
                $(selector).append(
                    `<div class="segmento-barra" style="width: ${(horas[k] / 24) * 100}%; background-color: var(--c-${k});" title="${t("act." + k)}: ${formatoNumero(horas[k])} h"></div>`
                );
            }
        });
    }

    function mejorasActivas() {
        return $(".toggle-mejora:checked").map(function() { return $(this).data("mejora"); }).get();
    }

    function actualizarProyeccion() {
        let proyectado = conMejoras(respuestas, mejorasActivas());
        construirBarra("#barra-proyectada", proyectado.horas);
        $("#nota-proyectada").text(formatoNumero(puntajeTotal(proyectado), 1));
    }

    $(".toggle-mejora").change(function() {
        pintarOpcionesCalendario($(this).data("mejora"), this.checked);
        actualizarProyeccion();
    });

    // --- Calendario: cada cambio activado se puede agregar como evento semanal ---
    // dias: días de la semana en formato iCalendar (MO, TU, WE, TH, FR, SA, SU).
    // Los títulos y descripciones de los eventos están en textos.js ("eventos").
    const EVENTOS = {
        sueno:      { dias: ["SU", "MO", "TU", "WE", "TH"], hora: "23:00", minutos: 30, archivo: "dormir" },
        deporte:    { dias: ["MO", "TU", "WE", "TH", "FR"], hora: "18:30", minutos: 20, archivo: "caminata" },
        estudio:    { dias: ["MO", "TU", "WE", "TH", "FR"], hora: "16:00", minutos: 60, archivo: "pomodoro" },
        planificar: { dias: ["SU"], hora: "20:00", minutos: 20, archivo: "planificar" }
    };
    const DIAS_ICAL = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

    // Próxima fecha (desde hoy) que cae en uno de los días del evento
    function primeraFecha(evento) {
        let [hh, mm] = evento.hora.split(":").map(Number);
        let ahora = new Date();
        for (let i = 0; i < 8; i++) {
            let candidata = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + i, hh, mm);
            if (evento.dias.includes(DIAS_ICAL[candidata.getDay()]) && candidata > ahora) return candidata;
        }
        return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, hh, mm);
    }
    const dosDigitos = n => String(n).padStart(2, "0");
    function formatoIcal(d) {
        return `${d.getFullYear()}${dosDigitos(d.getMonth() + 1)}${dosDigitos(d.getDate())}T${dosDigitos(d.getHours())}${dosDigitos(d.getMinutes())}00`;
    }
    function fechasEvento(evento) {
        let inicio = primeraFecha(evento);
        let fin = new Date(inicio.getTime() + evento.minutos * 60000);
        return { inicio: formatoIcal(inicio), fin: formatoIcal(fin) };
    }
    const reglaSemanal = evento => `RRULE:FREQ=WEEKLY;BYDAY=${evento.dias.join(",")}`;
    // Escapa barras, comas y punto y coma, como pide el formato iCalendar
    const textoIcal = s => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");

    function descargarIcs(id) {
        let ev = EVENTOS[id];
        let txt = lista("eventos")[id];
        let f = fechasEvento(ev);
        let ahora = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        let lineas = [
            "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//HazteElTiempo.cl//Plan de accion//ES", "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            `UID:${id}-${Date.now()}@hazteeltiempo.cl`,
            `DTSTAMP:${ahora}`,
            `DTSTART:${f.inicio}`,
            `DTEND:${f.fin}`,
            reglaSemanal(ev),
            `SUMMARY:${textoIcal(txt.titulo)}`,
            `DESCRIPTION:${textoIcal(txt.detalle + " (HazteElTiempo.cl)")}`,
            "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT10M", `DESCRIPTION:${textoIcal(txt.titulo)}`, "END:VALARM",
            "END:VEVENT", "END:VCALENDAR", ""
        ];
        let blob = new Blob([lineas.join("\r\n")], { type: "text/calendar;charset=utf-8" });
        let enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `hazteeltiempo-${ev.archivo}.ics`;
        document.body.appendChild(enlace);
        enlace.click();
        setTimeout(() => { URL.revokeObjectURL(enlace.href); enlace.remove(); }, 1000);
    }

    function enlaceGoogle(id) {
        let ev = EVENTOS[id];
        let txt = lista("eventos")[id];
        let f = fechasEvento(ev);
        let params = {
            action: "TEMPLATE",
            text: txt.titulo,
            dates: `${f.inicio}/${f.fin}`,
            details: txt.detalle + " (HazteElTiempo.cl)",
            recur: reglaSemanal(ev),
            ctz: "America/Santiago"
        };
        let consulta = Object.entries(params).map(([k, v]) => k + "=" + encodeURIComponent(v)).join("&");
        return "https://calendar.google.com/calendar/render?" + consulta;
    }

    function pintarOpcionesCalendario(id, activo) {
        let $caja = $(`.calendario-opciones[data-mejora="${id}"]`);
        if (!activo) { $caja.prop("hidden", true); return; }
        $caja.html(`
            <span class="calendario-titulo"><i class="fa-regular fa-calendar-plus"></i> ${t("cal.titulo")}</span>
            <div class="calendario-botones">
                <button type="button" class="btn-cal btn-ics" data-mejora="${id}"><i class="fa-solid fa-download"></i> ${t("cal.ics")}</button>
                <a class="btn-cal" href="${enlaceGoogle(id)}" target="_blank" rel="noopener"><i class="fa-brands fa-google"></i> ${t("cal.google")}</a>
            </div>`).prop("hidden", false);
    }
    $("#pantalla-guia").on("click", ".btn-ics", function() { descargarIcs($(this).data("mejora")); });

    // --- Compartir con texto ya escrito ---
    // URL_SITIO: dirección pública del sitio. Pendiente mientras no esté publicado.
    const URL_SITIO = "";
    function direccionSitio() {
        if (URL_SITIO) return URL_SITIO;
        if (location.protocol.startsWith("http")) return location.origin + location.pathname;
        return "HazteElTiempo.cl";
    }
    function textoCompartir(red) {
        let resultado = respuestas.horas
            ? t("compartir.resultado", { nota: formatoNumero(puntajeTotal(respuestas), 1) })
            : t("compartir.sinResultado");
        return t(red === "ig" ? "compartir.textoIg" : "compartir.textoWs", { resultado: resultado, url: direccionSitio() });
    }

    $("#btn-compartir-ws").click(function() {
        window.open("https://wa.me/?text=" + encodeURIComponent(textoCompartir("ws")), "_blank", "noopener");
    });

    // Instagram no permite abrirse con un texto desde la web: se copia el texto para pegarlo
    // y, en celular, además se abre el menú de compartir del teléfono.
    $("#btn-compartir-ig").click(function() {
        let texto = textoCompartir("ig");
        $("#texto-compartir-ig").text(texto);
        if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
            navigator.share({ text: texto }).catch(() => {});
        }
        $("#aviso-compartir-ig").text(t("compartir.copia"));
        if (navigator.clipboard) {
            navigator.clipboard.writeText(texto)
                .then(() => $("#aviso-compartir-ig").text(t("compartir.copiado")))
                .catch(() => {});
        }
        $("#caja-compartir-ig").prop("hidden", false);
    });

    // --- 7. Reiniciar todo ---
    $("#btn-reiniciar").click(function() {
        // Apagar todos los interruptores
        $(".toggle-mejora").prop("checked", false);
        $(".calendario-opciones, #caja-compartir-ig").prop("hidden", true);

        // Respuestas y sliders a cero
        respuestas = {};
        historial = [];
        $(".opcion").removeClass("elegida");
        $("#grupo-trabajo").show();
        reiniciarSliders();
        $("#slider-bateria").val(50);
        pintarBateria(50);

        // Scroll top y esconder secciones
        $('html, body').animate({ scrollTop: 0 }, 500, function() {
            $("section").removeClass("seccion-activa").addClass("seccion-oculta");
            $("#pantalla-bienvenida").removeClass("seccion-oculta").addClass("seccion-activa");
        });
    });

    // Al cambiar de idioma: volver a escribir todo lo que arma el JS
    $(document).on("cambioIdioma", function() {
        pintarValoresSliders();
        pintarDona(leerHoras());
        actualizarAvance();
        if (respuestas.horas) {
            mostrarResultados(false);
            dibujarBarras();
        }
        $(".toggle-mejora:checked").each(function() { pintarOpcionesCalendario($(this).data("mejora"), true); });
        if (!$("#caja-compartir-ig").prop("hidden")) {
            $("#texto-compartir-ig").text(textoCompartir("ig"));
            $("#aviso-compartir-ig").text(t("compartir.copia"));
        }
    });
});

// =====================================================================
// --- 8. Explorar Chile: mapa por cantidad de estudiantes y ficha por región ---
// =====================================================================

// DATOS POR REGIÓN: PENDIENTES (los entrega el equipo).
// Mientras un valor sea null, la ficha muestra [DATO PENDIENTE] y el mapa queda gris.
//  estudiantes:     matrícula total de educación superior en la región (SIES)
//  estudiaYTrabaja: % de estudiantes que estudia y trabaja (CASEN 2022)
//  duermePoco:      % de estudiantes que duerme poco (ENUT 2023). Definir el corte, por ejemplo menos de 7 h
//  universidades, ip, cft: número de instituciones con sede en la región (SIES)
//  instituciones:   [ { nombre: "Universidad X", url: "https://..." }, ... ]
// Los servicios de apoyo estudiantil van en APOYO_ESTUDIANTIL (al inicio de este archivo).
const DATOS_REGIONES = {
    15: { 
        estudiantes: 17303,
        porcentajeNacional: 1.5,
        habitoClave: "Aprovechamiento del entorno costero y clima desértico-costero para pausas de estudio al aire libre.", 
        factorRiesgo: "Desplazamientos entre zonas extremas y adaptación al ritmo de la macrozona norte.", 
        tipBienestar: "Aprovechar la luz solar regular para establecer rutinas estables de estudio y descanso.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de Tarapacá", url: "https://www.uta.cl" }, { nombre: "Apoyo Estudiantil INACAP Arica", url: "https://www.inacap.cl" }] 
    }, // Arica y Parinacota (SIES 2025: 17.303 - 1,5%)
    1:  { 
        estudiantes: 20177,
        porcentajeNacional: 1.8,
        habitoClave: "Uso de los espacios costeros y playas como zonas de desconexión entre jornadas académicas.", 
        factorRiesgo: "Cargas de estudio concentradas en el entorno de zona franca e industrial.", 
        tipBienestar: "Integrar descansos visuales mirando al horizonte marino para mitigar el cansancio acumulado.", 
        apoyoEstudiantil: [{ nombre: "Bienestar Estudiantil UNAP", url: "https://www.unap.cl" }, { nombre: "DAE Santo Tomás Iquique", url: "https://www.santotomas.cl" }, { nombre: "Asuntos Estudiantiles INACAP", url: "https://www.inacap.cl" }] 
    }, // Tarapacá (SIES 2025: 20.177 - 1,8%)
    2:  { 
        estudiantes: 37214,
        porcentajeNacional: 3.3,
        habitoClave: "Organización de tiempos de estudio adaptados a la dinámica minero-industrial de la región.", 
        factorRiesgo: "Extensión de jornadas de estudio y trabajo en un entorno predominantemente árido y de alta exigencia.", 
        tipBienestar: "Mantener una alta hidratación y proteger los ambientes nocturnos de descanso.", 
        apoyoEstudiantil: [{ nombre: "DIDE UCN Antofagasta", url: "https://www.ucn.cl" }, { nombre: "DAE Universidad de Antofagasta", url: "https://www.uantof.cl" }] 
    }, // Antofagasta (SIES 2025: 37.214 - 3,3%)
    3:  { 
        estudiantes: 12819,
        porcentajeNacional: 1.1,
        habitoClave: "Estudio presencial y colaborador en campus integrados a valles desérticos.", 
        factorRiesgo: "Distancias entre comunas y aislamiento geográfico durante periodos de evaluaciones.", 
        tipBienestar: "Coordinar grupos de apoyo académico presenciales para fortalecer la red comunitaria.", 
        apoyoEstudiantil: [{ nombre: "Bienestar Estudiantil UDA", url: "https://www.uda.cl" }] 
    }, // Atacama (SIES 2025: 12.819 - 1,1%)
    4:  { 
        estudiantes: 46796,
        porcentajeNacional: 4.1,
        habitoClave: "Uso de patios universitarios y campus abiertos gracias al clima semiarido propicio.", 
        factorRiesgo: "Extensión de trayectos interurbanos entre La Serena, Coquimbo y el interior.", 
        tipBienestar: "Aprovechar las áreas verdes del entorno costero o de valles para hacer pausas de estudio.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de La Serena", url: "https://www.userena.cl" }, { nombre: "DAE UCN Coquimbo", url: "https://www.ucn.cl" }] 
    }, // Coquimbo (SIES 2025: 46.796 - 4,1%)
    5:  { 
        estudiantes: 125159,
        porcentajeNacional: 10.9,
        habitoClave: "Integración académica entre múltiples universidades y la activa vida de ciudad puerto y universitaria.", 
        factorRiesgo: "Complejidad en los trayectos por la geografía de cerros y la alta conectividad costera.", 
        tipBienestar: "Marcar un límite claro entre las actividades académicas y los momentos de recreación regional.", 
        apoyoEstudiantil: [{ nombre: "DAE PUCV", url: "https://www.pucv.cl" }, { nombre: "Dirección de Asuntos Estudiantiles UV", url: "https://www.uv.cl" }, { nombre: "Servicios de Salud UPLA", url: "https://www.upla.cl" }] 
    }, // Valparaíso (SIES 2025: 125.159 - 10,9%)
    13: { 
        estudiantes: 501447,
        porcentajeNacional: 43.8,
        habitoClave: "Uso eficiente del transporte metropolitano para la lectura o repaso de contenidos.", 
        factorRiesgo: "Estrés urbano acumulado debido a los largos tiempos de traslado en la gran capital.", 
        tipBienestar: "Aprovechar los traslados diarios para desconectar activamente con música o contenidos auditivos.", 
        apoyoEstudiantil: [{ nombre: "Salud Estudiantil UC", url: "https://www.uc.cl" }, { nombre: "Bienestar Estudiantil U. de Chile", url: "https://uchile.cl" }, { nombre: "DAE USACH", url: "https://www.usach.cl" }, { nombre: "DAE UDP", url: "https://www.udp.cl" }] 
    }, // Metropolitana (SIES 2025: 501.447 - 43,8%)
    6:  { 
        estudiantes: 31146,
        porcentajeNacional: 2.7,
        habitoClave: "Aprovechamiento de la calma del entorno agrourbano para jornadas de concentración focalizada.", 
        factorRiesgo: "Desplazamientos diarios entre comunas rurales y la capital regional.", 
        tipBienestar: "Separar espacios definidos en el hogar para evitar la mezcla entre estudio y descanso.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de O'Higgins", url: "https://www.uoh.cl" }] 
    }, // O'Higgins (SIES 2025: 31.146 - 2,7%)
    7:  { 
        estudiantes: 61470,
        porcentajeNacional: 5.4,
        habitoClave: "Pausas de descanso y estudio en las amplias áreas verdes que caracterizan los campus del centro-sur.", 
        factorRiesgo: "Fluctuaciones de temperatura estacionales que alteran el rendimiento o dinamismo diario.", 
        tipBienestar: "Caminar periódicamente por zonas arboladas para despejar la mente entre clases.", 
        apoyoEstudiantil: [{ nombre: "DVET Universidad de Talca", url: "https://www.utalca.cl" }, { nombre: "DAE UCM", url: "https://portal.ucm.cl" }] 
    }, // Maule (SIES 2025: 61.470 - 5,4%)
    16: { 
        estudiantes: 22772,
        porcentajeNacional: 2.0,
        habitoClave: "Organización de grupos de estudio en una zona de alta cercanía y vida estudiantil de pequeña escala.", 
        factorRiesgo: "Impacto del clima lluvioso e invernal en la movilidad cotidiana.", 
        tipBienestar: "Organizar espacios iluminados y templados para el trabajo académico en época de frío.", 
        apoyoEstudiantil: [{ nombre: "Dir. Desarrollo Estudiantil UBB Chillán", url: "https://www.ubiobio.cl" }] 
    }, // Ñuble (SIES 2025: 22.772 - 2,0%)
    8:  { 
        estudiantes: 124873,
        porcentajeNacional: 10.9,
        habitoClave: "Intensa vida universitaria integrada a campus con abundante vegetación y tradición académica.", 
        factorRiesgo: "Saturación por alta exigencia académica combinada con el clima húmedo y lluvioso.", 
        tipBienestar: "Mantener horarios de alimentación regulares durante las semanas de alta carga climática.", 
        apoyoEstudiantil: [{ nombre: "Dise Universidad de Concepción", url: "https://www.udec.cl" }, { nombre: "DAE UCSC", url: "https://www.ucsc.cl" }, { nombre: "DDE UBB Concepción", url: "https://www.ubiobio.cl" }] 
    }, // Biobío (SIES 2025: 124.873 - 10,9%)
    9:  { 
        estudiantes: 59171,
        porcentajeNacional: 5.2,
        habitoClave: "Estudio y encuentro estudiantil en recintos cerrados adaptados a la zona sur y multicultural.", 
        factorRiesgo: "Menor exposición a luz natural durante los periodos de otoño-invierno.", 
        tipBienestar: "Asegurar una ventilación adecuada en áreas de estudio con calefacción constante.", 
        apoyoEstudiantil: [{ nombre: "DGE Universidad de La Frontera", url: "https://www.ufro.cl" }, { nombre: "DAE UCT Temuco", url: "https://www.uct.cl" }] 
    }, // La Araucanía (SIES 2025: 59.171 - 5,2%)
    14: { 
        estudiantes: 28017,
        porcentajeNacional: 2.4,
        habitoClave: "Aprovechamiento del entorno natural y fluvial para equilibrar el estrés académico.", 
        factorRiesgo: "Continuidad de lluvias prolongadas que dificultan el movimiento al aire libre.", 
        tipBienestar: "Llevar un calendario visual para planificar las entregas durante días con clima adverso.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad Austral de Chile", url: "https://www.uach.cl" }] 
    }, // Los Ríos (SIES 2025: 28.017 - 2,4%)
    10: { 
        estudiantes: 44961,
        porcentajeNacional: 3.9,
        habitoClave: "Rutinas adaptadas al dinamismo insular, norpatagónico y costero de la región.", 
        factorRiesgo: "Aislamiento geográfico temporal por factores meteorológicos y de transporte marítimo/terrestre.", 
        tipBienestar: "Cumplir objetivos diarios graduados para evitar acumulación de tareas de última hora.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de Los Lagos", url: "https://www.ulagos.cl" }, { nombre: "DAE UACh Sede Puerto Montt", url: "https://www.uach.cl" }] 
    }, // Los Lagos (SIES 2025: 44.961 - 3,9%)
    11: { 
        estudiantes: 2795,
        porcentajeNacional: 0.2,
        habitoClave: "Fuerte trabajo colaborativo en comunidades estudiantiles reducidas y unidas de la Patagonia.", 
        factorRiesgo: "Condiciones climáticas extremas e insularidad que limitan la movilidad regular.", 
        tipBienestar: "Fomentar actividades compartidas para mantener el bienestar emocional en los meses más fríos.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de Aysén", url: "https://uaysen.cl" }] 
    }, // Aysén (SIES 2025: 2.795 - 0,2%)
    12: { 
        estudiantes: 7675,
        porcentajeNacional: 0.7,
        habitoClave: "Adaptación de los hábitos de estudio a las variaciones dramáticas de luz diurna durante el año.", 
        factorRiesgo: "Alteración de ciclos circadianos por las pocas horas de luz solar en invierno austral.", 
        tipBienestar: "Sostener horarios estrictos de sueño para regular los niveles de energía corporal.", 
        apoyoEstudiantil: [{ nombre: "DAE Universidad de Magallanes", url: "https://www.umag.cl" }] 
    }  // Magallanes (SIES 2025: 7.675 - 0,7%)
};

$(document).ready(function() {

    let regionActual = null;
    const hayDato = v => typeof v === "number" && !isNaN(v);
    const nombreRegion = codigo => t("region." + codigo);
    const pendiente = () => `<span class="pendiente">${t("explorar.pendiente")}</span>`;
    const miles = n => n.toLocaleString(idioma === "es" ? "es-CL" : "en-US");

    // Escala de color entre --mapa-min y --mapa-max (definidos en style.css).
    // Es logarítmica: la Región Metropolitana tiene muchos más estudiantes que el resto
    // y con una escala lineal casi todas las demás quedarían del mismo color.
    function colorCss(variable) {
        let hex = getComputedStyle(document.documentElement).getPropertyValue(variable).trim().replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        return [0, 2, 4].map(i => parseInt(hex.substr(i, 2), 16));
    }
    function colorEscala(valor, min, max) {
        let desde = colorCss("--mapa-min"), hasta = colorCss("--mapa-max");
        let t01 = (max === min) ? 0.5 : (Math.log(valor) - Math.log(min)) / (Math.log(max) - Math.log(min));
        let rgb = desde.map((c, i) => Math.round(c + (hasta[i] - c) * t01));
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    function pintarMapa() {
        let valores = Object.values(DATOS_REGIONES).map(r => r.estudiantes).filter(hayDato);
        let min = Math.min(...valores), max = Math.max(...valores);
        $("#mapa-sin-datos").prop("hidden", valores.length > 0);

        for (const [codigo, region] of Object.entries(DATOS_REGIONES)) {
            // Sin dato: color vacío que viene del CSS (--mapa-sin-dato)
            let color = hayDato(region.estudiantes) ? colorEscala(region.estudiantes, min, max) : "";
            $(`.region-mapa[data-region="${codigo}"]`).css("fill", color);
            $(`.item-region[data-region="${codigo}"] .muestra-color`).css("background", color);
        }
    }

   function mostrarRegion(codigo, desplazar) {
        regionActual = codigo;
        let r = DATOS_REGIONES[codigo];

        if (!r) return;

        // Resaltar en el mapa y en la lista
        $(".region-mapa").removeClass("activa");
        $(`.region-mapa[data-region="${codigo}"]`).addClass("activa").appendTo("#mapa-chile");
        $(".item-region").removeClass("activo");
        $(`.item-region[data-region="${codigo}"]`).addClass("activo");

        $("#ficha-vacia").prop("hidden", true);
        $("#ficha-contenido").prop("hidden", false);

        // Generar lista de enlaces de apoyo estudiantil
        let htmlApoyo = (r.apoyoEstudiantil && r.apoyoEstudiantil.length > 0)
            ? r.apoyoEstudiantil.map(item => `<li><a href="${item.url}" target="_blank" rel="noopener"><strong>${item.nombre}</strong> <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>`).join("")
            : `<li>${pendiente()}</li>`;

        let contenidoNuevo = `
            <h3 id="nombre-region" style="font-size: 1.5rem; margin-bottom: 15px; color: var(--primario);">${nombreRegion(codigo)}</h3>

            <div class="ficha-bloque">
                <h4><i class="fa-solid fa-user-graduate"></i> Cómo son los estudiantes</h4>
                <ul class="ficha-datos">
                    <li><span class="ficha-valor">${hayDato(r.estudiantes) ? miles(r.estudiantes) : pendiente()}</span> estudiantes de educación superior</li>
                    <li><span class="ficha-valor">${r.porcentajeNacional ? formatoNumero(r.porcentajeNacional, 1) + "%" : pendiente()}</span> de la matrícula nacional</li>
                </ul>
                <p class="ficha-fuente" style="font-size: 0.74rem; color: var(--texto-suave); margin-top: 0.6rem; margin-bottom: 0;">
                    <i class="fa-solid fa-book-bookmark"></i> <strong>Fuente oficial:</strong> SIES (Servicio de Información de Educación Superior, 2025) · Mineduc
                </p>
            </div>

            <div class="ficha-bloque">
                <h4><i class="fa-solid fa-brain"></i> Hábitos y Bienestar</h4>
                <p style="margin-bottom: 8px;"><strong>📌 Hábitos de estudio:</strong> ${r.habitoClave || pendiente()}</p>
                <p style="margin-bottom: 8px;"><strong>⚠️ Factor de riesgo/estrés:</strong> ${r.factorRiesgo || pendiente()}</p>
                <p style="margin-bottom: 8px;"><strong>💡 Tip de Bienestar:</strong> ${r.tipBienestar || pendiente()}</p>
            </div>

            <div class="ficha-bloque">
                <h4><i class="fa-solid fa-hand-holding-heart"></i> Dónde pedir apoyo</h4>
                <ul class="apoyo-instituciones" style="margin-bottom: 12px;">
                    ${htmlApoyo}
                </ul>
                <ul class="contactos-ayuda">
                    <li><i class="fa-solid fa-phone"></i> <span><strong>Salud Responde</strong> <a href="tel:6003607777">600 360 7777</a></span></li>
                    <li><i class="fa-solid fa-phone"></i> <span><strong>Línea <a href="tel:*4141">*4141</a></strong> del Minsal, gratuita, 24/7</span></li>
                </ul>
            </div>

            <button type="button" id="btn-explorar-test-nuevo" class="boton-primario" style="margin-top: 15px; width: 100%;">Compárate con tu región · Hacer el test</button>
        `;

        $("#ficha-contenido").html(contenidoNuevo);

        // Evento para activar el botón del test dentro de la ficha inyectada
        $("#btn-explorar-test-nuevo").click(function() {
            mostrarSeccion("#pantalla-contexto");
        });

        // En celular desplaza la vista hacia la ficha
        if (desplazar && window.matchMedia("(max-width: 900px)").matches) {
            $("html, body").animate({
                scrollTop: $("#ficha-region").offset().top - parseInt(getComputedStyle(document.documentElement).getPropertyValue("--alto-header") || 0) - 12
            }, 500);
        }
    }


    function htmlEnlaces(titulo, enlaces) {
        if (!enlaces || !enlaces.length) return `<p>${titulo} ${pendiente()}</p>`;
        let items = enlaces.map(e => `<li><a href="${e.url}" target="_blank" rel="noopener">${e.nombre} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>`).join("");
        return `<p>${titulo}</p><ul>${items}</ul>`;
    }

    // Clic en el mapa o en la lista
    $("#mapa-chile").on("click", ".region-mapa", function() {
        mostrarRegion($(this).data("region"), true);
    });
    $("#mapa-chile").on("keydown", ".region-mapa", function(e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mostrarRegion($(this).data("region"), true); }
    });
    $(".item-region").click(function() {
        mostrarRegion($(this).data("region"), true);
    });

    // Tooltip al pasar el cursor: cantidad de estudiantes de la región
    $("#mapa-chile").on("mousemove", ".region-mapa", function(e) {
        let codigo = $(this).data("region");
        let r = DATOS_REGIONES[codigo];
        let n = r ? r.estudiantes : null;
        let pct = r && r.porcentajeNacional ? (" (" + formatoNumero(r.porcentajeNacional, 1) + "% nacional)") : "";
        let texto = hayDato(n)
            ? (nombreRegion(codigo) + ": " + miles(n) + " estudiantes" + pct)
            : `${nombreRegion(codigo)}: ${t("explorar.pendiente")}`;
        let caja = $(".columna-mapa")[0].getBoundingClientRect();
        $("#tooltip-mapa")
            .text(texto)
            .css({ left: e.clientX - caja.left, top: e.clientY - caja.top })
            .removeClass("oculta-tooltip");
    });
    $("#mapa-chile").on("mouseleave", ".region-mapa", function() {
        $("#tooltip-mapa").addClass("oculta-tooltip");
    });

    $(document).on("cambioIdioma", function() {
        if (regionActual !== null) mostrarRegion(regionActual, false);
    });

    pintarMapa();
});

// =====================================================================
// --- 9. Vive un día: recorrido horizontal de 08:00 a 07:00 ---
// La sección queda fija (pin de ScrollTrigger) y el scroll vertical mueve el día hacia el lado.
// Capas: cielo (degradé por código), cordillera (lenta), ciudad (media) y calle (rápida).
// Reemplaza al recorrido con scroll vertical, que quedó comentado más abajo.
// =====================================================================
$(document).ready(function() {
    const $seccion = $("#pantalla-vive");
    if (!$seccion.length || !$("#vd-recorrido").length) return;

    const CARPETA = "img/dia/";
    // Proporción de cada imagen (ancho, alto). Los rectángulos provisorios usan la misma.
    const TAM = { cordillera: [2400, 800], ciudad: [2400, 800], escenario: [1500, 1000], personaje: [600, 900] };
    const MIN_TOTAL = 1380;   // de 08:00 a 07:00 del día siguiente, en minutos
    const MIN_NOCHE = 810;    // 21:30, preparación para dormir
    const VELOCIDAD = { cordillera: 0.12, ciudad: 0.35, calle: 1 };

    // Paradas del día: textos del arreglo "momentos" de textos.js (mismo orden)
    const PARADAS_DIA = [
        { hora: "08:00", min: 0, momento: 0, ejemplo: true, iconoBien: "fa-headphones", iconoMal: "fa-mobile-screen" },
        { hora: "10:30", min: 150, momento: 1, iconoBien: "fa-list-check", iconoMal: "fa-bell" },
        { hora: "13:30", min: 330, momento: 2, ejemplo: true, iconoBien: "fa-utensils", iconoMal: "fa-laptop" },
        { hora: "16:00", min: 480, momento: 4, iconoBien: "fa-person-running", iconoMal: "fa-couch", horaImagen: "1930" },
        { hora: "21:00", min: 780, momento: 5, iconoBien: "fa-guitar", iconoMal: "fa-mobile-screen" }
    ];
    // Se agrega solo si existe img/dia-1800.jpg (textos en "momentoTrabajo")
    const PARADA_TRABAJO = { hora: "18:00", min: 600, trabajo: true, ejemplo: true, iconoBien: "fa-calendar-days", iconoMal: "fa-battery-quarter" };
    // Paradas de la noche: textos en "noche" de textos.js. "sueno" = horas dormidas hasta esa hora.
    const PARADAS_NOCHE = [
        { hora: "21:30", min: 810, noche: 0, sueno: {"bien":0,"mal":0}, fuente: {"bien":"","mal":"vd.fuentePantalla"}, iconoBien: "fa-book-open", iconoMal: "fa-mobile-screen", horaImagen: "2300" },
        { hora: "22:00", min: 840, noche: 1, sueno: {"bien":0,"mal":0}, fuente: {"bien":"vd.fuenteNoche","mal":"vd.fuentePantalla"}, iconoBien: "fa-bed", iconoMal: "fa-mobile-screen", horaImagen: "2330" },
        { hora: "00:30", min: 990, noche: 2, sueno: {"bien":2.5,"mal":0}, fuente: {"bien":"vd.fuenteNoche","mal":"vd.fuentePantalla"}, iconoBien: "fa-moon", iconoMal: "fa-mobile-screen" },
        { hora: "02:00", min: 1080, noche: 3, sueno: {"bien":4,"mal":0}, fuente: {"bien":"vd.fuenteNoche","mal":""}, iconoBien: "fa-moon", iconoMal: "fa-bed" },
        { hora: "04:30", min: 1230, noche: 4, sueno: {"bien":6.5,"mal":2.5}, fuente: {"bien":"vd.fuenteNoche","mal":"vd.fuenteNoche"}, iconoBien: "fa-cloud-moon", iconoMal: "fa-bed" },
        { hora: "07:00", min: 1380, noche: 5, sueno: {"bien":9,"mal":5}, fuente: {"bien":"vd.fuenteNoche","mal":"vd.fuenteNoche"}, iconoBien: "fa-sun", iconoMal: "fa-clock" }
    ];

    // Cielo: colores (variables de :root) en distintas horas; entre ellas se mezclan
    const CIELO = [[0, "0800"], [330, "1330"], [480, "1600"], [690, "1930"], [780, "2100"],
                   [900, "2300"], [1080, "0200"], [1290, "0530"], [1380, "0700"]];
    // Cuánto se oscurecen la cordillera y la ciudad según la hora (0 = nada)
    const OSCURIDAD = [[0, 0], [690, 0.05], [780, 0.3], [900, 0.5], [1080, 0.62], [1290, 0.45], [1380, 0.05]];

    // Hipnograma (ilustrativo): minutos desde las 21:30. Fases: d despierto, l liviano, r REM, p profundo.
    const CICLOS = {
        bien: { despierta: 30, ciclos: [
            [["l",15],["p",45],["l",15],["r",15]],
            [["l",15],["p",35],["l",20],["r",20]],
            [["l",20],["p",20],["l",25],["r",25]],
            [["l",25],["p",10],["l",25],["r",30]],
            [["l",25],["p",5],["l",25],["r",35]],
            [["l",25],["p",5],["l",25],["r",35]]
        ] },
        mal: { despierta: 270, ciclos: [
            [["l",15],["p",45],["l",15],["r",15]],
            [["l",15],["p",35],["l",20],["r",20]],
            [["l",20],["p",25],["l",20],["r",55]]
        ] }
    };
    const NIVEL = { d: 0, l: 1, r: 2, p: 3 };
    // Batería (ilustrativa): parte en 20% y se carga mientras duerme
    const BATERIA = { bien: {"duerme":840,"llega":95}, mal: {"duerme":1080,"llega":55} };

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paradas = PARADAS_DIA.concat(PARADAS_NOCHE);
    let modo = "bien";
    let actual = -1;           // parada activa
    let pos = 0;               // posición en el recorrido (índice con decimales)
    let anchoParada = 0;
    let disparador = null;     // ScrollTrigger
    let construido = false;
    let tarjetaAbierta = -1;
    let coloresCielo = null;
    let hipno = { puntos: [], largos: [], total: 0, animando: false };

    const esNoche = p => p.noche !== undefined;
    const hhmm = p => p.horaImagen || p.hora.replace(":", "");
    const limitar01 = n => Math.max(0, Math.min(1, n));

    // ---------- Imágenes (o rectángulo provisorio si falta el archivo) ----------
    function imagen(nombre, tam, clase) {
        let $caja = $(`<div class="vd-img ${clase || ""}" style="aspect-ratio: ${tam[0]} / ${tam[1]}" data-archivo="${CARPETA + nombre}"></div>`);
        let img = new Image();
        img.alt = "";
        img.onload = function() { $caja.addClass("cargada"); };
        img.onerror = function() {
            $caja.addClass("vd-falta").empty().append(`<span>${t("vive.falta", { archivo: CARPETA + nombre })}</span>`);
        };
        img.src = CARPETA + nombre;
        $caja.append(img);
        return $caja;
    }

    // ---------- Textos de una parada en el idioma y la versión actuales ----------
    function textosParada(p) {
        if (esNoche(p)) {
            let n = lista("noche")[p.noche], v = n[modo];
            return {
                titulo: n.titulo, dato: formatoNumero(p.sueno[modo]) + " h", nota: t("vd.deSueno"),
                frase: v.frase, linea: "", detalle: v.detalle,
                fuente: p.fuente[modo] ? t(p.fuente[modo]) : "", ejemplo: false
            };
        }
        let m = p.trabajo ? lista("momentoTrabajo") : lista("momentos")[p.momento];
        return {
            titulo: m.titulo, dato: m.dato, nota: "", frase: m.texto, linea: m[modo].titulo,
            detalle: m[modo].lista, fuente: m.fuente, ejemplo: !!p.ejemplo
        };
    }

    // ---------- Construcción ----------
    function construir() {
        if (!paradas.length) return;
        construido = true;
        $seccion.toggleClass("vd-reducido", reducido || typeof gsap === "undefined");
        if (reducido || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            construirLista();
            return;
        }

        let $calle = $("#vd-calle").empty();
        paradas.forEach((p, i) => {
            let escenario = esNoche(p) ? "escenario-dormitorio.png" : `escenario-${hhmm(p)}.png`;
            let $p = $(`<div class="vd-parada ${esNoche(p) ? "es-noche" : ""}" data-i="${i}"></div>`);
            $p.append('<div class="vd-suelo"></div>');
            $p.append(imagen(escenario, TAM.escenario, "vd-escenario"));
            $p.append(`<span class="vd-objeto" data-version="bien"><i class="fa-solid ${p.iconoBien}"></i></span>`);
            $p.append(`<span class="vd-objeto" data-version="mal"><i class="fa-solid ${p.iconoMal}"></i></span>`);
            $p.append(`
                <button type="button" class="vd-info" data-i="${i}">
                    <span class="vd-hora">${p.hora}</span>
                    <span class="vd-dato"></span>
                    <span class="vd-nota"></span>
                    <span class="vd-frase"></span>
                    <span class="vd-linea"></span>
                    <span class="vd-ver-mas"></span>
                </button>`);
            $calle.append($p);
        });

        // Barra del día
        let $puntos = $("#vd-barra-puntos").empty();
        paradas.forEach((p, i) => {
            $puntos.append(`<li style="left: ${p.min / MIN_TOTAL * 100}%"><button type="button" class="vd-barra-punto" data-i="${i}"><span>${p.hora}</span></button></li>`);
        });
        $(".vd-barra-noche").css("left", MIN_NOCHE / MIN_TOTAL * 100 + "%");

        leerColoresCielo();
        pintarTextos();
        medir();
        crearDesplazamiento();
        aplicar(0);
        activarDeslizamientoTactil();
    }

    // Tiras de cordillera y ciudad: suficientes copias para cubrir todo el recorrido
    function llenarTira(selector, nombre, velocidad) {
        let $tira = $(`${selector} .vd-tira`).empty();
        let alto = $(selector).height();
        let anchoCopia = alto * TAM[nombre][0] / TAM[nombre][1];
        let necesario = $(window).width() * 1.2 + velocidad * (paradas.length - 1) * anchoParada;
        let copias = Math.max(1, Math.ceil(necesario / anchoCopia) + 1);
        for (let i = 0; i < copias; i++) $tira.append(imagen(nombre + ".png", TAM[nombre], "vd-copia"));
    }

    function medir() {
        anchoParada = $(".vd-parada").first().outerWidth() || $(window).width();
        llenarTira("#capa-cordillera", "cordillera", VELOCIDAD.cordillera);
        llenarTira("#capa-ciudad", "ciudad", VELOCIDAD.ciudad);
        construirHipnograma();
    }

    function crearDesplazamiento() {
        gsap.registerPlugin(ScrollTrigger);
        let proxy = { pos: 0 };
        let tween = gsap.to(proxy, {
            pos: paradas.length - 1,
            ease: "none",
            onUpdate: () => aplicar(proxy.pos),
            scrollTrigger: {
                trigger: "#vd-recorrido",
                pin: true,
                start: "top top",
                end: () => "+=" + Math.round((paradas.length - 1) * anchoParada * 0.9),
                scrub: 0.6,
                invalidateOnRefresh: true,
                onRefreshInit: medir
            }
        });
        disparador = tween.scrollTrigger;
    }

    // ---------- Lo que cambia con el scroll ----------
    function minutosEn(p) {
        let i = Math.floor(p), f = p - i;
        if (i >= paradas.length - 1) return paradas[paradas.length - 1].min;
        return paradas[i].min + f * (paradas[i + 1].min - paradas[i].min);
    }

    let pararCaminar = null;
    function aplicar(nuevaPos) {
        let cambio = Math.abs(nuevaPos - pos) > 0.0005;
        pos = nuevaPos;
        let x = -pos * anchoParada;
        $("#vd-calle")[0].style.transform = `translate3d(${x * VELOCIDAD.calle}px, 0, 0)`;
        $("#capa-ciudad .vd-tira")[0].style.transform = `translate3d(${x * VELOCIDAD.ciudad}px, 0, 0)`;
        $("#capa-cordillera .vd-tira")[0].style.transform = `translate3d(${x * VELOCIDAD.cordillera}px, 0, 0)`;

        let min = minutosEn(pos);
        pintarCielo(min);

        let activa = Math.round(pos);
        if (activa !== actual) cambiarParada(activa);

        let deNoche = min >= MIN_NOCHE - 20;
        $("#vd-hipnograma, #vd-bateria").toggleClass("visible", deNoche);
        if (!hipno.animando) dibujarHipnograma(min);
        pintarBateria(min);

        $("#vd-barra-marca").css("left", min / MIN_TOTAL * 100 + "%");
        $("#vd-pista").toggleClass("oculta-pista", pos > 0.05);

        if (cambio) {
            $("#vd-personaje").addClass("caminando");
            clearTimeout(pararCaminar);
            pararCaminar = setTimeout(() => $("#vd-personaje").removeClass("caminando"), 180);
        }
    }

    function cambiarParada(i) {
        actual = i;
        $(".vd-barra-punto").removeClass("activo").filter(`[data-i="${i}"]`).addClass("activo");
        $(".vd-parada").removeClass("activa").filter(`[data-i="${i}"]`).addClass("activa");
        mostrarPersonaje(false);
        if (tarjetaAbierta !== -1 && tarjetaAbierta !== i) cerrarTarjeta();
    }

    // Personaje: dos capas que se cruzan con un fundido
    let personajeActual = "";
    function mostrarPersonaje(forzar) {
        let p = paradas[actual];
        if (!p) return;
        let nombre = `personaje-${hhmm(p)}-${modo}.png`;
        if (nombre === personajeActual && !forzar) return;
        personajeActual = nombre;
        let $slots = $("#vd-personaje .vd-pj-slot");
        let $siguiente = $slots.not(".activo").first();
        $siguiente.empty().append(imagen(nombre, TAM.personaje, "vd-pj-img"));
        $slots.removeClass("activo");
        $siguiente.addClass("activo");
    }

    // ---------- Cielo ----------
    function hexARgb(hex) {
        hex = hex.trim().replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        return [0, 2, 4].map(i => parseInt(hex.substr(i, 2), 16));
    }
    function leerColoresCielo() {
        let estilo = getComputedStyle(document.documentElement);
        coloresCielo = CIELO.map(([min, clave]) => ({
            min: min,
            arriba: hexARgb(estilo.getPropertyValue(`--vd-cielo-${clave}-arriba`)),
            abajo: hexARgb(estilo.getPropertyValue(`--vd-cielo-${clave}-abajo`))
        }));
    }
    function interpolar(tabla, min, valor) {
        for (let i = 0; i < tabla.length - 1; i++) {
            let a = tabla[i], b = tabla[i + 1];
            let ma = a.min !== undefined ? a.min : a[0], mb = b.min !== undefined ? b.min : b[0];
            if (min <= mb) return valor(a, b, limitar01((min - ma) / (mb - ma)));
        }
        let u = tabla[tabla.length - 1];
        return valor(u, u, 0);
    }
    const mezcla = (c1, c2, f) => c1.map((c, i) => Math.round(c + (c2[i] - c) * f));
    function pintarCielo(min) {
        let [arriba, abajo] = interpolar(coloresCielo, min, (a, b, f) => [mezcla(a.arriba, b.arriba, f), mezcla(a.abajo, b.abajo, f)]);
        $("#vd-cielo")[0].style.background = `linear-gradient(to bottom, rgb(${arriba}), rgb(${abajo}))`;
        let osc = interpolar(OSCURIDAD, min, (a, b, f) => a[1] + (b[1] - a[1]) * f);
        $("#vd-recorrido")[0].style.setProperty("--vd-oscuridad", osc.toFixed(3));
    }

    // ---------- Hipnograma ----------
    function fasesDe(version) {
        let c = CICLOS[version], fases = [["d", 0]], tiempo = c.despierta;
        c.ciclos.forEach(ciclo => ciclo.forEach(([fase, dur]) => { fases.push([fase, tiempo]); tiempo += dur; }));
        fases.push(["d", MIN_TOTAL - MIN_NOCHE]);
        return fases;
    }
    function construirHipnograma() {
        let $svg = $("#vd-hipnograma svg");
        let ancho = Math.max(100, $svg.width()), alto = Math.max(40, $svg.height());
        $svg.attr("viewBox", `0 0 ${ancho} ${alto}`);
        let y = n => 6 + n * (alto - 12) / 3;
        $svg.find(".vd-hipno-guia").each(function(n) { $(this).attr({ x1: 0, x2: ancho, y1: y(n), y2: y(n) }); });

        // Escalera: horizontal hasta el inicio de la fase siguiente, luego vertical
        let fases = fasesDe(modo), puntos = [];
        fases.forEach(([fase, min], k) => {
            let px = min / (MIN_TOTAL - MIN_NOCHE) * ancho;
            if (k === 0) puntos.push([px, y(NIVEL[fase])]);
            else { puntos.push([px, puntos[puntos.length - 1][1]]); puntos.push([px, y(NIVEL[fase])]); }
        });
        let largos = [0];
        for (let i = 1; i < puntos.length; i++) {
            largos.push(largos[i - 1] + Math.hypot(puntos[i][0] - puntos[i - 1][0], puntos[i][1] - puntos[i - 1][1]));
        }
        hipno.puntos = puntos; hipno.largos = largos; hipno.total = largos[largos.length - 1]; hipno.ancho = ancho;
        let linea = document.getElementById("vd-hipno-linea");
        linea.setAttribute("d", "M" + puntos.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L"));
        linea.style.strokeDasharray = hipno.total;
    }
    // Largo de la línea hasta cierta hora (para dibujarla a medida que avanza la noche)
    function largoHasta(min) {
        let px = limitar01((min - MIN_NOCHE) / (MIN_TOTAL - MIN_NOCHE)) * hipno.ancho;
        let p = hipno.puntos, l = hipno.largos;
        for (let i = 1; i < p.length; i++) {
            if (p[i][0] > px) return l[i - 1] + Math.max(0, px - p[i - 1][0]);
        }
        return hipno.total;
    }
    function dibujarHipnograma(min, largo) {
        let hecho = largo !== undefined ? largo : largoHasta(min);
        document.getElementById("vd-hipno-linea").style.strokeDashoffset = hipno.total - hecho;
    }
    // Al cambiar el interruptor, la línea nueva se dibuja desde el inicio hasta la hora actual.
    // Dura ~0,9 s; pase lo que pase, al segundo vuelve al dibujo normal.
    function redibujarHipnograma() {
        construirHipnograma();
        clearTimeout(hipno.fin);
        let terminar = () => { hipno.animando = false; dibujarHipnograma(minutosEn(pos)); };
        if (typeof gsap === "undefined") { terminar(); return; }
        hipno.animando = true;
        let proxy = { f: 0 };
        gsap.to(proxy, { f: 1, duration: 0.9, ease: "power2.out",
            onUpdate: () => { if (hipno.animando) dibujarHipnograma(0, proxy.f * largoHasta(minutosEn(pos))); },
            onComplete: terminar });
        hipno.fin = setTimeout(terminar, 1000);
    }

    // ---------- Batería ----------
    function nivelBateria(min, version) {
        let b = BATERIA[version];
        return Math.round(20 + (b.llega - 20) * limitar01((min - b.duerme) / (MIN_TOTAL - b.duerme)));
    }
    function pintarBateria(min) {
        let nivel = nivelBateria(min, modo);
        let color = nivel < 30 ? "var(--estado-atencion)" : (nivel < 60 ? "var(--estado-mejorar)" : "var(--estado-bien)");
        $("#vd-bateria-nivel").css({ width: nivel + "%", background: color });
    }

    // ---------- Textos ----------
    function pintarTextos() {
        $(".vd-parada").each(function() {
            let i = $(this).data("i"), txt = textosParada(paradas[i]);
            let $info = $(this).find(".vd-info");
            $info.find(".vd-dato").text(txt.dato);
            $info.find(".vd-nota").text(txt.nota).toggle(!!txt.nota);
            $info.find(".vd-frase").text(txt.frase);
            $info.find(".vd-linea").html(txt.linea ? `<i class="fa-solid ${modo === "bien" ? "fa-check" : "fa-xmark"}"></i> ${txt.linea}` : "").toggle(!!txt.linea);
            $info.find(".vd-ver-mas").html(`${t("vd.verMas")} <i class="fa-solid fa-plus"></i>`);
        });
        $(".vd-barra-punto").each(function() {
            this.setAttribute("aria-label", t("vd.irA", { hora: paradas[$(this).data("i")].hora }));
        });
        $(".vd-falta").each(function() {
            $(this).find("span").text(t("vive.falta", { archivo: $(this).data("archivo") }));
        });
        if (tarjetaAbierta !== -1) llenarTarjeta(tarjetaAbierta);
        if ($seccion.hasClass("vd-reducido")) construirLista();
    }

    // ---------- Tarjeta de detalle ----------
    function htmlDetalle(i) {
        let p = paradas[i], txt = textosParada(p);
        return `
            <p class="vd-t-hora">${p.hora} · ${txt.titulo}</p>
            <p class="vd-t-dato">${txt.dato} ${txt.nota ? `<small>${txt.nota}</small>` : ""}</p>
            <p class="vd-t-frase">${txt.frase}</p>
            ${txt.linea ? `<h4><i class="fa-solid ${modo === "bien" ? "fa-check" : "fa-xmark"}"></i> ${txt.linea}</h4>` : ""}
            <ul>${txt.detalle.map(d => `<li>${d}</li>`).join("")}</ul>
            ${txt.ejemplo ? `<span class="vd-t-ejemplo">${t("vive.ejemplo")}</span>` : ""}
            ${txt.fuente ? `<p class="vd-t-fuente">${t("vive.fuente", { fuente: txt.fuente })}</p>` : ""}`;
    }
    function llenarTarjeta(i) { $("#vd-tarjeta-contenido").html(htmlDetalle(i)); }
    function abrirTarjeta(i) {
        tarjetaAbierta = i;
        llenarTarjeta(i);
        let $t = $("#vd-tarjeta").prop("hidden", false);
        requestAnimationFrame(() => $t.addClass("abierta"));
    }
    function cerrarTarjeta() {
        tarjetaAbierta = -1;
        let $t = $("#vd-tarjeta").removeClass("abierta");
        setTimeout(() => { if (tarjetaAbierta === -1) $t.prop("hidden", true); }, 300);
    }
    $seccion.on("click", ".vd-info", function() {
        let i = $(this).data("i");
        if (tarjetaAbierta === i) cerrarTarjeta(); else abrirTarjeta(i);
    });
    $("#vd-tarjeta-cerrar").on("click", cerrarTarjeta);
    $(document).on("keydown", e => { if (e.key === "Escape" && tarjetaAbierta !== -1) cerrarTarjeta(); });

    // ---------- Barra del día: saltar a una parada ----------
    function irAParada(i) {
        if (!disparador) return;
        let destino = disparador.start + (i / (paradas.length - 1)) * (disparador.end - disparador.start);
        window.scrollTo({ top: destino, behavior: "smooth" });
    }
    $seccion.on("click", ".vd-barra-punto", function() { irAParada($(this).data("i")); });

    // ---------- Interruptor de hábitos (no reinicia ni mueve el scroll) ----------
    $seccion.on("click", ".vd-modo-btn", function() {
        let nuevo = $(this).data("modo");
        if (nuevo === modo) return;
        modo = nuevo;
        $seccion.removeClass("modo-bien modo-mal").addClass("modo-" + modo);
        $seccion.find(".vd-modo-btn").removeClass("activo").attr("aria-checked", "false")
            .filter(`[data-modo="${modo}"]`).addClass("activo").attr("aria-checked", "true");
        if ($seccion.hasClass("vd-reducido")) { construirLista(); return; }
        pintarTextos();
        mostrarPersonaje(true);
        redibujarHipnograma();
        pintarBateria(minutosEn(pos));
    });

    // ---------- Celular: deslizar el dedo hacia el lado también avanza ----------
    function activarDeslizamientoTactil() {
        let el = document.getElementById("vd-recorrido"), x0 = null, y0 = null;
        el.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
        el.addEventListener("touchmove", e => {
            if (x0 === null) return;
            let dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
                e.preventDefault();
                window.scrollBy(0, -dx * 1.4);
                x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
            }
        }, { passive: false });
        el.addEventListener("touchend", () => { x0 = null; }, { passive: true });
    }

    // ---------- Sin animaciones (prefers-reduced-motion o sin GSAP): una parada debajo de otra ----------
    function construirLista() {
        let $lista = $("#vd-lista").prop("hidden", false).empty();
        $("#vd-recorrido").prop("hidden", true);
        $lista.append(`
            <div class="vd-modo vd-modo-lista" role="radiogroup" aria-label="${t("vd.modoAria")}">
                <button type="button" class="vd-modo-btn ${modo === "bien" ? "activo" : ""}" data-modo="bien" role="radio" aria-checked="${modo === "bien"}"><i class="fa-solid fa-check"></i> ${t("vd.modoBien")}</button>
                <button type="button" class="vd-modo-btn ${modo === "mal" ? "activo" : ""}" data-modo="mal" role="radio" aria-checked="${modo === "mal"}"><i class="fa-solid fa-xmark"></i> ${t("vd.modoMal")}</button>
            </div>`);
        paradas.forEach((p, i) => {
            let $item = $(`<article class="vd-lista-item ${esNoche(p) ? "es-noche" : ""}"></article>`);
            $item.append(imagen(`personaje-${hhmm(p)}-${modo}.png`, TAM.personaje, "vd-lista-pj"));
            $item.append(`<div class="vd-lista-texto">${htmlDetalle(i)}</div>`);
            $lista.append($item);
        });
    }

    // ---------- Arranque: se construye la primera vez que se abre la sección ----------
    function alMostrar() {
        if (!$seccion.hasClass("seccion-activa")) {
            if (disparador) disparador.disable();
            return;
        }
        if (!construido) {
            construir();
            setTimeout(() => { if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); }, 80);
            return;
        }
        if (disparador) {
            disparador.enable();
            setTimeout(() => { if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); }, 80);
        }
    }
    new MutationObserver(alMostrar).observe($seccion[0], { attributes: true, attributeFilter: ["class"] });

    $(document).on("cambioIdioma", function() {
        if (!construido) return;
        pintarTextos();
    });

    // Paradas: día (+ 18:00 si existe su imagen) y noche
    let prueba = new Image();
    prueba.onload = () => { paradas = PARADAS_DIA.slice(0, 4).concat([PARADA_TRABAJO], PARADAS_DIA.slice(4), PARADAS_NOCHE); alMostrar(); };
    prueba.onerror = () => { paradas = PARADAS_DIA.concat(PARADAS_NOCHE); alMostrar(); };
    // Formulario de sugerencias (Formspree)
    const $formSugerencias = $("#suggestion-form");
    if ($formSugerencias.length) {
        $formSugerencias.on("submit", function(e) {
            e.preventDefault();
            const formEl = this;
            const data = new FormData(formEl);
            fetch(formEl.action, {
                method: "POST",
                body: data,
                headers: { "Accept": "application/json" }
            }).then(function(res) {
                if (res.ok) {
                    $("#form-container").hide();
                    $("#success-message").css("display", "flex");
                    formEl.reset();
                } else {
                    alert("Hubo un problema al enviar la sugerencia. Por favor intenta más tarde.");
                }
            }).catch(function() {
                alert("Error de conexión. Verifica tu red e intenta de nuevo.");
            });
        });
    }
    $("#btn-otra-sugerencia").click(function() {
        $("#success-message").hide();
        $("#form-container").show();
    });

    prueba.src = "img/dia-1800.jpg";
});

/* =====================================================================
   VERSIÓN ANTERIOR de Vive un día (scroll vertical con tarjeta central).
   La REEMPLAZA la sección 9 de arriba (recorrido horizontal). Se deja comentada como referencia.
   ===================================================================== */
/*
// =====================================================================
// --- 9. Vive un día: recorrido ilustrado con scroll ---
// =====================================================================
$(document).ready(function() {

    // Cada momento usa como fondo la ilustración "img/dia-HHMM.jpg"
    // (por ejemplo img/dia-2300.jpg). Mientras no exista, se ve un fondo provisorio.
    // "ejemplo: true" marca los datos que hay que reemplazar por el valor real.
    // Los textos de cada momento están en textos.js ("momentos"), en el mismo orden.
    const MOMENTOS = [
        { archivo: "dia-0800.jpg", hora: "08:00", ejemplo: true, cielo: ["#fbcfe8", "#fed7aa"], iconoMal: "fa-mobile-screen", iconoBien: "fa-headphones" },
        { archivo: "dia-1030.jpg", hora: "10:30", cielo: ["#bae6fd", "#e0f2fe"], iconoMal: "fa-bell", iconoBien: "fa-list-check" },
        { archivo: "dia-1330.jpg", hora: "13:30", ejemplo: true, cielo: ["#7dd3fc", "#bae6fd"], iconoMal: "fa-laptop", iconoBien: "fa-utensils" },
        { archivo: "dia-1600.jpg", hora: "16:00", cielo: ["#bae6fd", "#fde68a"], iconoMal: "fa-hourglass-end", iconoBien: "fa-list-check" },
        { archivo: "dia-1930.jpg", hora: "19:30", cielo: ["#fb7185", "#1e3a8a"], iconoMal: "fa-couch", iconoBien: "fa-person-running" },
        { archivo: "dia-2100.jpg", hora: "21:00", cielo: ["#1e3a8a", "#0b1a45"], iconoMal: "fa-mobile-screen", iconoBien: "fa-guitar" },
        { archivo: "dia-2300.jpg", hora: "23:00", cielo: ["#0b1a45", "#1e3a8a"], iconoMal: "fa-mobile-screen", iconoBien: "fa-book-open" },
        { archivo: "dia-0030.jpg", hora: "00:30", cielo: ["#0f172a", "#0b1a45"], iconoMal: "fa-mobile-screen", iconoBien: "fa-bed" },
        { archivo: "dia-0030.jpg", hora: "02:00", estilo: "madrugada", cielo: ["#0f172a", "#0f172a"], iconoMal: "fa-mobile-screen", iconoBien: "fa-moon",
          barras: [ { horas: 7.5, tipo: "bien" }, { horas: 5, tipo: "mal" } ] }
    ];

    // Etapa de las 18:00 (Trabajo): se activa al tener la ilustración img/dia-1800.jpg.
    // Para usarla:
    //  1. Pega esta línea en MOMENTOS, entre la de las 16:00 y la de las 19:30:
    //     { archivo: "dia-1800.jpg", hora: "18:00", ejemplo: true, cielo: ["#fdba74", "#fb7185"], iconoMal: "fa-battery-quarter", iconoBien: "fa-calendar-days" },
    //  2. En textos.js, copia "momentoTrabajo" dentro de "momentos" en la misma posición (en es y en).

    const CARPETA = "img/";
    const $seccion = $("#dia-scroll");
    if (!$seccion.length) return;

    // Momento con sus textos en el idioma actual
    function momento(i) {
        return Object.assign({}, MOMENTOS[i], lista("momentos")[i]);
    }

    // Fondos (ilustración o fondo provisorio) y puntos de la línea del día
    MOMENTOS.forEach((m, i) => {
        let fondo = $(`
            <div class="dia-fondo ${m.estilo || ""}" data-i="${i}" style="background-image:url('${CARPETA + m.archivo}')">
                <img src="${CARPETA + m.archivo}" alt="">
                <div class="dia-velo"></div>
            </div>`);
        fondo.find("img").on("error", function() {
            fondo.addClass("provisorio").css("background", `linear-gradient(to bottom, ${m.cielo[0]}, ${m.cielo[1]})`);
            fondo.append(`
                <div class="mitad-provisoria mal"><i class="fa-solid ${m.iconoMal}"></i><small></small></div>
                <div class="mitad-provisoria bien"><i class="fa-solid ${m.iconoBien}"></i></div>`);
            textosFondos();
        });
        $("#dia-fondos").append(fondo);

        $("#dia-puntos").append(`<li><button type="button" class="dia-punto" data-i="${i}"><span></span></button></li>`);
    });

    // Textos de los fondos y de la línea del día (cambian con el idioma)
    function textosFondos() {
        $(".dia-fondo").each(function() {
            let i = $(this).data("i");
            let m = momento(i);
            $(this).find("img").attr("alt", t("vive.alt", { titulo: m.titulo }));
            $(this).find(".mitad-provisoria small").text(t("vive.falta", { archivo: CARPETA + m.archivo }));
            $(`.dia-punto[data-i="${i}"] span`).text(`${m.hora} · ${m.titulo}`);
        });
    }
    textosFondos();

    // Mostrar un momento en el escenario
    let actual = -1;
    function mostrarMomento(i) {
        if (i === actual) return;
        actual = i;
        let m = momento(i);

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
            $("#dia-mal-lista").html(m.mal.lista.map(x => `<li>${x}</li>`).join(""));
            $("#dia-bien-lista").html(m.bien.lista.map(x => `<li>${x}</li>`).join(""));
            $("#dia-fuente").text(t("vive.fuente", { fuente: m.fuente }));
            if (m.barras) {
                const MAX = 9; // escala de 0 a 9 horas
                let filas = m.barras.map((br, j) => `
                    <div class="barra-sueno ${br.tipo}">
                        <span class="barra-etiqueta">${m.etiquetasBarras[j]}</span>
                        <div class="barra-pista">
                            <div class="barra-zona" style="left:${7 / MAX * 100}%; width:${2 / MAX * 100}%"></div>
                            <div class="barra-relleno" style="width:${br.horas / MAX * 100}%"></div>
                        </div>
                        <span class="barra-valor">${formatoNumero(br.horas)} h</span>
                    </div>`).join("");
                $("#dia-barras").html(filas + `<p class="barra-nota"><span></span> ${t("vive.recomendado")}</p>`).show();
            } else {
                $("#dia-barras").empty().hide();
            }
            $t.removeClass("cambiando");
        }, 250);

        $("#dia-sigue").css("visibility", i === MOMENTOS.length - 1 ? "hidden" : "visible");
    }

    // Qué momento corresponde según cuánto se ha bajado
    function alHacerScroll() {
        if (!$seccion.is(":visible")) return;
        let alto = $(window).height();
        let avance = $(window).scrollTop() - $seccion.offset().top;
        let i = Math.round(avance / alto);
        i = Math.max(0, Math.min(MOMENTOS.length - 1, i));
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

    // Interruptor "Con buenos hábitos" / "Con malos hábitos" (hay dos: en la portada y fijo arriba)
    $(".dia-modo-btn").click(function() {
        let modo = $(this).data("modo");
        $("#pantalla-vive").removeClass("modo-bien modo-mal").addClass("modo-" + modo);
        $(".dia-modo-btn").removeClass("activo").attr("aria-checked", "false");
        $(`.dia-modo-btn[data-modo="${modo}"]`).addClass("activo").attr("aria-checked", "true");
    });

    // Al cambiar de idioma: volver a escribir el momento actual
    $(document).on("cambioIdioma", function() {
        textosFondos();
        let i = Math.max(actual, 0);
        actual = -1;
        mostrarMomento(i);
    });

    // Dejar listo el primer momento
    mostrarMomento(0);
});

*/

// Al final, cuando todo está listo: poner los textos del idioma elegido
$(document).ready(aplicarIdioma);
