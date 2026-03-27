# PRUEBA Y VERIFICACIÓN - PDI USIL 2026
## Google Sheets API Implementación

===========================================================
✅ CONFIGURACIÓN COMPLETADA
===========================================================

Sheet ID: 1LTxRV3vhUYT52WdDSC2PMbEgqdd4dVtp5cXWkuqZWxI
API Key: AIzaSyAg13AghaOZh_NJWL_vjCwb-1bimD6SOnI
Status: ✅ Código actualizado en app.js

===========================================================
🔐 PASO CRÍTICO: Configurar permisos de Google Sheets
===========================================================

1. Abre tu Google Sheets:
   https://docs.google.com/spreadsheets/d/1LTxRV3vhUYT52WdDSC2PMbEgqdd4dVtp5cXWkuqZWxI/edit

2. Click en "Compartir" (botón azul, arriba derecha)

3. En "Acceso general":
   - Cambiar de "Restringido" a: "Cualquier persona con el enlace"
   - Permiso: "Editor"
   - Click "Listo"

===========================================================
🧪 CÓMO PROBAR
===========================================================

1. Completa el formulario en la aplicación con datos de prueba

2. Llega hasta el paso final (PDI Consolidado)

3. Abre la consola del navegador:
   - Click derecho > Inspeccionar
   - Pestaña "Console"

4. Verifica los logs:
   ✅ "=== ENVIANDO A GOOGLE SHEETS API ==="
   ✅ "✅ Datos enviados exitosamente a Google Sheets"

5. Ve a tu Google Sheets y verifica que aparezca la nueva fila

===========================================================
❌ TROUBLESHOOTING - Si hay errores
===========================================================

ERROR 1: "403 Forbidden" o "The caller does not have permission"
SOLUCIÓN:
- Verifica que la hoja tenga permisos "Editor" para "Cualquiera con el enlace"
- O agrega el permiso específico para la API

ERROR 2: "404 Not Found"
SOLUCIÓN:
- Verifica el nombre de la pestaña en GOOGLE_SHEETS_CONFIG.SHEET_NAME
- Por defecto es: "Respuestas de formulario 1"
- Si tu pestaña tiene otro nombre, actualiza app.js línea 5

ERROR 3: "400 Bad Request" - Invalid values
SOLUCIÓN:
- Verifica que las columnas de Google Sheets correspondan al orden correcto
- Debe tener 15 columnas en este orden:
  1. Marca temporal
  2. Nombre completo
  3. Puesto de trabajo
  4. Área
  5. Perfil
  6. Objetivos de mejora
  7. Competencias
  8. Comp1 - Nivel actual
  9. Comp1 - Nivel esperado
  10. Comp2 - Nivel actual
  11. Comp2 - Nivel esperado
  12. Comp3 - Nivel actual
  13. Comp3 - Nivel esperado
  14. Tiempo de ejecución
  15. Modalidad

ERROR 4: CORS Error
SOLUCIÓN:
- La API Key debe estar bien configurada
- Verifica en Google Cloud Console > Credenciales
- La API Key debe tener acceso a Google Sheets API

===========================================================
📊 VERIFICACIÓN EN GOOGLE SHEETS
===========================================================

Después de enviar el formulario, deberías ver una nueva fila con:

- Fecha y hora actual
- Nombre del colaborador
- Puesto y área
- Perfil (Académico/Administrativo/Comercial)
- Objetivos escritos
- 3 competencias separadas por comas
- 6 niveles (actual y esperado para cada competencia, en texto como "En desarrollo")
- Tiempo (Corto/Medio/Largo)
- Modalidad (Virtual/Presencial/Autodidacta/Mixta)

===========================================================
🔧 SI NECESITAS CAMBIAR EL NOMBRE DE LA PESTAÑA
===========================================================

Si tu pestaña de Google Sheets NO se llama "Respuestas de formulario 1":

1. Abre app.js
2. Busca la línea 5:
   SHEET_NAME: "Respuestas de formulario 1"
3. Cámbialo por el nombre exacto de tu pestaña
4. Guarda el archivo
5. Recarga la aplicación (F5)

===========================================================
✅ PRÓXIMOS PASOS DESPUÉS DE PROBAR
===========================================================

Una vez que confirmes que funciona:

1. Puedes hacer un commit de los cambios:
   git add app.js
   git commit -m "Implementar Google Sheets API para env\u00edo de datos"

2. Si vas a publicar esto, considera:
   - Restringir la API Key por dominio/IP
   - Usar Service Account para más seguridad
   - Ocultar las credenciales en variables de entorno

===========================================================
🆘 ¿NECESITAS AYUDA?
===========================================================

Si encuentras algún error, copia el mensaje completo de la consola
y compártelo para diagnosticar el problema específico.