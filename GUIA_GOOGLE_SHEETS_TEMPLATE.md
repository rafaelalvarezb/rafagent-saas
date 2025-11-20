# 📊 Guía: Crear Google Sheets Template para Bulk Import

## 🎯 Objetivo
Crear un Google Sheets público que los usuarios puedan copiar y usar como template para importar prospects.

## 📝 Pasos para Crear el Template

### 1. Crear el Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea un nuevo spreadsheet
3. Nómbralo: "Sendlr.ai - Prospects Import Template"

### 2. Agregar Headers y Datos de Ejemplo
En la primera fila, agrega estos headers:
- **A1:** `First Name`
- **B1:** `Email Address`
- **C1:** `Job Title`
- **D1:** `Company Name`
- **E1:** `Industry`

En las filas 2-4, agrega datos de ejemplo:
- **Fila 2:** `John`, `john.doe@example.com`, `CEO`, `Acme Corp`, `Technology`
- **Fila 3:** `Jane`, `jane.smith@example.com`, `Marketing Director`, `TechStart Inc`, `Marketing`
- **Fila 4:** `Bob`, `bob.johnson@example.com`, `Sales Manager`, `Global Solutions`, `Sales`

### 3. Formatear el Template
1. **Header Row (Fila 1):**
   - Selecciona la fila 1
   - Hazla en negrita (Ctrl+B / Cmd+B)
   - Agrega fondo de color (ej: azul claro)
   - Congela la fila: View → Freeze → 1 row

2. **Agregar Instrucciones:**
   - En la celda **F1**, agrega: `Instructions`
   - En **F2**, agrega: `Fill in your prospects below`
   - En **F3**, agrega: `Delete example rows before exporting`
   - En **F4**, agrega: `Export as CSV and upload to Sendlr.ai`

### 4. Hacer el Sheet Público y Copiable
1. Haz clic en el botón **"Share"** (Compartir) en la esquina superior derecha
2. Haz clic en **"Change to anyone with the link"**
3. Selecciona **"Viewer"** (Solo lectura)
4. **IMPORTANTE:** Marca la casilla **"Allow anyone with the link to make a copy"** si está disponible
5. Copia el link de compartir

### 5. Obtener el Link de Copia
El link debería verse así:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing
```

Para que los usuarios puedan hacer una copia automáticamente, agrega `&copy=true` al final:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing&copy=true
```

### 6. Actualizar el Código
Una vez que tengas el link, actualiza el archivo `src/pages/Prospects.tsx` en la línea donde dice:
```typescript
href="https://docs.google.com/spreadsheets/d/1YOUR_SHEET_ID/edit?usp=sharing&copy=true"
```

Reemplaza `1YOUR_SHEET_ID` con el ID real de tu Google Sheet.

## ✅ Resultado Final

Los usuarios podrán:
1. Hacer clic en "Use Google Sheets Template"
2. Se abrirá el Google Sheet en una nueva pestaña
3. Hacer una copia del template (si configuraste `&copy=true`)
4. Llenar sus datos
5. Exportar como CSV (File → Download → Comma Separated Values (.csv))
6. Subir el CSV a Sendlr.ai

## 🔧 Alternativa: Template Pre-configurado

Si prefieres que el template ya tenga una estructura más completa, puedes:
- Agregar validación de datos (Data → Data validation)
- Agregar formato condicional para emails inválidos
- Agregar más filas de ejemplo
- Agregar instrucciones más detalladas en una columna separada

---

**Nota:** El template CSV descargable también funciona, pero Google Sheets es más fácil de usar para usuarios no técnicos.

