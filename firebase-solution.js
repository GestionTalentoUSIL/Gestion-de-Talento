// SOLUCIÓN FIREBASE/FIRESTORE - MUY FÁCIL DE IMPLEMENTAR
// Incluye este script en index.html antes de app.js:
// <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

// CONFIGURACIÓN FIREBASE (agregar al inicio de app.js)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "123456789",
  appId: "TU_APP_ID"
};

// Inicializar Firebase (solo una vez)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// FUNCIÓN DE ENVÍO A FIRESTORE
async function submitToFirestore() {
  console.log('=== ENVIANDO A FIREBASE FIRESTORE ===');

  const data = {
    // Timestamp
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    submitted_at: new Date().toISOString(),

    // Perfil
    name: state.profile.name || '',
    position: state.profile.position || '',
    area: state.profile.area || '',
    role: state.profile.role || '',
    improvements: state.profile.improvements || '',

    // Competencias
    selected_competencies: state.selectedCompIds.map(id => {
      const comp = ALL_COMPS.find(c => c.id === id);
      return {
        id: id,
        name: comp ? comp.name : 'Unknown',
        current_level: state.levels[id]?.current || 1,
        current_level_text: SHORT_LEVEL[(state.levels[id]?.current || 1) - 1],
        expected_level: state.levels[id]?.expected || 4,
        expected_level_text: SHORT_LEVEL[(state.levels[id]?.expected || 4) - 1]
      };
    }),

    // Plan configurado
    time_frame: state.profile.time || '',
    learning_modality: state.profile.modality || '',

    // Metadatos
    form_version: "PDI_2026_v1",
    user_agent: navigator.userAgent,
    completed: true
  };

  console.log('Datos para Firestore:', data);

  try {
    // Guardar en colección "pdi_responses"
    const docRef = await db.collection('pdi_responses').add(data);
    console.log('✅ Documento guardado con ID:', docRef.id);

    // Opcional: también guardar en colección de backup con timestamp
    const backupRef = await db.collection('pdi_backup').doc(docRef.id).set({
      ...data,
      original_id: docRef.id,
      backup_date: new Date().toISOString()
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error('❌ Error guardando en Firestore:', error);
    throw error;
  }
}

// PASOS PARA CONFIGURAR FIREBASE:
// 1. Ve a https://console.firebase.google.com
// 2. Crea nuevo proyecto o usa existente
// 3. Ve a "Project Settings" > "General"
// 4. Copia la configuración de "Firebase SDK snippet"
// 5. Ve a "Firestore Database" > "Crear base de datos"
// 6. Configura reglas de seguridad (permite escritura)
// 7. Reemplaza firebaseConfig con tus datos

// REGLAS DE FIRESTORE RECOMENDADAS:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pdi_responses/{document} {
      allow write: if true; // Permite que cualquiera escriba
      allow read: if false; // No permite lectura pública
    }
    match /pdi_backup/{document} {
      allow write: if true;
      allow read: if false;
    }
  }
}
*/