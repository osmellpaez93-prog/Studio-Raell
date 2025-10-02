import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

const contenedor = document.getElementById('detalle');

const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  contenedor.innerHTML = '<p>❌ Sesión no válida. <a href="login.html">Inicia sesión</a>.</p>';
} else {
  supabase
    .from('clientes')
    .select('*')
    .eq('id', clienteId)
    .single()
    .then(({ data, error }) => {
      if (error || !data) {
        contenedor.innerHTML = '<p>❌ No se encontró tu proyecto.</p>';
        return;
      }

      const fEntrega = data.fecha_entrega ? new Date(data.fecha_entrega).toLocaleDateString() : 'No definida';
      const pInicio = data.periodo_inicio ? new Date(data.periodo_inicio).toLocaleDateString() : '';
      const pFin = data.periodo_fin ? new Date(data.periodo_fin).toLocaleDateString() : '';

      contenedor.innerHTML = `
        <h2>Proyecto de: ${data.nombre}</h2>
        <p><strong>Número Raell:</strong> ${data.numero_raell}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Cantante:</strong> ${data.cantante}</p>
        <p><strong>Entrega:</strong> ${fEntrega || (pInicio && pFin ? `${pInicio} - ${pFin}` : 'No definida')}</p>
        <div><strong>Descripción:</strong><br>${data.descripcion}</div>
      `;
    });
}