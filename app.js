// CONFIGURACIÓN GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTgooPzH2-GBuK-SQ-NvHQt11oYHeG1Kfxn178RU5-F8NT4vAzZKXes2hCuMKFW54C/exec";

const TIMES = ["Corto (3-6 meses)", "Medio (6-12 meses)", "Largo (1-2 años)"];
const MODALITIES = ["Virtual", "Presencial", "Autodidacta", "Mixta"];
const LEVEL_CURRENT = ["1", "2", "3", "4", "5"];
const LEVEL_EXPECTED = ["1", "2", "3", "4", "5"];
const SHORT_LEVEL = ["No presenta", "En desarrollo", "Dentro de lo esperado", "Por encima de lo esperado", "Sobresaliente"];
const LEVEL_EXPECTED_OPTIONS = ["Por encima de lo esperado", "Sobresaliente"];

const ROLES = [
  { id: "academico", label: "Académico", desc: "Docencia, investigación y gestión curricular" },
  { id: "administrativo", label: "Administrativo", desc: "Eficiencia operativa y procesos institucionales" },
  { id: "comercial", label: "Comercial", desc: "Captación y fidelización" }
];

const COMPETENCIES = {
  liderazgo: [
    { id: "l1", name: "Desarrollo de personas" },
    { id: "l2", name: "Feedback Feedforward" },
    { id: "l3", name: "Toma de decisiones" },
    { id: "l4", name: "Comunicación asertiva" }
  ],
  organizacionales: [
    { id: "o1", name: "Trabajo en entorno digital" },
    { id: "o2", name: "Excelencia en la experiencia del cliente" },
    { id: "o3", name: "Colaboración basada en resultados" },
    { id: "o4", name: "Acción hacia el cambio" },
    { id: "o5", name: "Innovación" }
  ]
};

const ROLE_ACTION_LIBRARY = {
  academico: {
    "70": [
      "Rediseñar una experiencia de aprendizaje en {area} desde el rol de {puesto}, aplicando esta competencia en sesiones, tutorías o evaluaciones.",
      "Conducir un ciclo corto de mejora docente en {area} para elevar {mejora} con evidencia de avance por semana.",
      "Ejecutar una práctica de aula, tutoría o coordinación académica donde esta competencia impacte directamente en el logro de estudiantes."
    ],
    "20": [
      "Solicitar observación de clase o cofacilitación con un par referente y recibir feedback/feedforward quincenal sobre {mejora}.",
      "Participar en una comunidad académica interna para contrastar casos reales vinculados al puesto de {puesto}.",
      "Coordinar mentoría con liderazgo académico para revisar decisiones pedagógicas y su impacto en estudiantes."
    ],
    "10": [
      "Completar una micro-ruta formativa en innovación educativa y transferir lo aprendido a una asignatura activa.",
      "Analizar dos casos de excelencia académica y documentar acciones replicables para {area}.",
      "Desarrollar un mini caso aplicado sobre un reto del puesto de {puesto} y socializar aprendizajes con el equipo."
    ]
  },
  administrativo: {
    "70": [
      "Optimizar un proceso crítico en {area} desde el puesto de {puesto}, usando esta competencia para reducir tiempos o reprocesos.",
      "Asumir un proyecto transversal con áreas usuarias donde esta competencia sea clave para lograr {mejora}.",
      "Consolidar un tablero de seguimiento operativo con indicadores semanales para sostener la mejora."
    ],
    "20": [
      "Solicitar shadowing de un referente interno y recoger feedback/feedforward sobre decisiones operativas del puesto.",
      "Cofacilitar una reunión de coordinación interáreas para fortalecer colaboración y acuerdos de servicio en {area}.",
      "Participar en una célula de mejora continua y compartir aprendizajes mensualmente con foco en {mejora}."
    ],
    "10": [
      "Completar una ruta corta de gestión de procesos y aplicar una herramienta concreta en el puesto de {puesto}.",
      "Estudiar dos casos de eficiencia administrativa en educación y proponer una adaptación viable para {area}.",
      "Tomar un curso virtual sobre analítica o automatización básica para mejorar la gestión diaria del equipo."
    ]
  },
  comercial: {
    "70": [
      "Desplegar una iniciativa de captación o fidelización en {area} alineada al puesto de {puesto} y a metas semanales.",
      "Gestionar un caso comercial retador donde la experiencia del cliente sea decisiva para alcanzar {mejora}.",
      "Ajustar el embudo comercial y validar impacto en conversión, retención o matrícula efectiva."
    ],
    "20": [
      "Realizar sesiones quincenales de role play con un referente comercial y recibir feedback/feedforward sobre objeciones frecuentes.",
      "Observar reuniones de negociación de alto desempeño y documentar prácticas transferibles al puesto de {puesto}.",
      "Trabajar con un mentor interno para fortalecer análisis de oportunidades y decisiones comerciales con datos."
    ],
    "10": [
      "Completar una ruta de formación en ventas consultivas y aplicar una técnica en casos reales de admisión.",
      "Revisar dos casos de éxito comercial en educación y definir acciones para la cartera de {area}.",
      "Participar en un webinar especializado y presentar al equipo un plan de aplicación en campo con seguimiento mensual."
    ]
  }
};

