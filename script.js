let botonPedido = document.querySelector("button");
let imagenPrincipal = document.querySelector("img");
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

function obtenerComida(nombre) {
  return new Promise((resolve, reject) => {
    const formComida = document.createElement('form');

    const imgHamburguesa = document.createElement('img');
    imgHamburguesa.src = "img/paty.jpg"; // Ruta de la imagen de la hamburguesa
    formComida.appendChild(imgHamburguesa);

    const hamburguesasInput = document.createElement('input');
    hamburguesasInput.type = 'number';
    hamburguesasInput.placeholder = 'Cantidad de Hamburguesas';
    formComida.appendChild(hamburguesasInput);

    const imgEnsalada = document.createElement('img');
    imgEnsalada.src = "img/arrozpollo.jpg";
    formComida.appendChild(imgEnsalada);

    const ensaladasInput = document.createElement('input');
    ensaladasInput.type = 'number';
    ensaladasInput.placeholder = 'Cantidad de Ensaladas';
    formComida.appendChild(ensaladasInput);

    const imgArrozPollo = document.createElement('img');
    imgArrozPollo.src = "img/arrozpollo.jpg";
    formComida.appendChild(imgArrozPollo);

    const arrozInput = document.createElement('input');
    arrozInput.type = 'number';
    arrozInput.placeholder = 'Cantidad de Arroz con Pollo';
    formComida.appendChild(arrozInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Enviar';
    formComida.appendChild(submitButton);

    formComida.addEventListener('submit', function(event) {
      event.preventDefault();
      const cantidadHamburguesas = parseInt(hamburguesasInput.value);
      const cantidadEnsaladas = parseInt(ensaladasInput.value);
      const cantidadArroz = parseInt(arrozInput.value);
      const pedidoComida = [];
      if (cantidadHamburguesas > 0) {
        pedidoComida.push({ item: "Hamburguesa con queso", precio: 4000, cantidad: cantidadHamburguesas, tipo: "Comida" });
      }
      if (cantidadEnsaladas > 0) {
        pedidoComida.push({ item: "Ensalada", precio: 3000, cantidad: cantidadEnsaladas, tipo: "Comida" });
      }
      if (cantidadArroz > 0) {
        pedidoComida.push({ item: "Arroz con pollo", precio: 2000, cantidad: cantidadArroz, tipo: "Comida" });
      }
      resolve({ tipo: "Comida", pedido: pedidoComida });
      formComida.style.display = "none";
    });

    document.body.appendChild(formComida);
  });
}

function obtenerBebida(nombre, edad) {
  return new Promise((resolve, reject) => {
    const formBebida = document.createElement('form');
    const aguaInput = document.createElement('input');
    aguaInput.type = 'number';
    aguaInput.placeholder = 'Cantidad de Vasos de Agua';
    const gaseosaInput = document.createElement('input');
    gaseosaInput.type = 'number';
    gaseosaInput.placeholder = 'Cantidad de Gaseosas';
    const cervezaInput = document.createElement('input');
    cervezaInput.type = 'number';
    cervezaInput.placeholder = 'Cantidad de Cervezas';
    const mateInput = document.createElement('input');
    mateInput.type = 'number';
    mateInput.placeholder = 'Cantidad de Mate';
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Enviar';
    formBebida.appendChild(aguaInput);
    formBebida.appendChild(gaseosaInput);
    formBebida.appendChild(cervezaInput);
    formBebida.appendChild(mateInput);
    formBebida.appendChild(submitButton);
    formBebida.addEventListener('submit', function(event) {
      event.preventDefault();
      const cantidadAgua = parseInt(aguaInput.value);
      const cantidadGaseosa = parseInt(gaseosaInput.value);
      const cantidadCerveza = parseInt(cervezaInput.value);
      const cantidadMate = parseInt(mateInput.value);
      const pedidoBebida = [];
      if (cantidadAgua > 0) {
        pedidoBebida.push({ item: "Vaso de agua", precio: 0, cantidad: cantidadAgua, tipo: "Bebida" });
      }
      if (cantidadGaseosa > 0) {
        pedidoBebida.push({ item: "Gaseosa", precio: 500, cantidad: cantidadGaseosa, tipo: "Bebida" });
      }
      if (cantidadCerveza > 0) {
        if (edad < 18) {
          alert("Lo siento, no puedes elegir cerveza porque eres menor de 18 años.");
          return; // Terminar la ejecución de la función
        }
        pedidoBebida.push({ item: "Cerveza", precio: 2000, cantidad: cantidadCerveza, tipo: "Bebida" });
      }
      if (cantidadMate > 0) {
        pedidoBebida.push({ item: "Mate", precio: 20, cantidad: cantidadMate, tipo: "Bebida" });
      }
      resolve({ tipo: "Bebida", pedido: pedidoBebida });
      formBebida.style.display = "none";
    });
    document.body.appendChild(formBebida);
  });
}

function imprimirSubtotal({ nombre, tipo, pedido }) {
  let subtotal = 0;

  if (Array.isArray(pedido)) {
    subtotal = pedido.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  } else {
    subtotal = pedido.precio * pedido.cantidad;
  }

  console.log(`💰Subtotal de ${tipo} para ${nombre.toUpperCase()}: ${subtotal}`);
}

function imprimirMensajeFinal() {
  imagenPrincipal.src = "img/OIG (1).jpg"; // Establece la fuente de la imagen
  imagenPrincipal.style.display = "block"; // Asegúrate de que la imagen esté visible
  botonPedido.style.display = "none"; // Oculta el botón de pedido
  document.querySelector("h1").innerText = "Su pedido está preparándose!"; // Actualiza el texto del encabezado

  const totalGeneral = pedidos.reduce((total, pedido) => total + pedido.reduce((subtotal, item) => subtotal + (item.precio * item.cantidad), 0), 0);

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

botonPedido.addEventListener("click", async function () {
  botonPedido.style.display = "none";
  imagenPrincipal.style.display = "none";
  console.log("⚠️ATENCIÓN COCINEROS! HAY UN NUEVO CLIENTE!⚠️");
  const personas = prompt("¿Cuantas personas son? 👨‍👩‍👦‍👦 ");

  for (let i = 0; i < personas; i++) {
    const { nombre, edad } = await obtenerInformacionCliente(i);

    const pedidoComida = await obtenerComida(nombre);
    const pedidoBebida = await obtenerBebida(nombre, edad);

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
