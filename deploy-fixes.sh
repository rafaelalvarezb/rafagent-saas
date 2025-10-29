#!/bin/bash

echo "🚀 Desplegando correcciones de RafAgent..."

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# 2. Hacer commit de los cambios
echo "📝 Haciendo commit de los cambios..."
git add .
git commit -m "🔧 Fix: Arreglar pixel tracking SSL y programación de reuniones

- Pixel tracking ahora usa URL de Railway en producción
- Programación de reuniones usa tokens de usuario reales
- Corregir horarios de trabajo para programación de reuniones
- Agregar autenticación a endpoints de análisis y follow-up"

# 3. Desplegar a Railway (backend)
echo "🚀 Desplegando backend a Railway..."
git push origin main

# 4. Desplegar a Vercel (frontend)
echo "🌐 Desplegando frontend a Vercel..."
npx vercel --prod

echo "✅ Despliegue completado!"
echo ""
echo "🔍 Para verificar los cambios:"
echo "1. Ve a https://rafagent-saas.vercel.app"
echo "2. Crea un prospect con tu email real"
echo "3. Verifica que el pixel tracking funciona (debería aparecer en la consola del navegador)"
echo "4. Prueba la programación de reuniones con horarios correctos"
echo ""
echo "📧 El pixel tracking ahora debería funcionar porque usa la URL de Railway con SSL"
echo "⏰ La programación de reuniones ahora respeta los horarios de trabajo configurados"