const IMPROVEMENT_PRIORITIES = [
  {
    key: "comunicacion",
    pattern: /comunicaci[oó]n|escucha|presentaci[oó]n|oratoria|mensaje|influencia/,
    objective: "mejorar la calidad de comunicación y el alineamiento de equipos",
    indicator: "claridad del mensaje, acuerdos cerrados y seguimiento oportuno"
  },
  {
    key: "decision",
    pattern: /decisi[oó]n|decisiones|criterio|priorizaci[oó]n|an[aá]lisis|riesgo/,
    objective: "mejorar la calidad y oportunidad de decisiones",
    indicator: "decisiones trazables, menor retrabajo y mejor uso de datos"
  },
  {
    key: "cliente",
    pattern: /cliente|servicio|atenci[oó]n|satisfacci[oó]n|nps|experiencia/,
    objective: "elevar la experiencia y satisfacción del cliente",
    indicator: "mejores tiempos de respuesta, satisfacción y cierre de casos"
  },
  {
    key: "digital",
    pattern: /digital|herramienta|tecnolog[ií]a|automatizaci[oó]n|datos|anal[ií]tica|crm/,
    objective: "fortalecer productividad digital y trabajo basado en datos",
    indicator: "adopción de herramientas, trazabilidad y productividad"
  },
  {
    key: "personas",
    pattern: /liderazgo|equipo|personas|mentoria|mentoría|feedback|feedforward|coaching/,
    objective: "potenciar desarrollo de personas y efectividad del equipo",
    indicator: "mejor desempeño del equipo y avances sostenidos por persona"
  }
];

const COMPETENCY_CONTEXT = {
  l1: {
    focus: "desarrollo de talento y crecimiento del equipo",
    evidence: "evidencias de avance de personas y transferencia al puesto"
  },
  l2: {
    focus: "conversaciones de feedback y feedforward accionables",
    evidence: "compromisos de mejora documentados y seguimiento frecuente"
  },
  l3: {
    focus: "análisis de escenarios y decisiones oportunas",
    evidence: "decisiones justificadas con datos y resultados medibles"
  },
  l4: {
    focus: "comunicación clara con escucha activa",
    evidence: "alineamiento del equipo y acuerdos de ejecución"
  },
  o1: {
    focus: "productividad y colaboración en entorno digital",
    evidence: "uso consistente de herramientas y trazabilidad de avances"
  },
  o2: {
    focus: "experiencia del cliente en cada punto de contacto",
    evidence: "mejoras en satisfacción, tiempos de respuesta y calidad percibida"
  },
  o3: {
    focus: "colaboración orientada a resultados institucionales",
    evidence: "cumplimiento de hitos compartidos y resultados interáreas"
  },
  o4: {
    focus: "adaptación y liderazgo del cambio",
    evidence: "adopción de nuevas prácticas con continuidad operativa"
  },
  o5: {
    focus: "innovación aplicada al contexto USIL",
    evidence: "prototipos o mejoras implementadas con impacto verificable"
  }
};

const ALL_COMPS = [...COMPETENCIES.liderazgo, ...COMPETENCIES.organizacionales];

const state = {
  step: 1,
  lastRenderedStep: null,
  profile: {
    name: "",
    position: "",
    area: "",
    improvements: "",
    role: "",
    time: TIMES[0],
    modality: MODALITIES[0]
  },
  selectedCompIds: [],
  levels: {},
  plan: {},
  planSeed: 0,
  feedback: "",
  submitStatus: "idle",
  copied: false
};

const app = document.getElementById("app");
const STEPS = ["Perfil", "Competencias", "Niveles", "Tiempo y Modalidad", "Acciones", "PDI Final"];
let delegatedEventsBound = false;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function smoothStepScroll() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const root = document.getElementById("active-step");
    if (root) {
      setTimeout(() => root.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  });
}

function bindAutoFocusScroll() {
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("focus", () => {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 90);
    });
  });
}

function refreshNextButtonState() {
  const nextBtn = document.querySelector("[data-next]");
  if (!nextBtn) return;
  nextBtn.disabled = !canGoNext();
}

function getProfileSnapshotForValidation() {
  const getDomValue = (field) => {
    const el = document.querySelector(`[data-field="${field}"]`);
    return el ? el.value : "";
  };

  return {
    name: String(getDomValue("name") || state.profile.name || "").trim(),
    position: String(getDomValue("position") || state.profile.position || "").trim(),
    area: String(getDomValue("area") || state.profile.area || "").trim(),
    improvements: String(getDomValue("improvements") || state.profile.improvements || "").trim(),
    role: String(state.profile.role || "").trim()
  };
}

function updateLevel(compId, field, value) {
  const current = state.levels[compId] || { current: 1, expected: 4 };
  let newLevel = { ...current, [field]: value };

  // Si el nivel actual es 4 o 5, el nivel meta debe ser automaticamente 5
  if (field === "current" && value >= 4) {
    newLevel.expected = 5;
  }

  state.levels[compId] = newLevel;
  render();
}

function toggleComp(compId) {
  if (state.selectedCompIds.includes(compId)) {
    state.selectedCompIds = state.selectedCompIds.filter((id) => id !== compId);
    delete state.levels[compId];
  } else if (state.selectedCompIds.length < 3) {
    state.selectedCompIds.push(compId);
    state.levels[compId] = { current: 1, expected: 4 };
  }
  render();
}

function modalityHint(modality) {
  if (modality === "Virtual") return "Prioriza evidencias digitales y seguimiento en línea.";
  if (modality === "Presencial") return "Asegura espacios presenciales de práctica y retroalimentación inmediata.";
  if (modality === "Autodidacta") return "Incluye hitos semanales de autoaprendizaje con entregables concretos.";
  return "Combina práctica en el puesto con instancias guiadas para acelerar transferencia.";
}

