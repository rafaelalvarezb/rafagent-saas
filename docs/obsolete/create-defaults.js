// Script para crear secuencias por defecto en RafAgent
// Ejecuta este script en la consola del navegador mientras estás en https://rafagent-saas.vercel.app/templates

async function createDefaultSequences() {
  try {
    console.log('🚀 Creando secuencias por defecto...');
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('rafagent_token');
    if (!token) {
      console.error('❌ No se encontró token de autenticación. Por favor, inicia sesión primero.');
      return;
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    
    // Hacer la llamada a la API
    const response = await fetch('/api/diagnostic/create-defaults', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear secuencias por defecto');
    }
    
    const result = await response.json();
    console.log('✅ ¡Éxito!', result.message);
    console.log('🔄 Recargando la página...');
    
    // Recargar la página para ver los cambios
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar la función
createDefaultSequences();
