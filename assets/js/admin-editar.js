// assets/js/admin-editar.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

const urlParams = new URLSearchParams(window.location.search);
const proyectoId = urlParams.get('id');

if (!proyectoId) {
  alert('ID de proyecto no válido.');
  window.location.href = 'admin.html';
}

async function cargarProyecto() {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', proyectoId)
    .single();

  if (error || !data) {
    document.getElementById('datosCliente').innerHTML = '<p>❌ Proyecto no encontrado.</p>';
    return;
  }

  document.getElementById('datosCliente').innerHTML = `
    <h2>${data.nombre} (${data.numero_raell})</h2>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Descripción:</strong> ${data.descripcion}</p>
  `;

  if (data.letra) document.getElementById('letraAdmin').value = data.letra;
  if (data.audio_url) {
    document.getElementById('audioStatus').textContent = 'Audio: ' + data.audio_url;
  }

  renderComentarios(data.comentarios || []);
}

async function guardarLetra() {
  const letra = document.getElementById('letraAdmin').value.trim();
  if (!letra) return;

  const { error } = await supabase
    .from('proyectos')
    .update({ letra })
    .eq('id', proyectoId);

  if (error) alert('❌ Error al guardar la letra.');
  else alert('✅ Letra guardada.');
}

async function subirAudio() {
  const fileInput = document.getElementById('audioFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Selecciona un archivo de audio.');
    return;
  }

  const fileName = `${proyectoId}_${Date.now()}.mp3`;

  const { error: uploadError } = await supabase
    .storage
    .from('audios')
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    alert('❌ Error al subir: ' + uploadError.message);
    return;
  }

  // ✅ URL manual (confiable)
  const publicUrl = `https://vgrpcnknpeihzljhnfjp.supabase.co/storage/v1/object/public/audios/${encodeURIComponent(fileName)}`;

  const { error: updateError } = await supabase
    .from('proyectos')
    .update({ audio_url: publicUrl })
    .eq('id', proyectoId);

  if (updateError) {
    alert('❌ Error al guardar URL: ' + updateError.message);
    return;
  }

  alert('✅ Audio enlazado al proyecto.');
  cargarProyecto();
}

async function responderComentario() {
  const respuesta = document.getElementById('respuestaAdmin').value.trim();
  if (!respuesta) return;

  const { data, error } = await supabase
    .from('proyectos')
    .select('comentarios')
    .eq('id', proyectoId)
    .single();

  if (error || !data || !data.comentarios?.length) {
    alert('No hay comentarios.');
    return;
  }

  const comentarios = data.comentarios;
  comentarios[comentarios.length - 1].respuesta = respuesta;

  const { error: updateError } = await supabase
    .from('proyectos')
    .update({ comentarios })
    .eq('id', proyectoId);

  if (updateError) {
    alert('❌ Error al responder.');
    return;
  }

  alert('✅ Respuesta enviada.');
  document.getElementById('respuestaAdmin').value = '';
  cargarProyecto();
}

function renderComentarios(comentarios) {
  const cont = document.getElementById('comentarios');
  if (!cont) return;
  cont.innerHTML = comentarios.length
    ? comentarios.map(c => `
        <div style="background:rgba(255,255,255,0.1); padding:10px; margin:10px 0; border-radius:6px;">
          <p><strong>Cliente:</strong> ${c.texto}</p>
          <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
          ${c.respuesta ? `<p><strong>Tú:</strong> ${c.respuesta}</p>` : '<p><em>Esperando tu respuesta...</em></p>'}
        </div>
      `).join("")
    : '<p>No hay comentarios.</p>';
}

window.guardarLetra = guardarLetra;
window.subirAudio = subirAudio;
window.responderComentario = responderComentario;

cargarProyecto();