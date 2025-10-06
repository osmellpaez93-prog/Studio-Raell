// assets/js/registro.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://vgrpcnknpeihzljhnfjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnBjbmtucGVpaHpsamhuZmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI5MjcsImV4cCI6MjA3NDQ0ODkyN30.RKiiwVUdmQKrOBuz-wI6zWsGT0JV1R4M-eoFJpetp2E'
);

document.getElementById('formulario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validar contraseñas
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  
  if (password !== passwordConfirm) {
    document.getElementById('mensaje').textContent = '❌ Las contraseñas no coinciden';
    return;
  }

  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = 'Registrando...';
  mensaje.style.color = '#8a2be2';

  const email = document.getElementById('email').value.trim().toLowerCase();
  const nombre = document.getElementById('nombre').value.trim();
  const numeroRaell = "R" + Math.floor(10000 + Math.random() * 90000) + "L";

  try {
    // 1. Crear usuario en Supabase Auth con contraseña personalizada
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nombre_completo: nombre,
          numero_raell: numeroRaell
        },
        emailRedirectTo: 'https://tu-dominio.com/confirmacion.html' // Cambia por tu URL
      }
    });

    if (authError) throw authError;

    // 2. Guardar datos en tabla 'clientes'
    const clienteData = {
      user_id: data.user?.id,
      nombre: nombre,
      email: email,
      nombre_artistico: document.getElementById('nombreArtistico').value.trim() || null,
      cantante: document.getElementById('cantante').value,
      genero: document.getElementById('genero').value,
      ocasion: document.getElementById('ocasion').value || null,
      idioma: document.getElementById('idioma').value,
      referencias: document.getElementById('referencias').value.trim() || null,
      demo: document.getElementById('demo').checked,
      fecha_entrega: document.getElementById('fechaEntrega').value || null,
      descripcion: document.getElementById('descripcion').value.trim(),
      numero_raell: numeroRaell
    };

    const { error: dbError } = await supabase.from('clientes').insert([clienteData]);
    if (dbError) throw dbError;

    // 3. Guardar en localStorage
    localStorage.setItem('numeroRaellUsuario', numeroRaell);
    localStorage.setItem('nombreUsuario', nombre);
    localStorage.setItem('emailUsuario', email);

    mensaje.textContent = '✅ ¡Registro exitoso! Revisa tu correo para confirmar.';
    mensaje.style.color = 'green';
    
    setTimeout(() => {
      window.location.href = 'confirmacion.html';
    }, 3000);

  } catch (err) {
    console.error('Error:', err);
    mensaje.textContent = '❌ Error: ' + (err.message || 'No se pudo registrar.');
    mensaje.style.color = 'red';
  }
});