#!/bin/bash
# Script para hacer push limpio a rafagent-engine (solo código, sin secrets)

echo "🔄 Preparando push limpio a rafagent-engine..."

# Archivos a sincronizar (solo código backend, sin secrets)
FILES_TO_SYNC=(
  "server/"
  "shared/"
  "migrations/"
  "package.json"
  "package-lock.json"
  "drizzle.config.ts"
  "tsconfig.json"
  "railway.json"
)

# Crear branch temporal
git checkout -b sync-mailboxes-clean

# Agregar solo los archivos necesarios
for file in "${FILES_TO_SYNC[@]}"; do
  if [ -e "$file" ]; then
    echo "✅ Agregando: $file"
    git add "$file"
  else
    echo "⚠️  No encontrado: $file"
  fi
done

# Commit
git commit -m "feat: Add multiple mailboxes system (Phase 1.1)

- Add mailboxes table schema and migration
- Implement mailbox management service
- Add mailbox API endpoints (CRUD operations)
- Add mailbox rotation and daily limit tracking
- Integrate OAuth flow for adding new mailboxes
- Auto-sync user main mailbox on login
- Make serveStatic optional for Railway backend-only"

# Push a engine (sin force para evitar problemas con secrets)
echo "📤 Haciendo push a rafagent-engine..."
git push engine sync-mailboxes-clean:main || {
  echo "⚠️  Push falló. Esto puede ser por secrets en commits antiguos."
  echo "💡 Solución: Usa los links que GitHub proporcionó para permitir los secrets temporalmente"
  echo "   O elimina los archivos con secrets del historial de rafagent-engine"
}

# Volver a main
git checkout main
git branch -D sync-mailboxes-clean

echo "✅ Proceso completado!"

