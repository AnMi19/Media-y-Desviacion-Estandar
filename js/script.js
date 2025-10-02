// Clase para manejar el arreglo de números
class MiArreglo {
  constructor() {
    this.numeros = [];
    this.cantidadTotal = 0;
  }

  definirCantidad(cantidad) {
    this.cantidadTotal = cantidad;
    this.numeros = [];
    return `Arreglo listo para ${cantidad} números`;
  }

  agregarNumero(numero) {
    if (this.numeros.length < this.cantidadTotal) {
      this.numeros.push(parseFloat(numero));
      return {
        exito: true,
        numero: numero,
        progreso: this.numeros.length,
        total: this.cantidadTotal,
        completo: this.numeros.length === this.cantidadTotal,
      };
    }
    return { exito: false, error: "El arreglo ya está lleno" };
  }

  obtenerNumeros() {
    return this.numeros;
  }

  obtenerProgreso() {
    return {
      actual: this.numeros.length,
      total: this.cantidadTotal,
      porcentaje: (this.numeros.length / this.cantidadTotal) * 100,
    };
  }
}

// Clase para los cálculos estadísticos
class CalculadoraEstadistica {
  constructor() {
    this.media = 0;
    this.desviacion = 0;
  }

  calcularMedia(numeros) {
    if (numeros.length === 0) return 0;

    const suma = numeros.reduce((total, num) => total + num, 0);
    this.media = suma / numeros.length;
    return this.media;
  }

  calcularDesviacionEstandar(numeros) {
    if (numeros.length < 2) return 0;

    // Calcular media si no está calculada
    if (this.media === 0) {
      this.calcularMedia(numeros);
    }

    // Calcular suma de las diferencias al cuadrado
    const sumaDiferencias = numeros.reduce((total, num) => {
      const diferencia = num - this.media;
      return total + diferencia * diferencia;
    }, 0);

    // Desviación estándar muestral (n-1)
    this.desviacion = Math.sqrt(sumaDiferencias / (numeros.length - 1));
    return this.desviacion;
  }

  obtenerResultados(numeros) {
    const media = this.calcularMedia(numeros);
    const desviacion = this.calcularDesviacionEstandar(numeros);

    return {
      media: media,
      desviacion: desviacion,
      totalNumeros: numeros.length,
      numeros: numeros,
    };
  }
}

// Variables globales
let miArreglo = new MiArreglo();
let calculadora = new CalculadoraEstadistica();

// Función para inicializar el arreglo con la cantidad deseada
function inicializarArreglo() {
  const cantidadInput = document.getElementById("cantidadInput");
  const mensajeDiv = document.getElementById("configMensaje");

  const cantidad = parseInt(cantidadInput.value);

  if (isNaN(cantidad) || cantidad < 2) {
    mostrarMensaje(
      mensajeDiv,
      "❌ Por favor ingresa un número mayor o igual a 2",
      "error"
    );
    return;
  }

  if (cantidad > 50) {
    mostrarMensaje(mensajeDiv, "❌ El máximo permitido es 50 números", "error");
    return;
  }

  // Inicializar el arreglo
  const mensaje = miArreglo.definirCantidad(cantidad);
  mostrarMensaje(mensajeDiv, "✅ " + mensaje, "success");

  // Mostrar paso 2
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";

  // Actualizar interfaz
  actualizarInterfazIngreso();
}

// Función para agregar números al arreglo
function agregarNumero() {
  const numeroInput = document.getElementById("numeroInput");
  const mensajeDiv = document.getElementById("numeroMensaje");

  const numero = numeroInput.value.trim();

  if (numero === "") {
    mostrarMensaje(mensajeDiv, "❌ Por favor ingresa un número", "error");
    return;
  }

  if (isNaN(parseFloat(numero))) {
    mostrarMensaje(
      mensajeDiv,
      "❌ Por favor ingresa un número válido",
      "error"
    );
    return;
  }

  // Agregar número al arreglo
  const resultado = miArreglo.agregarNumero(numero);

  if (resultado.exito) {
    mostrarMensaje(
      mensajeDiv,
      `✅ Número ${numero} agregado correctamente`,
      "success"
    );
    numeroInput.value = ""; // Limpiar input
    actualizarInterfazIngreso();

    // Si el arreglo está completo, mostrar paso 3
    if (resultado.completo) {
      setTimeout(() => {
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
        mostrarNumerosFinales();
      }, 1000);
    }
  } else {
    mostrarMensaje(mensajeDiv, "❌ " + resultado.error, "error");
  }
}

