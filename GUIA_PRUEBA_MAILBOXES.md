# Guía de Prueba: Sistema de Múltiples Mailboxes

## 📋 Pasos para Probar

### Paso 1: Aplicar la Migración de Base de Datos

Tienes dos opciones:

#### Opción A: Usar Drizzle Push (Recomendado)
```bash
npm run db:push
```

Esto sincronizará el schema con la base de datos y creará la tabla `mailboxes` automáticamente.

#### Opción B: Ejecutar SQL Manualmente
Si prefieres ejecutar la migración SQL manualmente, puedes ejecutar el contenido de `migrations/0009_add_mailboxes.sql` directamente en tu base de datos Neon.

### Paso 2: Verificar que el Servidor Esté Corriendo

Asegúrate de que el servidor backend esté corriendo:

```bash
npm run dev
```

O si estás en producción:
```bash
npm start
```

### Paso 3: Acceder a la Página de Mailboxes

1. **Inicia sesión** en Sendlr.ai (si no estás logueado)
2. En el **sidebar izquierdo**, verás un nuevo item llamado **"Mailboxes"** con un icono de inbox
3. Haz clic en **"Mailboxes"** o navega directamente a `/mailboxes`

### Paso 4: Probar Agregar un Mailbox

1. En la página de Mailboxes, verás un botón **"Add Mailbox"** en la esquina superior derecha
2. Haz clic en **"Add Mailbox"**
3. Se abrirá la ventana de autenticación de Google OAuth
4. **Selecciona una cuenta Gmail diferente** a la que usas para tu usuario principal (o la misma si quieres probar)
5. **Autoriza** los permisos solicitados
6. Serás redirigido de vuelta a la página de Mailboxes
7. Deberías ver un **toast de éxito** diciendo "Mailbox added"
8. El nuevo mailbox debería aparecer en la tabla

### Paso 5: Verificar la Información del Mailbox

En la tabla deberías ver:
- ✅ **Email**: El email del mailbox agregado
- ✅ **Display Name**: (vacío inicialmente, puedes editarlo)
- ✅ **Status**: Badge verde "Active" o gris "Inactive"
- ✅ **Warmup**: Badge "Not Started" (por ahora)
- ✅ **Daily Limit**: 25 emails/day
- ✅ **Sent Today**: 0 / 25
- ✅ **Reputation**: Barra de progreso en 0%

### Paso 6: Probar Editar un Mailbox

1. Haz clic en el **icono de editar (lápiz)** en la fila del mailbox
2. Se abrirá un diálogo donde puedes:
   - Cambiar el **Display Name**
   - Ajustar el **Daily Send Limit** (1-50)
3. Haz clic en **"Save Changes"**
4. Deberías ver un toast de éxito y los cambios reflejados en la tabla

### Paso 7: Probar Activar/Desactivar Mailbox

1. Haz clic en el **icono de power (encendido/apagado)** en la fila del mailbox
2. El estado debería cambiar entre "Active" (verde) e "Inactive" (gris)
3. Deberías ver un toast confirmando el cambio

### Paso 8: Probar Eliminar un Mailbox

1. Haz clic en el **icono de eliminar (basura)** en la fila del mailbox
2. Se abrirá un diálogo de confirmación
3. Confirma la eliminación
4. El mailbox debería desaparecer de la tabla
5. Deberías ver un toast de éxito

## ✅ Checklist de Verificación

- [ ] La migración se aplicó correctamente (tabla `mailboxes` existe)
- [ ] Puedo acceder a la página `/mailboxes`
- [ ] Puedo agregar un mailbox mediante OAuth
- [ ] El mailbox aparece en la tabla con toda su información
- [ ] Puedo editar el display name y daily limit
- [ ] Puedo activar/desactivar el mailbox
- [ ] Puedo eliminar el mailbox
- [ ] Los toasts de éxito/error funcionan correctamente

## 🐛 Solución de Problemas

### Error: "Table mailboxes does not exist"
**Solución**: Ejecuta `npm run db:push` o aplica la migración SQL manualmente.

### Error: "Authorization code not provided"
**Solución**: Asegúrate de que el callback de OAuth esté configurado correctamente. Verifica que `GOOGLE_REDIRECT_URI` en tu `.env` apunte a `/api/auth/google/callback`.

### Error: "Failed to add mailbox"
**Solución**: 
- Verifica que el servidor backend esté corriendo
- Revisa la consola del navegador para ver el error específico
- Verifica que tengas conexión a internet para el OAuth de Google

### El mailbox no aparece después de agregarlo
**Solución**:
- Refresca la página
- Verifica en la consola del navegador si hay errores
- Revisa los logs del servidor backend

### No puedo ver el item "Mailboxes" en el sidebar
**Solución**:
- Asegúrate de haber reiniciado el servidor frontend después de los cambios
- Verifica que el archivo `src/components/AppSidebar.tsx` tenga el item agregado
- Limpia la caché del navegador

## 📝 Notas Importantes

1. **Límite diario**: Por defecto, cada mailbox puede enviar máximo 25 emails por día. Esto se resetea automáticamente cada día.

2. **OAuth**: Cuando agregas un mailbox, se usa el mismo flujo OAuth que para el login principal, pero con un `state` diferente para identificar que es para agregar mailbox.

3. **Múltiples mailboxes**: Puedes agregar tantos mailboxes como quieras. El sistema rotará automáticamente entre ellos cuando envíes emails.

4. **Warmup**: El sistema de warmup aún no está implementado (será la siguiente fase), por eso todos los mailboxes muestran "Not Started".

## 🎯 Próximos Pasos

Una vez que verifiques que todo funciona correctamente:
- ✅ Podremos avanzar con la **Fase 1.2: Email Warmup System**
- ✅ Después implementaremos la rotación automática de mailboxes en el agente de envío

---

**¿Todo funcionando?** Avísame y continuamos con la siguiente fase! 🚀

