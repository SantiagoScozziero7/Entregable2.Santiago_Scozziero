const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const productos = [
    {
        titulo: "Enganche Volkswagen Amarok",
        precio: 1000,
        imagen: "img/enganche.jpg"
    },
    {
        titulo: "Enganche Reforzado Cobra Para Ram 1500",
        precio: 2000,
        imagen: "img/Enganche-ram2.jpg"
    },
    {
        titulo: "Punta Acople Para Enganches De Trailer Cobra Bocha O Perno 40X40",
        precio: 500,
        imagen: "img/portada-acoples.jpg"
    },
    {
        titulo: "Punta Acople Para Enganches De Trailer Cobra Bocha O Perno 50x50",
        precio: 600,
        imagen: "img/portada-acoples 50x50.jpg"
    }
];

function mostrarAlerta(mensaje) {
    Swal.fire({
        text: mensaje,
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
        timerProgressBar: true
    });
}

function renderizarCarrito() {
    const contenedorCarrito = document.querySelector(".carrito-productos");
    if (!contenedorCarrito) return;
    contenedorCarrito.innerHTML = "";
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        document.getElementById("total-precio").textContent = 0;
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
    calcularTotal();
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
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

function renderizarProductos(productos) {
    const contenedorProductos = document.querySelector(".contenedor-productos");
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar">Agregar</button>
            </div>
        `;
        contenedorProductos.appendChild(div);
        div.querySelector(".producto-agregar").addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
    });
}

async function cargarProductos() {
    try {
        const response = await fetch("productos.json");
        if (!response.ok) throw new Error("Error al cargar los productos.");
        const data = await response.json();
        renderizarProductos(data);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        Swal.fire({
            text: "Hubo un error al cargar los productos. Por favor, inténtalo más tarde.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

function calcularTotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById("total-precio").textContent = total;
}

function inicializarCarrito() {
    const botonComprar = document.querySelector(".carrito-comprar");
    if (!botonComprar) return;
    botonComprar.addEventListener("click", comprar);
    renderizarCarrito();
    document.querySelector(".carrito-limpiar").addEventListener("click", () => {
        carrito.length = 0;
        localStorage.removeItem("carrito");
        renderizarCarrito();
        mostrarAlerta("El carrito ha sido limpiado.");
        calcularTotal();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    inicializarCarrito();
});

document.getElementById("buscar").addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase();
    const productosFiltrados = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(termino)
    );
    renderizarProductos(productosFiltrados);
});