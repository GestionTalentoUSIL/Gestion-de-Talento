// SOLUCIÓN GOOGLE SHEETS API DIRECTA
// Reemplaza la función submitGoogleForms() en app.js

async function submitToGoogleSheets() {
  console.log('=== ENVIANDO A GOOGLE SHEETS API ===');

  // 1. CONFIGURA TU GOOGLE SHEET
  const SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI'; // Extraer de la URL de tu hoja
  const SHEET_NAME = 'Respuestas'; // Nombre de la pestaña
  const API_KEY = 'TU_API_KEY_AQUI'; // API Key de Google Cloud Console

  // 2. CONSTRUIR DATOS
  const data = {
    timestamp: new Date().toLocaleString('es-PE'),
    name: state.profile.name || '',
    position: state.profile.position || '',
    area: state.profile.area || '',
    role: state.profile.role || '',
    improvements: state.profile.improvements || '',

    // Competencias seleccionadas
    competencies: state.selectedCompIds
      .map(id => ALL_COMPS.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', '),

    // Niveles de cada competencia
    comp1_current: state.levels[state.selectedCompIds[0]]?.current ? SHORT_LEVEL[state.levels[state.selectedCompIds[0]].current - 1] : '',
    comp1_expected: state.levels[state.selectedCompIds[0]]?.expected ? SHORT_LEVEL[state.levels[state.selectedCompIds[0]].expected - 1] : '',
    comp2_current: state.levels[state.selectedCompIds[1]]?.current ? SHORT_LEVEL[state.levels[state.selectedCompIds[1]].current - 1] : '',
    comp2_expected: state.levels[state.selectedCompIds[1]]?.expected ? SHORT_LEVEL[state.levels[state.selectedCompIds[1]].expected - 1] : '',
    comp3_current: state.levels[state.selectedCompIds[2]]?.current ? SHORT_LEVEL[state.levels[state.selectedCompIds[2]].current - 1] : '',
    comp3_expected: state.levels[state.selectedCompIds[2]]?.expected ? SHORT_LEVEL[state.levels[state.selectedCompIds[2]].expected - 1] : '',

    time: state.profile.time || '',
    modality: state.profile.modality || ''
  };

  console.log('Datos a enviar:', data);

  // 3. ENVIAR A GOOGLE SHEETS
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW&key=${API_KEY}`;

  const row = [
    data.timestamp,
    data.name,
    data.position,
    data.area,
    data.role,
    data.improvements,
    data.competencies,
    data.comp1_current,
    data.comp1_expected,
    data.comp2_current,
    data.comp2_expected,
    data.comp3_current,
    data.comp3_expected,
    data.time,
    data.modality
  ];

  const body = {
    values: [row]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Datos enviados exitosamente:', result);
    return result;

  } catch (error) {
    console.error('❌ Error enviando a Google Sheets:', error);
    throw error;
  }
}

// PASOS PARA CONFIGURAR:
// 1. Ve a Google Cloud Console (console.cloud.google.com)
// 2. Crea proyecto o selecciona uno existente
// 3. Habilita Google Sheets API
// 4. Crea API Key en "Credenciales"
// 5. Copia tu Sheet ID desde la URL de Google Sheets
// 6. Reemplaza TU_GOOGLE_SHEET_ID_AQUI y TU_API_KEY_AQUI