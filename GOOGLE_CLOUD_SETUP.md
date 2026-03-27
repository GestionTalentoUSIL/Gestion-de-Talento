# CONFIGURACIÓN GOOGLE CLOUD CONSOLE - PASO A PASO

## 🔑 PASO 2A: Crear proyecto y API Key

1. **Ve a Google Cloud Console:**
   https://console.cloud.google.com

2. **Crear nuevo proyecto:**
   - Click en el selector de proyectos (arriba)
   - Click "NUEVO PROYECTO"
   - Nombre: `PDI-USIL-2026`
   - Click "CREAR"
   - Espera 30 segundos a que se cree

3. **Habilitar Google Sheets API:**
   - Menú hamburguesa ☰ > "APIs y servicios" > "Biblioteca"
   - Busca: "Google Sheets API"
   - Click en "Google Sheets API"
   - Click "HABILITAR"
   - Espera que se active (15 segundos)

4. **Crear API Key:**
   - Ve a "APIs y servicios" > "Credenciales"
   - Click "CREAR CREDENCIALES" (arriba)
   - Selecciona "Clave de API"
   - Se generará tu API Key (algo como: AIzaSyC...)
   - **¡CÓPIALA!** (la necesitamos)

5. **Restringir la API Key (IMPORTANTE):**
   - Click en "EDITAR CLAVE DE API"
   - En "Restricciones de la API":
     * Selecciona "Restringir clave"
     * Marca SOLO: "Google Sheets API"
   - Click "GUARDAR"

## ✅ Datos que necesitas copiar:

1. ✅ **URL de tu Google Sheets** (del Paso 1)
2. ✅ **API Key** (de este paso - comienza con AIzaSy...)

## 🔐 IMPORTANTE - Seguridad de la hoja:

Para que la API pueda escribir en tu hoja:

1. Abre tu Google Sheets (la de respuestas del formulario)
2. Click en "Compartir" (arriba derecha)
3. En "Acceso general" cambia a:
   - "Cualquier persona con el enlace"
   - Permiso: "Editor"
4. Click "Listo"

⚠️ NOTA: Si prefieres más seguridad, podemos usar Service Account
en lugar de API Key (es más complejo pero más seguro).