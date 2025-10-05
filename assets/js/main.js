// assets/js/main.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Datos del carrusel
const servicios = [
  {
    img: 'https://via.placeholder.com/800x400/6a5acd/white?text=Transformaci%C3%B3n',
    title: 'Transformacion',
    desc: 'Llevamos tus ideas y recuerdos a la musica, creando composiciones unicas...'
  },
  {
    img: 'https://via.placeholder.com/800x400/6a5acd/white?text=Composici%C3%B3n',
    title: 'Composicion',
    desc: 'Nuestros compositores acogeran tus ideas y las convertiran en melodias...'
  },
  {
    img: 'https://via.placeholder.com/800x400/6a5acd/white?text=Producci%C3%B3n',
    title: 'Produccion',
    desc: 'Mezclamos y masterizamos con tecnologia de punta...'
  },
  {
    img: 'https://via.placeholder.com/800x400/6a5acd/white?text=Exportaci%C3%B3n',
    title: 'Exportacion',
    desc: 'Exportamos tu proyecto terminado a Spotify, Apple Music, YouTube y mas.'
  }
];

// Renderizar carrusel
const carrusel = document.getElementById('carrusel');
const navegacion = document.getElementById('navegacion');
const fondo = document.getElementById('fondo-imagen');

if (carrusel && navegacion && fondo) {
  servicios.forEach((servicio, i) => {
    // Item del carrusel
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

    // Boton de navegacion
    const btn = document.createElement('button');
    btn.textContent = servicio.title;
    btn.onclick = () => activarItem(i);
    navegacion.appendChild(btn);
  });

  // Logica del carrusel
  let index = 0;
  const items = document.querySelectorAll('.item');

  function activarItem(i) {
    items[index]?.classList.remove('activo');
    index = i;
    items[index]?.classList.add('activo');
    fondo.style.backgroundImage = `url(${servicios[i].img})`;
  }

  // Iniciar con el primer fondo
  fondo.style.backgroundImage = `url(${servicios[0].img})`;

  // Cambiar automaticamente cada 10 segundos
  setInterval(() => {
    index = (index + 1) % servicios.length;
    activarItem(index);
  }, 10000);
}

// Menu de acceso
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

// Formulario de registro (sin cambios)
document.getElementById('registroForm')?.addEventListener('submit', async (e) => {
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
    document.getElementById('mensaje').textContent = 'Error de conexion. Intenta de nuevo.';
  }
});