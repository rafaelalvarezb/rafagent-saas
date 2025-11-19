#!/bin/bash

# Script para limpiar templates duplicados usando token manual
# Uso: ./cleanup-with-token.sh TU_TOKEN_AQUI

if [ -z "$1" ]; then
    echo "❌ Error: Necesitas proporcionar tu token de autenticación"
    echo "Uso: ./cleanup-with-token.sh TU_TOKEN_AQUI"
    echo ""
    echo "Para obtener tu token:"
    echo "1. Ve a https://rafagent-saas-5cca3ovve-rafael-alvarezs-projects-43d604b9.vercel.app"
    echo "2. Haz login con Google"
    echo "3. Abre F12 → Application → Local Storage → tu dominio"
    echo "4. Copia el valor de 'authToken'"
    exit 1
fi

TOKEN="$1"
BACKEND_URL="https://rafagent-engine-production.up.railway.app"

echo "🧹 Iniciando limpieza de templates duplicados..."
echo "🔑 Usando token: ${TOKEN:0:20}..."

# Limpiar duplicados
echo "📝 Limpiando duplicados..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/diagnostic/create-defaults" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')

echo "📊 Respuesta del servidor:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

# Verificar resultado
echo ""
echo "🔍 Verificando templates actuales..."
TEMPLATES=$(curl -s "$BACKEND_URL/api/templates" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Templates encontrados:"
echo "$TEMPLATES" | jq '.[] | {name: .templateName, id: .id}' 2>/dev/null || echo "$TEMPLATES"

echo ""
echo "✅ Proceso completado!"
