// CONFIGURACIÓN GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTgooPzH2-GBuK-SQ-NvHQt11oYHeG1Kfxn178RU5-F8NT4vAzZKXes2hCuMKFW54C/exec";

const TIMES = ["Corto (3-6 meses)", "Medio (6-12 meses)", "Largo (1-2 anos)"];
const MODALITIES = ["Virtual", "Presencial", "Autodidacta", "Mixta"];
const LEVEL_CURRENT = ["1", "2", "3", "4", "5"];
const LEVEL_EXPECTED = ["1", "2", "3", "4", "5"];
const SHORT_LEVEL = ["No presenta", "En desarrollo", "Dentro de lo esperado", "Por encima de lo esperado", "Sobresaliente"];
const LEVEL_EXPECTED_OPTIONS = ["Por encima de lo esperado", "Sobresaliente"];

const ROLES = [
  { id: "Academico", desc: "Docencia, investigacion y gestion curricular" },
  { id: "Administrativo", desc: "Eficiencia operativa y procesos institucionales" },
  { id: "Comercial", desc: "Captacion, fidelizacion y metas estrategicas" }
];

const COMPETENCIES = {
  liderazgo: [
    { id: "l1", name: "Desarrollo de personas" },
    { id: "l2", name: "Feedback Feedforward" },
    { id: "l3", name: "Toma de decisiones" },
    { id: "l4", name: "Comunicacion asertiva" }
  ],
  organizacionales: [
    { id: "o1", name: "Trabajo en entorno digital" },
    { id: "o2", name: "Excelencia en la experiencia del cliente" },
    { id: "o3", name: "Colaboracion basada en resultados" },
    { id: "o4", name: "Accion hacia el cambio" },
    { id: "o5", name: "Innovacion" }
  ]
};

const ALL_COMPS = [...COMPETENCIES.liderazgo, ...COMPETENCIES.organizacionales];

