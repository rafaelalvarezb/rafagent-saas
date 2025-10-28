#!/usr/bin/env node

// Script para limpiar templates duplicados usando el endpoint del backend
import https from 'https';

const BACKEND_URL = 'https://rafagent-engine-production.up.railway.app';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function cleanupDuplicates() {
  console.log('🧹 Iniciando limpieza de templates duplicados...');
  
  try {
    // Primero, crear defaults y limpiar duplicados
    console.log('📝 Creando defaults y limpiando duplicados...');
    const response = await makeRequest(`${BACKEND_URL}/api/diagnostic/create-defaults`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Token temporal para testing
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.status === 200) {
      console.log('✅ Templates duplicados limpiados exitosamente!');
      console.log('📊 Resultado:', response.data.message);
    } else {
      console.log('❌ Error:', response.data.error || 'Error desconocido');
    }
    
  } catch (error) {
    console.error('❌ Error en la limpieza:', error.message);
  }
}

// Ejecutar la limpieza
cleanupDuplicates();
