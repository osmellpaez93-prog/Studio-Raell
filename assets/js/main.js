// assets/js/main.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Datos del carrusel
const servicios = [
  {
    img: './assets/img/piano.jpg',
    title: 'Transformaci�n',
    desc: 'Llevamos tus ideas y recuerdos a la m�sica. T� decides qu� incluir en cada parte de la canci�n: desde una frase que te marc�, hasta el sonido de una risa, una nota de voz, o el ritmo de tu historia. Podemos transformar una carta, un poema, una conversaci�n o incluso un silencio en melod�a. Cada canci�n es un reflejo de ti, y t� eres el compositor emocional.'
  },
  {
    img: './assets/img/partituras.jpg',
    title: 'Composici�n',
    desc: 'Nuestros compositores acoger�n tus ideas y las llevar�n a la m�sica respetando cada detalle y haci�ndolo sonar profesional. Puedes compartirnos palabras, emociones, frases, o simplemente una idea general. Nosotros lo convertiremos en una partitura musical �nica para ti.'
  },
  {
    img: './assets/img/studio.jpg',
    title: 'Producci�n',
    desc: 'Mezclamos y masterizamos con tecnolog�a de punta para lograr calidad profesional. Utilizamos herramientas avanzadas de edici�n, ecualizaci�n y espacializaci�n para que tu proyecto suene como si fuera de un estudio de primera clase.'
  },
  {
    img: './assets/img/plataformas.jpg',
    title: 'Exportaci�n',
    desc: 'Exportamos tu proyecto terminado a todas las plataformas digitales, con los datos que t� elijas: nombre art�stico, t�tulo, g�nero, portada y m�s. T� eres el autor, y nosotros te ayudamos a llegar a tu p�blico.'
  }
];

// Renderizar carrusel
const carrusel = document.getElementById('carrusel');
const navegacion = document.getElementById('navegacion');

if (carrusel && navegacion) {
  servicios.forEach((servicio, i) => {
    const item = document.createElement('div');
    item.className = i === 0 ? 'item activo' : 'item';
    item.innerHTML = `
      <img src="${servicio.img}" alt="${servicio.title}">
      <div class="info">
        <h3>${servicio.title}</h3>
        <p>${servicio.desc}</p>
      </div>
    `;
    carrusel.appendChild(item);

    const btn = document.createElement('button');
    btn.textContent = servicio.title;
    btn.onclick = () => activarItem(i);
    navegacion.appendChild(btn);
  });
}

// L�gica del carrusel
let index = 0;
const items = document.querySelectorAll('.item');
const fondo = document.getElementById('fondo-imagen');

function activarItem(i) {
  if (items[index]) items[index].classList.remove('activo');
  index = i;
  if (items[index]) items[index].classList.add('activo');
  if (fondo) fondo.style.backgroundImage = `url(${servicios[i].img})`;
}

if (fondo && servicios[0]) {
  fondo.style.backgroundImage = `url(${servicios[0].img})`;
}

// Cambiar autom�ticamente cada 10 segundos
setInterval(() => {
  index = (index + 1) % servicios.length;
  activarItem(index);
}, 10000);

// Men� de acceso
window.toggleMenu = function() {
  const menu = document.getElementById("menuOpciones");
  if (menu) {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
};

window.addEventListener("click", function (e) {
  const menu = document.getElementById("menuOpciones");
  if (menu && !e.target.closest(".menu-acceso")) {
    menu.style.display = "none";
  }
});

// Formulario de registro (si necesitas mantenerlo en esta p�gina)
document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const descripcion = document.getElementById('descripcion').value;

  try {
    const res = await fetch('/api/crear-proyecto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, descripcion })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = `/perfil.html?proyecto=${data.id}`;
    } else {
      document.getElementById('mensaje').textContent = 'Error: ' + (data.error || 'No se pudo crear el proyecto.');
    }
  } catch (err) {
    document.getElementById('mensaje').textContent = 'Error de conexi�n. Intenta de nuevo.';
  }
});