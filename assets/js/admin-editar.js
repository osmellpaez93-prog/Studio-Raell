import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Obtener cliente_id desde la URL
const clienteId = new URLSearchParams(window.location.search).get('id');
if (!clienteId) {
  document.getElementById('mensajeError')?.textContent = '❌ Cliente no especificado.';
  throw new Error('Cliente ID no encontrado en la URL');
}

let proyectoActual = null;

// Cargar proyecto vinculado al cliente
async function cargarProyecto() {
  try {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      document.getElementById('mensajeError')?.textContent = '❌ Proyecto no encontrado.';
      return;
    }

    proyectoActual = data;

    // Mostrar letra actual
    document.getElementById('letraCancion').value = data.letra || '';

    // Mostrar audio actual si existe
    const audioEl = document.getElementById('audioMuestra');
    const sourceEl = document.getElementById('audioSource');
    const audioTitle = document.querySelector('.bloque:nth-child(2) h3);

    if (data.audio_url) {
      sourceEl.src = data.audio_url;
      audioEl.load();
      audioEl.style.display = 'block';
      if (audioTitle) audioTitle.textContent = 'Prueba musical';
    } else {
      audioEl.style.display = 'none';
      if (audioTitle) audioTitle.textContent = 'No hay muestra musical aún.';
    }

    // Mostrar comentarios
    renderComentarios(data.comentarios || []);
  } catch (err) {
    console.error('Error al cargar proyecto:', err);
    document.getElementById('mensajeError')?.textContent = '❌ Error al cargar el proyecto.';
  }
}

// Guardar letra
async function guardarLetra() {
  const nuevaLetra = document.getElementById('letraCancion').value.trim();
  if (!proyectoActual || !nuevaLetra) return;

  const { error } = await supabase
    .from('proyectos')
    .update({ letra: nuevaLetra })
    .eq('id', proyectoActual.id);

  if (error) {
    alert('❌ Error al guardar la letra.');
    return;
  }

  alert('✅ Letra actualizada correctamente.');
}

// Subir y guardar audio
async function subirYGuardarAudio() {
  const archivo = document.getElementById('archivoAudio').files[0];
  if (!archivo || !proyectoActual) return;

  const nombreArchivo = `${proyectoActual.cliente_id}/${Date.now()}_${archivo.name}`;
  const { data, error } = await supabase.storage
    .from('audios')
    .upload(nombreArchivo, archivo, { upsert: true });

  if (error) {
    alert('❌ Error al subir el audio.');
    return;
  }

  const url = supabase.storage
    .from('audios')
    .getPublicUrl(nombreArchivo).data.publicUrl;

  const { error: updateError } = await supabase
    .from('proyectos')
    .update({ audio_url: url })
    .eq('id', proyectoActual.id);

  if (updateError) {
    alert('❌ Error al guardar el audio.');
    return;
  }

  alert('✅ Audio actualizado correctamente.');
  cargarProyecto(); // Recargar para mostrar el nuevo audio
}

// Mostrar comentarios del cliente
function renderComentarios(comentarios) {
  const cont = document.getElementById('comentarios');
  if (!cont) return;

  cont.innerHTML = comentarios.length
    ? comentarios.map((c, i) => `
        <div class="comentario-box" style="border:1px solid #ccc; padding:10px; margin:10px 0;">
          <p><strong>Cliente:</strong> ${c.texto}</p>
          <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
          ${c.respuesta ? `<p><strong>Respuesta enviada:</strong> ${c.respuesta}</p>` : ""}
        </div>
      `).join("")
    : '<p>No hay comentarios aún.</p>';
}

// Enviar respuesta del admin
async function responderComentario() {
  const respuesta = document.getElementById('respuestaAdmin')?.value?.trim();
  if (!respuesta || !proyectoActual) return;

  const comentarios = proyectoActual.comentarios || [];
  const sinResponder = comentarios.find(c => !c.respuesta);

  if (!sinResponder) {
    alert('✅ Todos los comentarios ya tienen respuesta.');
    return;
  }

  sinResponder.respuesta = respuesta;

  const { error } = await supabase
    .from('proyectos')
    .update({ comentarios })
    .eq('id', proyectoActual.id);

  if (error) {
    alert('❌ Error al enviar la respuesta.');
    return;
  }

  document.getElementById('respuestaAdmin').value = '';
  alert('✅ Respuesta enviada correctamente.');
  proyectoActual.comentarios = comentarios;
  renderComentarios(comentarios);
}

// Hacer funciones globales
window.guardarLetra = guardarLetra;
window.subirYGuardarAudio = subirYGuardarAudio;
window.responderComentario = responderComentario;

// Iniciar
cargarProyecto();