// Función para calcular las estadísticas
function calcularEstadisticas() {
  const numeros = miArreglo.obtenerNumeros();
  const resultados = calculadora.obtenerResultados(numeros);

  // Mostrar resultados en la interfaz
  document.getElementById("resultadoMedia").textContent =
    resultados.media.toFixed(4);
  document.getElementById("resultadoDesviacion").textContent =
    resultados.desviacion.toFixed(4);
  document.getElementById("resultadoTotal").textContent =
    resultados.totalNumeros;

  // Destacar los resultados
  const resultadoElements = document.querySelectorAll(".valor");
  resultadoElements.forEach((element) => {
    element.style.color = "#2ecc71";
    element.style.fontWeight = "bold";
  });
}

// Función para reiniciar la calculadora
function reiniciarCalculadora() {
  // Reiniciar las clases
  miArreglo = new MiArreglo();
  calculadora = new CalculadoraEstadistica();

  // Regresar al paso 1
  document.getElementById("step3").style.display = "none";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";

  // Limpiar inputs y mensajes
  document.getElementById("cantidadInput").value = "5";
  document.getElementById("numeroInput").value = "";
  document.getElementById("listaNumeros").innerHTML = "";
  document.getElementById("numerosFinales").innerHTML = "";

  // Limpiar resultados
  document.getElementById("resultadoMedia").textContent = "-";
  document.getElementById("resultadoDesviacion").textContent = "-";
  document.getElementById("resultadoTotal").textContent = "-";

  // Limpiar mensajes
  const mensajes = document.querySelectorAll(".mensaje");
  mensajes.forEach((mensaje) => {
    mensaje.style.display = "none";
    mensaje.className = "mensaje";
  });
}

// Funciones auxiliares para la interfaz
function actualizarInterfazIngreso() {
  const progreso = miArreglo.obtenerProgreso();
  const numeroActual = progreso.actual + 1;

  // Actualizar texto del progreso
  document.getElementById("progresoTexto").textContent = `Progreso: ${
    progreso.actual
  } de ${progreso.total} números (${Math.round(progreso.porcentaje)}%)`;

  // Actualizar barra de progreso
  document.getElementById(
    "barraProgreso"
  ).style.width = `${progreso.porcentaje}%`;

  // Actualizar label del input
  document.getElementById(
    "labelNumero"
  ).textContent = `Ingresa el número ${numeroActual}:`;

  // Actualizar lista de números
  actualizarListaNumeros();
}

function actualizarListaNumeros() {
  const numeros = miArreglo.obtenerNumeros();
  const listaDiv = document.getElementById("listaNumeros");

  listaDiv.innerHTML = "";

  numeros.forEach((numero, index) => {
    const badge = document.createElement("span");
    badge.className = "numero-badge";
    badge.textContent = numero;
    badge.title = `Número ${index + 1}: ${numero}`;
    listaDiv.appendChild(badge);
  });
}

function mostrarNumerosFinales() {
  const numeros = miArreglo.obtenerNumeros();
  const finalesDiv = document.getElementById("numerosFinales");

  finalesDiv.innerHTML = "";

  numeros.forEach((numero, index) => {
    const badge = document.createElement("span");
    badge.className = "numero-badge";
    badge.textContent = numero;
    badge.title = `Número ${index + 1}: ${numero}`;
    finalesDiv.appendChild(badge);
  });
}

function mostrarMensaje(elemento, mensaje, tipo) {
  elemento.textContent = mensaje;
  elemento.className = `mensaje ${tipo}`;

  // Ocultar mensaje después de 3 segundos (excepto errores)
  if (tipo === "success") {
    setTimeout(() => {
      elemento.style.display = "none";
    }, 3000);
  }
}

// Event listeners para mejor UX
document.addEventListener("DOMContentLoaded", function () {
  // Permitir enviar con Enter
  document
    .getElementById("cantidadInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        inicializarArreglo();
      }
    });

  document
    .getElementById("numeroInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        agregarNumero();
      }
    });

  // Focus en el primer input al cargar
  document.getElementById("cantidadInput").focus();
});

// Función para ejemplo rápido (opcional)
function cargarEjemplo() {
  document.getElementById("cantidadInput").value = "5";
  inicializarArreglo();

  // Simular entrada de números después de un delay
  setTimeout(() => {
    const numerosEjemplo = [10.5, 20.3, 15.7, 8.9, 12.1];
    let index = 0;

    const simularEntrada = setInterval(() => {
      if (index < numerosEjemplo.length) {
        document.getElementById("numeroInput").value = numerosEjemplo[index];
        agregarNumero();
        index++;
      } else {
        clearInterval(simularEntrada);
      }
    }, 800);
  }, 1000);
}

// Para probar rápidamente, descomenta la siguiente línea:
// document.addEventListener('DOMContentLoaded', cargarEjemplo);
