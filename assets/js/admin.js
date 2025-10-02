import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Cargar lista de clientes
async function cargarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*') // Sin asterisco, así Supabase lo interpreta correctamente
    .order('created_at', { ascending: false }); // Ordenar por created_at

  if (error) {
    document.getElementById('listaClientes').innerHTML = '<p>❌ Error al cargar los clientes.</p>';
    console.error('Error:', error);
    return;
  }

  if (data.length === 0) {
    document.getElementById('listaClientes').innerHTML = '<p>No hay clientes registrados aún.</p>';
    return;
  }

  document.getElementById('listaClientes').innerHTML = data.map(cliente => `
    <div class="cliente-item">
      <h3>${cliente.nombre} (${cliente.numero_raell})</h3>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Cantante:</strong> ${cliente.cantante}</p>
      <p><strong>Descripción:</strong> ${cliente.descripcion.substring(0, 50)}...</p>
      <button onclick="editarCliente('${cliente.id}')">Editar</button>
      <button onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
    </div>
  `).join("");
}

// Editar cliente
function editarCliente(id) {
  window.location.href = `admin-editar.html?id=${id}`;
}

// Eliminar cliente
async function eliminarCliente(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      alert('❌ Error al eliminar el cliente.');
      console.error('Error:', error);
      return;
    }

    alert('✅ Cliente eliminado correctamente.');
    cargarClientes();
  }
}

// Cargar clientes al iniciar
cargarClientes();