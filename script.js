let subtotal = 0;
let totalPedidoActual = 0;

function agregarAlCarrito(itemNombre, cantidad, precio, tipo) {
  const carrito = document.getElementById('lista-carrito');
  const subtotalCarrito = document.getElementById('subtotal-carrito');
  const nuevoItem = document.createElement('li');
  nuevoItem.innerHTML = `${cantidad} ${itemNombre} - Precio $${precio * cantidad}`;
  carrito.appendChild(nuevoItem);

  subtotal += precio * cantidad;

  console.log(subtotal);

  subtotalCarrito.innerText = `Subtotal: $${subtotal.toFixed(2)}`;
}

function mostrarNotificacion(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "top",
    background: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true,
  }).showToast();
}
function Pedido(item, precio, cantidad, tipo) {
  this.item = item;
  this.precio = parseFloat(precio); // Convertir el precio a número
  this.cantidad = cantidad;
  this.tipo = tipo;
}


function obtenerPedidosLocalStorage() {
  const pedidosLocalStorage = localStorage.getItem('pedidos');
  if (pedidosLocalStorage) {
    return JSON.parse(pedidosLocalStorage);
  } else {
    return [];
  }
}

let botonPedido = document.querySelector("button");
let imagenPrincipal = document.querySelector("img");
let pedidos = obtenerPedidosLocalStorage(); // Obtener los pedidos almacenados en localStorage

// Función para mostrar los pedidos anteriores en el div
// Función para mostrar los pedidos anteriores en el div
function mostrarPedidosAnteriores() {
  const divPedidosAnteriores = document.createElement('div');
  divPedidosAnteriores.style.backgroundColor = 'green';
  divPedidosAnteriores.style.color = 'white';
  divPedidosAnteriores.style.padding = '10px';
  divPedidosAnteriores.style.position = 'absolute';
  divPedidosAnteriores.style.left = '10px';
  divPedidosAnteriores.style.top = '10px';
  divPedidosAnteriores.style.maxWidth = '200px'; // Establecemos un ancho máximo
  divPedidosAnteriores.style.maxHeight = '300px'; // Establecemos una altura máxima
  divPedidosAnteriores.style.overflow = 'auto'; // Activamos las barras de desplazamiento en caso de que el contenido exceda la altura máxima

  const titulo = document.createElement('h2');
  titulo.innerText = 'Pedidos Anteriores';
  divPedidosAnteriores.appendChild(titulo);

  pedidos.forEach((pedido, index) => {
    const pPedido = document.createElement('p');
    pPedido.innerText = `Pedido ${index + 1}: ${pedido.map(item => `${item.cantidad} ${item.item}`).join(', ')}`;
    divPedidosAnteriores.appendChild(pPedido);
  });

  document.body.insertBefore(divPedidosAnteriores, document.querySelector('footer'));
}

mostrarPedidosAnteriores(); // Llamar a la función para mostrar los pedidos anteriores
 // Llamar a la función para mostrar los pedidos anteriores