function complexityNote(gap) {
  if (gap >= 3) return "Brecha alta: agrega indicadores quincenales y acompañamiento cercano.";
  if (gap === 2) return "Brecha media: define hitos mensuales y evidencia de aplicación.";
  return "Brecha acotada: enfócate en consolidar consistencia y calidad de ejecución.";
}

function horizonNote(time) {
  if ((time || "").startsWith("Corto")) return "Define entregables semanales y una revisión ejecutiva al cierre de cada mes.";
  if ((time || "").startsWith("Medio")) return "Estructura el plan en trimestres con hitos de implementación y calibración.";
  return "Diseña una hoja de ruta por fases con indicadores de sostenibilidad y escalamiento.";
}

function getObjectiveAnchor(improvements) {
  const raw = String(improvements || "").trim();
  if (!raw) return "impacto en resultados del rol";
  const firstChunk = raw.split(/[,;\n]|\d\)/)[0].trim();
  const words = firstChunk.split(/\s+/).filter(Boolean).slice(0, 10);
  return words.join(" ") || "impacto en resultados del rol";
}

function getImprovementPriority(improvements) {
  const raw = String(improvements || "").trim().toLowerCase();
  if (!raw) {
    return {
      objective: "mejorar resultados clave del puesto",
      indicator: "avance visible en desempeño, calidad y cumplimiento"
    };
  }

  const match = IMPROVEMENT_PRIORITIES.find((item) => item.pattern.test(raw));
  if (match) {
    return {
      objective: match.objective,
      indicator: match.indicator
    };
  }

  return {
    objective: `mejorar ${raw.split(/[,;\n]|\d\)/)[0].trim()}`,
    indicator: "avance visible en desempeño, calidad y cumplimiento"
  };
}

function getCompetencyContext(compId) {
  return COMPETENCY_CONTEXT[compId] || {
    focus: "aplicación efectiva en el puesto",
    evidence: "evidencias claras de ejecución"
  };
}

function inferRoleFromPosition(position, area) {
  const base = `${position || ""} ${area || ""}`.toLowerCase();

  const academicPattern = /docente|profesor|coordinador\s+acad[eé]mico|director\s+de\s+escuela|investigaci[oó]n|curr[ií]culo|s[ií]labo|facultad|decanatura|tutor[ií]a|aula|aprendizaje/;
  const commercialPattern = /admisi[oó]n|admisiones|ventas|comercial|captaci[oó]n|fidelizaci[oó]n|prospect|matr[ií]cula|matriculas|marketing|telemarketing|crm|call\s*center/;
  const administrativePattern = /tesorer[ií]a|finanzas|contabilidad|log[ií]stica|rrhh|recursos\s+humanos|talento|bienestar|secretar[ií]a\s+acad[eé]mica|registro\s+acad[eé]mico|operaciones|planeamiento|calidad|soporte|sistemas|tecnolog[ií]a|infraestructura|biblioteca/;

  if (academicPattern.test(base)) return "academico";
  if (commercialPattern.test(base)) return "comercial";
  if (administrativePattern.test(base)) return "administrativo";
  return "";
}

function resolveRoleForRecommendations(profile) {
  const inferredRole = inferRoleFromPosition(profile.position, profile.area);
  if (inferredRole) return inferredRole;
  return profile.role || "administrativo";
}

function pickRolePool(profile) {
  const effectiveRole = resolveRoleForRecommendations(profile);
  return ROLE_ACTION_LIBRARY[effectiveRole] || ROLE_ACTION_LIBRARY.administrativo;
}

function interpolate(template, profile) {
  const area = profile.area || "tu área";
  const puesto = profile.position || "tu puesto";
  const mejora = getObjectiveAnchor(profile.improvements);

  return template
    .replaceAll("{area}", area)
    .replaceAll("{puesto}", puesto)
    .replaceAll("{mejora}", mejora);
}

function priorityByGap(gap, type) {
  if (type === "70") return gap >= 2 ? "Alta" : "Media";
  if (type === "20") return gap >= 3 ? "Alta" : "Media";
  return gap >= 3 ? "Media" : "Baja";
}

function buildPlan(profile, selectedCompIds) {
  const out = {};
  const pool = pickRolePool(profile);
  const seed = state.planSeed || 0;
  const modeHint = modalityHint(profile.modality);
  const timeHint = horizonNote(profile.time);
  const objectiveAnchor = getObjectiveAnchor(profile.improvements);
  const priority = getImprovementPriority(profile.improvements);
  const positionLabel = profile.position || "el puesto actual";

  selectedCompIds.forEach((id, idx) => {
    const lv = state.levels[id] || { current: 1, expected: 4 };
    const gap = Math.max(0, Number(lv.expected) - Number(lv.current));
    const o = idx * 2 + seed;
    const compName = ALL_COMPS.find((c) => c.id === id)?.name || "esta competencia";
    const compContext = getCompetencyContext(id);

    const action70 = `${interpolate(pool["70"][o % pool["70"].length], profile)} Enfoca la ejecución en ${compContext.focus} y en ${priority.objective} desde ${positionLabel}. ${complexityNote(gap)}`;
    const action20 = `${interpolate(pool["20"][(o + 1) % pool["20"].length], profile)} Refuerza ${compName} en situaciones reales y conecta con ${objectiveAnchor}. Prioriza ${priority.indicator}.`;
    const action10 = `${interpolate(pool["10"][(o + 2) % pool["10"].length], profile)} ${modeHint} Busca ${compContext.evidence} y mide ${priority.indicator}. ${timeHint}`;

    out[id] = [
      { type: "70", text: action70, priority: priorityByGap(gap, "70") },
      { type: "20", text: action20, priority: priorityByGap(gap, "20") },
      { type: "10", text: action10, priority: priorityByGap(gap, "10") }
    ];
  });

  return out;
}

