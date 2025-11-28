# 🚀 Guía de Despliegue: Sistema de Mailboxes

## ✅ Cambios Aplicados

Los cambios ya están en el repositorio Git y se desplegarán automáticamente en:
- **Railway** (Backend): Auto-deploy desde `main` branch
- **Vercel** (Frontend): Auto-deploy desde `main` branch

## 📋 Pasos para Completar el Despliegue

### Paso 1: Aplicar Migración de Base de Datos

Tienes **3 opciones** para aplicar la migración:

#### Opción A: Usar Drizzle Push (Recomendado - Más Seguro)
```bash
# En tu máquina local, con DATABASE_URL de producción
export DATABASE_URL="tu_database_url_de_produccion"
npm run db:push
```

#### Opción B: Ejecutar SQL Directamente en Neon
1. Ve a tu dashboard de Neon Database
2. Abre el SQL Editor
3. Copia y pega el contenido de `migrations/0009_add_mailboxes.sql`
4. Ejecuta el SQL

#### Opción C: Usar el Script de Migración
```bash
# En tu máquina local, con DATABASE_URL de producción
export DATABASE_URL="tu_database_url_de_produccion"
npx tsx server/migrations/applyMailboxesMigration.ts
```

### Paso 2: Verificar Despliegue

1. **Railway**: 
   - Ve a tu dashboard de Railway
   - Verifica que el deploy se completó exitosamente
   - Revisa los logs para asegurarte de que no hay errores

2. **Vercel**:
   - Ve a tu dashboard de Vercel
   - Verifica que el deploy se completó exitosamente
   - Revisa que el build fue exitoso

### Paso 3: Probar en Producción

1. **Accede a Sendlr.ai** (tu URL de producción)
2. **Inicia sesión** con tu cuenta
3. **Navega a Mailboxes**:
   - Deberías ver el nuevo item "Mailboxes" en el sidebar
   - O navega directamente a: `https://tu-dominio.vercel.app/mailboxes`

4. **Prueba agregar un mailbox**:
   - Haz clic en "Add Mailbox"
   - Autoriza con Google OAuth
   - Verifica que el mailbox aparece en la tabla

## 🔍 Verificación de la Migración

Para verificar que la tabla se creó correctamente:

```sql
-- Ejecutar en Neon SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'mailboxes';
```

Deberías ver una fila con `table_name = 'mailboxes'`.

## 🐛 Solución de Problemas

### Error: "Table mailboxes does not exist"
**Solución**: Aplica la migración usando una de las opciones del Paso 1.

### Error: "Cannot find module 'mailbox'"
**Solución**: 
- Verifica que Railway desplegó correctamente
- Revisa los logs de Railway para ver si hay errores de build

### El item "Mailboxes" no aparece en el sidebar
**Solución**:
- Verifica que Vercel desplegó correctamente
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Verifica que estás en la versión más reciente

### Error 404 en `/mailboxes`
**Solución**:
- Verifica que Vercel desplegó correctamente
- Verifica que el archivo `src/pages/Mailboxes.tsx` existe
- Revisa los logs de build de Vercel

## ✅ Checklist Post-Deploy

- [ ] Migración de base de datos aplicada
- [ ] Railway desplegó correctamente (verificar logs)
- [ ] Vercel desplegó correctamente (verificar build)
- [ ] Puedo acceder a `/mailboxes` en producción
- [ ] Puedo agregar un mailbox mediante OAuth
- [ ] El mailbox aparece en la tabla
- [ ] Puedo editar/activar/eliminar mailboxes

## 📝 Notas Importantes

1. **La migración es segura**: Usa `CREATE TABLE IF NOT EXISTS`, así que puedes ejecutarla múltiples veces sin problemas.

2. **No afecta usuarios existentes**: Los usuarios actuales seguirán funcionando normalmente. Solo se agrega nueva funcionalidad.

3. **OAuth**: El flujo de OAuth para agregar mailboxes usa el mismo callback que el login principal, pero con un `state` diferente.

4. **Rollback**: Si necesitas revertir, simplemente no uses la funcionalidad de mailboxes. La tabla no afecta el funcionamiento existente.

---

**¿Todo funcionando?** Avísame y continuamos con la siguiente fase! 🚀

