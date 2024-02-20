let totalGeneral; // Variable para almacenar el total general del pedido

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
    img.width = 100; 
    label.appendChild(document.createElement('br')); 
    label.appendChild(img);
    container.appendChild(label);
    container.appendChild(document.createElement('br')); 
    const input = document.createElement('input');
    input.type = 'number';
    input.name = item.nombre;
    input.placeholder = `Cantidad de ${item.nombre}`;
    container.appendChild(input);
    formComida.appendChild(container);
    formComida.appendChild(document.createElement('br')); 
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
    fetch('datos.json')
      .then(response => response.json())
      .then(data => {
        const bebidas = data.bebida.map(item => ({
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen
        }));
        const formBebida = crearFormularioBebida(bebidas);
        formBebida.addEventListener('submit', function(event) {
          event.preventDefault();
          const cantidadCerveza = parseInt(formBebida.elements['Cerveza'].value);
          if (edad < 18 && cantidadCerveza > 0) {
            alert("Lo siento, no puedes elegir cerveza porque eres menor de 18 años.");
            return;
          }
          const pedidoBebida = [];
          bebidas.forEach(bebida => {
            const cantidad = parseInt(formBebida.elements[bebida.nombre].value);
            if (cantidad > 0) {
              pedidoBebida.push({ item: bebida.nombre, precio: bebida.precio, cantidad: cantidad, tipo: 'Bebida' });
            }
          });
          resolve({ tipo: 'Bebida', pedido: pedidoBebida });
          formBebida.style.display = 'none';
        });
      })
      .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
      });
  });
}

function crearFormularioBebida(bebidas) {
  const formBebida = document.createElement('form');
  bebidas.forEach(bebida => {
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = `${bebida.nombre}: `;
    const img = document.createElement('img');
    img.src = bebida.imagen;
    img.alt = bebida.nombre;
    img.width = 100; 
    label.appendChild(document.createElement('br')); 
    label.appendChild(img);
    container.appendChild(label);
    container.appendChild(document.createElement('br')); 
    const input = document.createElement('input');
    input.type = 'number';
    input.name = bebida.nombre;
    input.placeholder = `Cantidad de ${bebida.nombre}`;
    container.appendChild(input);
    formBebida.appendChild(container);
    formBebida.appendChild(document.createElement('br')); 
  });
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerText = 'Enviar';
  formBebida.appendChild(submitButton);
  document.body.appendChild(formBebida);
  return formBebida;
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
  imagenPrincipal.src = "img/OIG (1).jpg"; 
  imagenPrincipal.style.display = "block"; 
  botonPedido.style.display = "none"; 
  document.querySelector("h1").innerText = "Su pedido está preparándose!"; 

  totalGeneral = pedidos.reduce((total, pedido) => total + pedido.reduce((subtotal, item) => subtotal + (item.precio * item.cantidad), 0), 0);

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

  const imprimirFacturaButton = document.createElement("button");
  imprimirFacturaButton.innerText = "Imprimir Factura";
  imprimirFacturaButton.style.display = "block"; // Para ocupar toda la anchura
  imprimirFacturaButton.style.margin = "auto"; // Para centrar horizontalmente
  imprimirFacturaButton.addEventListener("click", imprimirFactura);
  pedidoRecuadro.appendChild(imprimirFacturaButton);

  document.body.appendChild(pedidoRecuadro);
}

function generarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function imprimirFactura() {
  const facturaWindow = window.open('', '_blank');
  facturaWindow.document.write('<html><head><title>Factura</title></head><body>');
  facturaWindow.document.write('<h1 style="text-align: center; font-weight: bold;">FACTURA</h1>');
  facturaWindow.document.write('<p style="text-align: center;">Restaurante Ratatouille</p>');
  facturaWindow.document.write('<hr>');
  facturaWindow.document.write('<h2>Detalles del pedido:</h2>');
  facturaWindow.document.write('<ul>');

  pedidos.forEach((pedido, index) => {
    facturaWindow.document.write(`<li><b>Detalle del pedido ${index + 1}:</b></li>`);
    pedido.forEach((item, itemIndex) => {
      facturaWindow.document.write(`<li>${item.tipo} ${itemIndex + 1}: ${item.item} - Precio:$ ${item.precio} - Cantidad: ${item.cantidad}</li>`);
    });
  });

  facturaWindow.document.write('</ul>');
  facturaWindow.document.write(`<p style="text-align: center; font-weight: bold;">Total a Pagar:$ ${totalGeneral}</p>`);
  facturaWindow.document.write('<p style="text-align: center;">Gracias por su compra!!</p>');
  facturaWindow.document.write('</body></html>');
  facturaWindow.document.close();
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
