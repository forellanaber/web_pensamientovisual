// =====================================================================
// Textos del sitio en español (es) e inglés (en).
//
// - En el HTML, cada texto tiene un atributo data-t="clave" (o data-t-html,
//   data-t-aria) que apunta a una clave de este archivo.
// - En main.js se usan con t("clave") y lista("clave").
// - {n}, {nota}, etc. se reemplazan por valores al mostrar el texto.
// - Para cambiar un texto, cámbialo aquí (en los dos idiomas).
// =====================================================================

const TEXTOS = {

// =====================================================================
// ESPAÑOL
// =====================================================================
es: {
    // --- Header ---
    "nav.explorar": "Explorar Chile",
    "nav.vive": "Vive un día",
    "nav.quienes": "Quiénes somos",
    "nav.contacto": "Contacto",
    "idioma.aria": "Cambiar idioma",

    // --- Inicio ---
    "inicio.titulo1": "¿Eres estudiante y te gustaría",
    "inicio.titulo2": "mejorar tu uso del tiempo?",
    "inicio.si": "Sí",

    // --- Dato de contexto ---
    "contexto.intro": "¿Sabías que el",
    "contexto.cifra": "66,8%",
    "contexto.detalle": "de los jóvenes en Chile pasa más de 4 horas al día pegado a una pantalla?",
    "contexto.subtitulo": "¡Eso es más de 2 meses seguidos pegado a una pantalla al año!",
    "contexto.fuente": "Fuente: SUBTEL y Cadem (2024), jóvenes de 16 a 29 años",
    "contexto.minutos": "3 minutos",
    "contexto.anonimo": "Anónimo",
    "contexto.alTiro": "Resultados al instante",
    "contexto.empezar": "Empezar el test",

    // --- Test: avance ---
    "test.volver": "Volver",
    "test.quedan": "Quedan unos {n} min",
    "test.quedaMenos": "Queda menos de 1 min",
    "test.seguir": "Listo, seguir",
    "test.seguirCorto": "Seguir",
    "test.verResultados": "Ver mis resultados",

    // --- Paso 1: perfil ---
    "test.etiquetaPerfil": "Tu perfil",
    "test.edadTitulo": "¿Cuántos años tienes?",
    "edad.18": "18 o menos",
    "edad.19": "19 a 21",
    "edad.22": "22 a 24",
    "edad.25": "25 a 29",
    "edad.30": "30 o más",
    "test.ocupacionTitulo": "¿Solo estudias o también trabajas?",
    "ocupacion.estudia": "Solo estudio",
    "ocupacion.trabaja": "Estudio y trabajo",
    "test.regionTitulo": "¿En qué región vives?",

    // Regiones (se usan en el test y en Explorar Chile)
    "region.15": "Arica y Parinacota",
    "region.1": "Tarapacá",
    "region.2": "Antofagasta",
    "region.3": "Atacama",
    "region.4": "Coquimbo",
    "region.5": "Valparaíso",
    "region.13": "Metropolitana",
    "region.6": "O'Higgins",
    "region.7": "Maule",
    "region.16": "Ñuble",
    "region.8": "Biobío",
    "region.9": "La Araucanía",
    "region.14": "Los Ríos",
    "region.10": "Los Lagos",
    "region.11": "Aysén",
    "region.12": "Magallanes",

    // --- Paso 2: tu día ---
    "test.etiquetaDia": "Tu día",
    "test.diaTitulo": "¿Cuántas horas le das a cada cosa en un día normal?",
    "test.alertaHoras": "Llegaste a las 24 horas del día. Para subir algo, baja otra cosa.",
    "act.sueno": "Sueño",
    "act.estudio": "Clases y estudio",
    "act.trabajo": "Trabajo",
    "act.traslado": "Traslado",
    "act.ocio": "Descanso y ocio sin pantalla",
    "act.deporte": "Deporte",
    "act.celular": "Celular y redes",
    "dona.aria": "Reparto de tus 24 horas",
    "dona.de24": "de 24 h",
    "dona.sinAsignar": "{n} h sin asignar",
    "dona.completo": "Día completo",

    // --- Paso 3: hábitos ---
    "test.etiquetaHabitos": "Tus hábitos",
    "test.camaTitulo": "¿Usas el celular en la cama antes de dormir?",
    "test.postergarTitulo": "¿Sueles dejar las tareas para después?",
    "test.planificarTitulo": "¿Planificas tu semana?",
    "test.deporteTitulo": "¿Cuántos días a la semana haces deporte?",
    "op.casiNunca": "Casi nunca",
    "op.aVeces": "A veces",
    "op.casiSiempre": "Casi siempre",
    "op.seguido": "Seguido",
    "op.si": "Sí",
    "op.no": "No",
    "op.ninguno": "Ninguno",
    "op.1o2": "1 o 2",
    "op.3o4": "3 o 4",
    "op.5oMas": "5 o más",

    // --- Paso 4: cómo te sientes ---
    "test.etiquetaSientes": "Cómo te sientes",
    "test.animoTitulo": "¿Cómo ha estado tu ánimo la mayor parte del tiempo?",
    "animo.1": "Muy mal",
    "animo.2": "Mal",
    "animo.3": "Más o menos",
    "animo.4": "Bien",
    "animo.5": "Muy bien",
    "test.bateriaTitulo": "¿Cómo te sientes al final del día?",
    "test.bateriaAyuda": "Mueve la barra para llenar la batería.",
    "test.bateriaAria": "Energía al final del día, de Agotado a Lleno de energía",
    "test.agotado": "Agotado",
    "test.lleno": "Lleno de energía",

    // --- Paso 5: bienestar ---
    "test.etiquetaMas": "Un poco más sobre ti",
    "test.bienIntroTitulo": "Antes de ver tus resultados, queremos preguntarte algo más",
    "test.bienIntroAyuda": "Son tres preguntas cortas. Nos ayudan a darte una orientación que sirva.",
    "test.duracionTitulo": "¿Hace cuánto te sientes así?",
    "op.unosDias": "Unos días",
    "op.unasSemanas": "Unas semanas",
    "op.masDeUnMes": "Más de un mes",
    "test.factorTitulo": "¿Qué crees que más influye?",
    "factor.academica": "La carga académica",
    "factor.trabajo": "El trabajo",
    "factor.sueno": "Dormir poco",
    "factor.lejos": "Estar lejos de mi familia o mi ciudad",
    "factor.otro": "Otra cosa",
    "test.apoyoTitulo": "¿Cuentas con alguien a quien recurrir?",

    // --- Pantalla de carga ---
    "carga.titulo": "Calculando tu resultado...",
    "carga.frases": [
        "Revisando tus respuestas...",
        "¿Sabías que dormir bien ayuda a recordar lo que estudias?",
        "El descanso no es tiempo perdido: ayuda a prevenir el agotamiento académico.",
        "Calculando el Equilibrio de tu día..."
    ],

    // --- Resultado ---
    "res.nombre": "Equilibrio de tu día",
    "res.de10": "de 10",
    "res.franjaAtencion": "Atención",
    "res.franjaMejorar": "Puede mejorar",
    "res.franjaBien": "Bien",
    "res.tu": "Tú",
    "res.verPlan": "Ver cómo lograrlo",
    "res.aviso": "Este puntaje es una orientación, no un diagnóstico.",
    "res.areasTitulo": "Qué hay detrás de tu puntaje",
    "res.frase": "Con dos cambios podrías llegar a <strong>{nota} de 10</strong>: {cambios}.",
    "res.fraseMantener": "Con pequeños ajustes puedes mantener tu equilibrio.",
    "res.y": " y ",
    "res.puntaje": "{nota} de 10",
    "res.repartoTitulo": "Así repartes tu día",
    "pie.lema": "Tu día, en equilibrio",
    "pie.ayuda": "¿Necesitas hablar con alguien?",

    "area.sueno": "Sueño",
    "area.carga": "Carga del día",
    "area.celular": "Celular",
    "area.movimiento": "Movimiento",
    "area.organizacion": "Organización",
    "area.animo": "Ánimo y energía",
    "area.descanso": "Descanso",
    "area.estudio": "Estudio",
    "area.trabajo": "Trabajo",
    "area.traslado": "Traslado",
    "area.ocio": "Ocio",
    "area.deporte": "Deporte y salud",
    "res.baseDatos": "Base de datos",

    "tarjetasDiagnostico": {
        descanso: {
            titulo: "Descanso",
            icono: "fa-solid fa-moon",
            fuentes: [
                { nombre: "Consenso AASM / SRS", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4442216/" },
                { nombre: "Sleep Foundation", url: "https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need" }
            ],
            rangos: [
                {
                    min: 0, max: 6.9,
                    estado: "Deficiente",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Dormir menos de 7 horas de forma habitual deteriora la concentración, la memoria y la función inmunológica. Además, se asocia a un mayor riesgo de fatiga crónica, estrés, accidentes y alteraciones metabólicas."
                },
                {
                    min: 7, max: 9,
                    estado: "Óptimo / Saludable",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Cumples con el rango recomendado para adultos jóvenes. Dormir entre 7 y 9 horas consolida el aprendizaje diario, regula los estados de ánimo y asegura una óptima recuperación física y mental."
                },
                {
                    min: 9.1, max: 24,
                    estado: "Excesivo",
                    nivel: "mejorar",
                    puntos: 6,
                    texto: "Aunque puede ser adecuado al recuperarte de deudas acumuladas de sueño o enfermedades, superar de forma crónica las 9 horas puede asociarse a somnolencia diurna excesiva, baja energía o alteraciones del ciclo circadiano."
                }
            ]
        },
        estudio: {
            titulo: "Estudio",
            icono: "fa-solid fa-book-open",
            fuentes: [
                { nombre: "Encuesta CASEN (Educación)", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen" },
                { nombre: "Athenify Study Research", url: "https://athenify.io/es/blog/cuantas-horas-estudiar-al-dia" }
            ],
            rangos: [
                {
                    min: 0, max: 1.9,
                    estado: "Bajo",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Dedicar muy poco tiempo al estudio autónomo puede acumular sobrecargas y estrés previo a evaluaciones, afectando negativamente tu rendimiento académico y la asimilación paulatina de materias."
                },
                {
                    min: 2, max: 5.5,
                    estado: "Equilibrado",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Mantienes un volumen de estudio diario sostenible. Este bloque permite consolidar contenidos académicos sin comprometer tus horas de descanso ni tus actividades personales."
                },
                {
                    min: 5.6, max: 24,
                    estado: "Riesgo de sobrecarga",
                    nivel: "atencion",
                    puntos: 5,
                    texto: "La investigación muestra que tras 5-6 horas de estudio concentrado diario los rendimientos disminuyen drásticamente. Sobrepasar este umbral eleva el agotamiento mental (burnout) y reduce la retención neta."
                }
            ]
        },
        trabajo: {
            titulo: "Trabajo",
            icono: "fa-solid fa-briefcase",
            fuentes: [
                { nombre: "ENUT (INE) - Uso del Tiempo", url: "https://www.ine.gob.cl/estadisticas/sociales/genero/uso-del-tiempo" },
                { nombre: "Encuesta CASEN", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen" }
            ],
            rangos: [
                {
                    min: 0, max: 0.1,
                    estado: "Dedicación exclusiva",
                    nivel: "bien",
                    puntos: 10,
                    texto: "No dedicas horas a trabajo remunerado, lo que te permite mayor disponibilidad horaria para organizar tus estudios, ocio y descanso."
                },
                {
                    min: 0.2, max: 4.5,
                    estado: "Jornada parcial compatible",
                    nivel: "bien",
                    puntos: 9,
                    texto: "Compatibilizas tus estudios con una actividad laboral moderada dentro de los marcos del trabajo juvenil y parcial, sin canibalizar severamente tus horarios de recuperación."
                },
                {
                    min: 4.6, max: 24,
                    estado: "Alta carga laboral",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Una jornada laboral extensa compite directamente con tus horas de estudio y descanso. En estudiantes de educación superior, jornadas largas elevan significativamente el riesgo de deserción y el agotamiento físico."
                }
            ]
        },
        traslado: {
            titulo: "Traslado",
            icono: "fa-solid fa-bus",
            fuentes: [
                { nombre: "Encuesta CASEN", url: "https://www.latercera.com/pulso/noticia/casen-2017-muestra-fuerte-diferencia-tiempos-traslado-santiaguinos-segun-tipo-trabajo/873500/" },
                { nombre: "ENUT (INE) - Uso del Tiempo", url: "https://www.ine.gob.cl/estadisticas/sociales/genero/uso-del-tiempo" }
            ],
            rangos: [
                {
                    min: 0, max: 0.9,
                    estado: "Bajo impacto",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Tus tiempos de viaje son acotados, lo que te deja una mayor reserva de energía diaria y más horas útiles durante la semana."
                },
                {
                    min: 1, max: 2.2,
                    estado: "Promedio urbano nacional",
                    nivel: "mejorar",
                    puntos: 7,
                    texto: "Te encuentras dentro del promedio de traslado de las principales zonas urbanas en Chile. Aprovechar estos trayectos para \"ocio activo\" (escuchar música o podcasts) ayuda a mitigar la fatiga acumulada en el viaje."
                },
                {
                    min: 2.3, max: 24,
                    estado: "Excesivo",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Pasas un tiempo excesivo en locomoción. Los trayectos diarios prolongados en transporte público se correlacionan con niveles elevados de estrés, fatiga postural y pérdida crítica de horas de ocio y sueño."
                }
            ]
        },
        ocio: {
            titulo: "Ocio",
            icono: "fa-solid fa-mug-hot",
            fuentes: [
                { nombre: "Programa Vida Saludable (UdeC)", url: "https://vidasaludable.udec.cl/node/279" },
                { nombre: "10ª Encuesta INJUV", url: "https://www.injuv.gob.cl/" },
                { nombre: "ENUT (INE)", url: "https://www.ine.gob.cl/estadisticas/sociales/genero/uso-del-tiempo" },
                { nombre: "Sleep Foundation", url: "https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need" }
            ],
            rangos: [
                {
                    min: 0, max: 0.9,
                    estado: "Déficit",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Estás sacrificando tu tiempo personal. El ocio no es perder el tiempo, es una necesidad biológica y cognitiva que reduce la ansiedad, estimula la creatividad y previene el colapso por estrés académico."
                },
                {
                    min: 1, max: 4,
                    estado: "Equilibrado",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Mantienes un espacio saludable para tus intereses personales y relaciones sociales. Este equilibrio fortalece tu sistema inmune, reduce la ansiedad y mejora tu calidad de sueño."
                },
                {
                    min: 4.1, max: 24,
                    estado: "Sobrecarga de ocio / Pantallas",
                    nivel: "atencion",
                    puntos: 5,
                    texto: "Dedicar un exceso de horas diarias a ocio sedentario o consumo de pantallas puede desplazar horarios de sueño y estudio, aumentando la sensación de procrastinación, fatiga visual y cansancio matutino."
                }
            ]
        },
        deporte: {
            titulo: "Deporte y salud",
            icono: "fa-solid fa-person-running",
            fuentes: [
                { nombre: "OMS - Actividad Física", url: "https://www.who.int/es/news-room/fact-sheets/detail/physical-activity" },
                { nombre: "OPS - Recomendaciones de Salud", url: "https://www.paho.org/es/noticias/9-5-2012-recomendaciones-mundiales-sobre-actividad-fisica-para-salud" }
            ],
            rangos: [
                {
                    min: 0, max: 0.25,
                    estado: "Sedentarismo",
                    nivel: "atencion",
                    puntos: 3,
                    texto: "Tu nivel de actividad física es insuficiente respecto a los mínimos médicos recomendados. Moverte al menos 20 minutos al día mejora la función cardiovascular, la memoria y actúa como protector natural contra la depresión y el estrés."
                },
                {
                    min: 0.26, max: 1.25,
                    estado: "Saludable",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Cumples con la pauta recomendada para adultos jóvenes (150 a 300 minutos semanales). Esta rutina optimiza tu resistencia cardiorrespiratoria, mejora el estado de ánimo y fortalece tu sistema óseo y muscular."
                },
                {
                    min: 1.26, max: 24,
                    estado: "Alto rendimiento",
                    nivel: "bien",
                    puntos: 9,
                    texto: "Mantienes un volumen de ejercicio muy alto. Asegúrate de compensar esta demanda física con una adecuada hidratación, alimentación y suficientes horas de descanso para evitar sobrecargas articulares o agotamiento físico."
                }
            ]
        }
    },

    "diagnostico": {
        atencion: "Tu día está pidiendo un cambio. No tienes que hacerlo todo de una: parte por una cosa.",
        mejorar: "Vas bien en algunas cosas y en otras tienes espacio para mejorar.",
        bien: "Tu día está bastante equilibrado. Sigue cuidando lo que te funciona."
    },

    "textosAreas": {
        sueno: {
            atencion: "Duermes menos de lo recomendado (7 a 9 horas). Dormir poco se nota en la concentración y el ánimo del día siguiente.",
            mejorar: "Estás cerca de lo recomendado (7 a 9 horas). Dejar el celular antes de acostarte te puede dar ese rato que falta.",
            bien: "Duermes dentro de lo recomendado (7 a 9 horas). Cuida ese horario, también el fin de semana."
        },
        carga: {
            atencion: "Clases, trabajo y traslado ocupan casi todo tu día. Ojo con que eso no se coma tus horas de sueño.",
            mejorar: "Entre clases, trabajo y traslado se te va buena parte del día. Ordenar la semana ayuda a que no se junte todo.",
            bien: "Tu carga de clases, trabajo y traslado te deja espacio para descansar."
        },
        celular: {
            atencion: "El celular se lleva muchas horas de tu día. Es tiempo que podrías usar para dormir, moverte o descansar.",
            mejorar: "Pasas varias horas al día en el celular. Ponerle un límite a las apps que más usas te puede devolver tiempo.",
            bien: "Usas poco el celular fuera de lo necesario. Bien ahí."
        },
        movimiento: {
            atencion: "Casi no haces deporte. Partir con caminatas de 20 minutos ya cuenta.",
            mejorar: "Haces algo de deporte. Sumar un día más te acerca a los 150 minutos a la semana que recomienda la OMS.",
            bien: "Te mueves varios días a la semana. Vas por buen camino con los 150 minutos semanales que recomienda la OMS."
        },
        organizacion: {
            atencion: "Postergar y no planificar hace que todo se junte. Un rato el domingo para ordenar la semana puede cambiar mucho.",
            mejorar: "A veces planificas y a veces postergas. Partir por la tarea más corta hace más fácil empezar.",
            bien: "Planificas y no dejas todo para después. Eso te deja tiempo libre de verdad."
        },
        animo: {
            atencion: "Terminas el día con poca energía y el ánimo bajo. Más arriba te dejamos ideas y contactos de apoyo.",
            mejorar: "Tu energía y tu ánimo están a medias. Dormir mejor y moverte más suele ayudar.",
            bien: "Terminas el día con energía y buen ánimo."
        }
    },

    // --- Mensaje de bienestar ---
    "bien.tituloDerivar": "Hablar con alguien puede ayudarte",
    "bien.tituloConsejo": "Una idea para estos días",
    "bien.contextoLejos": "Estar lejos de tu familia o de tu ciudad es un cambio grande, y es normal que se sienta. Muchas instituciones tienen grupos y actividades para estudiantes que llegan de otras regiones: puede ser una buena forma de armar red.",
    "bien.derivar": "Cuando el malestar dura más de un mes, o sientes que no tienes con quién hablar, conversar con un profesional ayuda. No necesitas esperar a sentirte peor para pedir apoyo.",
    "bien.apoyoRegion": "En tu región puedes buscar apoyo en:",
    "bien.apoyoGeneral": "Tu universidad, IP o CFT tiene un servicio de apoyo psicológico o de bienestar estudiantil. Búscalo en la web de tu institución o pregunta en asuntos estudiantiles.",
    "bien.tambienLlamar": "También puedes llamar a:",
    "bien.siSigue": "Si esto sigue o se pone más difícil, puedes llamar a:",
    "bien.aVeces": "Contarle a alguien de confianza cómo te sientes también ayuda.",
    "bien.linea4141": "del Minsal, gratuita, 24/7",
    "bien.linea": "Línea",
    "consejos": {
        academica: "Elige una sola tarea para hoy y divídela en pasos chicos. Si los plazos no te dan, conversarlo con tus profes o ayudantes también es una opción.",
        trabajo: "Fija en la semana bloques claros para estudiar y para trabajar, y cuida tus horas de sueño.",
        sueno: "Esta semana prueba dejar el celular 30 minutos antes de dormir y acostarte siempre a la misma hora.",
        lejos: "Llama o haz una videollamada con alguien de tu familia esta semana, y busca alguna actividad en tu institución para conocer gente.",
        otro: "Date un rato al día para algo que te guste y que no tenga pantalla, y conversa con alguien de confianza sobre cómo te sientes."
    },

    // --- Invitación a Vive un día y botón al plan ---
    "invita.titulo": "¿Cómo cambia un día con otros hábitos?",
    "invita.texto": "Recorre un día completo de un estudiante, de la mañana a la madrugada.",
    "invita.boton": "Vive un día",
    "cta.titulo": "¿Y qué puedo hacer?",
    "cta.boton": "Descúbrelo",

    // --- Plan de acción ---
    "guia.titulo": "Tu plan de acción",
    "guia.sub": "Pequeños ajustes pueden cambiar mucho tu día. Activa los cambios para ver cómo mejoraría tu día y agrégalos a tu calendario.",
    "mejora.suenoTitulo": "Duerme 1 hora más",
    "mejora.suenoTexto": "Restando 1 h de pantalla en la noche.",
    "mejora.suenoNombre": "dormir 1 hora más",
    "mejora.deporteTitulo": "20 min de caminata",
    "mejora.deporteTexto": "Usa parte del traslado o del tiempo libre.",
    "mejora.deporteNombre": "caminar 20 minutos al día",
    "mejora.estudioTitulo": "Bloques Pomodoro",
    "mejora.estudioTexto": "Estudia en bloques de 25 min y libera 30 min.",
    "mejora.estudioNombre": "estudiar en bloques Pomodoro",
    "mejora.planificarTitulo": "Planifica tu semana",
    "mejora.planificarTexto": "20 minutos el domingo para ordenar lo que viene.",
    "mejora.planificarNombre": "planificar tu semana",
    "guia.impacto": "Impacto en tu día",
    "guia.actual": "Tu día actual",
    "guia.conCambios": "Tu día con los cambios",
    "guia.quedaria": "Tu Equilibrio del día quedaría en:",

    "cal.titulo": "Agregarlo a mi calendario",
    "cal.ics": "Descargar .ics",
    "cal.google": "Google Calendar",
    "eventos": {
        sueno: { titulo: "Dejar el celular e irme a dormir", detalle: "Deja el celular 30 minutos antes de acostarte y duerme 1 hora más." },
        deporte: { titulo: "Caminata de 20 minutos", detalle: "Sal a caminar 20 minutos. Puede ser parte del traslado." },
        estudio: { titulo: "Bloque de estudio Pomodoro", detalle: "Dos bloques de 25 minutos de estudio con 5 minutos de pausa. Celular lejos." },
        planificar: { titulo: "Planificar mi semana", detalle: "20 minutos para revisar entregas, pruebas y horarios de la semana que viene." }
    },

    "recursos.titulo": "Herramientas para lograrlo",
    "recursos.podcastTitulo": "Podcast: Hábitos Atómicos",
    "recursos.podcastTexto": "Aprende cómo pequeñas mejoras del 1% diario transforman tu vida sin requerir motivación extrema.",
    "recursos.podcastLink": "Escuchar en Spotify",
    "recursos.pomodoroTitulo": "Técnica Pomodoro",
    "recursos.pomodoroTexto": "Un video de 5 minutos que explica cómo estudiar en bloques de 25 minutos para evitar la fatiga mental.",
    "recursos.pomodoroLink": "Ver tutorial",
    "recursos.saludTitulo": "Salud Responde",
    "recursos.saludTexto": "Si sientes que el agobio te supera, no estás solo. Habla gratis con profesionales de la salud mental.",
    "recursos.saludLink": "Visitar web oficial",

    "final.titulo": "Tu salud es tu recurso más valioso",
    "final.texto": "Priorizar tu descanso no es perder el tiempo, es afilar el hacha. Comparte esta herramienta con ese amigo o amiga que sabes que necesita un respiro.",
    "compartir.ws": "WhatsApp",
    "compartir.ig": "Instagram",
    "compartir.resultado": "mi Equilibrio del día salió {nota} de 10",
    "compartir.sinResultado": "descubrí cómo uso mi tiempo",
    "compartir.textoWs": "Hice el test de HazteElTiempo.cl y {resultado}. ¿Cuánto te sale a ti? Son 4 minutos y es anónimo: {url}",
    "compartir.textoIg": "Hice el test de HazteElTiempo.cl y {resultado}. ¿Y el tuyo? Son 4 minutos: {url}",
    "compartir.copia": "Copia este texto y pégalo en tu historia o en un mensaje de Instagram:",
    "compartir.copiado": "Copiamos el texto. Pégalo en tu historia o en un mensaje de Instagram:",
    "reiniciar": "Volver a hacer el test",

    // --- Vive un día (recorrido horizontal) ---
    "vd.pista": "Baja para recorrer el día",
    "vd.modoAria": "Cómo vivir el día",
    "vd.modoBien": "Buenos hábitos",
    "vd.modoMal": "Malos hábitos",
    "vd.verMas": "Ver más",
    "vd.cerrar": "Cerrar",
    "vd.deSueno": "de sueño",
    "vd.ilustrativo": "Ilustrativo",
    "vd.hipnogramaAria": "Fases del sueño durante la noche",
    "vd.despierto": "Despierto",
    "vd.liviano": "Liviano",
    "vd.rem": "REM",
    "vd.profundo": "Profundo",
    "vd.barraAria": "Línea del día, de 08:00 a 07:00",
    "vd.irA": "Ir a las {hora}",
    "vd.finalFrase": "La diferencia empieza mucho antes de dormir",
    "vd.fuenteNoche": "Institute of Medicine (2006), Sleep Physiology",
    "vd.fuentePantalla": "Hjetland et al. (2025), Frontiers in Psychiatry",

    // Paradas de la noche (23:00 a 07:00). "frase" se ve siempre; "detalle" va en la tarjeta.
    "noche": [
        { titulo: "Antes de dormir",
          bien: {"frase":"Si dejas el celular antes de dormir:","detalle":["Te das un momento para bajar el ritmo y relajarte.","Puedes conciliar el sueño con más facilidad y descansar mejor."]},
          mal:  {"frase":"Si sigues usando el celular en la cama:","detalle":["Puedes retrasar tu hora de dormir y reducir tu tiempo de descanso.","Puede costarte más conciliar el sueño."]} },
        { titulo: "Se apaga la luz",
          bien: { frase: "Se duerme.", detalle: ["Empieza el primer ciclo de sueño, de unos 90 minutos."] },
          mal:  { frase: "Sigue en el celular.", detalle: ["Con la cara iluminada por la pantalla."] } },
        { titulo: "Pasada la medianoche",
          bien: { frase: "Sueño profundo.", detalle: ["Es la fase más reparadora.", "Se concentra en el primer tercio de la noche."] },
          mal:  { frase: "Sigue despierto.", detalle: ["Cada hora de pantalla en la cama quita unos 24 minutos de sueño."] } },
        { titulo: "Madrugada",
          bien: { frase: "Va en su tercer ciclo.", detalle: ["Cada ciclo dura unos 90 minutos y pasa por sueño liviano, profundo y REM."] },
          mal:  { frase: "Recién se duerme.", detalle: ["Con la alarma a las 07:00, le quedan 5 horas de sueño."] } },
        { titulo: "Antes del amanecer",
          bien: { frase: "Aumenta el sueño REM.", detalle: ["Es la fase de los sueños.", "Se asocia a ordenar lo aprendido."] },
          mal:  { frase: "Va en su primer ciclo de sueño profundo.", detalle: ["Todavía le falta casi todo el REM de la noche."] } },
        { titulo: "Suena la alarma",
          bien: { frase: "Despierta con 9 horas.", detalle: ["Cerca de 6 ciclos completos."] },
          mal:  { frase: "El despertador lo saca a mitad de ciclo.", detalle: ["Duerme 5 horas, unos 3 ciclos.", "Se pierde gran parte del REM, que se concentra al final de la noche."] } }
    ],

    // --- Explorar Chile ---
    "explorar.titulo": "¿Cómo viven los estudiantes en tu región?",
    "explorar.sub": "Toca una región del mapa o de la lista para ver su ficha.",
    "explorar.mapaAria": "Mapa de Chile por regiones",
    "explorar.menos": "Menos",
    "explorar.mas": "Más",
    "explorar.leyenda": "Estudiantes de educación superior",
    "explorar.sinDatosMapa": "El mapa se coloreará cuando estén los datos reales.",
    "explorar.tooltip": "{region}: {n} estudiantes",
    "explorar.pendiente": "[DATO PENDIENTE]",
    "explorar.fichaVacia": "Elige una región para ver cómo son sus estudiantes, dónde estudian y dónde pedir apoyo.",
    "explorar.bloqueEstudiantes": "Cómo son los estudiantes",
    "explorar.datoEstudiantes": "estudiantes de educación superior",
    "explorar.datoTrabaja": "estudia y trabaja",
    "explorar.datoDuerme": "duerme poco",
    "explorar.bloqueEstudian": "Dónde estudian",
    "explorar.universidades": "universidades",
    "explorar.ip": "institutos profesionales (IP)",
    "explorar.cft": "centros de formación técnica (CFT)",
    "explorar.sitios": "Sitios de las instituciones:",
    "explorar.bloqueApoyo": "Dónde pedir apoyo",
    "explorar.apoyoEstudiantil": "Servicios de apoyo estudiantil:",
    "explorar.fuentes": "Fuentes: SIES (Mineduc), CASEN 2022, ENUT 2023",
    "explorar.boton": "Compárate con tu región · Hacer el test",

    // --- Vive un día ---
    "vive.titulo": "Vive un día",
    "vive.intro": "Recorre un día completo de un estudiante, de la mañana a la madrugada. Elige cómo vivirlo y baja.",
    "vive.modoAria": "Cómo vivir el día",
    "vive.modoBien": "Con buenos hábitos",
    "vive.modoMal": "Con malos hábitos",
    "vive.plegarAria": "Plegar o desplegar la información",
    "vive.ejemplo": "Dato de ejemplo",
    "vive.lineaAria": "Momentos del día",
    "vive.manana": "Mañana",
    "vive.madrugada": "Madrugada",
    "vive.sigue": "Sigue bajando",
    "vive.fuente": "Fuente: {fuente}",
    "vive.falta": "Falta {archivo}",
    "vive.alt": "Ilustración: {titulo}, mal hábito a la izquierda y buen hábito a la derecha",
    "vive.recomendado": "Lo recomendado: 7 a 9 h",
    "vive.finalTitulo": "Así termina el día",
    "vive.finalSub": "Con la alarma a las 07:00, esto es lo que alcanzas a dormir.",
    "vive.finalBuenas": "9 h",
    "vive.finalMalas": "5 h",
    "vive.durmio2330": "Te dormiste a las 22:00",
    "vive.durmio0200": "Te dormiste a las 02:00",
    "vive.finalNota": "Lo recomendado: 7 a 9 h. Fuente: National Sleep Foundation (Hirshkowitz et al., 2015)",
    "vive.finalPregunta": "¿Y cómo es tu día?",
    "vive.finalBoton": "Hacer el test",

    // Momentos del día, en el mismo orden que "momentos" en main.js
    "momentos": [
        {
            titulo: "Traslado", dato: "5 de 10", texto: "estudiantes tardan más de 1 hora en trasladarse", fuente: "Espinoza Díaz et al. (2025); Errázuriz y Valdés (2017)",
            mal:  {"titulo":"Si pasas todo el viaje pendiente de redes y notificaciones:","lista":["El uso excesivo del celular puede aumentar tu sensación de ansiedad.","Puedes terminar el trayecto con la sensación de no haber tenido una pausa."]},
            bien: {"titulo":"Si escuchas un podcast y/o lees:","lista":["El tiempo del viaje se vuelve productivo","Puedes desconectarte por un rato de tus pendientes y convertir el trayecto en un momento para ti"]}
        },
        {
            titulo: "Clases y estudio", dato: "59%", texto: "de los universitarios de un estudio se pone objetivos de estudio",
            fuente: "Zambrano et al. (2021)",
            mal:  {"titulo":"Si estudias con redes y notificaciones abiertas:","lista":["Las interrupciones dificultan que mantengas la concentración.","Puedes tardar más en terminar tus tareas."]},
            bien: {"titulo":"Si planificas la semana:","lista":["Divides los objetivos grandes en pasos pequeños y alcanzables.","Distribuyes tus tareas según sus plazos y el tiempo disponible.","Puedes reconocer tus avances y sentir que el objetivo está más cerca."]}
        },
        {
            titulo: "Almuerzo y pausa", dato: "1 h", texto: "al día dedican los estudiantes a comer", fuente: "ENUT 2023",
            mal:  {"titulo":"Si sigues estudiando mientras almuerzas:","lista":["Comes con la atención dividida entre la comida y tus tareas.","Pierdes una pausa para descansar y despejar la mente."]},
            bien: {"titulo":"si comes sin pantallas:","lista":["Te das una pausa para descansar y despejar la mente.","Bajas el ritmo del día, lo que puede ayudarte a reducir el estrés."]}
        },
        {
            titulo: "Tareas pendientes", dato: "4 de 6", texto: "áreas del bienestar son más bajas en quienes más postergan",
            fuente: "Cordovez, Ramírez y Villafaña (2023), estudiantes chilenos",
            mal:  { titulo: "Si lo dejas para después", lista: ["Se acumula el estrés", "Baja tu sensación de propósito"] },
            bien: { titulo: "Si partes por lo más corto", lista: ["Empezar se hace más fácil", "Avanzas y te queda tiempo libre"] }
        },
        {
            titulo: "Deporte", dato: "150 min", texto: "de actividad física a la semana recomienda la OMS",
            fuente: "Organización Mundial de la Salud (2020)",
            mal:  {"titulo":"Si pasas muchas horas sentado sin hacer pausas:","lista":["Puedes sentir molestias físicas por mantener la misma postura.","Puedes acumular cansancio y sentir más sueño durante la jornada."]},
            bien: {"titulo":"Si haces deporte o actividad física:","lista":["Mejora tu ánimo y ayuda a dormir mejor.","Puede favorecer tu concentración y tu memoria."]}
        },
        {
            titulo: "Celular y redes", dato: "66,8%", texto: "de los jóvenes de 16 a 29 años está más de 4 h al día en internet",
            fuente: "SUBTEL y Cadem (2024)",
            mal:  {"titulo":"Si revisas redes sin ponerte un límite:","lista":["Puedes perder la noción del tiempo y quedarte más de lo que querías.","Dejas menos tiempo para tus pendientes y las actividades que disfrutas."]},
            bien: {"titulo":"Si limitas tu tiempo en redes:","lista":["Evitas pasar más tiempo del que querías en el celular.","Recuperas tiempo para descansar o hacer actividades que disfrutas."]}
        },
        {
            titulo: "Antes de dormir", dato: "+59%", texto: "más riesgo de insomnio por cada hora de pantalla en la cama",
            fuente: "Hjetland et al. (2025), Frontiers in Psychiatry",
            mal:  {"titulo":"Si sigues usando el celular en la cama:","lista":["Puedes retrasar tu hora de dormir y reducir tu tiempo de descanso.","Puede costarte más conciliar el sueño."]},
            bien: {"titulo":"Si dejas el celular antes de dormir:","lista":["Te das un momento para bajar el ritmo y relajarte.","Puedes conciliar el sueño con más facilidad y descansar mejor."]}
        },
        {
            titulo: "Pasada la medianoche", dato: "−36 min", texto: "de sueño ya perdió quien lleva 1 h y media con el celular en la cama",
            fuente: "Hjetland et al. (2025): cerca de 24 min menos de sueño por cada hora de pantalla en la cama",
            mal:  { titulo: "Si sigues con el celular", lista: ["Te dijiste que a las 23:30 te dormías", "Cada video te quita un poco más de sueño"] },
            bien: { titulo: "Si cumpliste tu hora", lista: ["Ya llevas 1 hora durmiendo", "Tu cuerpo empezó a recuperarse"] }
        },
        {
            titulo: "Madrugada", dato: "2,5 h", texto: "menos de sueño por quedarte con el celular hasta las 02:00",
            etiquetasBarras: ["Te dormiste a las 23:30", "Te dormiste a las 02:00"],
            fuente: "National Sleep Foundation (Hirshkowitz et al., 2015). Cálculo con alarma a las 07:00",
            mal:  { titulo: "Si te duermes a las 02:00", lista: ["Dormirás 5 h, bajo lo recomendado", "Mañana partes cansado y con sueño"] },
            bien: { titulo: "Si te dormiste a tu hora", lista: ["Dormirás 7,5 h, dentro de lo recomendado", "Mañana partes con energía"] }
        }
    ],

    // Momento de las 18:00 (Trabajo): se usa cuando exista img/dia-1800.jpg (ver main.js)
    "momentoTrabajo": {
        titulo: "Trabajo", dato: "3 de 10", texto: "estudiantes estudian y trabajan", fuente: "CASEN 2022",
        mal:  { titulo: "Si trabajas sin ordenar la semana", lista: ["Terminas restando horas de sueño", "Todo se junta al final"] },
        bien: { titulo: "Si fijas bloques en la semana", lista: ["Sabes cuándo estudias y cuándo trabajas", "Baja el estrés"] }
    },
    // --- Sugerencias y Nosotros ---
    "nav.nosotros": "Nosotros",
    "nav.sugerencias": "Ayúdanos",
    "sugerencias.titulo": "Déjanos tus sugerencias",
    "sugerencias.sub": "Tu opinión nos ayuda a mejorar la experiencia.",
    "sugerencias.califica": "Califica la página:",
    "sugerencias.placeholder": "Escribe tus ideas, sugerencias o críticas aquí...",
    "sugerencias.enviar": "Enviar sugerencia",
    "sugerencias.exito": "Gracias por ayudarnos a mejorar",
    "sugerencias.otra": "Dejar otra sugerencia",
    "quienes.misionTitulo": "Nuestra misión",
    "quienes.misionTexto": "Acompañar y orientar a las y los estudiantes de educación superior en Chile en la recuperación consciente de su tiempo, calidad de vida y salud mental. A través del uso de datos reales y herramientas digitales sencillas, transformamos información compleja en experiencias intuitivas, accesibles y personalizadas. Nuestro propósito es visibilizar los desequilibrios cotidianos provocados por la sobrecarga académica, las jornadas laborales y los tiempos de traslado, demostrando cómo la incorporación de pequeños cambios sostenibles en la rutina diaria protege la salud mental, potencia el rendimiento y devuelve horas de valor para lo que verdaderamente importa.",
    "quienes.visionTitulo": "Nuestra visión",
    "quienes.visionTexto": "Consolidarnos como la plataforma digital interactiva de referencia a nivel nacional en bienestar estudiantil y educación de hábitos de vida, impulsando una profunda transformación cultural en los entornos universitarios y técnicos del país. Queremos forjar una comunidad académica donde el descanso, el cuidado de la salud mental y la preservación del tiempo personal dejen de considerarse privilegios o pérdidas de tiempo. Así, que pasen a ser reconocidos activamente como pilares fundamentales y determinantes para el éxito y la sostenibilidad académica y profesional de cada estudiante.",
    "quienes.datosTitulo": "Nuestros datos",
    "quienes.datosTexto": "Para construir esta plataforma, analizamos y cruzamos información oficial de tres fuentes principales de Chile:",
    "quienes.equipoTexto": "Este sitio fue desarrollado por Estudiantes de la Pontificia Universidad Católica de Chile."
},

// =====================================================================
// ENGLISH
// =====================================================================
en: {
    // --- Header ---
    "nav.explorar": "Explore Chile",
    "nav.vive": "Live a day",
    "nav.quienes": "About us",
    "nav.contacto": "Contact",
    "idioma.aria": "Change language",

    // --- Home ---
    "inicio.titulo1": "Are you a student who would like to",
    "inicio.titulo2": "make better use of your time?",
    "inicio.si": "Yes",

    // --- Context ---
    "contexto.intro": "Did you know that",
    "contexto.cifra": "66.8%",
    "contexto.detalle": "of young people in Chile spend more than 4 hours a day glued to a screen?",
    "contexto.subtitulo": "That's more than 2 straight months glued to a screen every year!",
    "contexto.fuente": "Source: SUBTEL and Cadem (2024), young people aged 16 to 29",
    "contexto.minutos": "3 minutes",
    "contexto.anonimo": "Anonymous",
    "contexto.alTiro": "Instant results",
    "contexto.empezar": "Start the test",

    // --- Test: progress ---
    "test.volver": "Back",
    "test.quedan": "About {n} min left",
    "test.quedaMenos": "Less than 1 min left",
    "test.seguir": "Done, continue",
    "test.seguirCorto": "Continue",
    "test.verResultados": "See my results",

    // --- Step 1: profile ---
    "test.etiquetaPerfil": "Your profile",
    "test.edadTitulo": "How old are you?",
    "edad.18": "18 or younger",
    "edad.19": "19 to 21",
    "edad.22": "22 to 24",
    "edad.25": "25 to 29",
    "edad.30": "30 or older",
    "test.ocupacionTitulo": "Do you only study, or do you also work?",
    "ocupacion.estudia": "I only study",
    "ocupacion.trabaja": "I study and work",
    "test.regionTitulo": "Which region do you live in?",

    "region.15": "Arica y Parinacota",
    "region.1": "Tarapacá",
    "region.2": "Antofagasta",
    "region.3": "Atacama",
    "region.4": "Coquimbo",
    "region.5": "Valparaíso",
    "region.13": "Santiago Metropolitan",
    "region.6": "O'Higgins",
    "region.7": "Maule",
    "region.16": "Ñuble",
    "region.8": "Biobío",
    "region.9": "Araucanía",
    "region.14": "Los Ríos",
    "region.10": "Los Lagos",
    "region.11": "Aysén",
    "region.12": "Magallanes",

    // --- Step 2: your day ---
    "test.etiquetaDia": "Your day",
    "test.diaTitulo": "How many hours do you spend on each thing on a normal day?",
    "test.alertaHoras": "You've reached 24 hours. To raise one thing, lower another.",
    "act.sueno": "Sleep",
    "act.estudio": "Classes and study",
    "act.trabajo": "Work",
    "act.traslado": "Commute",
    "act.ocio": "Screen-free rest and leisure",
    "act.deporte": "Exercise",
    "act.celular": "Phone and social media",
    "dona.aria": "How your 24 hours are split",
    "dona.de24": "of 24 h",
    "dona.sinAsignar": "{n} h unassigned",
    "dona.completo": "Full day",

    // --- Step 3: habits ---
    "test.etiquetaHabitos": "Your habits",
    "test.camaTitulo": "Do you use your phone in bed before going to sleep?",
    "test.postergarTitulo": "Do you tend to put off tasks?",
    "test.planificarTitulo": "Do you plan your week?",
    "test.deporteTitulo": "How many days a week do you exercise?",
    "op.casiNunca": "Hardly ever",
    "op.aVeces": "Sometimes",
    "op.casiSiempre": "Almost always",
    "op.seguido": "Often",
    "op.si": "Yes",
    "op.no": "No",
    "op.ninguno": "None",
    "op.1o2": "1 or 2",
    "op.3o4": "3 or 4",
    "op.5oMas": "5 or more",

    // --- Step 4: how you feel ---
    "test.etiquetaSientes": "How you feel",
    "test.animoTitulo": "How has your mood been most of the time?",
    "animo.1": "Very bad",
    "animo.2": "Bad",
    "animo.3": "So-so",
    "animo.4": "Good",
    "animo.5": "Very good",
    "test.bateriaTitulo": "How do you feel at the end of the day?",
    "test.bateriaAyuda": "Move the slider to fill the battery.",
    "test.bateriaAria": "Energy at the end of the day, from Exhausted to Full of energy",
    "test.agotado": "Exhausted",
    "test.lleno": "Full of energy",

    // --- Step 5: well-being ---
    "test.etiquetaMas": "A bit more about you",
    "test.bienIntroTitulo": "Before you see your results, we'd like to ask you a bit more",
    "test.bienIntroAyuda": "Just three short questions. They help us give you guidance that's actually useful.",
    "test.duracionTitulo": "How long have you felt this way?",
    "op.unosDias": "A few days",
    "op.unasSemanas": "A few weeks",
    "op.masDeUnMes": "More than a month",
    "test.factorTitulo": "What do you think affects it most?",
    "factor.academica": "My academic workload",
    "factor.trabajo": "Work",
    "factor.sueno": "Not sleeping enough",
    "factor.lejos": "Being away from my family or hometown",
    "factor.otro": "Something else",
    "test.apoyoTitulo": "Do you have someone you can turn to?",

    // --- Loading screen ---
    "carga.titulo": "Working out your result...",
    "carga.frases": [
        "Going over your answers...",
        "Did you know good sleep helps you remember what you study?",
        "Rest isn't wasted time: it helps prevent academic burnout.",
        "Working out your day's balance..."
    ],

    // --- Result ---
    "res.nombre": "Your day's balance",
    "res.de10": "out of 10",
    "res.franjaAtencion": "Needs attention",
    "res.franjaMejorar": "Could improve",
    "res.franjaBien": "Good",
    "res.tu": "You",
    "res.verPlan": "See how",
    "res.aviso": "This score is a guide, not a diagnosis.",
    "res.areasTitulo": "What's behind your score",
    "res.frase": "With two changes you could reach <strong>{nota} out of 10</strong>: {cambios}.",
    "res.fraseMantener": "Small adjustments will help you keep your balance.",
    "res.y": " and ",
    "res.puntaje": "{nota} out of 10",
    "res.repartoTitulo": "How you split your day",
    "pie.lema": "Your day, in balance",
    "pie.ayuda": "Need to talk to someone?",

    "area.sueno": "Sleep",
    "area.carga": "Daily load",
    "area.celular": "Phone",
    "area.movimiento": "Movement",
    "area.organizacion": "Organization",
    "area.animo": "Mood and energy",
    "area.descanso": "Rest & Sleep",
    "area.estudio": "Study",
    "area.trabajo": "Work",
    "area.traslado": "Commute",
    "area.ocio": "Leisure",
    "area.deporte": "Sports & Health",
    "res.baseDatos": "Database",

    "tarjetasDiagnostico": {
        descanso: {
            titulo: "Rest & Sleep",
            icono: "fa-solid fa-moon",
            fuentes: [
                { nombre: "AASM / SRS Consensus", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4442216/" },
                { nombre: "Sleep Foundation", url: "https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need" }
            ],
            rangos: [
                {
                    min: 0, max: 6.9,
                    estado: "Deficient",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Regularly sleeping less than 7 hours impairs concentration, memory and immune function. It is also linked to chronic fatigue and stress."
                },
                {
                    min: 7, max: 9,
                    estado: "Optimal / Healthy",
                    nivel: "bien",
                    puntos: 10,
                    texto: "You meet the recommended range for young adults. Sleeping 7 to 9 hours consolidates learning and ensures physical and mental recovery."
                },
                {
                    min: 9.1, max: 24,
                    estado: "Excessive",
                    nivel: "mejorar",
                    puntos: 6,
                    texto: "Consistently exceeding 9 hours may be associated with daytime sleepiness and circadian rhythm disruption."
                }
            ]
        },
        estudio: {
            titulo: "Study",
            icono: "fa-solid fa-book-open",
            fuentes: [
                { nombre: "CASEN Survey (Education)", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen" },
                { nombre: "Athenify Study Research", url: "https://athenify.io/es/blog/cuantas-horas-estudiar-al-dia" }
            ],
            rangos: [
                {
                    min: 0, max: 1.9,
                    estado: "Low",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Dedication of very little autonomous study time can pile up stress before evaluations, harming academic performance."
                },
                {
                    min: 2, max: 5.5,
                    estado: "Balanced",
                    nivel: "bien",
                    puntos: 10,
                    texto: "You maintain a sustainable daily study load without sacrificing rest or personal time."
                },
                {
                    min: 5.6, max: 24,
                    estado: "Overload risk",
                    nivel: "atencion",
                    puntos: 5,
                    texto: "Research shows that after 5-6 hours of intense study, cognitive returns diminish sharply, raising burnout risks."
                }
            ]
        },
        trabajo: {
            titulo: "Work",
            icono: "fa-solid fa-briefcase",
            fuentes: [
                { nombre: "ENUT (INE) - Time Use", url: "https://www.ine.gob.cl/estadisticas/sociales/genero/uso-del-tiempo" },
                { nombre: "CASEN Survey", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen" }
            ],
            rangos: [
                {
                    min: 0, max: 0.1,
                    estado: "Exclusive dedication",
                    nivel: "bien",
                    puntos: 10,
                    texto: "You do not work paid hours, providing more schedule flexibility for studies, leisure, and sleep."
                },
                {
                    min: 0.2, max: 4.5,
                    estado: "Compatible part-time",
                    nivel: "bien",
                    puntos: 9,
                    texto: "You balance study with moderate work within youth part-time frameworks, without severely compromising recovery."
                },
                {
                    min: 4.6, max: 24,
                    estado: "High work load",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "An extensive work schedule directly competes with study and rest, significantly raising burnout risks."
                }
            ]
        },
        traslado: {
            titulo: "Commute",
            icono: "fa-solid fa-bus",
            fuentes: [
                { nombre: "CASEN Survey", url: "https://www.latercera.com/pulso/noticia/casen-2017-muestra-fuerte-diferencia-tiempos-traslado-santiaguinos-segun-tipo-trabajo/873500/" },
                { nombre: "ENUT (INE)", url: "https://www.ine.gob.cl/estadisticas/sociales/genero/uso-del-tiempo" }
            ],
            rangos: [
                {
                    min: 0, max: 0.9,
                    estado: "Low impact",
                    nivel: "bien",
                    puntos: 10,
                    texto: "Your travel times are short, leaving more useful hours and energy during the week."
                },
                {
                    min: 1, max: 2.2,
                    estado: "National urban average",
                    nivel: "mejorar",
                    puntos: 7,
                    texto: "You fall within the average commute of main urban areas in Chile. Using this time for active leisure helps reduce fatigue."
                },
                {
                    min: 2.3, max: 24,
                    estado: "Excessive",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "Extended transit times correlate with elevated stress, posture fatigue, and critical loss of free time."
                }
            ]
        },
        ocio: {
            titulo: "Leisure",
            icono: "fa-solid fa-mug-hot",
            fuentes: [
                { nombre: "Vida Saludable (UdeC)", url: "https://vidasaludable.udec.cl/node/279" },
                { nombre: "INJUV Survey", url: "https://www.injuv.gob.cl/" },
                { nombre: "Sleep Foundation", url: "https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need" }
            ],
            rangos: [
                {
                    min: 0, max: 0.9,
                    estado: "Deficit",
                    nivel: "atencion",
                    puntos: 4,
                    texto: "You are sacrificing personal time. Leisure is a cognitive necessity that lowers anxiety and prevents burnout."
                },
                {
                    min: 1, max: 4,
                    estado: "Balanced",
                    nivel: "bien",
                    puntos: 10,
                    texto: "You keep healthy space for personal interests and social relationships, boosting immune health and sleep quality."
                },
                {
                    min: 4.1, max: 24,
                    estado: "Screen / Leisure overload",
                    nivel: "atencion",
                    puntos: 5,
                    texto: "Excessive sedentary leisure or screen consumption displaces sleep and study, raising procrastination and visual fatigue."
                }
            ]
        },
        deporte: {
            titulo: "Sports & Health",
            icono: "fa-solid fa-person-running",
            fuentes: [
                { nombre: "WHO - Physical Activity", url: "https://www.who.int/es/news-room/fact-sheets/detail/physical-activity" },
                { nombre: "PAHO Recommendations", url: "https://www.paho.org/es/noticias/9-5-2012-recomendaciones-mundiales-sobre-actividad-fisica-para-salud" }
            ],
            rangos: [
                {
                    min: 0, max: 0.25,
                    estado: "Sedentary",
                    nivel: "atencion",
                    puntos: 3,
                    texto: "Physical activity is below recommended minimums. 20 minutes a day boosts cardiovascular and memory function."
                },
                {
                    min: 0.26, max: 1.25,
                    estado: "Healthy",
                    nivel: "bien",
                    puntos: 10,
                    texto: "You meet the recommended guideline for young adults (150-300 min/week), enhancing mood and fitness."
                },
                {
                    min: 1.26, max: 24,
                    estado: "High performance",
                    nivel: "bien",
                    puntos: 9,
                    texto: "You maintain very high exercise volume. Compensate with hydration, nutrition, and rest to avoid strain."
                }
            ]
        }
    },

    "diagnostico": {
        atencion: "Your day is asking for a change. You don't have to fix everything at once: start with one thing.",
        mejorar: "Some things are going well, and others have room to improve.",
        bien: "Your day is fairly balanced. Keep looking after what works for you."
    },

    "textosAreas": {
        sueno: {
            atencion: "You sleep less than recommended (7 to 9 hours). Not sleeping enough shows up in your focus and mood the next day.",
            mejorar: "You're close to the recommended amount (7 to 9 hours). Putting your phone down before bed can give you the time you're missing.",
            bien: "You sleep within the recommended range (7 to 9 hours). Keep that schedule, weekends included."
        },
        carga: {
            atencion: "Classes, work and commuting take up almost your whole day. Make sure they don't eat into your sleep.",
            mejorar: "Classes, work and commuting take up a good part of your day. Organizing your week helps keep things from piling up.",
            bien: "Your load of classes, work and commuting leaves you room to rest."
        },
        celular: {
            atencion: "Your phone takes up many hours of your day. That's time you could use to sleep, move or rest.",
            mejorar: "You spend several hours a day on your phone. Setting a limit on the apps you use most can give you time back.",
            bien: "You use your phone very little beyond what you need. Nice."
        },
        movimiento: {
            atencion: "You hardly exercise. Starting with 20-minute walks already counts.",
            mejorar: "You do some exercise. Adding one more day gets you closer to the 150 minutes a week the WHO recommends.",
            bien: "You move several days a week. You're on track for the 150 minutes a week the WHO recommends."
        },
        organizacion: {
            atencion: "Putting things off and not planning makes everything pile up. A little time on Sunday to organize your week can change a lot.",
            mejorar: "Sometimes you plan and sometimes you put things off. Starting with the shortest task makes it easier to begin.",
            bien: "You plan and don't leave everything for later. That gives you real free time."
        },
        animo: {
            atencion: "You end the day low on energy and in a low mood. Above, we've left you some ideas and support contacts.",
            mejorar: "Your energy and mood are halfway there. Sleeping better and moving more usually helps.",
            bien: "You end the day with energy and in a good mood."
        }
    },

    // --- Well-being message ---
    "bien.tituloDerivar": "Talking to someone can help",
    "bien.tituloConsejo": "An idea for these days",
    "bien.contextoLejos": "Being away from your family or hometown is a big change, and it's normal to feel it. Many institutions have groups and activities for students from other regions: they can be a good way to build a support network.",
    "bien.derivar": "When you've felt bad for more than a month, or feel you have no one to talk to, talking to a professional helps. You don't need to wait until you feel worse to ask for support.",
    "bien.apoyoRegion": "In your region you can find support at:",
    "bien.apoyoGeneral": "Your university, professional institute (IP) or technical training center (CFT) has a psychological support or student well-being service. Look for it on your institution's website or ask at student affairs.",
    "bien.tambienLlamar": "You can also call:",
    "bien.siSigue": "If this continues or gets harder, you can call:",
    "bien.aVeces": "Telling someone you trust how you feel also helps.",
    "bien.linea4141": "from the Ministry of Health, free, 24/7",
    "bien.linea": "Line",
    "consejos": {
        academica: "Choose just one task for today and break it into small steps. If the deadlines don't work for you, talking to your teachers or teaching assistants is also an option.",
        trabajo: "Set clear blocks in your week for studying and for working, and protect your sleep.",
        sueno: "This week, try putting your phone down 30 minutes before bed and going to sleep at the same time every night.",
        lejos: "Call or video call someone from your family this week, and look for an activity at your institution to meet people.",
        otro: "Take some time each day for something you enjoy that doesn't involve a screen, and talk to someone you trust about how you feel."
    },

    // --- Live a day invite and plan button ---
    "invita.titulo": "How does a day change with different habits?",
    "invita.texto": "Walk through a full day in a student's life, from morning to the small hours.",
    "invita.boton": "Live a day",
    "cta.titulo": "So what can I do?",
    "cta.boton": "Find out",

    // --- Action plan ---
    "guia.titulo": "Your action plan",
    "guia.sub": "Small adjustments can change your day a lot. Turn on changes to see how your day would improve, and add them to your calendar.",
    "mejora.suenoTitulo": "Sleep 1 more hour",
    "mejora.suenoTexto": "By cutting 1 h of screen time at night.",
    "mejora.suenoNombre": "sleeping 1 more hour",
    "mejora.deporteTitulo": "20-minute walk",
    "mejora.deporteTexto": "Use part of your commute or free time.",
    "mejora.deporteNombre": "walking 20 minutes a day",
    "mejora.estudioTitulo": "Pomodoro blocks",
    "mejora.estudioTexto": "Study in 25-minute blocks and free up 30 min.",
    "mejora.estudioNombre": "studying in Pomodoro blocks",
    "mejora.planificarTitulo": "Plan your week",
    "mejora.planificarTexto": "20 minutes on Sunday to sort out the week ahead.",
    "mejora.planificarNombre": "planning your week",
    "guia.impacto": "Impact on your day",
    "guia.actual": "Your day now",
    "guia.conCambios": "Your day with the changes",
    "guia.quedaria": "Your day's balance would be:",

    "cal.titulo": "Add it to my calendar",
    "cal.ics": "Download .ics",
    "cal.google": "Google Calendar",
    "eventos": {
        sueno: { titulo: "Put my phone down and go to sleep", detalle: "Put your phone down 30 minutes before bed and sleep 1 more hour." },
        deporte: { titulo: "20-minute walk", detalle: "Go for a 20-minute walk. It can be part of your commute." },
        estudio: { titulo: "Pomodoro study block", detalle: "Two 25-minute study blocks with a 5-minute break. Phone away." },
        planificar: { titulo: "Plan my week", detalle: "20 minutes to check assignments, tests and schedules for the coming week." }
    },

    "recursos.titulo": "Tools to make it happen",
    "recursos.podcastTitulo": "Podcast: Atomic Habits",
    "recursos.podcastTexto": "Learn how small 1% daily improvements change your life without needing extreme motivation.",
    "recursos.podcastLink": "Listen on Spotify",
    "recursos.pomodoroTitulo": "The Pomodoro Technique",
    "recursos.pomodoroTexto": "A 5-minute video on how to study in 25-minute blocks to avoid mental fatigue.",
    "recursos.pomodoroLink": "Watch the tutorial",
    "recursos.saludTitulo": "Salud Responde",
    "recursos.saludTexto": "If you feel overwhelmed, you're not alone. Talk to mental health professionals for free.",
    "recursos.saludLink": "Visit the official site",

    "final.titulo": "Your health is your most valuable resource",
    "final.texto": "Making time to rest isn't wasting time, it's sharpening the axe. Share this tool with a friend you know needs a break.",
    "compartir.ws": "WhatsApp",
    "compartir.ig": "Instagram",
    "compartir.resultado": "my day's balance came out at {nota} out of 10",
    "compartir.sinResultado": "found out how I use my time",
    "compartir.textoWs": "I took the HazteElTiempo.cl test and {resultado}. What's yours? It takes 4 minutes and it's anonymous: {url}",
    "compartir.textoIg": "I took the HazteElTiempo.cl test and {resultado}. What about you? It takes 4 minutes: {url}",
    "compartir.copia": "Copy this text and paste it into your Instagram story or a message:",
    "compartir.copiado": "We copied the text. Paste it into your Instagram story or a message:",
    "reiniciar": "Take the test again",

    // --- Live a day (horizontal walk-through) ---
    "vd.pista": "Scroll to walk through the day",
    "vd.modoAria": "How to live the day",
    "vd.modoBien": "Good habits",
    "vd.modoMal": "Bad habits",
    "vd.verMas": "See more",
    "vd.cerrar": "Close",
    "vd.deSueno": "of sleep",
    "vd.ilustrativo": "Illustrative",
    "vd.hipnogramaAria": "Sleep stages during the night",
    "vd.despierto": "Awake",
    "vd.liviano": "Light",
    "vd.rem": "REM",
    "vd.profundo": "Deep",
    "vd.barraAria": "Timeline of the day, from 08:00 to 07:00",
    "vd.irA": "Go to {hora}",
    "vd.finalFrase": "The difference starts long before bedtime",
    "vd.fuenteNoche": "Institute of Medicine (2006), Sleep Physiology",
    "vd.fuentePantalla": "Hjetland et al. (2025), Frontiers in Psychiatry",

    "noche": [
        { titulo: "Before bed",
          bien: { frase: "Puts the phone down and reads for a while.", detalle: ["Without a screen in bed, falling asleep is faster.", "Rests better and does better the next day."] },
          mal:  { frase: "In bed with the phone.", detalle: ["Every hour of screen time in bed raises the risk of insomnia by 59%.", "And takes away about 24 minutes of sleep."] } },
        { titulo: "Lights out",
          bien: { frase: "Falls asleep.", detalle: ["The first sleep cycle begins, lasting about 90 minutes."] },
          mal:  { frase: "Still on the phone.", detalle: ["Face lit up by the screen."] } },
        { titulo: "After midnight",
          bien: { frase: "Deep sleep.", detalle: ["The most restorative stage.", "It is concentrated in the first third of the night."] },
          mal:  { frase: "Still awake.", detalle: ["Every hour of screen time in bed takes away about 24 minutes of sleep."] } },
        { titulo: "Small hours",
          bien: { frase: "In the third cycle.", detalle: ["Each cycle lasts about 90 minutes and goes through light, deep and REM sleep."] },
          mal:  { frase: "Only now falls asleep.", detalle: ["With the alarm at 07:00, there are 5 hours of sleep left."] } },
        { titulo: "Before dawn",
          bien: { frase: "More REM sleep.", detalle: ["The dreaming stage.", "It is linked to sorting out what was learned."] },
          mal:  { frase: "In the first cycle of deep sleep.", detalle: ["Almost all of the night's REM is still to come."] } },
        { titulo: "The alarm goes off",
          bien: { frase: "Wakes up after 9 hours.", detalle: ["Close to 6 full cycles."] },
          mal:  { frase: "The alarm cuts a cycle in half.", detalle: ["Sleeps 5 hours, about 3 cycles.", "Misses much of the REM, which is concentrated at the end of the night."] } }
    ],

    // --- Explore Chile ---
    "explorar.titulo": "How do students live in your region?",
    "explorar.sub": "Tap a region on the map or in the list to see its profile.",
    "explorar.mapaAria": "Map of Chile by region",
    "explorar.menos": "Fewer",
    "explorar.mas": "More",
    "explorar.leyenda": "Higher education students",
    "explorar.sinDatosMapa": "The map will be colored once the real data is in.",
    "explorar.tooltip": "{region}: {n} students",
    "explorar.pendiente": "[DATO PENDIENTE]",
    "explorar.fichaVacia": "Choose a region to see what its students are like, where they study and where to get support.",
    "explorar.bloqueEstudiantes": "What students are like",
    "explorar.datoEstudiantes": "higher education students",
    "explorar.datoTrabaja": "study and work",
    "explorar.datoDuerme": "don't get enough sleep",
    "explorar.bloqueEstudian": "Where they study",
    "explorar.universidades": "universities",
    "explorar.ip": "professional institutes (IP)",
    "explorar.cft": "technical training centers (CFT)",
    "explorar.sitios": "Institution websites:",
    "explorar.bloqueApoyo": "Where to get support",
    "explorar.apoyoEstudiantil": "Student support services:",
    "explorar.fuentes": "Sources: SIES (Ministry of Education), CASEN 2022, ENUT 2023",
    "explorar.boton": "Compare yourself with your region · Take the test",

    // --- Live a day ---
    "vive.titulo": "Live a day",
    "vive.intro": "Walk through a full day in a student's life, from morning to the small hours. Choose how to live it and scroll down.",
    "vive.modoAria": "How to live the day",
    "vive.modoBien": "With good habits",
    "vive.modoMal": "With bad habits",
    "vive.plegarAria": "Collapse or expand the details",
    "vive.ejemplo": "Example figure",
    "vive.lineaAria": "Moments of the day",
    "vive.manana": "Morning",
    "vive.madrugada": "Small hours",
    "vive.sigue": "Keep scrolling",
    "vive.fuente": "Source: {fuente}",
    "vive.falta": "Missing {archivo}",
    "vive.alt": "Illustration: {titulo}, bad habit on the left and good habit on the right",
    "vive.recomendado": "Recommended: 7 to 9 h",
    "vive.finalTitulo": "How the day ends",
    "vive.finalSub": "With the alarm set for 07:00, this is how much sleep you get.",
    "vive.finalBuenas": "9 h",
    "vive.finalMalas": "5 h",
    "vive.durmio2330": "You fell asleep at 22:00",
    "vive.durmio0200": "You fell asleep at 02:00",
    "vive.finalNota": "Recommended: 7 to 9 h. Source: National Sleep Foundation (Hirshkowitz et al., 2015)",
    "vive.finalPregunta": "And what's your day like?",
    "vive.finalBoton": "Take the test",

    "momentos": [
        {
            titulo: "Commute", dato: "5 in 10", texto: "students take more than 1 hour to get where they're going", fuente: "ENUT 2023",
            mal:  { titulo: "If you spend the ride glued to your phone", lista: ["You arrive with your head overloaded", "The trip feels like wasted time"] },
            bien: { titulo: "If you listen to a podcast", lista: ["The trip becomes useful time", "You review without even noticing"] }
        },
        {
            titulo: "Classes and study", dato: "59%", texto: "of university students in one study set themselves study goals",
            fuente: "Reyes-González, Meneses-Báez and Díaz-Mujica (2022)",
            mal:  { titulo: "If you study with everything open", lista: ["You jump between tabs and notifications", "Studying takes you longer"] },
            bien: { titulo: "If you plan your week", lista: ["You know what to do and when", "Those who do best prioritize and rest"] }
        },
        {
            titulo: "Lunch and a break", dato: "1 h", texto: "a day is what students spend eating", fuente: "ENUT 2023",
            mal:  { titulo: "If you eat in front of the computer", lista: ["There's no real break", "The afternoon feels heavier"] },
            bien: { titulo: "If you have lunch with others", lista: ["You recharge for the afternoon", "You connect and your stress goes down"] }
        },
        {
            titulo: "Pending tasks", dato: "4 of 6", texto: "areas of well-being are lower in those who procrastinate most",
            fuente: "Cordovez, Ramírez and Villafaña (2023), Chilean students",
            mal:  { titulo: "If you leave it for later", lista: ["Stress builds up", "Your sense of purpose drops"] },
            bien: { titulo: "If you start with the shortest task", lista: ["Getting started is easier", "You make progress and have free time left"] }
        },
        {
            titulo: "Exercise", dato: "150 min", texto: "of physical activity a week is what the WHO recommends",
            fuente: "World Health Organization (2020)",
            mal:  { titulo: "If you sit all day", lista: ["You get more tired", "It's harder to let go of stress"] },
            bien: { titulo: "If you get out and move", lista: ["20 to 30 minutes a day is enough", "Your mood and sleep improve"] }
        },
        {
            titulo: "Phone and social media", dato: "66.8%", texto: "of young people aged 16 to 29 spend more than 4 h a day online",
            fuente: "SUBTEL and Cadem (2024)",
            mal:  { titulo: "If you scroll nonstop", lista: ["Time slips away without you noticing", "You miss your bedtime"] },
            bien: { titulo: "If you set yourself a limit", lista: ["You get time back for things you enjoy", "You're calmer when bedtime comes"] }
        },
        {
            titulo: "Before bed", dato: "+59%", texto: "higher risk of insomnia for every hour of screen time in bed",
            fuente: "Hjetland et al. (2025), Frontiers in Psychiatry",
            mal:  { titulo: "If you use your phone", lista: ["You sleep 24 minutes less", "It's harder to focus the next day"] },
            bien: { titulo: "If you put it down 30 min earlier", lista: ["You fall asleep faster", "You rest better and do better"] }
        },
        {
            titulo: "After midnight", dato: "−36 min", texto: "of sleep already lost after an hour and a half on your phone in bed",
            fuente: "Hjetland et al. (2025): about 24 min less sleep for every hour of screen time in bed",
            mal:  { titulo: "If you keep using your phone", lista: ["You told yourself you'd be asleep by 23:30", "Every video takes a bit more of your sleep"] },
            bien: { titulo: "If you kept to your bedtime", lista: ["You've already been asleep for 1 hour", "Your body has started to recover"] }
        },
        {
            titulo: "Small hours", dato: "2.5 h", texto: "less sleep from staying on your phone until 02:00",
            etiquetasBarras: ["You fell asleep at 23:30", "You fell asleep at 02:00"],
            fuente: "National Sleep Foundation (Hirshkowitz et al., 2015). Calculated with an alarm at 07:00",
            mal:  { titulo: "If you fall asleep at 02:00", lista: ["You'll sleep 5 h, below what's recommended", "Tomorrow you'll start out tired and sleepy"] },
            bien: { titulo: "If you fell asleep on time", lista: ["You'll sleep 7.5 h, within what's recommended", "Tomorrow you'll start out with energy"] }
        }
    ],

    "momentoTrabajo": {
        titulo: "Work", dato: "3 in 10", texto: "students study and work", fuente: "CASEN 2022",
        mal:  { titulo: "If you work without organizing your week", lista: ["You end up cutting into your sleep", "Everything piles up at the end"] },
        bien: { titulo: "If you set blocks in your week", lista: ["You know when you study and when you work", "Your stress goes down"] }
    },

    // --- Feedback & About Us ---
    "nav.nosotros": "About Us",
    "nav.sugerencias": "Help Us",
    "sugerencias.titulo": "Leave us your feedback",
    "sugerencias.sub": "Your opinion helps us improve the experience.",
    "sugerencias.califica": "Rate our site:",
    "sugerencias.placeholder": "Write your ideas, suggestions, or criticisms here...",
    "sugerencias.enviar": "Submit feedback",
    "sugerencias.exito": "Thanks for helping us improve",
    "sugerencias.otra": "Leave another suggestion",
    "quienes.misionTitulo": "Our mission",
    "quienes.misionTexto": "To guide and support higher education students in Chile in consciously reclaiming their time, quality of life, and mental health. By using real data and simple digital tools, we transform complex information into intuitive, accessible, and personalized experiences. Our purpose is to bring visibility to everyday imbalances caused by academic overload, long workdays, and commute times, showing how small, sustainable daily changes protect mental health, boost performance, and return meaningful hours for what truly matters.",
    "quienes.visionTitulo": "Our vision",
    "quienes.visionTexto": "To establish ourselves as Chile's leading interactive digital platform for student well-being and lifestyle habit education, driving cultural transformation across the country's universities and technical institutes. We aspire to build an academic community where rest, mental health care, and personal time are no longer seen as luxuries or wasted time, but recognized as essential foundations for academic and personal success.",
    "quienes.datosTitulo": "Our data",
    "quienes.datosTexto": "To build this platform, we analyzed and cross-referenced official data from three main sources in Chile:",
    "quienes.equipoTexto": "This platform was developed by students from the Pontificia Universidad Católica de Chile.",
}

};