function regeneratePlan() {
  state.planSeed = (state.planSeed + 1) % 5;
  state.plan = buildPlan(state.profile, state.selectedCompIds);
  render();
}

function buildFeedback() {
  const names = state.selectedCompIds
    .map((id) => ALL_COMPS.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c.name)
    .join(", ");
  const who = state.profile.name || "Este colaborador";
  const role = resolveRoleForRecommendations(state.profile) || "su rol";
  const area = state.profile.area || "su área";
  const improve = state.profile.improvements || "competencias estratégicas";
  const roleLabel = ROLES.find((r) => r.id === role)?.label || role;

  return `${who} tiene una oportunidad clara de elevar su impacto en ${area}, desarrollando ${names}. El foco en ${improve} está alineado con su rol ${roleLabel} y con metas institucionales. Este PDI servirá como hoja de ruta para convertir progreso semanal en resultados sostenibles.`;
}

function submitViaHiddenForm(url, params) {
  return new Promise((resolve, reject) => {
    // Método 1: Usar fetch con no-cors (más confiable)
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })
    .then(() => {
      console.log('✅ Fetch completado');
      resolve();
    })
    .catch((error) => {
      console.error('❌ Error en fetch:', error);
      // Fallback: intentar con iframe
      const iframe = document.createElement("iframe");
      iframe.name = `gf_submit_${Date.now()}`;
      iframe.style.display = "none";

      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;
      form.target = iframe.name;
      form.style.display = "none";

      params.forEach((value, key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        if (form.parentNode) form.parentNode.removeChild(form);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        resolve();
      }, 2000);
    });
  });
}

async function submitGoogleForms() {
  console.log('=== ENVIANDO A GOOGLE APPS SCRIPT ===');
  console.log('Estado actual:', state);

  // Construir timestamp en formato Perú
  const timestamp = new Date().toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Obtener nombres de competencias seleccionadas (separadas por coma)
  const competenciesNames = state.selectedCompIds
    .map(id => ALL_COMPS.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');
  const roleLabel = ROLES.find((r) => r.id === state.profile.role)?.label || state.profile.role || '';

  console.log('Competencias seleccionadas:', competenciesNames);

  // Construir niveles para cada competencia (enviar números, no texto)
  const levels = [];
  for (let i = 0; i < 3; i++) {
    const compId = state.selectedCompIds[i];
    if (compId && state.levels[compId]) {
      const lv = state.levels[compId];
      levels.push(lv.current || '');  // Número: 1, 2, 3, 4, 5
      levels.push(lv.expected || ''); // Número: 1, 2, 3, 4, 5
    } else {
      levels.push('', ''); // Vacíos si no hay competencia
    }
  }

  console.log('Niveles a enviar:', levels);

  // Construir fila de datos según el orden de las columnas del formulario
  const row = [
    timestamp,                        // Columna A: Marca temporal
    state.profile.name || '',         // Columna B: Nombre completo
    state.profile.position || '',     // Columna C: Puesto de trabajo
    state.profile.area || '',         // Columna D: Área
    roleLabel,                        // Columna E: Perfil
    state.profile.improvements || '', // Columna F: Objetivos de mejora
    competenciesNames,                // Columna G: Competencias (separadas por coma)
    levels[0], levels[1],             // Columnas H-I: Comp 1: actual, esperado
    levels[2], levels[3],             // Columnas J-K: Comp 2: actual, esperado
    levels[4], levels[5],             // Columnas L-M: Comp 3: actual, esperado
    '',                               // Columna N: SECCION 4 (vacía - solo header)
    state.profile.time || '',         // Columna O: Tiempo de ejecución
    state.profile.modality || ''      // Columna P: Modalidad
  ];

  console.log('Fila completa a enviar:', row);

  const body = { row: row };

  console.log('URL:', GOOGLE_SCRIPT_URL);
  console.log('Body:', JSON.stringify(body, null, 2));

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    // Con mode: 'no-cors', no podemos leer la respuesta pero si llegó aquí, funcionó
    console.log('✅ Solicitud enviada a Google Apps Script');
    console.log('Verificar en Google Sheets si los datos llegaron');
    return { success: true };

  } catch (error) {
    console.error('❌ Error enviando a Google Apps Script:', error);
    throw error;
  }
}

function canGoNext() {
  if (state.step === 1) {
    const snapshot = getProfileSnapshotForValidation();
    return Boolean(
      snapshot.name &&
      snapshot.position &&
      snapshot.area &&
      snapshot.improvements &&
      snapshot.role
    );
  }
  if (state.step === 2) {
    return state.selectedCompIds.length >= 2;
  }
  return true;
}

function toNext() {
  if (state.step === 1) {
    const snapshot = getProfileSnapshotForValidation();
    state.profile.name = snapshot.name;
    state.profile.position = snapshot.position;
    state.profile.area = snapshot.area;
    state.profile.improvements = snapshot.improvements;
  }

  if (!canGoNext()) return;
  if (state.step === 5) {
    state.feedback = buildFeedback();
    state.step = 6;
    render();
    smoothStepScroll();
    // Envío automático al llegar al PDI final
    console.log('Iniciando envío automático...', new Date());
    setTimeout(() => {
      submitData();
    }, 1000);
  } else {
    state.step += 1;
    if (state.step === 5) state.plan = buildPlan(state.profile, state.selectedCompIds);
    render();
    smoothStepScroll();
  }
}

