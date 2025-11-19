// Script para forzar la recarga de datos en RafAgent
// Ejecuta este script en la consola del navegador en cualquier página de RafAgent

async function forceReloadRafAgentData() {
  try {
    console.log('🚀 Forzando recarga de datos en RafAgent...');
    
    const token = localStorage.getItem('rafagent_token');
    if (!token) {
      console.error('❌ No se encontró token de autenticación.');
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
    
    // Paso 1: Verificar autenticación
    console.log('🔐 Verificando autenticación...');
    const authResponse = await apiCall('/auth/status');
    if (!authResponse.ok) {
      throw new Error('Error de autenticación');
    }
    const authData = await authResponse.json();
    console.log('✅ Autenticado como:', authData.user.email);
    
    // Paso 2: Obtener secuencias
    console.log('📋 Obteniendo secuencias...');
    const sequencesResponse = await apiCall('/sequences');
    if (!sequencesResponse.ok) {
      throw new Error('Error al obtener secuencias');
    }
    const sequences = await sequencesResponse.json();
    console.log(`✅ Secuencias obtenidas:`, sequences.map(s => s.name));
    
    // Paso 3: Obtener templates
    console.log('📝 Obteniendo templates...');
    const templatesResponse = await apiCall('/templates');
    if (!templatesResponse.ok) {
      throw new Error('Error al obtener templates');
    }
    const templates = await templatesResponse.json();
    console.log(`✅ Templates obtenidos:`, templates.map(t => t.templateName));
    
    // Paso 4: Limpiar cache del navegador y recargar
    console.log('🧹 Limpiando cache y recargando...');
    
    // Limpiar localStorage de React Query si existe
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('react-query') || key.includes('tanstack'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Forzar recarga completa
    console.log('🔄 Recargando página con cache limpio...');
    window.location.reload(true);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Intenta hacer logout y login nuevamente');
  }
}

// Ejecutar la función
forceReloadRafAgentData();
