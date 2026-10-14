// Obtener elementos de los sliders
const sueno = document.getElementById('sueno');
const estudio = document.getElementById('estudio');
const trabajo = document.getElementById('trabajo');
const traslado = document.getElementById('traslado');
const ocio = document.getElementById('ocio');

// Elementos de la interfaz
const valSueno = document.getElementById('val-sueno');
const valEstudio = document.getElementById('val-estudio');
const valTrabajo = document.getElementById('val-trabajo');
const valTraslado = document.getElementById('val-traslado');
const valOcio = document.getElementById('val-ocio');

const clockDisplay = document.getElementById('clock-display');
const clockStatus = document.getElementById('clock-status');
const clockBox = document.getElementById('clock-box');
const totalScore = document.getElementById('total-score');

// Switches del simulador
const chkSueno = document.getElementById('change-sueno');
const chkCelular = document.getElementById('change-celular');
const chkDeporte = document.getElementById('change-deporte');
const simScore = document.getElementById('sim-score');

function actualizar() {
  const hSueno = parseFloat(sueno.value);
  const hEstudio = parseFloat(estudio.value);
  const hTrabajo = parseFloat(trabajo.value);
  const hTraslado = parseFloat(traslado.value);
  const hOcio = parseFloat(ocio.value);

  // Actualizar valores numéricos en pantalla
  valSueno.textContent = hSueno;
  valEstudio.textContent = hEstudio;
  valTrabajo.textContent = hTrabajo;
  valTraslado.textContent = hTraslado;
  valOcio.textContent = hOcio;

  // Sumar horas totales
  const totalHoras = hSueno + hEstudio + hTrabajo + hTraslado + hOcio;
  clockDisplay.textContent = `${totalHoras.toFixed(1)} / 24 hrs`;

  // Validar si supera las 24 horas
  if (totalHoras > 24) {
    clockStatus.textContent = "⚠️ ¡Atención! Tu día supera las 24 horas.";
    clockStatus.style.color = "var(--color-bad)";
    clockBox.style.borderColor = "var(--color-bad)";
  } else {
    clockStatus.textContent = "¡Día dentro del límite permitido!";
    clockStatus.style.color = "var(--color-good)";
    clockBox.style.borderColor = "var(--border-light)";
  }

  // Calcular Puntaje General
  let score = 10;

  // Penalizar si duerme menos de 7 horas
  if (hSueno < 7) score -= (7 - hSueno) * 1.2;
  // Penalizar traslados muy largos (más de 2h)
  if (hTraslado > 2) score -= (hTraslado - 2) * 0.8;
  // Penalizar exceso de carga (estudio + trabajo > 10h)
  if ((hEstudio + hTrabajo) > 10) score -= 1.5;

  score = Math.max(1, Math.min(10, score));
  totalScore.textContent = `${score.toFixed(1)} / 10`;

  // Calcular simulador
  let bonus = 0;
  if (chkSueno.checked) bonus += 0.5;
  if (chkCelular.checked) bonus += 0.4;
  if (chkDeporte.checked) bonus += 0.5;

  const simFinal = Math.min(10, score + bonus);
  simScore.textContent = simFinal.toFixed(1);
}

// Event Listeners para interacción en tiempo real
[sueno, estudio, trabajo, traslado, ocio].forEach(input => {
  input.addEventListener('input', actualizar);
});

[chkSueno, chkCelular, chkDeporte].forEach(chk => {
  chk.addEventListener('change', actualizar);
});

// Ejecutar al cargar
actualizar();
