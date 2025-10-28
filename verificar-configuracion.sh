#!/bin/bash

# Script de Verificación de Configuración RafAgent
# Este script verifica que todas las configuraciones estén correctas

echo "🔍 VERIFICADOR DE CONFIGURACIÓN - RafAgent"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de problemas
PROBLEMAS=0

echo "📋 Verificando configuración local..."
echo ""

# 1. Verificar que estemos en el directorio correcto
echo -n "1. Verificando directorio del proyecto... "
if [ -f "package.json" ] && [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Error: No estás en el directorio raíz del proyecto"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

# 2. Verificar que exista el archivo de configuración de API
echo -n "2. Verificando client/src/lib/api.ts... "
if [ -f "client/src/lib/api.ts" ]; then
    echo -e "${GREEN}✓${NC}"
    
    # Verificar que contenga VITE_API_URL
    if grep -q "VITE_API_URL" "client/src/lib/api.ts"; then
        echo "   ✓ Archivo configurado para usar VITE_API_URL"
    else
        echo -e "   ${RED}✗${NC} Archivo no está configurado correctamente"
        PROBLEMAS=$((PROBLEMAS + 1))
    fi
else
    echo -e "${RED}✗${NC}"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

# 3. Verificar que exista vercel.json
echo -n "3. Verificando vercel.json... "
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

# 4. Verificar que exista package.json con las dependencias correctas
echo -n "4. Verificando package.json... "
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC}"
    
    # Verificar dependencias clave
    DEPS=("express" "drizzle-orm" "socket.io" "@tanstack/react-query")
    for dep in "${DEPS[@]}"; do
        if grep -q "\"$dep\"" "package.json"; then
            echo "   ✓ Dependencia $dep presente"
        else
            echo -e "   ${YELLOW}⚠${NC} Dependencia $dep no encontrada"
        fi
    done
else
    echo -e "${RED}✗${NC}"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

echo ""
echo "🌐 Verificando conectividad a servicios..."
echo ""

# 5. Verificar conectividad a Railway
echo -n "5. Verificando Railway backend... "
if curl -s --max-time 10 "https://rafagent-engine-production.up.railway.app/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    
    # Obtener el status
    HEALTH_STATUS=$(curl -s "https://rafagent-engine-production.up.railway.app/health")
    if echo "$HEALTH_STATUS" | grep -q "healthy"; then
        echo "   ✓ Backend está healthy"
    else
        echo -e "   ${YELLOW}⚠${NC} Backend responde pero no está healthy"
        PROBLEMAS=$((PROBLEMAS + 1))
    fi
else
    echo -e "${RED}✗${NC}"
    echo "   Error: No se puede conectar a Railway"
    echo "   URL: https://rafagent-engine-production.up.railway.app"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

# 6. Verificar conectividad a Vercel
echo -n "6. Verificando Vercel frontend... "
if curl -s --max-time 10 "https://rafagent-saas.vercel.app" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Error: No se puede conectar a Vercel"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

# 7. Verificar repositorio de GitHub
echo -n "7. Verificando repositorio de GitHub... "
if git remote -v | grep -q "rafagent-saas"; then
    echo -e "${GREEN}✓${NC}"
    
    # Ver el estado
    if git status | grep -q "nothing to commit, working tree clean"; then
        echo "   ✓ Working tree clean"
    else
        echo -e "   ${YELLOW}⚠${NC} Hay cambios sin commitear"
    fi
else
    echo -e "${RED}✗${NC}"
    echo "   Error: Repositorio no está vinculado a GitHub"
    PROBLEMAS=$((PROBLEMAS + 1))
fi

echo ""
echo "📊 RESUMEN"
echo "=========================================="
echo ""

if [ $PROBLEMAS -eq 0 ]; then
    echo -e "${GREEN}✅ ¡Todo está configurado correctamente!${NC}"
    echo ""
    echo "Siguiente paso:"
    echo "1. Abre: PASOS_FINALES_SIMPLES.md"
    echo "2. Sigue los 3 pasos para completar el deployment"
else
    echo -e "${RED}❌ Se encontraron $PROBLEMAS problema(s)${NC}"
    echo ""
    echo "Recomendación:"
    echo "1. Revisa los errores marcados con ✗ arriba"
    echo "2. Lee: SOLUCION_RAILWAY_CRASHES.md si Railway no responde"
    echo "3. Si necesitas ayuda, copia este output y envíalo"
fi

echo ""
echo "🔗 URLs Importantes:"
echo "--------------------"
echo "Railway Dashboard: https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844"
echo "Vercel Dashboard: https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas"
echo "RafAgent Production: https://rafagent-saas.vercel.app"
echo ""

exit $PROBLEMAS

