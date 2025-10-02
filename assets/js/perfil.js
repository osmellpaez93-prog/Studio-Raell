import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Obtener datos del cliente desde localStorage
const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  window.location.href = 'login.html';
}

// Cargar datos del cliente
async function cargarPerfil() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', clienteId)
    .single();

  if (error || !data) {
    document.getElementById('perfil').innerHTML = '<p>❌ Error al cargar tu perfil.</p>';
    return;
  }

  // Mostrar saludo y número Raell
  document.getElementById('saludoCliente').textContent = `Hola, ${data.nombre}`;
  document.getElementById('codigoRaell').textContent = `Número Raell Studio: ${data.numero_raell}`;

  // Mostrar letra
  const letraEl = document.getElementById('letraCancion');
  if (data.letra) {
    letraEl.textContent = data.letra;
  } else {
    letraEl.textContent = 'Aún no se ha enviado ninguna letra.';
  }

  // Mostrar audio
  const audioEl = document.getElementById('audioMuestra');
  const sourceEl = document.getElementById('audioSource');
  if (data.audio_url) {
    sourceEl.src = data.audio_url;
    audioEl.load();
  } else {
    sourceEl.src = '';
    audioEl.pause();
    audioEl.style.display = 'none';
    document.querySelector('.bloque:nth-child(2) h3').textContent = 'No hay muestra musical aún.';
  }

  // Renderizar comentarios
  renderComentarios(data.comentarios);
}

// Enviar comentario
async function enviarComentario() {
  const texto = document.getElementById('comentarioCliente').value.trim();
  if (!texto) return;

  const { data, error } = await supabase
    .from('clientes')
    .update({
      comentarios: supabase.fn.jsonb_array_append('comentarios', {
        texto,
        fecha: new Date().toISOString(),
        respuesta: null
      })
    })
    .eq('id', clienteId);

  if (error) {
    document.getElementById('mensajeConfirmado').textContent = '❌ Error al enviar el comentario.';
    return;
  }

  document.getElementById('comentarioCliente').value = '';
  document.getElementById('mensajeConfirmado').textContent = '✅ Comentario enviado correctamente.';

  // Recargar comentarios
  cargarPerfil();
}

// Renderizar comentarios
function renderComentarios(comentarios = []) {
  const cont = document.getElementById('historialComentarios');
  if (!cont) return;

  if (comentarios.length === 0) {
    cont.innerHTML = '<p>No has enviado comentarios aún.</p>';
    return;
  }

  cont.innerHTML = comentarios.map(c => `
    <div class="comentario-box">
      <p><strong>Tú:</strong> ${c.texto}</p>
      <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
      ${c.respuesta ? `<p><strong>Raell Studio:</strong> ${c.respuesta}</p>` : ""}
    </div>
  `).join("");
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('cliente_id');
  localStorage.removeItem('cliente_nombre');
  localStorage.removeItem('cliente_numero');
  window.location.href = 'login.html';
}

// Cargar perfil al iniciar
cargarPerfil();