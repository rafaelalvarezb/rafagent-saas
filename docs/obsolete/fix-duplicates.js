#!/usr/bin/env node

// Script para eliminar templates duplicados directamente
import https from 'https';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiODFmMTZlYS1iYzMxLTQ1NDgtYjY4OC02OTViOGQ3ZmNlZDEiLCJ1c2VyRW1haWwiOiJyYWZhZWxhbHZyemJAZ21haWwuY29tIiwiaWF0IjoxNzYxNjc5NjU3LCJleHAiOjE3NjIyODQ0NTd9.Fop2EJi05iG49goFbDKsHUhpRqxM3AtJ2jdmII0xZ-I";
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

async function fixDuplicates() {
  console.log('🧹 Iniciando limpieza de templates duplicados...');
  
  try {
    // 1. Obtener todos los templates
    console.log('📋 Obteniendo templates actuales...');
    const templatesResponse = await makeRequest(`${BACKEND_URL}/api/templates`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    if (templatesResponse.status !== 200) {
      console.error('❌ Error obteniendo templates:', templatesResponse.data);
      return;
    }
    
    const templates = templatesResponse.data;
    console.log(`📊 Encontrados ${templates.length} templates`);
    
    // 2. Agrupar por nombre de template
    const templateGroups = {};
    templates.forEach(template => {
      if (!templateGroups[template.templateName]) {
        templateGroups[template.templateName] = [];
      }
      templateGroups[template.templateName].push(template);
    });
    
    console.log('\n📋 Agrupando templates:');
    Object.keys(templateGroups).forEach(name => {
      console.log(`  ${name}: ${templateGroups[name].length} copias`);
    });
    
    // 3. Para cada grupo con duplicados, mantener solo el más antiguo
    let deletedCount = 0;
    for (const [templateName, templateList] of Object.entries(templateGroups)) {
      if (templateList.length > 1) {
        console.log(`\n🔧 Procesando ${templateName} (${templateList.length} duplicados)...`);
        
        // Ordenar por fecha de creación (más antiguo primero)
        templateList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        // Mantener el primero (más antiguo) y eliminar el resto
        const toKeep = templateList[0];
        const toDelete = templateList.slice(1);
        
        console.log(`  ✅ Manteniendo: ${toKeep.id} (creado: ${toKeep.createdAt})`);
        
        for (const template of toDelete) {
          console.log(`  🗑️  Eliminando: ${template.id} (creado: ${template.createdAt})`);
          
          const deleteResponse = await makeRequest(`${BACKEND_URL}/api/templates/${template.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${TOKEN}`
            }
          });
          
          if (deleteResponse.status === 200) {
            deletedCount++;
            console.log(`    ✅ Eliminado exitosamente`);
          } else {
            console.log(`    ❌ Error eliminando: ${deleteResponse.data}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Limpieza completada! Eliminados ${deletedCount} templates duplicados.`);
    
    // 4. Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    const finalResponse = await makeRequest(`${BACKEND_URL}/api/templates`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    if (finalResponse.status === 200) {
      const finalTemplates = finalResponse.data;
      console.log(`📊 Templates restantes: ${finalTemplates.length}`);
      
      const finalGroups = {};
      finalTemplates.forEach(template => {
        if (!finalGroups[template.templateName]) {
          finalGroups[template.templateName] = [];
        }
        finalGroups[template.templateName].push(template);
      });
      
      console.log('\n📋 Estado final:');
      Object.keys(finalGroups).forEach(name => {
        console.log(`  ${name}: ${finalGroups[name].length} copia(s)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en la limpieza:', error.message);
  }
}

// Ejecutar la limpieza
fixDuplicates();
