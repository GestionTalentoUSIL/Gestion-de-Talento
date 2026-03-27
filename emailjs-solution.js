// SOLUCIÓN EMAILJS - SETUP EN 5 MINUTOS
// Incluye en index.html antes de app.js:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// CONFIGURACIÓN EMAILJS (agregar al inicio de app.js)
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'TU_PUBLIC_KEY', // De tu dashboard EmailJS
  SERVICE_ID: 'TU_SERVICE_ID', // gmail, outlook, etc.
  TEMPLATE_ID: 'TU_TEMPLATE_ID' // Template que crees
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// FUNCIÓN DE ENVÍO POR EMAIL
async function submitViaEmail() {
  console.log('=== ENVIANDO VIA EMAILJS ===');

  // Preparar competencias seleccionadas
  const competencies = state.selectedCompIds.map((id, index) => {
    const comp = ALL_COMPS.find(c => c.id === id);
    const levels = state.levels[id] || { current: 1, expected: 4 };

    return `${index + 1}. ${comp ? comp.name : 'N/A'}
       Nivel actual: ${SHORT_LEVEL[levels.current - 1]}
       Nivel esperado: ${SHORT_LEVEL[levels.expected - 1]}`;
  }).join('\n\n');

  // Datos para el email
  const templateParams = {
    // Datos básicos
    to_email: 'talento@usil.edu.pe', // Email donde quieres recibir
    from_name: state.profile.name || 'Sin nombre',

    // Perfil completo
    employee_name: state.profile.name || '',
    job_position: state.profile.position || '',
    work_area: state.profile.area || '',
    employee_role: state.profile.role || '',
    improvement_goals: state.profile.improvements || '',

    // Competencias y niveles
    selected_competencies: competencies,

    // Configuración del plan
    time_frame: state.profile.time || '',
    learning_mode: state.profile.modality || '',

    // Timestamp
    submission_date: new Date().toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),

    // Subject personalizado
    subject: `PDI 2026 - ${state.profile.name || 'Nuevo colaborador'} - ${state.profile.area || 'USIL'}`
  };

  console.log('Enviando email con datos:', templateParams);

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email enviado exitosamente:', response);
    return response;

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}

// TAMBIÉN ENVIAR COPIA AL COLABORADOR (OPCIONAL)
async function sendCopyToEmployee() {
  if (!state.profile.email) return;

  const employeeParams = {
    to_email: state.profile.email,
    from_name: 'Gestión del Talento USIL',
    subject: 'Copia de tu PDI 2026 - USIL',
    employee_name: state.profile.name,
    message: `Hola ${state.profile.name},\n\nAdjuntamos una copia de tu Plan de Desarrollo Individual 2026 que acabas de completar.\n\nSaludos,\nGestión del Talento USIL`
  };

  try {
    await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, 'employee_copy_template', employeeParams);
    console.log('✅ Copia enviada al colaborador');
  } catch (error) {
    console.error('❌ Error enviando copia:', error);
  }
}

/*
PASOS PARA CONFIGURAR EMAILJS:

1. Ve a https://www.emailjs.com
2. Crea cuenta gratuita (1000 emails/mes gratis)
3. Ve a "Email Services" > "Add New Service"
4. Conecta Gmail/Outlook/Yahoo
5. Ve a "Email Templates" > "Create New Template"
6. Usa este template:

SUBJECT: {{subject}}

DATOS DEL COLABORADOR:
====================================
Nombre: {{employee_name}}
Puesto: {{job_position}}
Área: {{work_area}}
Perfil: {{employee_role}}

OBJETIVOS DE MEJORA:
{{improvement_goals}}

COMPETENCIAS SELECCIONADAS:
====================================
{{selected_competencies}}

CONFIGURACIÓN DEL PLAN:
====================================
Tiempo: {{time_frame}}
Modalidad: {{learning_mode}}

Enviado el: {{submission_date}}
Sistema: PDI Interactivo 2026 - USIL

6. Copia los IDs de Service y Template
7. Ve a "API Keys" y copia tu Public Key
8. Reemplaza los valores en EMAILJS_CONFIG
*/