function toPrev() {
  if (state.step <= 1) return;
  state.step -= 1;
  render();
  smoothStepScroll();
}

function setProfileField(field, value, shouldRender = true) {
  state.profile[field] = value;
  if (shouldRender) {
    render();
    // Si el formulario está completo, hacer scroll al botón de navegación
    if (state.step === 1 && canGoNext()) {
      setTimeout(() => {
        const navButton = document.querySelector("[data-next]");
        if (navButton && !navButton.disabled) {
          navButton.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }
}

function restartAll() {
  window.location.reload();
}

function handleCopy() {
  let txt = `PDI USIL: Tu Ruta de Crecimiento\n${"=".repeat(40)}\n`;
  txt += `${state.profile.name}\n${state.profile.position} - ${state.profile.area}\n\n`;
  txt += `${state.feedback}\n\n`;

  state.selectedCompIds.forEach((id) => {
    const comp = ALL_COMPS.find((c) => c.id === id);
    txt += `COMPETENCIA: ${comp ? comp.name : id}\n`;
    (state.plan[id] || []).forEach((a) => {
      txt += `[${a.type}%] ${a.text}\n`;
    });
    txt += "\n";
  });

  navigator.clipboard.writeText(txt)
    .then(() => {
      state.copied = true;
      render();
      setTimeout(() => {
        state.copied = false;
        render();
      }, 2200);
    })
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      state.copied = true;
      render();
      setTimeout(() => {
        state.copied = false;
        render();
      }, 2200);
    });
}

function downloadPdf() {
  const printable = document.querySelector(".final-sheet");
  if (!printable) {
    window.print();
    return;
  }

  const printWindow = window.open("", "_blank", "width=1100,height=760");
  if (!printWindow) {
    alert("No se pudo abrir la vista de impresión. Habilita las ventanas emergentes para este sitio.");
    window.print();
    return;
  }

  const stylesheetHref = new URL("styles.css", window.location.href).href;

  const printStyles = `
    body {
      margin: 0;
      background: #ffffff;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #0f172a;
      padding: 18px;
    }
    .final-sheet {
      max-width: 1000px;
      margin: 0 auto;
      background: #ffffff;
    }
    .actions-bar,
    .hide-print {
      display: none !important;
    }
  `;

  const title = (state.profile.name || "PDI USIL").trim();
  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)} - PDI USIL: Tu Ruta de Crecimiento</title>
        <link rel="stylesheet" href="${stylesheetHref}" />
        <style>${printStyles}</style>
      </head>
      <body>
        ${printable.outerHTML}
      </body>
    </html>`);
  printWindow.document.close();

  let printTriggered = false;
  const runPrint = () => {
    if (printTriggered) return;
    printTriggered = true;
    printWindow.focus();
    printWindow.print();
  };

  // Espera carga completa para evitar PDF vacío o incompleto.
  printWindow.addEventListener("load", () => {
    setTimeout(runPrint, 350);
  }, { once: true });

  printWindow.addEventListener("afterprint", () => {
    printWindow.close();
  }, { once: true });

  // Fallback por si el evento load no dispara en algunos navegadores.
  setTimeout(runPrint, 900);
}

async function submitData() {
  state.submitStatus = "loading";
  render();
  try {
    await submitGoogleForms();
    state.submitStatus = "done";
  } catch (err) {
    state.submitStatus = "error";
  }
  render();
}

function levelButtons(compId, field, colorClass) {
  const lv = state.levels[compId] || { current: 1, expected: 4 };
  const val = lv[field];
  // Mostrar todas las opciones para ambos niveles
  const options = [1, 2, 3, 4, 5];
  return options
    .map((n) => `<button class="level-btn ${colorClass} ${val === n ? "active" : ""}" data-level-comp="${compId}" data-level-field="${field}" data-level-value="${n}">${n}<br><small>${SHORT_LEVEL[n - 1]}</small></button>`)
    .join("");
}

function renderStep1() {
  const p = state.profile;
  return `
    <section id="active-step">
      <h2>Perfil del Colaborador</h2>
      <p class="muted">Completa tus datos para construir el documento final.</p>

      <div class="grid-2 block">
        <div>
          <label>Nombre Completo *</label>
          <input data-field="name" value="${escapeHtml(p.name)}" placeholder="Ej. Ana María García López" />
        </div>
        <div>
          <label>Puesto de Trabajo *</label>
          <input data-field="position" value="${escapeHtml(p.position)}" placeholder="Ej. Coordinador de Sistemas" />
        </div>
      </div>

      <div class="block">
          <label>Área *</label>
        <input data-field="area" value="${escapeHtml(p.area)}" placeholder="Ej. Gerencia de Talento y Cultura" />
          <div class="hint">El departamento o área donde trabajas.</div>
      </div>

      <div class="block">
        <label>Elige el perfil que mejor describe tu rol *</label>
        <div class="hint">Las recomendaciones se ajustan automáticamente según tu puesto y área en el contexto universitario.</div>
        <div class="block" style="display:grid;gap:8px;">
          ${ROLES.map((r) => `
            <div class="role-card ${p.role === r.id ? "active" : ""}" data-role="${r.id}">
              <p class="card-title">${r.label}</p>
              <p class="card-desc">${r.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="block">
        <label>¿Qué aspectos específicos de tu desempeño quieres mejorar? (Define de 2 a 3 objetivos) *</label>
        <textarea data-field="improvements" placeholder="Ej. 1) Mejorar feedback efectivo, 2) Fortalecer coordinación de equipo, 3) Optimizar experiencia del cliente">${escapeHtml(p.improvements)}</textarea>
        <div class="hint">Escribe de 2 a 3 objetivos concretos y medibles.</div>
      </div>
    </section>
  `;
}

function renderStep2() {
  return `
    <section id="active-step">
      <h2>Priorización de Competencias</h2>
      <p class="muted">Selecciona entre 2 y 3 competencias (${state.selectedCompIds.length}/3).</p>
      <div class="hint">Tip: elige al menos 2 y hasta 3 competencias con mayor impacto en tus resultados del próximo ciclo.</div>

      <div class="grid-2 block">
        <div>
          <p class="section-title">Liderazgo</p>
          <div style="display:grid;gap:8px;">
            ${COMPETENCIES.liderazgo.map((c) => {
              const active = state.selectedCompIds.includes(c.id);
              const disabled = !active && state.selectedCompIds.length >= 3;
              return `<div class="comp-card ${active ? "active" : ""}" data-comp="${c.id}" style="opacity:${disabled ? 0.45 : 1};pointer-events:${disabled ? "none" : "auto"};">${c.name}</div>`;
            }).join("")}
          </div>
        </div>

        <div>
          <p class="section-title">Organizacionales</p>
          <div style="display:grid;gap:8px;">
            ${COMPETENCIES.organizacionales.map((c) => {
              const active = state.selectedCompIds.includes(c.id);
              const disabled = !active && state.selectedCompIds.length >= 3;
              return `<div class="comp-card ${active ? "active" : ""}" data-comp="${c.id}" style="opacity:${disabled ? 0.45 : 1};pointer-events:${disabled ? "none" : "auto"};">${c.name}</div>`;
            }).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStep3() {
  return `
    <section id="active-step">
      <h2>Evaluación de Niveles</h2>
      <div class="hint">Selecciona nivel actual y nivel meta para cada competencia elegida.</div>

      <div class="block" style="display:grid;gap:14px;">
        ${state.selectedCompIds.map((id, idx) => {
          const comp = ALL_COMPS.find((c) => c.id === id);
          const lv = state.levels[id] || { current: 1, expected: 4 };
          return `
            <div class="comp-plan">
              <div class="comp-plan-head">
                <span>${idx + 1}. ${comp ? comp.name : id}</span>
                <span>Actual ${lv.current} -> Meta ${lv.expected}</span>
              </div>
              <div style="padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div class="level-box">
                  <div class="level-head">
                    <strong>Nivel Actual</strong>
                    <span class="level-tag">${SHORT_LEVEL[lv.current - 1]}</span>
                  </div>
                  <small class="muted">1 = No presenta | 5 = Sobresaliente</small>
                  <div class="level-grid">${levelButtons(id, "current", "")}</div>
                </div>
                <div class="level-box">
                  <div class="level-head">
                    <strong>Nivel Meta</strong>
                    <span class="level-tag" style="background:#e8f9ef;color:#13803f;">${SHORT_LEVEL[lv.expected - 1]}</span>
                  </div>
                  <small class="muted">1 = No presenta | 5 = Sobresaliente</small>
                  <div class="level-grid">${levelButtons(id, "expected", "green")}</div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderStep4() {
  const p = state.profile;
  return `
    <section id="active-step">
      <h2>Tiempo y Modalidad del Plan</h2>
      <div class="hint">Define tiempo y modalidad para construir acciones realistas.</div>

      <div class="grid-2 block">
        <div>
          <label>Tiempo de Ejecución</label>
          <select data-field="time">
            ${TIMES.map((t) => `<option ${p.time === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
          <div class="hint">Corto plazo para logros inmediatos; largo plazo para cambios de mayor profundidad.</div>
        </div>

        <div>
          <label>Modalidad de Aprendizaje</label>
          <div class="hint">Elige cómo quieres aprender y ejecutar tu plan.</div>
          <div class="grid-2 block">
            ${MODALITIES.map((m) => `<div class="mode-card ${p.modality === m ? "active" : ""}" data-mode="${m}">${m}</div>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStep5() {
  if (Object.keys(state.plan).length === 0) {
    state.plan = buildPlan(state.profile, state.selectedCompIds);
  }

  return `
    <section id="active-step">
      <h2>Acciones 70-20-10</h2>
      <p class="muted">Revisa y ajusta mentalmente estas acciones antes de finalizar tu PDI.</p>
      <div style="margin-bottom:12px;">
        <button class="btn-muted" data-regenerate>Regenerar acciones</button>
      </div>

      <div class="block" style="display:grid;gap:14px;">
        ${state.selectedCompIds.map((id) => {
          const comp = ALL_COMPS.find((c) => c.id === id);
          const lv = state.levels[id] || { current: 1, expected: 4 };
          return `
            <div class="comp-plan">
              <div class="comp-plan-head">
                <span>${comp ? comp.name : id}</span>
                <span>Nivel ${lv.current} -> Meta ${lv.expected}</span>
              </div>
              ${(state.plan[id] || []).map((a) => `
                <div class="act-row">
                  <span class="badge b${a.type}">${a.type}%</span>
                  <p style="margin:7px 0 4px;font-size:14px;font-weight:700;line-height:1.45;">${a.text}</p>
                  <small style="font-weight:800;color:${a.priority === "Alta" ? "#a52727" : "#687a91"};">Prioridad ${a.priority}</small>
                </div>
              `).join("")}
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function finalActionsHtml() {
  let note = "";
  if (state.submitStatus === "loading") note = "<div class=\"loading-note hide-print\">Enviando datos a Google Forms...</div>";
  if (state.submitStatus === "done") note = "<div class=\"success-note hide-print\">✅ Datos enviados correctamente a Google Forms.</div>";
  if (state.submitStatus === "error") note = "<div class=\"error-note hide-print\">❌ No se pudo enviar. Haz clic en Reintentar.</div>";

  return `
    <div class="actions-bar hide-print">
      <button class="btn-main" data-copy>${state.copied ? "Copiado" : "Copiar Resumen"}</button>
      <button class="btn-success" data-print>Descargar / Imprimir PDF</button>
      ${state.submitStatus === "error" || state.submitStatus === "idle" ?
        `<button class="btn-purple" data-retry>Reintentar Envío</button>` :
        state.submitStatus === "loading" ?
        `<button class="btn-purple" disabled>Enviando...</button>` :
        `<button class="btn-purple" disabled>✓ Enviado</button>`
      }
    </div>
    ${note}
  `;
}

function renderStep6() {
  if (!state.feedback) state.feedback = buildFeedback();
  const p = state.profile;

  return `
    <section id="active-step">
      <h2 class="hide-print">PDI USIL: Tu Ruta de Crecimiento</h2>
      <p class="muted hide-print">Documento final listo para descargar y enviar.</p>

      ${finalActionsHtml()}

      <article id="pdi-final" class="final-sheet">
        <div class="final-cover">
          <h2 style="margin:0;font-size:44px;line-height:1;">Mi Ruta de Crecimiento</h2>
          <p style="margin:7px 0 0;text-transform:uppercase;letter-spacing:0.2em;font-size:11px;color:#315eb0;font-weight:800;">Plan de Desarrollo Individual - Gestión del Talento USIL</p>
        </div>

        <div class="grid-2">
          <div class="pill-data">
            <small style="text-transform:uppercase;color:#6d819b;font-weight:900;">Titular del Plan</small>
            <p style="margin:5px 0 0;font-size:20px;font-weight:900;">${escapeHtml((p.name || "Colaborador USIL").toUpperCase())}</p>
          </div>
          <div class="pill-data">
            <small style="text-transform:uppercase;color:#6d819b;font-weight:900;">Cargo y Área</small>
            <p style="margin:5px 0 0;font-size:18px;font-weight:900;">${escapeHtml(p.position)} - ${escapeHtml(p.area)}</p>
          </div>
        </div>

        <div class="final-grid-3">
          <div class="pill-data"><small>Rol</small><p><b>${escapeHtml(ROLES.find((r) => r.id === p.role)?.label || p.role)}</b></p></div>
          <div class="pill-data"><small>Modalidad</small><p><b>${escapeHtml(p.modality)}</b></p></div>
          <div class="pill-data"><small>Horizonte</small><p><b>${escapeHtml(p.time)}</b></p></div>
        </div>

        <div class="strong-box">
          <small style="text-transform:uppercase;letter-spacing:0.08em;color:#8fcbff;font-weight:900;">Foco de Mejora</small>
          <p style="margin:6px 0 0;font-size:15px;line-height:1.6;font-style:italic;">${escapeHtml(p.improvements)}</p>
        </div>

        <div class="strong-box" style="background:linear-gradient(140deg,#21264f,#3258ae);">
          <small style="text-transform:uppercase;letter-spacing:0.08em;color:#c5d7ff;font-weight:900;">Análisis Estratégico</small>
          <p style="margin:6px 0 0;font-size:15px;line-height:1.6;font-style:italic;">${escapeHtml(state.feedback)}</p>
        </div>

        ${state.selectedCompIds.map((id) => {
          const comp = ALL_COMPS.find((c) => c.id === id);
          const lv = state.levels[id] || { current: 1, expected: 4 };
          return `
            <section class="comp-plan">
              <div class="comp-plan-head">
                <span>${escapeHtml(comp ? comp.name : id)}</span>
                <span>Nivel ${lv.current} -> Meta ${lv.expected}</span>
              </div>
              ${(state.plan[id] || []).map((a) => `
                <div class="act-row">
                  <span class="badge b${a.type}">${a.type}%</span>
                  <p style="margin:7px 0 4px;font-size:14px;font-weight:700;line-height:1.45;">${escapeHtml(a.text)}</p>
                  <small style="font-weight:800;color:${a.priority === "Alta" ? "#a52727" : "#687a91"};">Prioridad ${a.priority}</small>
                </div>
              `).join("")}
            </section>
          `;
        }).join("")}

        <p style="text-align:center;margin:8px 0 0;color:#7f8fa4;text-transform:uppercase;letter-spacing:0.1em;font-size:10px;">
          Gestión del Talento USIL - PDI USIL: Tu Ruta de Crecimiento
        </p>
      </article>
    </section>
  `;
}

function renderNav() {
  if (state.step === 6) {
    return `
      <div class="nav hide-print">
        <button class="btn-muted" data-prev>Revisar Acciones</button>
        <button class="btn-danger" data-restart>Reiniciar</button>
      </div>
    `;
  }

  return `
    <div class="nav hide-print">
      <button class="btn-muted" data-prev ${state.step === 1 ? "disabled" : ""}>Atrás</button>
      <button class="${state.step === 5 ? "btn-success" : "btn-main"}" data-next ${!canGoNext() ? "disabled" : ""}>
        ${state.step === 5 ? "Finalizar y ver PDI" : "Siguiente"}
      </button>
    </div>
  `;
}

function renderBodyByStep() {
  if (state.step === 1) return renderStep1();
  if (state.step === 2) return renderStep2();
  if (state.step === 3) return renderStep3();
  if (state.step === 4) return renderStep4();
  if (state.step === 5) return renderStep5();
  return renderStep6();
}

// Event delegation: listeners globales en el contenedor app
function bindEvents() {
  if (!app) return;

  // Los listeners delegados deben registrarse una sola vez.
  if (!delegatedEventsBound) {

    // Event delegation en #app para inputs
    app.addEventListener("input", (ev) => {
      if (ev.target.hasAttribute("data-field")) {
        setProfileField(ev.target.dataset.field, ev.target.value, false);
        refreshNextButtonState();
      }
    });

    app.addEventListener("change", (ev) => {
      if (ev.target.hasAttribute("data-field")) {
        setProfileField(ev.target.dataset.field, ev.target.value, false);
        refreshNextButtonState();
      }
      if (ev.target.hasAttribute("data-level-comp")) {
        updateLevel(ev.target.dataset.levelComp, ev.target.dataset.levelField, Number(ev.target.dataset.levelValue));
      }
    });

    // Event delegation para clicks
    app.addEventListener("click", (ev) => {
      const target = ev.target.closest("[data-role], [data-comp], [data-mode], [data-level-comp], [data-next], [data-prev], [data-restart], [data-regenerate], [data-copy], [data-print], [data-retry]");
      
      if (!target) return;

      if (target.hasAttribute("data-role")) {
        ev.preventDefault();
        state.profile.role = target.dataset.role;
        render();
        refreshNextButtonState();
        if (state.step === 1 && canGoNext()) {
          setTimeout(() => {
            const navButton = document.querySelector("[data-next]");
            if (navButton && !navButton.disabled) {
              navButton.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      }

      if (target.hasAttribute("data-comp")) {
        ev.preventDefault();
        toggleComp(target.dataset.comp);
      }

      if (target.hasAttribute("data-mode")) {
        ev.preventDefault();
        state.profile.modality = target.dataset.mode;
        render();
      }

      if (target.hasAttribute("data-level-comp")) {
        ev.preventDefault();
        updateLevel(target.dataset.levelComp, target.dataset.levelField, Number(target.dataset.levelValue));
      }

      if (target.hasAttribute("data-next")) {
        ev.preventDefault();
        toNext();
      }

      if (target.hasAttribute("data-prev")) {
        ev.preventDefault();
        toPrev();
      }

      if (target.hasAttribute("data-restart")) {
        ev.preventDefault();
        restartAll();
      }

      if (target.hasAttribute("data-regenerate")) {
        ev.preventDefault();
        regeneratePlan();
      }

      if (target.hasAttribute("data-copy")) {
        ev.preventDefault();
        handleCopy();
      }

      if (target.hasAttribute("data-print")) {
        ev.preventDefault();
        downloadPdf();
      }

      if (target.hasAttribute("data-retry")) {
        ev.preventDefault();
        submitData();
      }
    });

    delegatedEventsBound = true;
  }

  bindAutoFocusScroll();
}

function renderStepper() {
  return STEPS.map((s, i) => {
    const n = i + 1;
    const cls = state.step === n ? "step-pill active" : state.step > n ? "step-pill done" : "step-pill";
    return `<div class="${cls}">${n}. ${s}</div>`;
  }).join("");
}

function ensureShell() {
  if (!app || app.dataset.shellReady === "1") return;

  const logoSrc = "assets/logo-usil.png";
  app.innerHTML = `
    <header class="topbar">
      <div class="topbar-main">
        <div>
          <h1 class="title">PDI USIL: Tu Ruta de Crecimiento</h1>
          <p class="subtitle">Plan de Desarrollo Individual - USIL</p>
        </div>
        <div class="topbar-logo-shell" aria-hidden="true">
          <img class="topbar-logo" src="${logoSrc}" alt="Corporación Educativa USIL" />
        </div>
      </div>
      <div class="stepper" data-stepper></div>
    </header>

    <main class="content" data-content></main>

    <footer class="footer hide-print">Gestión del Talento USIL - PDI USIL: Tu Ruta de Crecimiento</footer>
  `;

  app.dataset.shellReady = "1";
}

function render() {
  ensureShell();

  const warning = "";
  const stepper = app.querySelector("[data-stepper]");
  const content = app.querySelector("[data-content]");
  const stepChanged = state.lastRenderedStep !== state.step;

  if (stepper) {
    stepper.innerHTML = renderStepper();
  }

  if (content) {
    content.innerHTML = `
      ${warning}
      <div class="${stepChanged ? "step-changed" : ""}">
        ${renderBodyByStep()}
      </div>
      ${renderNav()}
    `;
  }

  state.lastRenderedStep = state.step;

  bindEvents();
}

function safeRender() {
  if (!app) return;
  try {
    render();
  } catch (error) {
    app.innerHTML = `
      <main class="content">
        <h2>Error al cargar la aplicación</h2>
        <p class="muted">Se produjo un error inesperado en la interfaz.</p>
        <div class="error-note">${escapeHtml(error && error.message ? error.message : String(error))}</div>
      </main>
    `;
    throw error;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeRender);
} else {
  safeRender();
}