const state = {
  step: 1,
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

function buildPlan(profile, selectedCompIds) {
  const pool = {
    "70": [
      `Liderar un proyecto transversal en ${profile.area || "tu area"} aplicando esta competencia y registrando avances semanales.`,
      "Asumir la facilitacion de una reunion mensual enfocada en esta competencia.",
      "Implementar una mejora de proceso en tu equipo con evidencia de impacto.",
      "Tomar un caso retador donde esta competencia sea decisiva para el resultado.",
      "Aplicar la competencia en tareas diarias y documentar lecciones aprendidas."
    ],
    "20": [
      "Participar en sesiones quincenales de mentoria con un referente interno.",
      "Co-facilitar un espacio de aprendizaje con un colega experto.",
      "Pedir feedback mensual a jefatura y pares sobre avances concretos.",
      "Unirse a comunidad de practica interna para compartir casos reales.",
      "Observar y analizar reuniones donde lideres demuestran esta competencia."
    ],
    "10": [
      "Completar curso virtual de 8-12h en plataforma de formacion.",
      "Leer dos recursos especializados y elaborar resumen aplicable al puesto.",
      "Asistir a webinar y presentar aprendizajes al equipo.",
      "Desarrollar mini caso de estudio sobre un reto del area.",
      "Certificarse en programa alineado a objetivos de desarrollo institucional."
    ]
  };

  const out = {};
  const seed = state.planSeed || 0;
  selectedCompIds.forEach((id, idx) => {
    const o = idx * 2 + seed;
    out[id] = [
      { type: "70", text: pool["70"][(o) % pool["70"].length], priority: "Alta" },
      { type: "20", text: pool["20"][(o + 1) % pool["20"].length], priority: idx === 0 ? "Alta" : "Media" },
      { type: "10", text: pool["10"][(o + 2) % pool["10"].length], priority: "Media" }
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
  const role = state.profile.role || "su rol";
  const area = state.profile.area || "su area";
  const improve = state.profile.improvements || "competencias estrategicas";

  return `${who} tiene una oportunidad clara de elevar su impacto en ${area} desarrollando ${names}. El foco en ${improve} esta alineado con su rol ${role} y con metas institucionales. Este PDI servira como hoja de ruta para convertir progreso semanal en resultados sostenibles.`;
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
    state.profile.role || '',         // Columna E: Perfil
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
    return state.profile.name && state.profile.position && state.profile.area && state.profile.improvements && state.profile.role;
  }
  if (state.step === 2) {
    return state.selectedCompIds.length >= 2;
  }
  return true;
}

function toNext() {
  if (!canGoNext()) return;
  if (state.step === 5) {
    state.feedback = buildFeedback();
    state.step = 6;
    render();
    smoothStepScroll();
    // Envio automatico al llegar al PDI final
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
  let txt = `PDI 2026 USIL\n${"=".repeat(40)}\n`;
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
  window.print();
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
        <div class="block" style="display:grid;gap:8px;">
          ${ROLES.map((r) => `
            <div class="role-card ${p.role === r.id ? "active" : ""}" data-role="${r.id}">
              <p class="card-title">${r.id}</p>
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
      <h2>Priorizacion de Competencias</h2>
      <p class="muted">Selecciona entre 2 y 3 competencias (${state.selectedCompIds.length}/3).</p>
      <div class="hint">Tip: elige al menos 2 y hasta 3 competencias con mayor impacto en tus resultados del proximo ciclo.</div>

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
      <h2>Evaluacion de Niveles</h2>
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
          <label>Tiempo de Ejecucion</label>
          <select data-field="time">
            ${TIMES.map((t) => `<option ${p.time === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
          <div class="hint">Corto plazo para logros inmediatos; largo plazo para cambios de mayor profundidad.</div>
        </div>

        <div>
          <label>Modalidad de Aprendizaje</label>
          <div class="hint">Elige como quieres aprender y ejecutar tu plan.</div>
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
        `<button class="btn-purple" data-retry>Reintentar Envio</button>` :
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
      <h2 class="hide-print">PDI 2026 Consolidado</h2>
      <p class="muted hide-print">Documento final listo para descargar y enviar.</p>

      ${finalActionsHtml()}

      <article id="pdi-final" class="final-sheet">
        <div class="final-cover">
          <h2 style="margin:0;font-size:44px;line-height:1;">Mi PDI 2026</h2>
          <p style="margin:7px 0 0;text-transform:uppercase;letter-spacing:0.2em;font-size:11px;color:#315eb0;font-weight:800;">Plan de Desarrollo Individual - Gestion del Talento USIL</p>
        </div>

        <div class="grid-2">
          <div class="pill-data">
            <small style="text-transform:uppercase;color:#6d819b;font-weight:900;">Titular del Plan</small>
            <p style="margin:5px 0 0;font-size:20px;font-weight:900;">${escapeHtml((p.name || "Colaborador USIL").toUpperCase())}</p>
          </div>
          <div class="pill-data">
            <small style="text-transform:uppercase;color:#6d819b;font-weight:900;">Cargo y Area</small>
            <p style="margin:5px 0 0;font-size:18px;font-weight:900;">${escapeHtml(p.position)} - ${escapeHtml(p.area)}</p>
          </div>
        </div>

        <div class="final-grid-3">
          <div class="pill-data"><small>Rol</small><p><b>${escapeHtml(p.role)}</b></p></div>
          <div class="pill-data"><small>Modalidad</small><p><b>${escapeHtml(p.modality)}</b></p></div>
          <div class="pill-data"><small>Horizonte</small><p><b>${escapeHtml(p.time)}</b></p></div>
        </div>

        <div class="strong-box">
          <small style="text-transform:uppercase;letter-spacing:0.08em;color:#8fcbff;font-weight:900;">Foco de Mejora</small>
          <p style="margin:6px 0 0;font-size:15px;line-height:1.6;font-style:italic;">${escapeHtml(p.improvements)}</p>
        </div>

        <div class="strong-box" style="background:linear-gradient(140deg,#21264f,#3258ae);">
          <small style="text-transform:uppercase;letter-spacing:0.08em;color:#c5d7ff;font-weight:900;">Analisis Estrategico</small>
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
          Gestion del Talento USIL - PDI 2026
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
      <button class="btn-muted" data-prev ${state.step === 1 ? "disabled" : ""}>Atras</button>
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

function bindEvents() {
  document.querySelectorAll("[data-field]").forEach((el) => {
    el.addEventListener("input", (ev) => {
      // Keep typing smooth: update state without replacing DOM on each keypress.
      setProfileField(ev.target.dataset.field, ev.target.value, false);
    });
    el.addEventListener("change", (ev) => {
      setProfileField(ev.target.dataset.field, ev.target.value, true);
    });
    // También actualizar cuando pierda el foco
    el.addEventListener("blur", (ev) => {
      setProfileField(ev.target.dataset.field, ev.target.value, true);
    });
  });

  document.querySelectorAll("[data-role]").forEach((el) => {
    el.addEventListener("click", () => {
      state.profile.role = el.dataset.role;
      render();
      // Si el formulario está completo, hacer scroll al botón
      if (state.step === 1 && canGoNext()) {
        setTimeout(() => {
          const navButton = document.querySelector("[data-next]");
          if (navButton && !navButton.disabled) {
            navButton.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    });
  });

  document.querySelectorAll("[data-comp]").forEach((el) => {
    el.addEventListener("click", () => toggleComp(el.dataset.comp));
  });

  document.querySelectorAll("[data-mode]").forEach((el) => {
    el.addEventListener("click", () => {
      state.profile.modality = el.dataset.mode;
      render();
    });
  });

  document.querySelectorAll("[data-level-comp]").forEach((el) => {
    el.addEventListener("click", () => {
      updateLevel(el.dataset.levelComp, el.dataset.levelField, Number(el.dataset.levelValue));
    });
  });

  const next = document.querySelector("[data-next]");
  if (next) next.addEventListener("click", toNext);

  const prev = document.querySelector("[data-prev]");
  if (prev) prev.addEventListener("click", toPrev);

  const restart = document.querySelector("[data-restart]");
  if (restart) restart.addEventListener("click", restartAll);

  const regen = document.querySelector("[data-regenerate]");
  if (regen) regen.addEventListener("click", regeneratePlan);

  const copy = document.querySelector("[data-copy]");
  if (copy) copy.addEventListener("click", handleCopy);

  const print = document.querySelector("[data-print]");
  if (print) print.addEventListener("click", downloadPdf);

  const retry = document.querySelector("[data-retry]");
  if (retry) retry.addEventListener("click", submitData);

  bindAutoFocusScroll();
}

function render() {
  const warning = "";

  app.innerHTML = `
    <header class="topbar">
      <h1 class="title">PDI Interactivo 2026</h1>
      <p class="subtitle">Plan de Desarrollo Individual - USIL</p>
      <div class="stepper">
        ${STEPS.map((s, i) => {
          const n = i + 1;
          const cls = state.step === n ? "step-pill active" : state.step > n ? "step-pill done" : "step-pill";
          return `<div class="${cls}">${n}. ${s}</div>`;
        }).join("")}
      </div>
    </header>

    <main class="content">
      ${warning}
      ${renderBodyByStep()}
      ${renderNav()}
    </main>

    <footer class="footer hide-print">Gestion del Talento USIL - Plan de Desarrollo Individual 2026</footer>
  `;

  bindEvents();
}

render();
