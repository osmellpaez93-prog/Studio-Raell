import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

document.getElementById('formLogin')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  const email = document.getElementById('email').value.trim();
  const numero = document.getElementById('numeroRaell').value.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('numero_raell', numero)
      .single();

    if (error || !data) {
      mensaje.textContent = '❌ Credenciales incorrectas.';
      return;
    }

    // Guardar sesión en localStorage (solo para redirección)
    localStorage.setItem('cliente_id', data.id);
    localStorage.setItem('cliente_nombre', data.nombre);
    localStorage.setItem('cliente_numero', data.numero_raell);

    window.location.href = 'perfil.html';
  } catch (err) {
    mensaje.textContent = '❌ Error al iniciar sesión.';
  }
});