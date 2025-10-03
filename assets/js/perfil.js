import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Verificar sesión
const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  window.location.href = 'login.html';
}

// Cargar perfil
async function cargarPerfil() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single();

    if (error || !data) {
      document.getElementById('perfil').innerHTML = '<p>❌ Error al cargar tu perfil.</p>';
      return;
    }

    // Saludo
    document.getElementById('saludoCliente').textContent = `Hola, ${data.nombre}`;
    document.getElementById('codigoRaell').textContent = `Número Raell Studio: ${data.numero_raell}`;

    // Letra
    const letraEl = document.getElementById('letraCancion');
    if (data.letra) {
      letraEl.textContent = data.letra;
    } else {
      letraEl.textContent = 'Aún no se ha enviado ninguna letra.';
    }

    // Audio
    const audioEl = document.getElementById('audioMuestra');
    const sourceEl = document.getElementById('audioSource');
    if (data.audio_url) {
      sourceEl.src = data.audio_url;
      audioEl.load();
      audioEl.style.display = 'block';
    } else {
      audioEl.style.display = 'none';
      const audioTitle = document.querySelector('.bloque:nth-child(2) h3');
      if (audioTitle) audioTitle.textContent = 'No hay muestra musical aún.';
    }

    // Comentarios
    renderComentarios(data.comentarios || []);
  } catch (err) {
    console.error('Error en cargarPerfil:', err);
    document.getElementById('perfil').innerHTML = '<p>❌ Error inesperado.</p>';
  }
}

// Enviar comentario
async function enviarComentario() {
  const texto = document.getElementById('comentarioCliente')?.value?.trim();
  if (!texto) return;

  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('comentarios')
      .eq('id', clienteId)
      .single();

    if (error) throw error;

    const comentarios = data.comentarios || [];
    comentarios.push({
      texto,
      fecha: new Date().toISOString(),
      respuesta: null
    });

    const { error: updateError } = await supabase
      .from('clientes')
      .update({ comentarios })
      .eq('id', clienteId);

    if (updateError) throw updateError;

    document.getElementById('comentarioCliente').value = '';
    const mensaje = document.getElementById('mensajeConfirmado');
    if (mensaje) mensaje.textContent = '✅ Comentario enviado correctamente.';

    cargarPerfil();
  } catch (err) {
    console.error('Error al enviar comentario:', err);
    alert('❌ Error al enviar el comentario.');
  }
}

// Renderizar comentarios
function renderComentarios(comentarios) {
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

// Hacer funciones accesibles globalmente
window.enviarComentario = enviarComentario;
window.cerrarSesion = cerrarSesion;

// Iniciar
cargarPerfil();