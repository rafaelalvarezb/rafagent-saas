#!/bin/bash
# Script para sincronizar cambios de mailboxes a rafagent-engine

echo "🔄 Sincronizando cambios a rafagent-engine..."

# Archivos a sincronizar (solo código, sin secrets)
FILES_TO_SYNC=(
  "server/routes.ts"
  "server/storage.ts"
  "server/services/mailbox.ts"
  "server/migrations/applyMailboxesMigration.ts"
  "server/migrations/verifyMailboxesTable.ts"
  "server/migrations/syncExistingUsersMailboxes.ts"
  "shared/schema.ts"
  "migrations/0009_add_mailboxes.sql"
  "package.json"
  "drizzle.config.ts"
)

# Crear branch temporal
git checkout -b sync-mailboxes-to-engine

# Agregar solo los archivos necesarios
for file in "${FILES_TO_SYNC[@]}"; do
  if [ -f "$file" ]; then
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
- Auto-sync user main mailbox on login"

# Push a engine
echo "📤 Haciendo push a rafagent-engine..."
git push engine sync-mailboxes-to-engine:main --force

# Volver a main
git checkout main
git branch -D sync-mailboxes-to-engine

echo "✅ Sincronización completada!"

