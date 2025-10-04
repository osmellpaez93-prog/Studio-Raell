// assets/js/registro.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = 'Enviando...';
  mensaje.style.color = '#6a5acd';

  const numeroRaell = "R" + Math.floor(10000 + Math.random() * 90000) + "L";

  const data = {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    nombre_artistico: document.getElementById('nombreArtistico').value.trim() || null,
    cantante: document.getElementById('cantante').value,
    fecha_entrega: document.getElementById('fechaEntrega').value || null,
    descripcion: document.getElementById('descripcion').value.trim(),
    numero_raell: numeroRaell
  };

  try {
    const { error } = await supabase.from('clientes').insert([data]);
    if (error) throw error;

    // ✅ Guardar en localStorage para confirmacion.html
    localStorage.setItem('numeroRaellUsuario', numeroRaell);
    localStorage.setItem('nombreUsuario', data.nombre);
    localStorage.setItem('emailUsuario', data.email);
    localStorage.setItem('descripcionUsuario', data.descripcion);

    mensaje.textContent = '✅ ¡Registro exitoso!';
    mensaje.style.color = 'green';
    setTimeout(() => window.location.href = 'confirmacion.html', 1500);
  } catch (err) {
    console.error('Error:', err);
    mensaje.textContent = '❌ Error: ' + (err.message || 'No se pudo registrar.');
    mensaje.style.color = 'red';
  }
});