// assets/js/main.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

// ?? CORREGIDO: URLs sin espacios al final
const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Datos del carrusel
const servicios = [
  {
    img: './assets/img/piano.jpg',
    title: 'Transformaci車n',
    desc: 'Llevamos tus ideas y recuerdos a la m迆sica, creando composiciones 迆nicas...'
  },
  {
    img: './assets/img/partituras.jpg',
    title: 'Composici車n',
    desc: 'Nuestros compositores acoger芍n tus ideas y las convertir芍n en melod赤as...'
  },
  {
    img: './assets/img/studio.jpg',
    title: 'Producci車n',
    desc: 'Mezclamos y masterizamos con tecnolog赤a de punta...'
  },
  {
    img: './assets/img/plataformas.jpg',
    title: 'Exportaci車n',
    desc: 'Exportamos tu proyecto terminado a Spotify, Apple Music, YouTube y m芍s.'
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

// L車gica del carrusel
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

// Formulario
document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const mensaje = document.getElementById('mensaje');
  if (mensaje) {
    mensaje.textContent = 'Enviando...';
    mensaje.style.color = '#6a5acd';
  }

  const formData = new FormData(e.target);
  const numeroRaell = "R" + Math.floor(10000 + Math.random() * 90000) + "L";

  const nuevoCliente = {
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    nombre_artistico: formData.get('nombreArtistico') || null,
    cantante: formData.get('cantante'),
    fecha_entrega: formData.get('fechaEntrega') || null,
    descripcion: formData.get('descripcion'),
    numero_raell: numeroRaell
  };

  try {
    // ?? Verificamos que todas las columnas existan en Supabase
    const { error } = await supabase
      .from('clientes')
      .insert([nuevoCliente]);

    if (error) throw error;

    if (mensaje) {
      mensaje.textContent = '? ?Registro exitoso! Redirigiendo...';
      mensaje.style.color = 'green';
    }
    
    localStorage.setItem('cliente', JSON.stringify({
      ...nuevoCliente,
      created_at: new Date().toISOString()
    }));
    
    setTimeout(() => {
      window.location.href = 'confirmacion.html';
    }, 1500);

  } catch (err) {
    console.error('Error:', err);
    if (mensaje) {
      mensaje.textContent = '? Error: ' + (err.message || 'No se pudo registrar.');
      mensaje.style.color = 'red';
    }
  }
});

// Men迆 de acceso
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
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.aparece').forEach((el) => observador.observe(el));