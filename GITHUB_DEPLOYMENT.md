# Instrucciones para Deployment en GitHub Pages

## 📁 Archivos del Proyecto
Tu aplicación **PDI Interactivo 2026** está completamente lista para GitHub Pages. Los archivos principales son:

- `index.html` - Página principal de la aplicación
- `app.js` - Lógica completa de la aplicación
- `styles.css` - Estilos de la interfaz
- `.gitignore` - Configuración git (excluye .venv correctamente)
- Archivos de documentación: `ENTRY_IDS_PDI_2026.md`, `FORM_RECREACION_GOOGLE_FORMS.txt`

## 🚀 Pasos para Subir a GitHub

### 1. Crear/Acceder al Repositorio
- Ve a https://github.com/GestionTalentoUSIL/Gestion-de-Talento
- Si no existe, créalo como repositorio público
- Si ya existe, asegúrate de tener permisos de colaborador

### 2. Subir Archivos Manualmente
**Opción A: Via Web Interface**
1. Haz clic en "Add file" > "Upload files"
2. Arrastra todos los archivos EXCEPTO la carpeta `.venv`
3. Commit con mensaje: "Deploy: PDI Interactivo 2026"

**Opción B: Via Git Command Line**
```bash
# En tu terminal, desde la carpeta del proyecto:
git remote set-url origin https://github.com/GestionTalentoUSIL/Gestion-de-Talento.git
git add .
git commit -m "Deploy: PDI Interactivo 2026"
git push -u origin main
```

### 3. Activar GitHub Pages
1. Ve a **Settings** del repositorio
2. Scroll hasta **Pages** (en el menú izquierdo)
3. En **Source**, selecciona "Deploy from a branch"
4. En **Branch**, selecciona "main" y carpeta "/ (root)"
5. Haz clic en **Save**

### 4. Acceder a tu Aplicación
- La URL será: `https://gestiontalentousil.github.io/Gestion-de-Talento/`
- GitHub Pages tarda 5-10 minutos en activarse por primera vez

## ✅ Verificaciones de Funcionalidad

### Características que Funcionarán:
- ✅ Interfaz completa del formulario multipaso
- ✅ Lógica de selección de competencias
- ✅ Evaluación de niveles
- ✅ Generación de PDI final
- ✅ Funciones de copiar e imprimir
- ✅ **Integración con Google Forms** (ya configurada)

### URL del Google Form Configurado:
```
https://docs.google.com/forms/d/e/1FAIpQLSf-MRHYj4mJ5itFzbZN-NfOs_6HVY4T91AS-Dmd4sy8nzJCZQ/formResponse
```

## 🔧 Configuraciones GitHub Pages

### Archivo `.gitignore` (Ya Configurado)
```
.venv/
__pycache__/
*.pyc
.env
```

### No se Requiere Configuración Adicional
- La aplicación es 100% frontend (HTML/CSS/JS)
- No necesita servidor ni base de datos
- Compatible nativo con GitHub Pages

## 🌐 Dominio Personalizado (Opcional)
Si quieres usar un dominio personalizado:
1. Crea archivo `CNAME` en el root con tu dominio
2. Configura DNS de tu dominio apuntando a GitHub Pages
3. En Settings > Pages, agrega tu dominio personalizado

## 📞 Soporte
- La aplicación está lista para producción
- Todas las funcionalidades han sido verificadas
- El envío a Google Forms funcionará desde cualquier dominio

---
**Preparado por:** Claude Code Assistant
**Fecha:** Marzo 2026
**Estado:** ✅ Listo para deployment