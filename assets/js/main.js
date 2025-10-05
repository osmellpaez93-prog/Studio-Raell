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
    title: 'Transformacion',
    desc: 'Llevamos tus ideas y recuerdos a la musica. Tu decides que incluir en cada parte de la cancion: desde una frase que te marco, hasta el sonido de una risa, una nota de voz, o el ritmo de tu historia. Podemos transformar una carta, un poema, una conversacion o incluso un silencio en melodia. Cada cancion es un reflejo de ti, y tu eres el compositor emocional.
'
  },
  {
    img: './assets/img/partituras.jpg',
    title: 'Composicion',
    desc: 'Nuestros compositores acogeran tus ideas y las llevaran a la musica respetando cada detalle y haciendolo sonar profesional. Puedes compartirnos palabras, emociones, momentos, sonidos o incluso objetos que tengan significado para ti. Nosotros los transformamos en armonia, ritmo y letra, cuidando cada matiz para que tu cancion no solo suene bien, sino que te represente con autenticidad.
'
  },
  {
    img: './assets/img/studio.jpg',
    title: 'Produccion',
    desc: 'Mezclamos y masterizamos con tecnologia de punta para lograr calidad profesional. Utilizamos herramientas avanzadas de edicion, ecualizacion y espacializacion para que cada elemento de tu cancion, voz, instrumentos y efectos suene claro, equilibrado y envolvente. Nos aseguramos de que tu musica este lista para cualquier plataforma: desde auriculares personales hasta escenarios en vivo. Tu cancion no solo se escucha bien, se siente bien.
'
  },
  {
    img: './assets/img/plataformas.jpg',
    title: 'Exportacion',
    desc: 'Exportamos tu proyecto terminado a todas las plataformas digitales, con los datos que tu elijas: nombre artistico, titulo, genero, portada y mas. Tu eres el autor y propietario de la cancion, con todos los derechos. Te entregamos los archivos listos para publicar en Spotify, Apple Music, YouTube, y cualquier otra plataforma que prefieras o elegir si lo hacemos nosotros. Tu musica, tu firma, tu historia.</p>
'
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

// L¨®gica del carrusel
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

// Men¨² de acceso
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