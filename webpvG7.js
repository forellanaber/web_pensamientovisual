$(document).ready(function() {

    // --- 1. Navegación entre pantallas ---
    
    // Botón "Sí" -> Ir a Contexto
    $("#btn-comenzar").click(function() {
        $("#pantalla-bienvenida").removeClass("seccion-activa").addClass("seccion-oculta");
        $("#pantalla-contexto").removeClass("seccion-oculta").addClass("seccion-activa");
    });

    // Botón "Empezar Test" -> Ir a Sliders
    $("#btn-ir-al-test").click(function() {
        $("#pantalla-contexto").removeClass("seccion-activa").addClass("seccion-oculta");
        $("#pantalla-test").removeClass("seccion-oculta").addClass("seccion-activa");
    });


    // --- 2. Lógica de Interacción de los Sliders ---
    
    // Escuchar el evento 'input' (cuando el slider se mueve)
    $(".slider").on("input", function() {
        // Obtener el ID del slider que se movió y su valor actual
        var idSlider = $(this).attr("id");
        var valor = $(this).val();

        // Actualizar el número en el texto de arriba
        if(idSlider === "horas-sueno") {
            $("#val-sueno").text(valor);
        } else if (idSlider === "horas-estudio") {
            $("#val-estudio").text(valor);
        } else if (idSlider === "horas-trabajo") {
            $("#val-trabajo").text(valor);
        }

        // Calcular el total de horas para ver si se pasa de 24
        calcularTotalHoras();
    });

    // Función para sumar las horas
    function calcularTotalHoras() {
        var sueno = parseFloat($("#horas-sueno").val());
        var estudio = parseFloat($("#horas-estudio").val());
        var trabajo = parseFloat($("#horas-trabajo").val());

        var total = sueno + estudio + trabajo;
        $("#total-horas").text(total);

        // Alerta visual si se pasa de 24 horas
        if(total > 24) {
            $("#total-horas").css("color", "#f43f5e"); // Rojo
        } else {
            $("#total-horas").css("color", "white");
        }
    }
});