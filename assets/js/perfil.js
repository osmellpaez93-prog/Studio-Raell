// assets/js/perfil.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

const proyectoId = localStorage.getItem('proyecto_id');
if (!proyectoId) {
  window.location.href = 'login.html';
}

async function cargarProyecto() {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', proyectoId)
      .single();

    if (error || !data) throw error;

    document.getElementById('saludoCliente').textContent = `Hola, ${data.nombre}`;
    document.getElementById('codigoRaell').textContent = `Número Raell Studio: ${data.numero_raell}`;

    const letraEl = document.getElementById('letraCancion');
    letraEl.textContent = data.letra || 'Aún no se ha enviado ninguna letra.';

    const audioEl = document.getElementById('audioMuestra');
    const sourceEl = document.getElementById('audioSource');
    const audioTitle = document.querySelector('.bloque:nth-child(2) h3');

    if (data.audio_url) {
      sourceEl.src = data.audio_url;
      audioEl.load();
      audioEl.style.display = 'block';
      if (audioTitle) audioTitle.textContent = 'Prueba musical';
    } else {
      audioEl.style.display = 'none';
      if (audioTitle) audioTitle.textContent = 'No hay muestra musical aún.';
    }

    renderComentarios(data.comentarios || []);
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('perfil').innerHTML = '<p>❌ Error al cargar tu proyecto.</p>';
  }
}

async function enviarComentario() {
  const texto = document.getElementById('comentarioCliente')?.value?.trim();
  if (!texto) return;

  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('comentarios')
      .eq('id', proyectoId)
      .single();

    if (error) throw error;

    const comentarios = data.comentarios || [];
    comentarios.push({
      texto,
      fecha: new Date().toISOString(),
      respuesta: null
    });

    const { error: updateError } = await supabase
      .from('proyectos')
      .update({ comentarios })
      .eq('id', proyectoId);

    if (updateError) throw updateError;

    document.getElementById('comentarioCliente').value = '';
    const msg = document.getElementById('mensajeConfirmado');
    if (msg) msg.textContent = '✅ Comentario enviado.';

    cargarProyecto();
  } catch (err) {
    alert('❌ Error al enviar el comentario.');
  }
}

function renderComentarios(comentarios) {
  const cont = document.getElementById('historialComentarios');
  if (!cont) return;
  cont.innerHTML = comentarios.length
    ? comentarios.map(c => `
        <div class="comentario-box">
          <p><strong>Tú:</strong> ${c.texto}</p>
          <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
          ${c.respuesta ? `<p><strong>Raell Studio:</strong> ${c.respuesta}</p>` : ""}
        </div>
      `).join("")
    : '<p>No has enviado comentarios aún.</p>';
}

function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}

window.enviarComentario = enviarComentario;
window.cerrarSesion = cerrarSesion;

cargarProyecto();