function obtenerInformacionCliente(i) {
  return new Promise((resolve, reject) => {
    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.placeholder = `Nombre de la persona ${parseInt(i) + 1}`;
    const mayorEdadButton = document.createElement('button');
    mayorEdadButton.innerText = 'Soy mayor de edad';
    const menorEdadButton = document.createElement('button');
    menorEdadButton.innerText = 'Soy menor de edad';
    const form = document.createElement('form');
    form.appendChild(nombreInput);
    form.appendChild(mayorEdadButton);
    form.appendChild(menorEdadButton);
    document.body.appendChild(form);

    mayorEdadButton.addEventListener('click', function(event) {
      event.preventDefault();
      const nombre = nombreInput.value.trim();
      if (nombre === '') {
        swal("Oops...", "No seas tímido, decinos tu nombre", "warning");
        return; // Detener el proceso si el nombre está vacío
      }
      document.body.removeChild(form);

      resolve({ nombre, mayorEdad: true });
    });

    menorEdadButton.addEventListener('click', function(event) {
      event.preventDefault();
      const nombre = nombreInput.value.trim();
      if (nombre === '') {
        swal("Oops...", "No seas tímido, decinos tu nombre", "warning");
        return; // Detener el proceso si el nombre está vacío
      }
      document.body.removeChild(form);

      resolve({ nombre, mayorEdad: false });
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
          precio: parseFloat(item.precio),
          imagen: item.imagen
        }));
        const formComida = crearFormularioComida(comida);
        formComida.addEventListener('submit', function(event) {
          event.preventDefault();
          const pedidoComida = [];
          comida.forEach(item => {
            const cantidad = parseInt(formComida.elements[item.nombre].value);
            if (cantidad > 0) {
              pedidoComida.push(new Pedido(item.nombre, item.precio, cantidad, "Comida"));
              agregarAlCarrito(item.nombre, cantidad, item.precio, "Comida");
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
  formComida.style.display = 'flex';
  formComida.style.flexDirection = 'column';
  formComida.style.alignItems = 'center'; // Centrar elementos horizontalmente
  formComida.style.textAlign = 'center'; // Centrar el texto dentro del formulario

  comida.forEach(item => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center'; // Centrar elementos horizontalmente

    const labelNombre = document.createElement('label');
    labelNombre.innerText = `${item.nombre}: `;
    labelNombre.style.marginBottom = '5px';

    const img = document.createElement('img');
    img.src = item.imagen;
    img.alt = item.nombre;
    img.width = 100;
    img.style.marginBottom = '5px';

    container.appendChild(labelNombre);
    container.appendChild(img);

    const quantityContainer = document.createElement('div');
    quantityContainer.style.display = 'flex';
    quantityContainer.style.alignItems = 'center';

    const decreaseButton = document.createElement('button');
    decreaseButton.type = 'button';
    decreaseButton.innerText = '-';
    decreaseButton.classList.add('decrease-button');
    decreaseButton.style.marginRight = '5px';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = 0;
    quantityInput.name = item.nombre;
    quantityInput.classList.add('cantidad-input');
    quantityInput.style.width = '50px';
    quantityInput.style.marginRight = '5px';

    const increaseButton = document.createElement('button');
    increaseButton.type = 'button';
    increaseButton.innerText = '+';
    increaseButton.classList.add('increase-button');

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(increaseButton);

    container.appendChild(quantityContainer);
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
function obtenerBebida(nombre, mayorEdad) {
  return new Promise((resolve, reject) => {
    fetch('datos.json')
      .then(response => response.json())
      .then(data => {
        const bebidas = data.bebida.map(item => ({
          nombre: item.nombre,
          precio: parseFloat(item.precio),
          imagen: item.imagen
        }));
        const formBebida = crearFormularioBebida(bebidas, mayorEdad);
        formBebida.addEventListener('submit', function(event) {
          event.preventDefault();
          const cantidadCerveza = parseInt(formBebida.elements['Cerveza'].value);
          if (!mayorEdad && cantidadCerveza > 0) {
            swal("oh oh", "Lo siento, no puedes elegir cerveza porque eres menor de 18 años.", "info");
            return;
          }
          const pedidoBebida = [];
          bebidas.forEach(bebida => {
            const cantidad = parseInt(formBebida.elements[bebida.nombre].value);
            if (cantidad > 0) {
              pedidoBebida.push(new Pedido(bebida.nombre, bebida.precio, cantidad, 'Bebida'));
              agregarAlCarrito(bebida.nombre, cantidad, bebida.precio, 'Bebida');
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


function crearFormularioBebida(bebidas, mayorEdad) {
  const formBebida = document.createElement('form');
  formBebida.style.display = 'flex';
  formBebida.style.flexDirection = 'column';
  formBebida.style.alignItems = 'center'; // Centrar elementos horizontalmente
  formBebida.style.textAlign = 'center'; // Centrar el texto dentro del formulario

  bebidas.forEach(bebida => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center'; // Centrar elementos horizontalmente

    const labelNombre = document.createElement('label');
    labelNombre.innerText = `${bebida.nombre}: `;
    labelNombre.style.marginBottom = '5px';

    const img = document.createElement('img');
    img.src = bebida.imagen;
    img.alt = bebida.nombre;
    img.width = 100;
    img.style.marginBottom = '5px';

    container.appendChild(labelNombre);
    container.appendChild(img);

    const quantityContainer = document.createElement('div');
    quantityContainer.style.display = 'flex';
    quantityContainer.style.alignItems = 'center';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = 0;
    quantityInput.name = bebida.nombre;
    quantityInput.classList.add('cantidad-input');
    quantityInput.style.width = '50px';
    quantityInput.style.marginRight = '5px';

    const decreaseButton = document.createElement('button');
    decreaseButton.type = 'button';
    decreaseButton.innerText = '-';
    decreaseButton.classList.add('decrease-button');
    decreaseButton.style.marginRight = '5px';

    const increaseButton = document.createElement('button');
    increaseButton.type = 'button';
    increaseButton.innerText = '+';
    increaseButton.classList.add('increase-button');

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(increaseButton);

    container.appendChild(quantityContainer);
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
document.addEventListener('click', function(event) {
  const target = event.target;
  if (target.classList.contains('increase-button') || target.classList.contains('decrease-button')) {
    const inputElement = target.parentNode.querySelector('.cantidad-input');
    const currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
      if (target.classList.contains('increase-button')) {
        inputElement.value = currentValue + 1;
      } else if (target.classList.contains('decrease-button')) {
        if (currentValue > 0) {
          inputElement.value = currentValue - 1;
        }
      }
    }
  }
});
function imprimirSubtotal({ nombre, tipo, pedido }) {
  /*let subtotalComensal = 0; // Variable para almacenar el subtotal de cada comensal

  if (Array.isArray(pedido)) {
    subtotalComensal = pedido.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  } else {
    subtotalComensal = pedido.precio * pedido.cantidad;
  }



  // Actualizar el subtotal global sumando el subtotal del comensal
  subtotal += subtotalComensal;

  // Mostrar el subtotal global en el carrito
  const subtotalCarrito = document.getElementById('subtotal-carrito');
  subtotalCarrito.innerText = `Subtotal: $${subtotal.toFixed(2)}`;*/
}

function imprimirMensajeFinal() {
  imagenPrincipal.src = "img/OIG (1).jpg"; 
  imagenPrincipal.style.display = "block"; 
  botonPedido.style.display = "none"; 
  document.querySelector("h1").innerText = "Su pedido está preparándose!"; 

  // Obtener los pedidos del último cliente
  const pedidosClienteActual = pedidos[pedidos.length - 1];

  // Sumar los precios de los pedidos del último cliente
  
  pedidosClienteActual.forEach(item => {
    totalPedidoActual += item.precio * item.cantidad;
  });

 

  const numeroPedidoAleatorio = generarNumeroAleatorio(10, 150);
 

  const pedidoRecuadro = document.createElement("div");
  pedidoRecuadro.style.backgroundColor = "white";
  pedidoRecuadro.style.padding = "10px";
  pedidoRecuadro.style.border = "2px solid red";
  const h3Pedido = document.createElement("h3");
  h3Pedido.innerText = `Su pedido es el número: ${numeroPedidoAleatorio}`;
  pedidoRecuadro.appendChild(h3Pedido);

  const imprimirFacturaButton = document.createElement("button");
  imprimirFacturaButton.innerText = "Imprimir Factura";
  imprimirFacturaButton.style.display = "block"; 
  imprimirFacturaButton.style.margin = "auto"; 
  imprimirFacturaButton.addEventListener("click", () => imprimirFactura(totalPedidoActual));
  pedidoRecuadro.appendChild(imprimirFacturaButton);

  document.body.appendChild(pedidoRecuadro);

  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function generarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function imprimirFactura(totalPedidoActual) {
  const facturaWindow = window.open('', '_blank');
  facturaWindow.document.write('<html><head><title>Factura</title></head><body>');
  facturaWindow.document.write('<h1 style="text-align: center; font-weight: bold;">FACTURA</h1>');
  facturaWindow.document.write('<p style="text-align: center;">Restaurante Ratatouille</p>');
  facturaWindow.document.write('<hr>');
  facturaWindow.document.write('<h2>Detalles del pedido:</h2>');
  facturaWindow.document.write('<ul>');

  // Iterar sobre los pedidos anteriores
  /*pedidos.forEach((pedido, index) => {
    pedido.forEach(item => {
      facturaWindow.document.write(`<li>Pedido ${index + 1}: ${item.tipo} - ${item.item} - Precio:$ ${item.precio} - Cantidad: ${item.cantidad}</li>`);
    });
  });*/

  facturaWindow.document.write('</ul>');

  // Agregar los elementos del carrito de compras
  const carritoItems = document.querySelectorAll('#lista-carrito li');
  facturaWindow.document.write('<ul>');
  carritoItems.forEach(item => {
    facturaWindow.document.write(`<li>${item.innerText}</li>`);
  });
  facturaWindow.document.write('</ul>');

  // Mostrar subtotal
  facturaWindow.document.write(`<p style="text-align: center; font-weight: bold;">Subtotal: $${subtotal.toFixed(2)}</p>`);

  facturaWindow.document.write('<p style="text-align: center;">Gracias por su compra!!</p>');
  facturaWindow.document.write('</body></html>');
  facturaWindow.document.close();
}


botonPedido.addEventListener("click", async function () {
  botonPedido.style.display = "none";
  imagenPrincipal.style.display = "none";

  
  const comensalesInput = document.createElement('select'); 
  comensalesInput.placeholder = '¿Cuántas personas son?';
  comensalesInput.innerHTML = '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>'; 
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerText = 'Enviar';
  const form = document.createElement('form');
  const comensalesLabel = document.createElement('label');
  comensalesLabel.innerText = '¿Cuántos comensales van a ser?';
  form.appendChild(comensalesLabel);
  form.appendChild(comensalesInput);
  form.appendChild(submitButton);
  document.body.appendChild(form);
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const personas = parseInt(comensalesInput.value);
    form.style.display = "none";

    // Inicializar una matriz de pedidos vacía para cada comensal
    const pedidosPorComensal = [];

    for (let i = 0; i < personas; i++) {
      const { nombre, mayorEdad } = await obtenerInformacionCliente(i);

      const pedidoComida = await obtenerComida(nombre);
      const pedidoBebida = await obtenerBebida(nombre, mayorEdad);

      // Agregar los pedidos del comensal actual a su matriz de pedidos
      pedidosPorComensal.push([...pedidoComida.pedido, ...pedidoBebida.pedido]);

      pedidoBebida.pedido.forEach(item => {
        mostrarNotificacion(`${item.cantidad} ${item.item} - Precio: $${item.precio * item.cantidad}`);
      });
      mostrarNotificacion(`${nombre.toUpperCase()} ha elegido la siguiente bebida:`);

      pedidoComida.pedido.forEach(item => {
        mostrarNotificacion(`${item.cantidad} ${item.item} - Precio: $${item.precio * item.cantidad}`);
      });
      mostrarNotificacion(`${nombre.toUpperCase()} ha elegido la siguiente comida:`);
      
      imprimirSubtotal({ nombre, ...pedidoComida });
      imprimirSubtotal({ nombre, ...pedidoBebida });
    }

    // Agregar los pedidos de todos los comensales a la matriz principal de pedidos
    pedidos.push(...pedidosPorComensal);

    imprimirMensajeFinal();
    document.body.removeChild(form);
  });
});