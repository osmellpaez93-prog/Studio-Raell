import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Datos del carrusel
const servicios = [
  {
    img: './assets/img/piano.jpg',
    title: 'Transformacion',
    desc: 'Llevamos tus ideas y recuerdos a la musica, creando composiciones unicas...'
  },
  {
    img: './assets/img/partituras.jpg',
    title: 'Composicion',
    desc: 'Nuestros compositores acogeran tus ideas y las convertiran en melodias...'
  },
  {
    img: './assets/img/studio.jpg',
    title: 'Produccion',
    desc: 'Mezclamos y masterizamos con tecnologia de punta...'
  },
  {
    img: './assets/img/plataformas.jpg',
    title: 'Exportacion',
    desc: 'Exportamos tu proyecto terminado a Spotify, Apple Music, YouTube y mas.'
  }
];

// Carrusel dinamico
const carrusel = document.getElementById('carrusel');
const navegacion = document.getElementById('navegacion');
const fondo = document.getElementById('fondo-imagen');
let index = 0;
let items = [];

if (carrusel && navegacion) {
  servicios.forEach((servicio, i) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <img src="${servicio.img}" alt="${servicio.title}" />
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

  items = document.querySelectorAll('.item');
  activarItem(0); // Activar el primero al cargar

  function activarItem(i) {
    items.forEach(item => item.classList.remove('activo'));
    index = i;
    items[index].classList.add('activo');
    if (fondo) fondo.style.backgroundImage = `url(${servicios[i].img})`;
  }

  setInterval(() => {
    index = (index + 1) % servicios.length;
    activarItem(index);
  }, 10000);
}

// Formulario (solo si existe en esta pagina)
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
    const { error } = await supabase
      .from('clientes')
      .insert([nuevoCliente]);

    if (error) throw error;

    if (mensaje) {
      mensaje.textContent = '? Registro exitoso! Redirigiendo...';
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

// Menu de acceso
window.toggleMenu = function () {
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

// Animaciones de entrada
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.aparece').forEach((el) => observador.observe(el));