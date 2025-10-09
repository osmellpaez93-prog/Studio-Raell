import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');

if (!clienteId) {
  alert('ID de cliente no válido.');
  window.location.href = 'admin.html';
}

// Cargar datos del cliente
async function cargarCliente() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', clienteId)
    .single();

  if (error || !data) {
    document.getElementById('datosCliente').innerHTML = '<p>❌ Cliente no encontrado.</p>';
    return;
  }

  document.getElementById('datosCliente').innerHTML = `
    <h2>${data.nombre} (${data.numero_raell})</h2>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Descripción:</strong> ${data.descripcion}</p>
  `;

  if (data.letra) document.getElementById('letraAdmin').value = data.letra;
  if (data.audio_url) {
    document.getElementById('audioStatus').textContent = 'Audio actual: ' + data.audio_url;
  }

  renderComentarios(data.comentarios || []);
}

// Guardar letra
async function guardarLetra() {
  const letra = document.getElementById('letraAdmin').value.trim();
  if (!letra) return;

  const { error } = await supabase
    .from('clientes')
    .update({ letra })
    .eq('id', clienteId);

  if (error) alert('❌ Error al guardar la letra.');
  else alert('✅ Letra guardada.');
}

// Subir y guardar audio
async function subirAudio() {
  const fileInput = document.getElementById('audioFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Por favor, selecciona un archivo de audio.');
    return;
  }

  if (!file.type.startsWith('audio/')) {
    alert('Solo se permiten archivos de audio (MP3, WAV, etc.).');
    return;
  }

  const fileName = `${clienteId}_${Date.now()}.mp3`;

  const { error: uploadError } = await supabase
    .storage
    .from('audios')
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    alert('❌ Error al subir el archivo: ' + uploadError.message);
    return;
  }

  const publicUrl = `https://vgrpcnknpeihzljhnfjp.supabase.co/storage/v1/object/public/audios/${encodeURIComponent(fileName)}`;

  const { error: updateError } = await supabase
    .from('clientes')
    .update({ audio_url: publicUrl })
    .eq('id', clienteId);

  if (updateError) {
    alert('❌ Error al guardar la URL: ' + updateError.message);
    return;
  }

  document.getElementById('audioStatus').textContent = '✅ Audio subido y enlazado.';
  alert('✅ Audio listo. El cliente ya puede escucharlo.');
}

// Responder al último comentario
async function responderComentario() {
  const respuesta = document.getElementById('respuestaAdmin').value.trim();
  if (!respuesta) return;

  const { data, error } = await supabase
    .from('clientes')
    .select('comentarios')
    .eq('id', clienteId)
    .single();

  if (error || !data) {
    alert('❌ Error al cargar comentarios.');
    return;
  }

  const comentarios = data.comentarios || [];
  if (comentarios.length === 0) {
    alert('No hay comentarios para responder.');
    return;
  }

  comentarios[comentarios.length - 1].respuesta = respuesta;

  const { error: updateError } = await supabase
    .from('clientes')
    .update({ comentarios })
    .eq('id', clienteId);

  if (updateError) {
    alert('❌ Error al enviar respuesta: ' + updateError.message);
    return;
  }

  alert('✅ Respuesta enviada.');
  document.getElementById('respuestaAdmin').value = '';
  cargarCliente();
}

// Renderizar comentarios
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
    : '<p>No hay comentarios aún.</p>';
}

// Eliminar perfil completo
async function eliminarCliente() {
  if (!confirm('⚠️ ¿Eliminar TODO el perfil del cliente? Esta acción es irreversible.')) return;

  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', clienteId);

  if (error) {
    document.getElementById('mensajeEliminacion').textContent = '❌ Error al eliminar cliente.';
    console.error('Error:', error);
  } else {
    alert('✅ Cliente eliminado permanentemente.');
    window.location.href = 'admin.html';
  }
}

// Hacer funciones accesibles desde HTML
window.guardarLetra = guardarLetra;
window.subirAudio = subirAudio;
window.responderComentario = responderComentario;
window.eliminarCliente = eliminarCliente;

// Iniciar
cargarCliente();