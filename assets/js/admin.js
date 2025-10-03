import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Protección de acceso
if (localStorage.getItem('admin') !== 'true') {
  alert('Acceso denegado. Usa el código maestro en login.');
  window.location.href = 'login.html';
}

// Mostrar clientes
async function cargarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  const contenedor = document.getElementById('listaClientes');
  if (error || !data) {
    contenedor.innerHTML = '<p>❌ Error al cargar los clientes.</p>';
    return;
  }

  if (data.length === 0) {
    contenedor.innerHTML = '<p>No hay clientes registrados aún.</p>';
    return;
  }

  contenedor.innerHTML = data.map(cliente => `
    <div class="cliente-item" style="background:rgba(255,255,255,0.1); padding:15px; margin:10px 0; border-radius:8px;">
      <h3>${cliente.nombre} (${cliente.numero_raell})</h3>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Cantante:</strong> ${cliente.cantante}</p>
      <p><strong>Descripción:</strong> ${cliente.descripcion.substring(0, 50)}...</p>
      <button onclick="window.editarCliente('${cliente.id}')" style="margin:5px; padding:6px 12px; background:#00c3ff; color:white; border:none; border-radius:4px; cursor:pointer;">Editar</button>
      <button onclick="window.eliminarCliente('${cliente.id}')" style="margin:5px; padding:6px 12px; background:#ff4d4d; color:white; border:none; border-radius:4px; cursor:pointer;">Eliminar</button>
    </div>
  `).join("");
}

// Llenar selector
async function llenarSelectorClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre');

  const selector = document.getElementById('clienteSeleccionado');
  if (error || !data || data.length === 0) {
    selector.innerHTML = '<option disabled>No hay clientes</option>';
    return;
  }

  selector.innerHTML = data.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

// Subir audio a Supabase Storage
async function subirAudio(clienteId) {
  const archivo = document.getElementById('archivoAudio').files[0];
  if (!archivo) return null;

  const nombreArchivo = `${clienteId}/${Date.now()}_${archivo.name}`;
  const { data, error } = await supabase.storage
    .from('audios')
    .upload(nombreArchivo, archivo, { upsert: true });

  if (error) {
    alert('❌ Error al subir el audio.');
    return null;
  }

  const url = supabase.storage
    .from('audios')
    .getPublicUrl(nombreArchivo).data.publicUrl;

  return url;
}

// Guardar contenido
async function guardarContenido() {
  const clienteId = document.getElementById('clienteSeleccionado').value;
  const letra = document.getElementById('letraCancion').value.trim();
  const audioURL = await subirAudio(clienteId);

  if (!clienteId || (!letra && !audioURL)) {
    alert('⚠️ Debes seleccionar un cliente y escribir letra o subir audio.');
    return;
  }

  const { error } = await supabase
    .from('clientes')
    .update({ letra, audio_url: audioURL })
    .eq('id', clienteId);

  if (error) {
    alert('❌ Error al guardar contenido.');
    return;
  }

  document.getElementById('mensajeGuardado').textContent = '✅ Contenido asignado correctamente.';
  document.getElementById('letraCancion').value = '';
  document.getElementById('archivoAudio').value = '';
}

// Comentarios y respuestas
async function cargarComentarios() {
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, comentarios');

  if (error || !data) return;

  const cont = document.getElementById('comentariosPendientes');
  cont.innerHTML = data.map(cliente => {
    const comentarios = cliente.comentarios || [];
    return comentarios.map((c, i) => `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <p><strong>${cliente.nombre}:</strong> ${c.texto}</p>
        <p><em>${new Date(c.fecha).toLocaleString()}</em></p>
        ${c.respuesta ? `<p><strong>Respuesta:</strong> ${c.respuesta}</p>` : `
          <textarea id="respuesta-${cliente.id}-${i}" rows="2" placeholder="Escribe tu respuesta..."></textarea>
          <button onclick="responderComentario('${cliente.id}', ${i})">Responder</button>
        `}
      </div>
    `).join('');
  }).join('');
}

async function responderComentario(clienteId, index) {
  const textarea = document.getElementById(`respuesta-${clienteId}-${index}`);
  const respuesta = textarea.value.trim();
  if (!respuesta) return;

  const { data, error } = await supabase
    .from('clientes')
    .select('comentarios')
    .eq('id', clienteId)
    .single();

  if (error || !data) return;

  const comentarios = data.comentarios || [];
  comentarios[index].respuesta = respuesta;

  const { error: updateError } = await supabase
    .from('clientes')
    .update({ comentarios })
    .eq('id', clienteId);

  if (updateError) {
    alert('❌ Error al responder.');
    return;
  }

  cargarComentarios();
}

// Editar y eliminar
function editarCliente(id) {
  window.location.href = `admin-editar.html?id=${id}`;
}

async function eliminarCliente(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      alert('❌ Error al eliminar el cliente.');
      return;
    }

    alert('✅ Cliente eliminado correctamente.');
    cargarClientes();
    llenarSelectorClientes();
 