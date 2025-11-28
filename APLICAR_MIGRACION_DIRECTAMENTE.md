# 🔧 Aplicar Migración de Mailboxes Directamente

## ❌ Problema

El endpoint `/api/admin/migrate-mailboxes` devuelve 404, lo que significa que las rutas aún no están disponibles en el servidor.

## ✅ Solución: Aplicar Migración Directamente en la Base de Datos

Como las rutas no están funcionando, necesitamos aplicar la migración directamente en la base de datos.

### Opción 1: Usar Neon Console (Recomendado - Más Fácil)

1. **Ve a tu base de datos Neon:**
   - Ve a: https://console.neon.tech
   - Inicia sesión
   - Selecciona tu proyecto

2. **Abre el SQL Editor:**
   - Haz clic en "SQL Editor" en el menú lateral
   - O ve directamente a la pestaña "SQL Editor"

3. **Copia y pega este SQL:**
```sql
-- Create mailboxes table for multiple Gmail accounts per user
CREATE TABLE IF NOT EXISTS "mailboxes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"google_access_token" text,
	"google_refresh_token" text,
	"google_token_expiry" timestamp,
	"is_active" boolean DEFAULT true,
	"daily_send_limit" integer DEFAULT 25,
	"emails_sent_today" integer DEFAULT 0,
	"last_reset_date" timestamp,
	"warmup_status" text DEFAULT 'not_started',
	"warmup_start_date" timestamp,
	"warmup_current_day" integer DEFAULT 0,
	"reputation_score" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mailboxes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
```

4. **Ejecuta el SQL:**
   - Haz clic en "Run" o presiona Ctrl+Enter
   - Deberías ver "Success" o un mensaje de confirmación

5. **Verifica que la tabla se creó:**
```sql
SELECT * FROM mailboxes LIMIT 1;
```
   - Debería ejecutarse sin errores (puede estar vacía, eso está bien)

### Opción 2: Usar psql desde Terminal

Si prefieres usar la línea de comandos:

1. **Obtén el DATABASE_URL de Railway:**
   - Ve a Railway → `rafagent-engine` → Variables
   - Copia el `DATABASE_URL`

2. **Ejecuta psql:**
```bash
psql "tu_database_url_aqui"
```

3. **Ejecuta el SQL:**
```sql
CREATE TABLE IF NOT EXISTS "mailboxes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"google_access_token" text,
	"google_refresh_token" text,
	"google_token_expiry" timestamp,
	"is_active" boolean DEFAULT true,
	"daily_send_limit" integer DEFAULT 25,
	"emails_sent_today" integer DEFAULT 0,
	"last_reset_date" timestamp,
	"warmup_status" text DEFAULT 'not_started',
	"warmup_start_date" timestamp,
	"warmup_current_day" integer DEFAULT 0,
	"reputation_score" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mailboxes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
```

---

## ✅ Después de Aplicar la Migración

1. **Espera 1-2 minutos** para que Railway detecte los cambios en la base de datos

2. **Reinicia el servidor en Railway:**
   - Ve a Railway → `rafagent-engine` → Deployments
   - Haz clic en "Redeploy" o reinicia el servicio

3. **Refresca la página de Mailboxes** en Sendlr.ai (Ctrl+Shift+R o Cmd+Shift+R)

4. **Deberías ver tu mailbox** `rafaelalvrzb@gmail.com` automáticamente

---

**Avísame cuando hayas aplicado la migración y si todo funciona!** 🚀

