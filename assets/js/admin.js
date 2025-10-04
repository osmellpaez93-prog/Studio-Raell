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

// Cargar lista de clientes
async function cargarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    document.getElementById('listaClientes').innerHTML = '<p>❌ Error al cargar los clientes.</p>';
    return;
  }

  if (data.length === 0) {
    document.getElementById('listaClientes').innerHTML = '<p>No hay clientes registrados aún.</p>';
    return;
  }

  document.getElementById('listaClientes').innerHTML = data.map(cliente => `
    <div style="background:rgba(255,255,255,0.1); padding:15px; margin:10px 0; border-radius:8px;">
      <h3>${cliente.nombre} (${cliente.numero_raell})</h3>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Cantante:</strong> ${cliente.cantante}</p>
      <p><strong>Descripción:</strong> ${cliente.descripcion.substring(0, 60)}...</p>
      <button onclick="window.editarCliente('${cliente.id}')" style="margin:5px; padding:6px 12px; background:#00c3ff; color:white; border:none; border-radius:4px; cursor:pointer;">
        Editar proyecto
      </button>
    </div>
  `).join("");
}

// Función global para editar cliente
window.editarCliente = function(id) {
  window.location.href = `admin-editar.html?id=${id}`;
};

// Iniciar
cargarClientes();