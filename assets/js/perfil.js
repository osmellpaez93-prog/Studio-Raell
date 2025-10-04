import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  window.location.href = 'login.html';
}

async function cargarPerfil() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single();

    if (error || !data) throw error;

    // Verificar que los elementos existan antes de usarlos
    const saludoEl = document.getElementById('saludoCliente');
    const codigoEl = document.getElementById('codigoRaell');
    const letraEl = document.getElementById('letraCancion');
    const audioEl = document.getElementById('audioMuestra');
    const sourceEl = document.getElementById('audioSource');

    if (saludoEl) saludoEl.textContent = `Hola, ${data.nombre}`;
    if (codigoEl) codigoEl.textContent = `Número Raell: ${data.numero_raell}`;
    if (letraEl) letraEl.textContent = data.letra || 'Aún no hay letra.';

    if (audioEl && sourceEl) {
      if (data.audio_url) {
        sourceEl.src = data.audio_url;
        audioEl.load();
        audioEl.style.display = 'block';
      } else {
        audioEl.style.display = 'none';
      }
    }

    renderComentarios(data.comentarios || []);
  } catch (err) {
    console.error('Error al cargar perfil:', err);
    document.getElementById('perfil').innerHTML = '<p>❌ Error al cargar tu perfil.</p>';
  }
}

async function enviarComentario() {
  const texto = document.getElementById('comentarioCliente')?.value?.trim();
  if (!texto) return;

  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('comentarios')
      .eq('id', clienteId)
      .single();

    const comentarios = data.comentarios || [];
    comentarios.push({ texto, fecha: new Date().toISOString(), respuesta: null });

    await supabase
      .from('clientes')
      .update({ comentarios })
      .eq('id', clienteId);

    document.getElementById('comentarioCliente').value = '';
    document.getElementById('mensajeConfirmado').textContent = '✅ Enviado.';
    cargarPerfil();
  } catch (err) {
    alert('❌ Error al enviar.');
  }
}

function renderComentarios(comentarios) {
  const cont = document.getElementById('historialComentarios');
  if (!cont) return;
  cont.innerHTML = comentarios.length
    ? comentarios.map(c => `
        <div style="background:#222; padding:10px; margin:8px 0; border-radius:6px;">
          <p><strong>Tú:</strong> ${c.texto}</p>
          <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
          ${c.respuesta ? `<p><strong>Raell:</strong> ${c.respuesta}</p>` : ''}
        </div>
      `).join("")
    : '<p>No hay comentarios.</p>';
}

function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}

window.enviarComentario = enviarComentario;
window.cerrarSesion = cerrarSesion;

cargarPerfil();