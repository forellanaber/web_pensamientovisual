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
const APOYO_ESTUDIANTIL = {};

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
    }

    $("#link-explorar").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-explorar", $(this));
    });
    $("#link-vive").click(function(e) {
        e.preventDefault();
        mostrarSeccion("#pantalla-vive", $(this));
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
    const PESOS = { sueno: 0.22, carga: 0.12, celular: 0.14, movimiento: 0.14, organizacion: 0.14, animo: 0.24 };
    const PUNTOS_DIAS_DEPORTE = { 0: 2, 1: 5, 3: 8, 5: 10 };
    const PUNTOS_PLANIFICAR = { 2: 10, 1: 6, 0: 3 };
    const PUNTOS_POSTERGAR = { 0: 10, 1: 6, 2: 3 };
    const limitar = n => Math.max(0, Math.min(10, n));

    function puntajeAreas(r) {
        let h = r.horas;

        let sueno = (h.sueno >= 7 && h.sueno <= 9) ? 10
                  : (h.sueno < 7 ? 10 - (7 - h.sueno) * 2.5 : 10 - (h.sueno - 9) * 2);
        sueno -= (r.celularCama || 0); // celular en la cama: resta 1 o 2

        let horasCarga = h.estudio + h.trabajo + h.traslado;
        let carga = horasCarga <= 10 ? 10 : 10 - (horasCarga - 10) * 1.5;
        if (h.ocio === 0) carga -= 1; // nada de descanso sin pantalla

        let celular = h.celular <= 2 ? 10 : 10 - (h.celular - 2) * 1.5;

        let movimiento = PUNTOS_DIAS_DEPORTE[r.diasDeporte] ?? 5;

        let organizacion = ((PUNTOS_PLANIFICAR[r.planificar] ?? 6) + (PUNTOS_POSTERGAR[r.postergar] ?? 6)) / 2;

        let animo = (((r.animo ?? 3) - 1) * 2.5 + (r.bateria ?? 50) / 10) / 2;

        return {
            sueno: limitar(sueno), carga: limitar(carga), celular: limitar(celular),
            movimiento: limitar(movimiento), organizacion: limitar(organizacion), animo: limitar(animo)
        };
    }

    function puntajeTotal(r) {
        let areas = puntajeAreas(r);
        let total = 0;
        for (const k in PESOS) total += areas[k] * PESOS[k];
        return Math.round(total * 10) / 10;
    }

    // Franjas de la barra: atención (0 a 4), puede mejorar (4 a 7), bien (7 a 10)
    function nivel(p) { return p < 4 ? "atencion" : (p < 7 ? "mejorar" : "bien"); }

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
        let areas = puntajeAreas(respuestas);
        let textosAreas = lista("textosAreas");

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

        for (const k in areas) {
            let $tarjeta = $(`.tarjeta-categoria[data-area="${k}"]`);
            $tarjeta.removeClass("nivel-atencion nivel-mejorar nivel-bien").addClass("nivel-" + nivel(areas[k]));
            $tarjeta.find(".nota-cat").text(t("res.puntaje", { nota: formatoNumero(areas[k], 1) }));
            $tarjeta.find(".tarjeta-detalle").text(textosAreas[k][nivel(areas[k])]);
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
    15: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Arica y Parinacota
    1:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Tarapacá
    2:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Antofagasta
    3:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Atacama
    4:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Coquimbo
    5:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Valparaíso
    13: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Metropolitana
    6:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // O'Higgins
    7:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Maule
    16: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Ñuble
    8:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Biobío
    9:  { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // La Araucanía
    14: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Los Ríos
    10: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Los Lagos
    11: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }, // Aysén
    12: { estudiantes: null, estudiaYTrabaja: null, duermePoco: null, universidades: null, ip: null, cft: null, instituciones: [] }  // Magallanes
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

        // Resaltar en el mapa (se mueve al final para quedar por encima de las vecinas) y en la lista
        $(".region-mapa").removeClass("activa");
        $(`.region-mapa[data-region="${codigo}"]`).addClass("activa").appendTo("#mapa-chile");
        $(".item-region").removeClass("activo");
        $(`.item-region[data-region="${codigo}"]`).addClass("activo");

        $("#ficha-vacia").prop("hidden", true);
        $("#ficha-contenido").prop("hidden", false);
        $("#nombre-region").text(nombreRegion(codigo));

        // 1. Cómo son los estudiantes
        $("#dato-estudiantes").html(hayDato(r.estudiantes) ? miles(r.estudiantes) : pendiente());
        $("#dato-trabaja").html(hayDato(r.estudiaYTrabaja) ? formatoNumero(r.estudiaYTrabaja) + "%" : pendiente());
        $("#dato-duerme").html(hayDato(r.duermePoco) ? formatoNumero(r.duermePoco) + "%" : pendiente());

        // 2. Dónde estudian
        $("#dato-universidades").html(hayDato(r.universidades) ? r.universidades : pendiente());
        $("#dato-ip").html(hayDato(r.ip) ? r.ip : pendiente());
        $("#dato-cft").html(hayDato(r.cft) ? r.cft : pendiente());
        $("#lista-instituciones").html(htmlEnlaces(t("explorar.sitios"), r.instituciones));

        // 3. Dónde pedir apoyo (Salud Responde y *4141 están fijos en el HTML)
        $("#apoyo-region").html(htmlEnlaces(t("explorar.apoyoEstudiantil"), APOYO_ESTUDIANTIL[codigo]));

        // En celular la ficha queda bajo el mapa: bajar hasta ella
        if (desplazar && window.matchMedia("(max-width: 900px)").matches) {
            $("html, body").animate({ scrollTop: $("#ficha-region").offset().top - parseInt(getComputedStyle(document.documentElement).getPropertyValue("--alto-header")) - 12 }, 500);
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
        let n = DATOS_REGIONES[codigo].estudiantes;
        let texto = hayDato(n)
            ? t("explorar.tooltip", { region: nombreRegion(codigo), n: miles(n) })
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

// Al final, cuando todo está listo: poner los textos del idioma elegido
$(document).ready(aplicarIdioma);
