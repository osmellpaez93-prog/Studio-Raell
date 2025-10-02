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

  // Mostrar letra y audio si existen
  if (data.letra) document.getElementById('letraAdmin').value = data.letra;
  if (data.audio_url) document.getElementById('audioUrl').value = data.audio_url;

  // Renderizar comentarios
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

// Guardar audio
async function guardarAudio() {
  const url = document.getElementById('audioUrl').value.trim();
  if (!url) return;

  const { error } = await supabase
    .from('clientes')
    .update({ audio_url: url })
    .eq('id', clienteId);

  if (error) alert('❌ Error al guardar el audio.');
  else alert('✅ Audio guardado.');
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

  if (error) {
    alert('❌ Error al cargar comentarios.');
    return;
  }

  const comentarios = data.comentarios || [];
  if (comentarios.length === 0) {
    alert('No hay comentarios para responder.');
    return;
  }

  // Responder al último comentario
  comentarios[comentarios.length - 1].respuesta = respuesta;

  const { error: updateError } = await supabase
    .from('clientes')
    .update({ comentarios })
    .eq('id', clienteId);

  if (updateError) alert('❌ Error al enviar la respuesta.');
  else {
    alert('✅ Respuesta enviada.');
    document.getElementById('respuestaAdmin').value = '';
    cargarCliente(); // Recargar para ver la respuesta
  }
}

// Renderizar comentarios
function renderComentarios(comentarios) {
  const cont = document.getElementById('comentarios');
  if (comentarios.length === 0) {
    cont.innerHTML = '<p>No hay comentarios aún.</p>';
    return;
  }

  cont.innerHTML = comentarios.map(c => `
    <div style="background:rgba(255,255,255,0.1); padding:10px; margin:10px 0; border-radius:6px;">
      <p><strong>Cliente:</strong> ${c.texto}</p>
      <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
      ${c.respuesta ? `<p><strong>Tú:</strong> ${c.respuesta}</p>` : '<p><em>Esperando tu respuesta...</em></p>'}
    </div>
  `).join('');
}

// Iniciar
cargarCliente();