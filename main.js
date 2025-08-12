// Variables globales
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para mostrar una alerta personalizada
function mostrarAlerta(mensaje) {
    const alerta = document.createElement("div");
    alerta.classList.add("alerta-personalizada");
    alerta.innerHTML = `
        <p>${mensaje}</p>
        <button class="alerta-cerrar">Cerrar</button>
    `;
    document.body.appendChild(alerta);

    // Cerrar la alerta al hacer clic en el botón
    alerta.querySelector(".alerta-cerrar").addEventListener("click", () => {
        alerta.remove();
    });

    // Cerrar automáticamente después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

// Función para renderizar los productos en el carrito
function renderizarCarrito() {
    const contenedorCarrito = document.querySelector(".carrito-productos");
    if (!contenedorCarrito) return; // Si no estamos en carrito.html, salir

    contenedorCarrito.innerHTML = ""; // Limpiar el carrito

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    carrito.forEach((producto, index) => {
        const div = document.createElement("div");
        div.classList.add("carrito-producto");
        div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Título</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" data-index="${index}">
                Eliminar
            </button>
        `;
        contenedorCarrito.appendChild(div);
    });

    // Guardar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".carrito-producto-eliminar").forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Guardar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarAlerta(`Producto "${producto.titulo}" agregado al carrito.`);
}

// Función para eliminar un producto del carrito
function eliminarProducto(e) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    renderizarCarrito();
    mostrarAlerta("Producto eliminado del carrito.");
}

// Función para manejar la compra
function comprar() {
    if (carrito.length === 0) {
        mostrarAlerta("El carrito está vacío.");
        return;
    }

    mostrarAlerta("¡Gracias por tu compra!");
    carrito.length = 0; // Vaciar el carrito
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

// Inicializar productos en index.html
function inicializarProductos() {
    const contenedorProductos = document.querySelector(".contenedor-productos");
    if (!contenedorProductos) return; // Si no estamos en index.html, salir

    document.querySelectorAll(".producto").forEach(productoDOM => {
        const producto = {
            titulo: productoDOM.querySelector(".producto-titulo").textContent,
            precio: parseFloat(productoDOM.querySelector(".producto-precio").textContent.replace("$", "")),
            imagen: productoDOM.querySelector(".producto-imagen").src
        };

        // Agregar evento al botón de agregar
        productoDOM.querySelector(".producto-agregar").addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
    });
}

// Inicializar carrito en carrito.html
function inicializarCarrito() {
    const botonComprar = document.querySelector(".carrito-comprar");
    if (!botonComprar) return; // Si no estamos en carrito.html, salir

    botonComprar.addEventListener("click", comprar);
    renderizarCarrito();
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    inicializarProductos();
    inicializarCarrito();
});
