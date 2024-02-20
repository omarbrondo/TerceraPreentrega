let botonPedido = document.querySelector("button");
let pedidos = []; // Array para almacenar la información de los pedidos

alert("⚠️INSTRUCCIONES⚠️\n ANTES DE HACER CLIC EN EL BOTON NARANJA, ABRIR LA CONSOLA");

function obtenerInformacionCliente(i) {
  return new Promise((resolve, reject) => {
    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.placeholder = `Nombre de la persona ${parseInt(i) + 1}`;
    const edadInput = document.createElement('input');
    edadInput.type = 'number';
    edadInput.placeholder = `Edad de la persona ${parseInt(i) + 1}`;
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Enviar';
    const form = document.createElement('form');
    form.appendChild(nombreInput);
    form.appendChild(edadInput);
    form.appendChild(submitButton);
    document.body.appendChild(form);
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const nombre = nombreInput.value;
      const edad = parseInt(edadInput.value);
      document.body.removeChild(form);
      console.log(`Menu para ${nombre.toUpperCase()}`);
      resolve({ nombre, edad });
    });
  });
}

// Función para ocultar elementos
function ocultarElementos() {
  document.querySelector("img").style.display = "none"; // Ocultar la imagen principal
  document.querySelector("footer").style.display = "none"; // Ocultar el footer
}

// Define objetos para representar los elementos del menú
const menuComida = {
  1: { item: "Hamburguesa con queso", precio: 4000 },
  2: { item: "Ensalada", precio: 3000 },
  3: { item: "Arroz con pollo", precio: 2000 },
};

const menuBebida = {
  1: { item: "Vaso de agua", precio: 0 },
  2: { item: "Gaseosa", precio: 500 },
  3: { item: "Cerveza", precio: 2000 },
  4: { item: "Mate", precio: 20 },
};

// Función de orden superior para calcular el subtotal de una categoría
const calcularSubtotalCategoria = (pedido, categoria) =>
  pedido.filter(item => item.tipo === categoria).reduce((total, item) => total + item.precio, 0);

function obtenerComida(nombre) {
  const pedidoComida = [];
  let comida;

  do {
    comida = prompt(
      `¿Qué comerá hoy ${nombre.toUpperCase()}? \n Seleccione Comida \n 1) Hamburguesa con queso 🍔💲4000  \n 2) Ensalada 🥗💲3000  \n 3) Arroz con pollo 🍚💲2000  \n 4) Listo! ✅`
    );

    if (parseInt(comida) !== 4) {
      const { item, precio } = menuComida[parseInt(comida)];
      pedidoComida.push({ item, precio, tipo: "Comida" });
      console.log(`${nombre.toUpperCase()} Eligió para comer ${item}`);
    }
  } while (parseInt(comida) !== 4);

  return { tipo: "Comida", pedido: pedidoComida };
}

function obtenerBebida(nombre, edad) {
  const pedidoBebida = [];
  let bebida;

  do {
    bebida = prompt(
      `¿Que beberá ${nombre.toUpperCase()}? \n 1) Vaso de agua 🥛💲0  \n 2) Gaseosa 🥤💲500  \n 3) Cerveza 🍺💲2000  \n 4) Mate 🧉💲20  \n 5) Listo!✅ \n`
    );

    if (parseInt(bebida) !== 5) {
      const { item, precio } = menuBebida[parseInt(bebida)];
      const puedeTomarCerveza = edad >= 18 ? true : false; // Operador ternario para determinar si puede tomar cerveza
      if (!puedeTomarCerveza && parseInt(bebida) === 3) {
        alert(`🔞 ${nombre.toUpperCase()} Es menor de edad, no puede tomar cerveza 🔞`);
      } else {
        pedidoBebida.push({ item, precio, tipo: "Bebida" });
        console.log(`${nombre.toUpperCase()} Eligió para beber ${item}`);
      }
    }
  } while (parseInt(bebida) !== 5);

  return { tipo: "Bebida", pedido: pedidoBebida };
}

function imprimirSubtotal({ nombre, tipo, pedido }) {
  const subtotal = calcularSubtotalCategoria(pedido, tipo);
  console.log(`💰Subtotal de ${tipo} para ${nombre.toUpperCase()}: ${subtotal}`);
}

function imprimirMensajeFinal() {
  document.querySelector("img").src = "img/OIG (1).jpg";
  document.querySelector("h1").innerText = "Su pedido está preparandose!";
  botonPedido.hidden = true;

  const totalGeneral = pedidos.reduce((total, pedido) => total + pedido.reduce((subtotal, item) => subtotal + item.precio, 0), 0);

  const numeroPedidoAleatorio = generarNumeroAleatorio(10, 150); 

  console.log("EL TOTAL A COBRAR ES 💵 💲" + totalGeneral);
  console.log(`Su pedido es el número: ${numeroPedidoAleatorio}`);

  const pedidoRecuadro = document.createElement("div");
  pedidoRecuadro.style.backgroundColor = "white";
  pedidoRecuadro.style.padding = "10px";
  pedidoRecuadro.style.border = "2px solid red";
  const h3Pedido = document.createElement("h3");
  h3Pedido.innerText = `Su pedido es el número: ${numeroPedidoAleatorio}`;
  pedidoRecuadro.appendChild(h3Pedido);
  document.body.appendChild(pedidoRecuadro);
}

function generarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ocultar elementos al hacer clic en el botón
botonPedido.addEventListener("click", async function () {
  console.log("⚠️ATENCIÓN COCINEROS! HAY UN NUEVO CLIENTE!⚠️");
  ocultarElementos(); // Ocultar elementos principales
  const personas = prompt("¿Cuantas personas son? 👨‍👩‍👦‍👦 ");

  for (let i = 0; i < personas; i++) {
    const { nombre, edad } = await obtenerInformacionCliente(i);

    const pedidoComida = obtenerComida(nombre);
    const pedidoBebida = obtenerBebida(nombre, edad);

    imprimirSubtotal({ nombre, ...pedidoComida });
    imprimirSubtotal({ nombre, ...pedidoBebida });

    pedidos.push([...pedidoComida.pedido, ...pedidoBebida.pedido]);
  }
  pedidos.forEach((pedido, index) => {
    console.log(`Detalles del pedido ${index + 1}:`);
    pedido.forEach((item, itemIndex) => {
      console.log(`  ${item.tipo} ${itemIndex + 1}: ${item.item} - Precio: ${item.precio}`);
    });
  });

  imprimirMensajeFinal();
});
