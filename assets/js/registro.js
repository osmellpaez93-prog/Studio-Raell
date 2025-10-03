import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

// 🔑 Configuración de Supabase (sin espacios)
const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = 'Enviando...';
  mensaje.style.color = '#6a5acd';

  // Generar número Raell único
  const numeroRaell = "R" + Math.floor(10000 + Math.random() * 90000) + "L";

<<<<<<< HEAD
  const data = {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    nombre_artistico: document.getElementById('nombreArtistico').value.trim() || null,
=======
  const clienteData = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    nombre_artistico: document.getElementById('nombreArtistico').value || null,
>>>>>>> 22c09bb070f9dd917beb098ea6530c9c827a5b9d
    cantante: document.getElementById('cantante').value,
    fecha_entrega: document.getElementById('fechaEntrega').value || null,
    descripcion: document.getElementById('descripcion').value.trim(),
    numero_raell: numeroRaell
  };

  try {
    const { data: clienteCreado, error: errorCliente } = await supabase
      .from('clientes')
      .insert([clienteData])
      .select()
      .single();

    if (errorCliente) throw errorCliente;

    const proyecto = {
      cliente_id: clienteCreado.id,
      letra: null,
      audio_url: null,
      comentarios: []
    };

    const { data: proyectoCreado, error: errorProyecto } = await supabase
      .from('proyectos')
      .insert([proyecto])
      .select()
      .single();

    if (errorProyecto) throw errorProyecto;

    localStorage.setItem('proyecto_id', proyectoCreado.id);

    mensaje.textContent = '✅ ¡Registro exitoso!';
<<<<<<< HEAD
    mensaje.style.color = 'green';
    setTimeout(() => window.location.href = 'confirmacion.html', 1500);
=======
    setTimeout(() => window.location.href = 'perfil.html', 1500);
>>>>>>> 22c09bb070f9dd917beb098ea6530c9c827a5b9d
  } catch (err) {
    console.error('Error:', err);
    mensaje.textContent = '❌ Error: ' + (err.message || 'No se pudo registrar.');
    mensaje.style.color = 'red';
  }
});