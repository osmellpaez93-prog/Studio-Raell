let items = document.querySelectorAll(".carrusel .item");
let fondo = document.getElementById("fondo-imagen");
let index = 0;
let autoCarrusel = true;
let temporizadorManual = null;

function mostrarItem(i) {
  items[index].classList.remove("activo");
  index = i;
  items[index].classList.add("activo");
  let imagen = items[index].getAttribute("data-img");
  fondo.style.backgroundImage = `url('${imagen}')`;
}

function siguienteItem() {
  if (!autoCarrusel) return;
  let siguiente = (index + 1) % items.length;
  mostrarItem(siguiente);
}

setInterval(siguienteItem, 5000);

function activarItem(i) {
  autoCarrusel = false;
  clearTimeout(temporizadorManual);
  mostrarItem(i);
  temporizadorManual = setTimeout(() => {
    autoCarrusel = true;
  }, 30000);
}

window.onload = () => {
  let imagen = items[0].getAttribute("data-img");
  fondo.style.backgroundImage = `url('${imagen}')`;
};
