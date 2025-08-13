const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function mostrarAlerta(mensaje) {
    const alerta = document.createElement("div");
    alerta.classList.add("alerta-personalizada");
    alerta.innerHTML = `
        <p>${mensaje}</p>
        <button class="alerta-cerrar">Cerrar</button>
    `;
    document.body.appendChild(alerta);

    
    alerta.querySelector(".alerta-cerrar").addEventListener("click", () => {
        alerta.remove();
    });

    
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}


function renderizarCarrito() {
    const contenedorCarrito = document.querySelector(".carrito-productos");
    if (!contenedorCarrito) return;  salir

    contenedorCarrito.innerHTML = ""; 

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

    
    localStorage.setItem("carrito", JSON.stringify(carrito));

    
    document.querySelectorAll(".carrito-producto-eliminar").forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });
}


function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarAlerta(`Producto "${producto.titulo}" agregado al carrito.`);
}


function eliminarProducto(e) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    renderizarCarrito();
    mostrarAlerta("Producto eliminado del carrito.");
}


function comprar() {
    if (carrito.length === 0) {
        mostrarAlerta("El carrito está vacío.");
        return;
    }

    mostrarAlerta("¡Gracias por tu compra!");
    carrito.length = 0; 
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}


function inicializarProductos() {
    const contenedorProductos = document.querySelector(".contenedor-productos");
    if (!contenedorProductos) return; 

    document.querySelectorAll(".producto").forEach(productoDOM => {
        const producto = {
            titulo: productoDOM.querySelector(".producto-titulo").textContent,
            precio: parseFloat(productoDOM.querySelector(".producto-precio").textContent.replace("$", "")),
            imagen: productoDOM.querySelector(".producto-imagen").src
        };

        
        productoDOM.querySelector(".producto-agregar").addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
    });
}


function inicializarCarrito() {
    const botonComprar = document.querySelector(".carrito-comprar");
    if (!botonComprar) return; 

    botonComprar.addEventListener("click", comprar);
    renderizarCarrito();
}


document.addEventListener("DOMContentLoaded", () => {
    inicializarProductos();
    inicializarCarrito();
});
