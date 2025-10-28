// Script para crear secuencias por defecto y probar RafAgent
// Ejecuta este script en la consola del navegador mientras estás en https://rafagent-saas.vercel.app/templates

async function fixRafAgentSequences() {
  try {
    console.log('🚀 Iniciando corrección de RafAgent...');
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('rafagent_token');
    if (!token) {
      console.error('❌ No se encontró token de autenticación. Por favor, inicia sesión primero.');
      return;
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    
    // Función para hacer llamadas API con token
    async function apiCall(endpoint, options = {}) {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
      return response;
    }
    
    // Paso 1: Crear secuencias por defecto
    console.log('📝 Paso 1: Creando secuencias por defecto...');
    const createResponse = await apiCall('/diagnostic/create-defaults', {
      method: 'POST'
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.error || 'Error al crear secuencias por defecto');
    }
    
    const createResult = await createResponse.json();
    console.log('✅ Secuencias creadas:', createResult.message);
    
    // Paso 2: Verificar que las secuencias se crearon
    console.log('🔍 Paso 2: Verificando secuencias...');
    const sequencesResponse = await apiCall('/sequences');
    if (!sequencesResponse.ok) {
      throw new Error('Error al verificar secuencias');
    }
    
    const sequences = await sequencesResponse.json();
    console.log(`✅ Encontradas ${sequences.length} secuencias:`, sequences.map(s => s.name));
    
    // Paso 3: Verificar templates
    console.log('🔍 Paso 3: Verificando templates...');
    const templatesResponse = await apiCall('/templates');
    if (!templatesResponse.ok) {
      throw new Error('Error al verificar templates');
    }
    
    const templates = await templatesResponse.json();
    console.log(`✅ Encontrados ${templates.length} templates:`, templates.map(t => t.templateName));
    
    // Paso 4: Recargar la página
    console.log('🔄 Paso 4: Recargando página...');
    console.log('✅ ¡RafAgent corregido exitosamente!');
    console.log('🎉 Ahora deberías ver la Standard Sequence en la página de Templates');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Intenta ejecutar este script nuevamente después de hacer login');
  }
}

// Ejecutar la función
fixRafAgentSequences();
