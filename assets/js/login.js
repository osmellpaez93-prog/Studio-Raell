// assets/js/login.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

// 🔑 Código maestro para acceso de administrador
const CODIGO_MAESTRO = "Raell-Master-1234";

document.getElementById('formLogin')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim().toLowerCase();
  const numero = document.getElementById('numeroRaell').value.trim();
  const mensaje = document.getElementById('mensaje');

  // ✅ Acceso de administrador
  if (numero === CODIGO_MAESTRO) {
    localStorage.setItem('admin', 'true');
    window.location.href = 'admin.html';
    return;
  }

  // ✅ Validación para cliente
  if (!email || !numero) {
    mensaje.textContent = '❌ Ingresa correo y número Raell.';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre, numero_raell')
      .eq('email', email)
      .eq('numero_raell', numero)
      .single();

    if (error || !data) {
      mensaje.textContent = '❌ Credenciales incorrectas.';
      return;
    }

    localStorage.setItem('cliente_id', data.id);
    localStorage.setItem('cliente_nombre', data.nombre);
    localStorage.setItem('cliente_numero', data.numero_raell);

    window.location.href = 'perfil.html';
  } catch (err) {
    console.error('Error:', err);
    mensaje.textContent = '❌ Error al iniciar sesión.';
  }
});