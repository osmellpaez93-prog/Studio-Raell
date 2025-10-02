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
    // ?? CORREGIDO: sin emojis en URLs
    img: 'https://via.placeholder.com/120/6a5acd/white?text=Transformacion',
    title: 'Transformaci車n',
    desc: 'Llevamos tus ideas y recuerdos a la m迆sica, creando composiciones 迆nicas...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=Composicion',
    title: 'Composici車n',
    desc: 'Nuestros compositores acoger芍n tus ideas y las convertir芍n en melod赤as...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=Produccion',
    title: 'Producci車n',
    desc: 'Mezclamos y masterizamos con tecnolog赤a de punta...'
  },
  {
    img: 'https://via.placeholder.com/120/6a5acd/white?text=Exportacion',
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

if (fondo && servicios[0])