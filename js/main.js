function Cliente(nombre, telefono, direccion) {
  this.nombre = nombre;
  this.telefono = telefono;
  this.direccion = direccion;
}

function Articulo(id, nombre, precio, destacado, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.destacado = destacado;
  this.imagen = imagen;
}

function Pedido() {
  this.cliente = undefined;
  this.items = [];
  this.total = 0;
  var fecha = new Date();
  fecha = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();
  this.fecha = fecha;
}

function preguntarEdad() {
  var edad = localStorage.getItem("edad");
  if (edad == null) {
    $("#modal-edad").modal("show");
  } else {
    validarEdad(edad);
  }
}

function guardarEdad() {
  const edad = $("#validar-edad").val();
  if (edad.trim() != "") {
    localStorage.setItem("edad", edad);
    $("#modal-edad").modal("hide");
    validarEdad(edad);
  }
}

function validarEdad(edad) {
  if (edad < 18) {
    $("#modal-menor").modal("show");
    var formulario = document.getElementById("customer");
    formulario.parentNode.removeChild(formulario);
  }
}

function cargarDatos(productos, articulos) {
  productos.forEach((producto, indice) => {
    var articulo = new Articulo(
      producto.id,
      producto.nombre,
      producto.precio,
      producto.destacado,
      producto.imagen
    );
    articulos.push(articulo);

    if (articulo.destacado) {
      generarHtmlProducto(articulo);
    }
    cargarSelect(articulo);
    if (indice == 0) {
      $("#precio").val(articulo.precio);
    }
  });
}

function generarHtmlProducto(producto) {
  var html = `<div class="col-sm bot1">
    <img src="${producto.imagen}">
    <div class="description">
      <div class="product-name">
      ${producto.nombre}
      </div>
      <div class="price">
      $${producto.precio}
      </div>
      <button class="shop" onclick="seleccionarProducto(${producto.id})">Agregar artículo</button>
    </div>
  </div>`;
  $("#bottles").append(html);
}

function seleccionarProducto(productoId) {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 1000);
  $("#brebajes").val(productoId).change();
}

function cargarSelect(producto) {
  var option = `<option value="${producto.id}">${producto.nombre}</option>`;
  $("#brebajes").append(option);
}

function agregarPrecio() {
  $("#error").html("");
  var valor = $("#brebajes option:selected").val();
  var encontrado = articulos.find((articulo) => {
    return articulo.id == valor;
  });
  $("#precio").val(encontrado.precio);
  $("#cantidad").val("");
  $("#subtotal").val("");
}

function soloNumeros(event) {
  var key = event.keyCode;
  if (key < 48 || key > 57) {
    event.preventDefault();
  }
}

function calcularSubtotal() {
  var cantidad = $("#cantidad").val();
  if (cantidad > 0) {
    $("#error").html("");
    var precio = $("#precio").val();
    var subtotal = parseInt(cantidad) * parseInt(precio);
    $("#subtotal").val(subtotal);
  } else {
    $("#error").html("Debe ingresar cantidad");
    $("#subtotal").val("");
  }
}

function agregarProducto() {
  var cantidad = parseInt($("#cantidad").val());
  if (cantidad > 0) {
    $("#error").html("");
    var itemId = parseInt($("#brebajes").val());

    var indiceYaExiste = pedido.items.findIndex((item) => {
      return item.itemId == itemId;
    });
    if (indiceYaExiste == -1) {
      pedido.items.push({ itemId, cantidad });
    } else {
      pedido.items[indiceYaExiste].cantidad += cantidad;
    }
    $("#cantidad").val("");
    $("#subtotal").val("");
    dibujarPedido();
  } else {
    $("#error").html("Debe ingresar cantidad");
  }
}

function dibujarPedido() {
  var tablaHeader = `<table class="table table-hover table-dark finalizar-pedido">
  <thead>
    <tr class="items">
      <th scope="col">#</th>
      <th scope="col">Producto</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Precio</th>
      <th scope="col">Subtotal</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>`;
  var tablaBody = "";
  var total = 0;
  var iconoEliminar = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>`;
  pedido.items.forEach((item, indice) => {
    var articulo = articulos.find((articulo) => {
      return item.itemId == articulo.id;
    });
    tablaBody += `<tr>
      <th scope="row">${indice + 1}</th>
      <td>${articulo.nombre}</td>
      <td>$${articulo.precio}</td>
      <td>${item.cantidad}</td>
      <td>$${parseInt(item.cantidad) * parseInt(articulo.precio)}</td>
      <td><span class="icono-eliminar" onclick="eliminarItem(${indice})">${iconoEliminar}</span></td>
    </tr>`;
    total += parseInt(item.cantidad) * parseInt(articulo.precio);
  });
  var tablaFooter = `<tr>
    <td colspan="3"></td>
    <td class="total">TOTAL</td>
    <td class="monto">$${total}</td>
    <td></td>
  </tr>
  </tbody>
  </table>`;
  var formCliente = `<div class="row">
      <div class="col-sm column-1">
        Nombre y Apellido:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="name" id="name">
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Telefono:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="phone" id="phone" >
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Dirección:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="adress" id="adress">
      </div>
    </div>
    <div class="row" >
      <div class="col-sm column-1">
      </div>
      <div class="col-sm column-2">
        <div class="error" id="error-cliente"></div>
        <button class="finalizar" onclick="finalizarPedido()">FINALIZAR PEDIDO</button>
      </div>
    </div>`;
  if (pedido.items.length) {
    $("#pedido-final").html(tablaHeader + tablaBody + tablaFooter);
    if ($("#form-cliente").html() === "") {
      $("#form-cliente").html(formCliente);
    }
  } else {
    $("#pedido-final").html("");
    $("#form-cliente").html("");
  }
}

function eliminarItem(indice) {
  pedido.items.splice(indice, 1);
  dibujarPedido();
}

function finalizarPedido() {
  if ($("#name").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un nombre");
    return;
  }
  if ($("#phone").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un teléfono");
    return;
  }
  if ($("#adress").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar una dirección");
    return;
  }
  $("#error-cliente").html("");
  var mensaje = `Muchas gracias por tu compra ${$(
    "#name"
  ).val()}, estaremos enviando tu pedido a ${$(
    "#adress"
  ).val()} en los proximos minutos`;
  $("#detalle-pedido").html(mensaje);
  $("#modal-pedido").modal();
  $("#pedido-final").html("");
  $("#form-cliente").html("");
}

/*-----MAIN-----*/
var articulos = [];
$.ajax({
  url: "./js/datos.json",
  dataType: "json",
  success: (response) => {
    cargarDatos(response, articulos);
  },
});
var pedido = new Pedido();
$("#cantidad").keypress(soloNumeros);
$("#validar-edad").keypress(soloNumeros);

$("#pedidos").on("click", function () {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 2000);
});

$(document).ready(() => {
  preguntarEdad();
});
