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
    fetch('datos.json')
      .then(response => response.json())
      .then(data => {
        const comida = data.comida.map(item => ({
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen
        }));
        const formComida = crearFormularioComida(comida);
        formComida.addEventListener('submit', function(event) {
          event.preventDefault();
          const pedidoComida = [];
          comida.forEach(item => {
            const cantidad = parseInt(formComida.elements[item.nombre].value);
            if (cantidad > 0) {
              pedidoComida.push({ item: item.nombre, precio: item.precio, cantidad: cantidad, tipo: "Comida" });
            }
          });
          resolve({ tipo: "Comida", pedido: pedidoComida });
          formComida.style.display = "none";
        });
      })
      .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
      });
  });
}

function crearFormularioComida(comida) {
  const formComida = document.createElement('form');
  comida.forEach(item => {
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = `${item.nombre}: `;
    const img = document.createElement('img');
    img.src = item.imagen;
    img.alt = item.nombre;
    img.width = 100; // Ajusta el ancho de la imagen según sea necesario
    label.appendChild(document.createElement('br')); // Salto de línea antes de la imagen
    label.appendChild(img);
    container.appendChild(label);
    container.appendChild(document.createElement('br')); // Salto de línea después de la imagen
    const input = document.createElement('input');
    input.type = 'number';
    input.name = item.nombre;
    input.placeholder = `Cantidad de ${item.nombre}`;
    container.appendChild(input);
    formComida.appendChild(container);
    formComida.appendChild(document.createElement('br')); // Salto de línea entre cada elemento del formulario
  });
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerText = 'Enviar';
  formComida.appendChild(submitButton);
  document.body.appendChild(formComida);
  return formComida;
}

function obtenerBebida(nombre, edad) {
  return new Promise((resolve, reject) => {
    const formBebida = document.createElement('form');

    // Agua
    const imgAgua = document.createElement('img');
    imgAgua.src = "img/agua.jpg"; // Ruta de la imagen del agua
    formBebida.appendChild(imgAgua);
    const aguaInput = document.createElement('input');
    aguaInput.type = 'number';
    aguaInput.placeholder = 'Cantidad de Vasos de Agua';
    formBebida.appendChild(aguaInput);

    // Gaseosa
    const imgGaseosa = document.createElement('img');
    imgGaseosa.src = "img/gaseosa.jpg"; // Ruta de la imagen de la gaseosa
    formBebida.appendChild(imgGaseosa);
    const gaseosaInput = document.createElement('input');
    gaseosaInput.type = 'number';
    gaseosaInput.placeholder = 'Cantidad de Gaseosas';
    formBebida.appendChild(gaseosaInput);

    // Cerveza
    const imgCerveza = document.createElement('img');
    imgCerveza.src = "img/cerveza.jpg"; // Ruta de la imagen de la cerveza
    formBebida.appendChild(imgCerveza);
    const cervezaInput = document.createElement('input');
    cervezaInput.type = 'number';
    cervezaInput.placeholder = 'Cantidad de Cervezas';
    formBebida.appendChild(cervezaInput);

    // Mate
    const imgMate = document.createElement('img');
    imgMate.src = "img/mate.jpg"; // Ruta de la imagen del mate
    formBebida.appendChild(imgMate);
    const mateInput = document.createElement('input');
    mateInput.type = 'number';
    mateInput.placeholder = 'Cantidad de Mate';
    formBebida.appendChild(mateInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Enviar';
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
