import { questions } from './questions_optimizado.js';

// Mostrar el nombre del usuario
const nombreUsuario = localStorage.getItem('nombreUsuario');
document.getElementById('nombreUsuario').textContent = `Usuario: ${nombreUsuario}`;

// Manejar el cierre de sesión
document.getElementById('cerrarSesion').addEventListener('click', () => {
    localStorage.removeItem('nombreUsuario');
    window.location.href = 'login.html';
});

// Configurar el número máximo de preguntas
const totalPreguntas = questions.length;
document.getElementById('maxPreguntas').textContent = totalPreguntas;
document.getElementById('maxPreguntasRange').textContent = totalPreguntas;
document.getElementById('num-preguntas').max = totalPreguntas;

// Validar el input de número de preguntas
document.getElementById('num-preguntas').addEventListener('input', function(e) {
    const valor = parseInt(e.target.value);
    if (valor > totalPreguntas) {
        e.target.value = totalPreguntas;
    } else if (valor < 1) {
        e.target.value = 1;
    }
});

let preguntasSeleccionadas = [];
let preguntaActual = 0;
let preguntaRespondida = false;
let puntuacion = 0;
let preguntasCorrectas = 0;
let preguntasIncorrectas = 0;

const preguntaElement = document.getElementById('pregunta');
const opcionesElement = document.getElementById('opciones');
const resultadoElement = document.getElementById('resultado');
const siguienteButton = document.getElementById('siguiente');
const comenzarButton = document.getElementById('comenzar');
const inicioContainer = document.getElementById('inicio-container');
const quizContainer = document.getElementById('quiz-container');

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

comenzarButton.addEventListener('click', () => {
    const numPreguntas = parseInt(document.getElementById('num-preguntas').value);
    if (numPreguntas > 0 && numPreguntas <= questions.length) {
        preguntasSeleccionadas = mezclarArray([...questions]).slice(0, numPreguntas);
        inicioContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        comenzarCuestionario();
    }
});

function comenzarCuestionario() {
    preguntaActual = 0;
    puntuacion = 0;
    preguntasCorrectas = 0;
    preguntasIncorrectas = 0;
    mostrarPregunta();
}

function actualizarEstadisticas() {
    const porcentajeAciertos = (preguntasCorrectas / (preguntasCorrectas + preguntasIncorrectas) * 100).toFixed(1);
    document.getElementById('estadisticas').innerHTML = `
        <div class="estadistica">
            <span>Puntuación: ${puntuacion}</span>
            <span>Correctas: ${preguntasCorrectas}</span>
            <span>Incorrectas: ${preguntasIncorrectas}</span>
            <span>Porcentaje de aciertos: ${porcentajeAciertos}%</span>
        </div>
    `;
}

function mostrarPregunta() {
    preguntaRespondida = false;
    const pregunta = preguntasSeleccionadas[preguntaActual];
    
    preguntaElement.textContent = pregunta.pregunta;
    opcionesElement.innerHTML = '';
    resultadoElement.style.display = 'none';
    resultadoElement.className = '';
    
    pregunta.opciones.forEach((opcion, index) => {
        const boton = document.createElement('div');
        boton.className = 'opcion';
        boton.textContent = opcion;
        boton.addEventListener('click', () => verificarRespuesta(index));
        opcionesElement.appendChild(boton);
    });
    
    document.getElementById('progreso').textContent = `Pregunta ${preguntaActual + 1} de ${preguntasSeleccionadas.length}`;
    siguienteButton.style.display = 'none';
}

function verificarRespuesta(respuestaSeleccionada) {
    if (preguntaRespondida) return;
    
    preguntaRespondida = true;
    const pregunta = preguntasSeleccionadas[preguntaActual];
    const opciones = document.querySelectorAll('.opcion');
    
    if (respuestaSeleccionada === pregunta.correcta) {
        opciones[respuestaSeleccionada].classList.add('correcta');
        resultadoElement.textContent = '¡Correcto!';
        resultadoElement.className = 'correcto';
        puntuacion += 100;
        preguntasCorrectas++;
    } else {
        opciones[respuestaSeleccionada].classList.add('incorrecta');
        opciones[pregunta.correcta].classList.add('correcta');
        resultadoElement.innerHTML = `Incorrecto. La respuesta correcta era: ${pregunta.opciones[pregunta.correcta]}`;
        resultadoElement.className = 'incorrecto';
        preguntasIncorrectas++;
    }
    
    actualizarEstadisticas();
    resultadoElement.style.display = 'block';
    siguienteButton.style.display = 'block';
    
    if (preguntaActual === preguntasSeleccionadas.length - 1) {
        siguienteButton.textContent = 'Ver Resultados Finales';
    }
}

siguienteButton.addEventListener('click', () => {
    if (preguntaActual === preguntasSeleccionadas.length - 1) {
        mostrarResultadosFinales();
    } else {
        preguntaActual++;
        mostrarPregunta();
    }
});

function mostrarResultadosFinales() {
    const porcentajeAciertos = (preguntasCorrectas / preguntasSeleccionadas.length * 100).toFixed(1);
    const mensaje = porcentajeAciertos >= 70 ? '¡Excelente trabajo!' : 'Sigue practicando, ¡lo harás mejor la próxima vez!';
    
    quizContainer.innerHTML = `
        <h1>Resultados Finales</h1>
        <div class="resultados-finales">
            <h2>${mensaje}</h2>
            <div class="estadisticas-finales">
                <p>Puntuación final: ${puntuacion}</p>
                <p>Respuestas correctas: ${preguntasCorrectas}</p>
                <p>Respuestas incorrectas: ${preguntasIncorrectas}</p>
                <p>Porcentaje de aciertos: ${porcentajeAciertos}%</p>
            </div>
            <button onclick="location.reload()" class="reiniciar">Intentar de nuevo</button>
        </div>
    `;
}
