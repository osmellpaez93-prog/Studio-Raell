import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// Lógica de entrega
const optFecha = document.querySelector('input[value="fecha"]');
const optPeriodo = document.querySelector('input[value="periodo"]');
const bloqueFecha = document.getElementById('bloqueFecha');
const bloquePeriodo = document.getElementById('bloquePeriodo');

function toggleEntrega() {
  if (optFecha.checked) {
    bloqueFecha.classList.remove('oculto');
    bloquePeriodo.classList.add('oculto');
  } else {
    bloqueFecha.classList.add('oculto');
    bloquePeriodo.classList.remove('oculto');
  }
}

optFecha?.addEventListener('change', toggleEntrega);
optPeriodo?.addEventListener('change', toggleEntrega);
toggleEntrega();

// Formulario
document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = 'Enviando...';

  const numeroRaell = "R" + Math.floor(10000 + Math.random() * 90000) + "L";

  const data = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    nombre_artistico: document.getElementById('nombreArtistico').value || null,
    cantante: document.getElementById('cantante').value,
    fecha_entrega: optFecha.checked ? document.getElementById('fechaEntrega').value || null : null,
    periodo_inicio: optPeriodo.checked ? document.getElementById('periodoInicio').value || null : null,
    periodo_fin: optPeriodo.checked ? document.getElementById('periodoFin').value || null : null,
    descripcion: document.getElementById('descripcion').value,
    numero_raell: numeroRaell
  };

  try {
    const { error } = await supabase.from('clientes').insert([data]);
    if (error) throw error;

    mensaje.textContent = '✅ ¡Registro exitoso!';
    setTimeout(() => window.location.href = 'confirmacion.html', 1500);
  } catch (err) {
    mensaje.textContent = '❌ Error: ' + err.message;
  }
});