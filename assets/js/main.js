// assets/js/main.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

// Configuración de Supabase
const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Datos del carrusel
const servicios = [
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=🎹',
    title: 'Transformación',
    desc: 'Llevamos tus ideas y recuerdos a la música, creando composiciones únicas...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=🎼',
    title: 'Composición',
    desc: 'Nuestros compositores acogerán tus ideas y las convertirán en melodías...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=🎧',
    title: 'Producción',
    desc: 'Mezclamos y masterizamos con tecnología de punta...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=🌐',
    title: 'Exportación',
    desc: 'Exportamos tu proyecto terminado a Spotify, Apple Music, YouTube y más.'
  }
];

// Renderizar carrusel
const carrusel = document.getElementById('carrusel');
const navegacion = document.getElementById('navegacion');

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

  // Botón de navegación
  const btn = document.createElement('button');
  btn.textContent = servicio.title;
  btn.onclick = () => activarItem(i);
  navegacion.appendChild(btn);
});

// Lógica del carrusel
let index = 0;
const items = document.querySelectorAll('.item');
const fondo = document.getElementById('fondo-imagen');

function activarItem(i) {
  items[index].classList.remove('activo');
  index = i;
  items[index].classList.add('activo');
  fondo.style.backgroundImage = `url(${servicios[i].img})`;
}

// Iniciar con el primer fondo
fondo.style.backgroundImage = `url(${servicios[0].img})`;

// Formulario
document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = 'Enviando...';
  mensaje.style.color = '#6a5acd';

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

    mensaje.textContent = '�?¡Registro exitoso! Redirigiendo...';
    mensaje.style.color = 'green';
    
    // Guardar en localStorage para mostrar en confirmación
    localStorage.setItem('cliente', JSON.stringify({
      ...nuevoCliente,
      created_at: new Date().toISOString()
    }));
    
    setTimeout(() => {
      window.location.href = 'confirmacion.html';
    }, 1500);

  } catch (err) {
    console.error('Error:', err);
    mensaje.textContent = '�?Error: ' + (err.message || 'No se pudo registrar.');
    mensaje.style.color = 'red';
  }
});

// Menú de acceso
function toggleMenu() {
  const menu = document.getElementById("menuOpciones");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener("click", function (e) {
  const menu = document.getElementById("menuOpciones");
  if (!e.target.closest(".menu-acceso")) {
    menu.style.display = "none";
  }
});