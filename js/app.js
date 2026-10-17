/* ==========================================================================
   E.P.E.T. N° 4 "Gendarmería Nacional" — Junín de los Andes, Neuquén
   Lógica Principal v4:
   - Seguridad con Contraseña para Alumnos, Profesores y Coordinador
   - Apartados separados: Alumnos | Profesores (con Standby) | Coordinador
   - Divisiones de curso A, B y C para 4°, 5° y 6° Año
   - Buscador de alumnos en tiempo real tanto en Profesor como en Coordinador
   ========================================================================== */

const REQUIRED_HOURS = 200;
const STORAGE_KEY = 'epet4_practicas_db_v4';
const SESSION_KEY = 'epet4_active_session_v4';

function getInitialState() {
  return {
    config: {
      schoolName: 'E.P.E.T. N° 4 "Gendarmería Nacional"',
      city: 'Junín de los Andes, Provincia del Neuquén',
      directorName: 'Prof. Claudia Fuentes',
      coordinatorName: 'Ing. Roberto Morales',
      resolution: 'Res. CPE Neuquén — Diseño Curricular Ciclo Superior Técnico (200 hs PP)',
      coordUsername: 'coordinador',
      coordPassword: 'epet4'
    },
    teachers: [
      {
        id: 'prof-1',
        email: 'prof.electromecanica.epet4@gmail.com',
        password: 'epet4',
        name: 'Téc. Alejandro Gómez',
        orientation: 'Electromecánica',
        status: 'active', // 'standby' | 'active' | 'preapproved' | 'suspended'
        addedAt: '2026-03-10'
      },
      {
        id: 'prof-2',
        email: 'prof.alimentacion.epet4@gmail.com',
        password: 'epet4',
        name: 'Lic. Valeria Domínguez',
        orientation: 'Ciencias de la Alimentación',
        status: 'active',
        addedAt: '2026-03-12'
      },
      {
        id: 'prof-3',
        email: 'marcos.riquelme.docente@gmail.com',
        password: 'epet4',
        name: 'Ing. Marcos Riquelme',
        orientation: 'Electromecánica',
        status: 'standby',
        addedAt: '2026-10-16'
      }
    ],
    students: [
      {
        id: 'stu-1',
        email: 'mateo.canicul@gmail.com',
        password: '1234',
        name: 'Mateo Nicolás Cañicul',
        dni: '46812309',
        year: '6° Año',
        division: 'A',
        orientation: 'Electromecánica',
        registeredAt: '2026-04-02',
        logs: [
          {
            id: 'log-101',
            date: '2026-05-18',
            hours: 80,
            place: 'EPEN — Servicio Eléctrico Junín de los Andes',
            description: 'Mantenimiento preventivo de transformadores de distribución y relevamiento de líneas de baja y media tensión.',
            teacherName: 'Téc. Alejandro Gómez',
            teacherEmail: 'prof.electromecanica.epet4@gmail.com'
          },
          {
            id: 'log-102',
            date: '2026-08-22',
            hours: 70,
            place: 'Taller de Electromecánica E.P.E.T. N° 4',
            description: 'Diseño y montaje de tableros de automatización con contactores, guardamotores y programación PLC.',
            teacherName: 'Téc. Alejandro Gómez',
            teacherEmail: 'prof.electromecanica.epet4@gmail.com'
          },
          {
            id: 'log-103',
            date: '2026-10-08',
            hours: 50,
            place: 'Planta Potabilizadora / Obras Públicas Municipal',
            description: 'Diagnóstico y reparación de electrobombas centrífugas trifásicas y alineación de acoplamientos.',
            teacherName: 'Téc. Alejandro Gómez',
            teacherEmail: 'prof.electromecanica.epet4@gmail.com'
          }
        ]
      },
      {
        id: 'stu-2',
        email: 'sofia.millain@gmail.com',
        password: '1234',
        name: 'Sofía Valentina Millain',
        dni: '46790445',
        year: '6° Año',
        division: 'B',
        orientation: 'Ciencias de la Alimentación',
        registeredAt: '2026-04-04',
        logs: [
          {
            id: 'log-201',
            date: '2026-05-25',
            hours: 85,
            place: 'Dirección de Bromatología Municipal — Junín de los Andes',
            description: 'Análisis fisicoquímico y microbiológico de aguas y alimentos, auditoría de Buenas Prácticas de Manufactura (BPM).',
            teacherName: 'Lic. Valeria Domínguez',
            teacherEmail: 'prof.alimentacion.epet4@gmail.com'
          },
          {
            id: 'log-202',
            date: '2026-08-14',
            hours: 75,
            place: 'Planta Piloto de Alimentos E.P.E.T. N° 4',
            description: 'Estandarización de procesos térmicos de pasteurización, control de pH y grados Brix en conservas regionales.',
            teacherName: 'Lic. Valeria Domínguez',
            teacherEmail: 'prof.alimentacion.epet4@gmail.com'
          },
          {
            id: 'log-203',
            date: '2026-10-04',
            hours: 50,
            place: 'Establecimiento Elaborador Regional de Truchas y Ahumados',
            description: 'Implementación de POES, control de cadena de frío y rotulado nutricional reglamentario.',
            teacherName: 'Lic. Valeria Domínguez',
            teacherEmail: 'prof.alimentacion.epet4@gmail.com'
          }
        ]
      },
      {
        id: 'stu-3',
        email: 'lautaro.rios@gmail.com',
        password: '1234',
        name: 'Lautaro Ezequiel Ríos',
        dni: '46945112',
        year: '6° Año',
        division: 'A',
        orientation: 'Electromecánica',
        registeredAt: '2026-04-10',
        logs: [
          {
            id: 'log-301',
            date: '2026-06-12',
            hours: 95,
            place: 'EPEN — Estación Transformadora Junín de los Andes',
            description: 'Medición de puesta a tierra, termografía en seccionadores y asistencia técnica en maniobras.',
            teacherName: 'Téc. Alejandro Gómez',
            teacherEmail: 'prof.electromecanica.epet4@gmail.com'
          },
          {
            id: 'log-302',
            date: '2026-09-20',
            hours: 90,
            place: 'Taller de Mecanizado y Tornería E.P.E.T. N° 4',
            description: 'Fabricación de ejes y bujes en torno paralelo y soldadura MIG/MAG.',
            teacherName: 'Téc. Alejandro Gómez',
            teacherEmail: 'prof.electromecanica.epet4@gmail.com'
          }
        ]
      },
      {
        id: 'stu-4',
        email: 'camila.aillapan@gmail.com',
        password: '1234',
        name: 'Camila Rocío Aillapan',
        dni: '47012889',
        year: '5° Año',
        division: 'C',
        orientation: 'Ciencias de la Alimentación',
        registeredAt: '2026-04-15',
        logs: [
          {
            id: 'log-401',
            date: '2026-06-19',
            hours: 120,
            place: 'Laboratorio de Química y Microbiología E.P.E.T. N° 4',
            description: 'Siembra en medios de cultivo selectivos, recuento de coliformes y determinación de acidez titulable en lácteos.',
            teacherName: 'Lic. Valeria Domínguez',
            teacherEmail: 'prof.alimentacion.epet4@gmail.com'
          }
        ]
      }
    ]
  };
}

let appState = loadState();
let currentSession = loadSession(); // { role: 'alumno'|'profesor'|'coordinador', id?, email?, name? }
let currentSubView = 'main';
let selectedTeacherStudentId = appState.students[0]?.id || null;
let teacherSearchQuery = '';
let teacherOrientationFilter = 'ALL';

// Estado del buscador de alumnos en el Panel del Coordinador
let coordStudentSearchQuery = '';
let coordStudentOriFilter = 'ALL';
let coordStudentYearFilter = 'ALL';
let coordStudentDivFilter = 'ALL';

let processedTransparentLogoDataUrl = null;

// ==========================================================================
// Persistencia Local + Sincronización con Servidor Node
// ==========================================================================

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students) && Array.isArray(parsed.teachers)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error leyendo localStorage:', e);
  }
  const initial = getInitialState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Error guardando estado:', e);
  }
  if (window.location.protocol.startsWith('http')) {
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appState)
    }).catch(() => {});
  }
}

async function syncFromServerIfAvailable() {
  if (!window.location.protocol.startsWith('http')) return;
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && Array.isArray(serverData.students) && Array.isArray(serverData.teachers)) {
        appState = serverData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        renderApp();
      } else {
        saveState();
      }
    }
  } catch (_) {}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function saveSession(sessionObj) {
  currentSession = sessionObj;
  if (sessionObj) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ==========================================================================
// Procesamiento del Escudo EPET N° 4 (Fondo Exterior Transparente)
// ==========================================================================

function processLogoTransparency() {
  const src = window.EPET4_LOGO_BASE64 || 'logo_epet4.png';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const visited = new Uint8Array(w * h);
      const queue = [];

      const pushIfWhite = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const idx = y * w + x;
        if (visited[idx]) return;
        const p = idx * 4;
        if (data[p] > 235 && data[p + 1] > 235 && data[p + 2] > 235) {
          visited[idx] = 1;
          queue.push(idx);
        }
      };

      for (let x = 0; x < w; x++) {
        pushIfWhite(x, 0);
        pushIfWhite(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        pushIfWhite(0, y);
        pushIfWhite(w - 1, y);
      }

      while (queue.length > 0) {
        const curr = queue.pop();
        const p = curr * 4;
        data[p + 3] = 0;
        const cx = curr % w;
        const cy = Math.floor(curr / w);
        pushIfWhite(cx + 1, cy);
        pushIfWhite(cx - 1, cy);
        pushIfWhite(cx, cy + 1);
        pushIfWhite(cx, cy - 1);
      }

      ctx.putImageData(imgData, 0, 0);
      processedTransparentLogoDataUrl = canvas.toDataURL('image/png');
      document.querySelectorAll('.epet-logo-img').forEach((el) => {
        el.src = processedTransparentLogoDataUrl;
      });
    } catch (_) {}
  };
  img.src = src;
}

// ==========================================================================
// Funciones Auxiliares de Negocio
// ==========================================================================

function getStudentTotalHours(stu) {
  if (!stu || !Array.isArray(stu.logs)) return 0;
  return stu.logs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0);
}

function getStudentRemainingHours(stu) {
  return Math.max(0, REQUIRED_HOURS - getStudentTotalHours(stu));
}

function isStudentCompleted(stu) {
  return getStudentTotalHours(stu) >= REQUIRED_HOURS;
}

function formatCourseLabel(stu) {
  const yr = stu?.year || '6° Año';
  const div = stu?.division || 'A';
  return `${yr} "${div}"`;
}

function findTeacherByEmail(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return appState.teachers.find((t) => t.email.trim().toLowerCase() === clean) || null;
}

function findStudentByEmail(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return appState.students.find((s) => (s.email || '').trim().toLowerCase() === clean) || null;
}

function getOfficialTechnicalTitle(orientation) {
  return orientation === 'Electromecánica'
    ? 'Técnico en Equipos e Instalaciones Electromecánicas'
    : 'Técnico en Ciencias de la Alimentación';
}

// ==========================================================================
// Pantalla 1: Conmutación entre Apartado Alumnos | Profesores | Coordinador
// ==========================================================================

function switchAuthRoleTab(role) {
  document.getElementById('roleTabBtnAlumno').classList.toggle('active', role === 'alumno');
  document.getElementById('roleTabBtnProfesor').classList.toggle('active', role === 'profesor');
  document.getElementById('roleTabBtnCoordinador').classList.toggle('active', role === 'coordinador');

  document.getElementById('authSectionAlumno').style.display = role === 'alumno' ? 'block' : 'none';
  document.getElementById('authSectionProfesor').style.display = role === 'profesor' ? 'block' : 'none';
  document.getElementById('authSectionCoordinador').style.display = role === 'coordinador' ? 'block' : 'none';

  const standbyBox = document.getElementById('profStandbyNoticeBox');
  if (standbyBox) standbyBox.style.display = 'none';
}

function switchStudentAuthMode(mode) {
  document.getElementById('btnSubAlumnoLogin').classList.toggle('active', mode === 'login');
  document.getElementById('btnSubAlumnoRegister').classList.toggle('active', mode === 'register');

  document.getElementById('boxStudentLogin').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('boxStudentRegister').style.display = mode === 'register' ? 'block' : 'none';
}

function switchTeacherAuthMode(mode) {
  document.getElementById('btnSubProfLogin').classList.toggle('active', mode === 'login');
  document.getElementById('btnSubProfRegister').classList.toggle('active', mode === 'register');

  document.getElementById('boxTeacherLogin').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('boxTeacherRegister').style.display = mode === 'register' ? 'block' : 'none';
}

// ==========================================================================
// Flujo A: Login y Registro de ALUMNOS (con Contraseña, División A/B/C y DNI)
// ==========================================================================

function handleStudentLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('stuLoginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('stuLoginPass').value;

  const stu = findStudentByEmail(email);
  if (!stu) {
    showToast(
      'No encontramos un alumno registrado con ese Gmail. Si es tu primera vez, usá la pestaña "Registrarme (1ra vez)".',
      'error'
    );
    return;
  }

  if (!stu.password) {
    showToast(
      'Tu ficha fue precargada por el Coordinador sin contraseña aún. Pasá a "Registrarme (1ra vez)" y poné tu DNI para crear tu contraseña.',
      'error'
    );
    switchStudentAuthMode('register');
    document.getElementById('stuRegEmail').value = email;
    document.getElementById('stuRegDni').value = stu.dni || '';
    document.getElementById('stuRegName').value = stu.name || '';
    if (stu.division) document.getElementById('stuRegDivision').value = stu.division;
    return;
  }

  if (stu.password !== pass) {
    showToast('Contraseña incorrecta para esta cuenta de alumno.', 'error');
    return;
  }

  saveSession({
    role: 'alumno',
    studentId: stu.id,
    email: stu.email,
    name: stu.name
  });

  document.getElementById('stuLoginPass').value = '';
  currentSubView = 'main';
  renderApp();
  showToast(`¡Bienvenido/a ${stu.name}!`, 'success');
}

function handleStudentRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('stuRegName').value.trim();
  const dni = document.getElementById('stuRegDni').value.replace(/\D/g, '');
  const email = document.getElementById('stuRegEmail').value.trim().toLowerCase();
  const orientation = document.getElementById('stuRegOrientation').value;
  const year = document.getElementById('stuRegYear').value;
  const division = document.getElementById('stuRegDivision')?.value || 'A';
  const pass = document.getElementById('stuRegPass').value;
  const passConfirm = document.getElementById('stuRegPassConfirm').value;

  if (!name || !dni || !email) {
    showToast('Completá Nombre y Apellido, DNI y Correo Gmail.', 'error');
    return;
  }

  if (pass.length < 4) {
    showToast('La contraseña debe tener al menos 4 caracteres.', 'error');
    return;
  }

  if (pass !== passConfirm) {
    showToast('Las contraseñas ingresadas no coinciden.', 'error');
    return;
  }

  if (findTeacherByEmail(email)) {
    showToast('Ese correo figura en el padrón de Profesores. Usá el apartado de Profesores.', 'error');
    return;
  }

  const existingByEmail = findStudentByEmail(email);
  if (existingByEmail && existingByEmail.password && existingByEmail.dni !== dni) {
    showToast('Ese correo Gmail ya está registrado por otro alumno. Iniciá sesión con tu contraseña.', 'error');
    return;
  }

  // Verificar si el Coordinador ya había cargado al alumno a mano por DNI (o por Gmail sin contraseña)
  let stu = appState.students.find((s) => s.dni === dni) || existingByEmail;

  if (stu) {
    if (stu.password) {
      showToast('Este alumno (DNI/Gmail) ya tiene una cuenta y contraseña creadas. Iniciá sesión.', 'error');
      switchStudentAuthMode('login');
      document.getElementById('stuLoginEmail').value = stu.email;
      return;
    }
    stu.name = name;
    stu.email = email;
    stu.orientation = orientation;
    stu.year = year;
    stu.division = division;
    stu.password = pass;
  } else {
    stu = {
      id: 'stu-' + Date.now(),
      email,
      password: pass,
      name,
      dni,
      orientation,
      year,
      division,
      registeredAt: new Date().toISOString().split('T')[0],
      logs: []
    };
    appState.students.unshift(stu);
  }

  selectedTeacherStudentId = stu.id;
  saveState();

  saveSession({
    role: 'alumno',
    studentId: stu.id,
    email: stu.email,
    name: stu.name
  });

  document.getElementById('stuRegPass').value = '';
  document.getElementById('stuRegPassConfirm').value = '';
  currentSubView = 'main';
  renderApp();
  showToast('¡Cuenta de alumno creada y guardada con contraseña!', 'success');
}

// ==========================================================================
// Flujo B: Login y Registro de PROFESORES (con Contraseña + Estado Standby)
// ==========================================================================

function handleTeacherLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('profLoginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('profLoginPass').value;
  const standbyBox = document.getElementById('profStandbyNoticeBox');
  if (standbyBox) standbyBox.style.display = 'none';

  const teacher = findTeacherByEmail(email);
  if (!teacher) {
    showToast(
      'Ese Gmail no está registrado como Profesor. Si sos docente nuevo, usá "Registrarme como Profesor".',
      'error'
    );
    return;
  }

  if (!teacher.password) {
    showToast(
      'El Coordinador pre-habilitó tu Gmail. Completá "Registrarme como Profesor" con ese mismo Gmail para definir tu contraseña.',
      'info'
    );
    switchTeacherAuthMode('register');
    document.getElementById('profRegEmail').value = teacher.email;
    document.getElementById('profRegName').value = teacher.name || '';
    return;
  }

  if (teacher.password !== pass) {
    showToast('Contraseña incorrecta para esta cuenta de profesor.', 'error');
    return;
  }

  if (teacher.status === 'standby') {
    if (standbyBox) {
      standbyBox.style.display = 'block';
      standbyBox.innerHTML = `
        <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--tech-yellow); margin-bottom: 0.25rem;">
          ⏳ CUENTA DOCENTE EN STANDBY (PENDIENTE DE CONFIRMACIÓN)
        </div>
        <div>
          Hola <strong>${escapeHtml(teacher.name)}</strong> (<strong>${escapeHtml(teacher.email)}</strong>): tu registro como profesor ya está cargado en el sistema, pero se encuentra en <strong>Standby</strong>.
          El <strong>Coordinador o Director</strong> debe confirmar tu cuenta desde su panel antes de que puedas ingresar a cargar horas.
        </div>
      `;
    }
    showToast('Tu cuenta de profesor está en Standby esperando confirmación del Coordinador.', 'error');
    return;
  }

  if (teacher.status === 'suspended') {
    showToast('Tu cuenta de profesor se encuentra suspendida por el Coordinador.', 'error');
    return;
  }

  saveSession({
    role: 'profesor',
    teacherId: teacher.id,
    email: teacher.email,
    name: teacher.name,
    orientation: teacher.orientation
  });

  document.getElementById('profLoginPass').value = '';
  currentSubView = 'main';
  renderApp();
  showToast(`Bienvenido/a ${teacher.name}. Acceso docente confirmado.`, 'success');
}

function handleTeacherRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('profRegName').value.trim();
  const email = document.getElementById('profRegEmail').value.trim().toLowerCase();
  const orientation = document.getElementById('profRegOrientation').value;
  const pass = document.getElementById('profRegPass').value;
  const passConfirm = document.getElementById('profRegPassConfirm').value;

  if (!name || !email) {
    showToast('Completá tu Nombre y Apellido y tu Gmail.', 'error');
    return;
  }

  if (pass.length < 4) {
    showToast('La contraseña debe tener al menos 4 caracteres.', 'error');
    return;
  }

  if (pass !== passConfirm) {
    showToast('Las contraseñas no coinciden.', 'error');
    return;
  }

  const existing = findTeacherByEmail(email);

  if (existing && existing.status === 'preapproved' && !existing.password) {
    existing.name = name;
    existing.orientation = orientation;
    existing.password = pass;
    existing.status = 'active';
    saveState();

    saveSession({
      role: 'profesor',
      teacherId: existing.id,
      email: existing.email,
      name: existing.name,
      orientation: existing.orientation
    });

    currentSubView = 'main';
    renderApp();
    showToast('Tu Gmail ya estaba pre-habilitado por el Coordinador. ¡Bienvenido al Panel de Profesores!', 'success');
    return;
  }

  if (existing) {
    if (existing.status === 'standby') {
      showToast('Este Gmail ya fue registrado y está en Standby esperando confirmación del Coordinador.', 'error');
    } else {
      showToast('Este Gmail de profesor ya está registrado. Iniciá sesión con tu contraseña.', 'error');
    }
    switchTeacherAuthMode('login');
    document.getElementById('profLoginEmail').value = email;
    return;
  }

  const newTeacher = {
    id: 'prof-' + Date.now(),
    email,
    password: pass,
    name,
    orientation,
    status: 'standby',
    addedAt: new Date().toISOString().split('T')[0]
  };

  appState.teachers.unshift(newTeacher);
  saveState();

  document.getElementById('profRegName').value = '';
  document.getElementById('profRegEmail').value = '';
  document.getElementById('profRegPass').value = '';
  document.getElementById('profRegPassConfirm').value = '';

  switchTeacherAuthMode('login');
  document.getElementById('profLoginEmail').value = email;

  const standbyBox = document.getElementById('profStandbyNoticeBox');
  if (standbyBox) {
    standbyBox.style.display = 'block';
    standbyBox.innerHTML = `
      <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--tech-yellow); margin-bottom: 0.25rem;">
        ✓ SOLICITUD DOCENTE ENVIADA (EN STANDBY)
      </div>
      <div>
        Tu correo <strong>${escapeHtml(email)}</strong> y tu contraseña quedaron registrados en <strong>Standby</strong>.
        Una vez que el <strong>Coordinador / Director</strong> confirme tu cuenta desde su panel, ya podrás iniciar sesión aquí para cargar horas.
      </div>
    `;
  }

  showToast('Registro en Standby enviado. El Coordinador debe confirmarlo en su panel.', 'success');
}

// ==========================================================================
// Flujo C: Login del COORDINADOR / DIRECTOR (Usuario y Contraseña)
// ==========================================================================

function handleCoordinatorLoginSubmit(e) {
  e.preventDefault();
  const user = document.getElementById('coordUserInput').value.trim();
  const pass = document.getElementById('coordPassInput').value;

  const validUser = appState.config.coordUsername || 'coordinador';
  const validPass = appState.config.coordPassword || 'epet4';

  if (user === validUser && pass === validPass) {
    saveSession({
      role: 'coordinador',
      name: appState.config.coordinatorName || 'Coordinador / Director EPET N° 4',
      username: validUser
    });
    document.getElementById('coordUserInput').value = '';
    document.getElementById('coordPassInput').value = '';
    currentSubView = 'main';
    renderApp();
    showToast('Sesión iniciada en el Panel del Coordinador / Director.', 'success');
  } else {
    showToast('Usuario o contraseña de Coordinador incorrectos.', 'error');
  }
}

function logoutSession() {
  saveSession(null);
  currentSubView = 'main';
  renderApp();
  showToast('Sesión cerrada correctamente.', 'success');
}

// ==========================================================================
// Renderizador Principal
// ==========================================================================

function renderApp() {
  const authScreen = document.getElementById('authGatewayScreen');
  const workspaceScreen = document.getElementById('workspaceScreen');

  if (currentSession) {
    if (currentSession.role === 'profesor') {
      const t = findTeacherByEmail(currentSession.email);
      if (!t || t.status !== 'active') {
        saveSession(null);
      }
    } else if (currentSession.role === 'alumno') {
      const s =
        appState.students.find((item) => item.id === currentSession.studentId) ||
        findStudentByEmail(currentSession.email);
      if (!s) {
        saveSession(null);
      } else {
        currentSession.studentId = s.id;
      }
    }
  }

  if (!currentSession) {
    authScreen.style.display = 'flex';
    workspaceScreen.style.display = 'none';
    return;
  }

  authScreen.style.display = 'none';
  workspaceScreen.style.display = 'grid';

  renderSidebar();

  if (currentSession.role === 'alumno') {
    renderStudentPersonalWorkspace();
  } else if (currentSession.role === 'profesor') {
    renderTeacherWorkspace();
  } else if (currentSession.role === 'coordinador') {
    renderCoordinatorWorkspace();
  }
}

// ==========================================================================
// Sidebar Lateral Izquierda Contextual por Rol
// ==========================================================================

function renderSidebar() {
  const userCard = document.getElementById('sidebarUserCard');
  const menuContainer = document.getElementById('sidebarMenuContainer');

  if (currentSession.role === 'alumno') {
    const stu = appState.students.find((s) => s.id === currentSession.studentId);
    userCard.innerHTML = `
      <span class="user-role-tag alumno">🎓 Alumno Ciclo Superior</span>
      <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem;">
        ${escapeHtml(stu?.name || currentSession.name)}
      </div>
      <div class="font-mono" style="font-size: 0.78rem; color: var(--tech-yellow); margin-top: 0.2rem;">
        DNI ${formatDni(stu?.dni || '')} • ${escapeHtml(formatCourseLabel(stu))}
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; word-break: break-all;">
        ${escapeHtml(stu?.email || currentSession.email)}
      </div>
    `;

    menuContainer.innerHTML = `
      <button type="button" class="sidebar-link ${currentSubView === 'main' ? 'active' : ''}" onclick="setSubView('main')">
        <span>📊 Mis Horas y Certificado</span>
      </button>
      <button type="button" class="sidebar-link ${currentSubView === 'perfil' ? 'active' : ''}" onclick="setSubView('perfil')">
        <span>🔐 Mis Datos y Contraseña</span>
      </button>
    `;
  } else if (currentSession.role === 'profesor') {
    const teacher = findTeacherByEmail(currentSession.email);
    userCard.innerHTML = `
      <span class="user-role-tag profesor">👨‍🏫 Profesor Confirmado</span>
      <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem;">
        ${escapeHtml(teacher?.name || currentSession.name)}
      </div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem;">
        ${escapeHtml(teacher?.orientation || 'Ciclo Superior')}
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; word-break: break-all;">
        ${escapeHtml(currentSession.email)}
      </div>
    `;

    menuContainer.innerHTML = `
      <button type="button" class="sidebar-link ${currentSubView === 'main' ? 'active' : ''}" onclick="setSubView('main')">
        <span>🔍 Buscar Alumno y Cargar Horas</span>
      </button>
      <button type="button" class="sidebar-link ${currentSubView === 'historial' ? 'active' : ''}" onclick="setSubView('historial')">
        <span>📋 Historial de Cargas (${countTotalLogs()})</span>
      </button>
    `;
  } else if (currentSession.role === 'coordinador') {
    const standbyCount = appState.teachers.filter((t) => t.status === 'standby').length;

    userCard.innerHTML = `
      <span class="user-role-tag coordinador">🛡️ Coordinador / Director</span>
      <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem;">
        ${escapeHtml(appState.config.coordinatorName || 'Coordinación General')}
      </div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem;">
        E.P.E.T. N° 4 — Junín de los Andes
      </div>
    `;

    menuContainer.innerHTML = `
      <button type="button" class="sidebar-link ${currentSubView === 'main' ? 'active' : ''}" onclick="setSubView('main')">
        <span>👨‍🏫 Profesores y Standby</span>
        ${standbyCount > 0 ? `<span class="standby-count-badge">${standbyCount}</span>` : ''}
      </button>
      <button type="button" class="sidebar-link ${currentSubView === 'alumnos' ? 'active' : ''}" onclick="setSubView('alumnos')">
        <span>🎓 Buscar y Registrar Alumnos (${appState.students.length})</span>
      </button>
      <button type="button" class="sidebar-link ${currentSubView === 'config' ? 'active' : ''}" onclick="setSubView('config')">
        <span>⚙️ Clave Coordinador y PDF</span>
      </button>
    `;
  }
}

function setSubView(viewName) {
  currentSubView = viewName;
  renderApp();
}

function countTotalLogs() {
  return appState.students.reduce((sum, s) => sum + (s.logs ? s.logs.length : 0), 0);
}

// ==========================================================================
// PANEL 1: VISTA PRIVADA DEL ALUMNO ("MI PANEL DE ALUMNO")
// ==========================================================================

function renderStudentPersonalWorkspace() {
  const container = document.getElementById('workspaceMainContainer');
  const stu = appState.students.find((s) => s.id === currentSession.studentId);

  if (!stu) {
    logoutSession();
    return;
  }

  const totalHours = getStudentTotalHours(stu);
  const remainingHours = getStudentRemainingHours(stu);
  const completed = totalHours >= REQUIRED_HOURS;
  const pct = Math.min(100, Math.round((totalHours / REQUIRED_HOURS) * 100));
  const isElectro = stu.orientation === 'Electromecánica';
  const stuDiv = stu.division || 'A';

  if (currentSubView === 'perfil') {
    container.innerHTML = `
      <div class="neu-card" style="max-width: 680px;">
        <span class="hero-top-badge">MI CUENTA PERSONAL DE ALUMNO</span>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.4rem;">Mis Datos Académicos y Contraseña</h2>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.4rem;">
          Podés actualizar tus datos de cursada (Año y División A, B o C) o cambiar tu contraseña de acceso.
        </p>

        <form onsubmit="handleStudentUpdateOwnProfile(event)">
          <div class="form-group">
            <label class="form-label">Correo Gmail Registrado</label>
            <input type="email" class="neu-input" value="${escapeHtml(stu.email)}" disabled />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="editOwnName">Nombre y Apellido Completo *</label>
              <input type="text" id="editOwnName" class="neu-input" value="${escapeHtml(stu.name)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="editOwnDni">Número de DNI (sin puntos) *</label>
              <input type="text" id="editOwnDni" class="neu-input font-mono" value="${escapeHtml(stu.dni)}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="editOwnOrientation">Orientación Técnica *</label>
            <select id="editOwnOrientation" class="neu-select">
              <option value="Electromecánica" ${stu.orientation === 'Electromecánica' ? 'selected' : ''}>⚙️ Electromecánica</option>
              <option value="Ciencias de la Alimentación" ${stu.orientation === 'Ciencias de la Alimentación' ? 'selected' : ''}>🧪 Ciencias de la Alimentación</option>
            </select>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="editOwnYear">Año del Ciclo Superior *</label>
              <select id="editOwnYear" class="neu-select">
                <option value="4° Año" ${stu.year === '4° Año' ? 'selected' : ''}>4° Año Ciclo Superior</option>
                <option value="5° Año" ${stu.year === '5° Año' ? 'selected' : ''}>5° Año Ciclo Superior</option>
                <option value="6° Año" ${stu.year === '6° Año' ? 'selected' : ''}>6° Año Ciclo Superior</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="editOwnDivision">División de Curso *</label>
              <select id="editOwnDivision" class="neu-select">
                <option value="A" ${stuDiv === 'A' ? 'selected' : ''}>División A</option>
                <option value="B" ${stuDiv === 'B' ? 'selected' : ''}>División B</option>
                <option value="C" ${stuDiv === 'C' ? 'selected' : ''}>División C</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="editOwnPass">Nueva Contraseña (dejar igual para no cambiarla) *</label>
            <input type="password" id="editOwnPass" class="neu-input" minlength="4" value="${escapeHtml(stu.password || '')}" required />
          </div>

          <button type="submit" class="neu-btn neu-btn-primary">
            Guardar Mis Datos y Contraseña
          </button>
        </form>
      </div>
    `;
    return;
  }

  const radius = 94;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const logsHtml =
    stu.logs && stu.logs.length > 0
      ? stu.logs
          .slice()
          .sort((a, b) => String(b.date).localeCompare(String(a.date)))
          .map(
            (log) => `
          <div class="log-item ${isElectro ? '' : 'alimentacion'}">
            <div>
              <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.98rem;">
                ${escapeHtml(log.place)}
              </div>
              <div style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0.2rem;">
                ${escapeHtml(log.description)}
              </div>
              <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.35rem;">
                📅 Fecha: <strong>${formatDateAR(log.date)}</strong> • Acreditado por: <strong>${escapeHtml(log.teacherName)}</strong>
              </div>
            </div>
            <span class="log-item-hours">+${log.hours} HS</span>
          </div>
        `
          )
          .join('')
      : `
        <div class="neu-well" style="text-align: center; padding: 2.2rem;">
          <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.02rem; color: var(--text-secondary);">
            Todavía no tenés horas de prácticas cargadas
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">
            Tu ficha (<strong>${escapeHtml(stu.name)} — DNI ${formatDni(stu.dni)}</strong>) ya está activa. Cuando tus profesores te carguen horas, las verás reflejadas aquí.
          </p>
        </div>
      `;

  container.innerHTML = `
    <div class="neu-card workspace-header-banner">
      <div>
        <span class="hero-top-badge" style="margin-bottom: 0.25rem;">
          PANEL PERSONAL DEL ALUMNO • E.P.E.T. N° 4
        </span>
        <h1 style="font-size: 1.75rem;">${escapeHtml(stu.name)}</h1>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.15rem;">
          DNI <strong class="font-mono">${formatDni(stu.dni)}</strong> • Gmail: <strong>${escapeHtml(stu.email || 'Sin vincular')}</strong>
        </p>
      </div>

      <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
        <span class="orientation-badge ${isElectro ? 'electromecanica' : 'alimentacion'}">
          ${isElectro ? '⚙️ Electromecánica' : '🧪 Ciencias de la Alimentación'}
        </span>
        <span class="year-tag">${escapeHtml(formatCourseLabel(stu))}</span>
      </div>
    </div>

    <div class="student-personal-grid">
      <section class="neu-card" style="text-align: center;">
        <h3 style="font-size: 1.12rem;">Mi Progreso de Prácticas</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.15rem;">
          Requisito Titulación Técnica: <strong>200 horas reloj</strong>
        </p>

        <div class="dial-wrapper">
          <div class="neu-dial-outer">
            <svg class="neu-dial-svg" viewBox="0 0 224 224">
              <circle cx="112" cy="112" r="${radius}" stroke="transparent"></circle>
              <circle
                class="dial-progress ${completed ? 'completed' : ''}"
                cx="112"
                cy="112"
                r="${radius}"
                stroke-dasharray="${circumference.toFixed(1)}"
                stroke-dashoffset="${strokeDashoffset.toFixed(1)}"
              ></circle>
            </svg>
            <div class="neu-dial-inner-well">
              <div class="neu-dial-center">
                <div class="dial-hours-big">${totalHours}</div>
                <div class="dial-hours-total">DE ${REQUIRED_HOURS} HS</div>
                <div style="margin-top: 0.3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; color: ${
                  completed ? 'var(--alimentos-emerald)' : 'var(--mech-orange)'
                };">
                  ${pct}% CUMPLIDO
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-row-2" style="margin: 1.1rem 0;">
          <div class="neu-well-sm">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
              Mis Horas Realizadas
            </div>
            <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: var(--mech-orange); margin-top: 0.15rem;">
              ${totalHours} hs
            </div>
          </div>

          <div class="neu-well-sm">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
              Horas Faltantes
            </div>
            <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: ${
              completed ? 'var(--alimentos-emerald)' : 'var(--tech-yellow)'
            }; margin-top: 0.15rem;">
              ${completed ? '0 hs (¡Listo!)' : `${remainingHours} hs`}
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 1rem;">
          ${
            completed
              ? `
                <button
                  type="button"
                  class="neu-btn neu-btn-certificate unlocked"
                  onclick="downloadCertificatePDF('${stu.id}')"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Descargar Certificado
                </button>
                <button
                  type="button"
                  class="neu-btn"
                  style="width: 100%; font-size: 0.85rem;"
                  onclick="openCertificatePreviewModal('${stu.id}')"
                >
                  👁️ Vista Previa del Certificado Oficial
                </button>
              `
              : `
                <button type="button" class="neu-btn neu-btn-certificate locked" disabled>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Descargar Certificado (Te faltan ${remainingHours} hs)
                </button>
              `
          }
        </div>
      </section>

      <section class="neu-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="font-size: 1.2rem;">Mis Prácticas Profesionalizantes Acreditadas</h3>
            <p style="font-size: 0.83rem; color: var(--text-secondary);">
              Detalle de horas cargadas a tu legajo por los profesores
            </p>
          </div>
          <span class="neu-pill">${stu.logs.length} ${stu.logs.length === 1 ? 'registro' : 'registros'}</span>
        </div>

        <div style="margin-bottom: 1.35rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">
            <span>Avance Acumulado: ${totalHours} de ${REQUIRED_HOURS} horas</span>
            <span style="color: ${completed ? 'var(--alimentos-emerald)' : 'var(--tech-yellow)'};">
              ${completed ? '✓ 200 Horas Completadas' : `Faltan ${remainingHours} horas`}
            </span>
          </div>
          <div class="neu-progress-track">
            <div class="neu-progress-fill ${completed ? 'completed' : ''}" style="width: ${pct}%;"></div>
          </div>
        </div>

        <div class="logs-list">
          ${logsHtml}
        </div>
      </section>
    </div>
  `;
}

function handleStudentUpdateOwnProfile(e) {
  e.preventDefault();
  const stu = appState.students.find((s) => s.id === currentSession?.studentId);
  if (!stu) return;

  const name = document.getElementById('editOwnName').value.trim();
  const dni = document.getElementById('editOwnDni').value.replace(/\D/g, '');
  const orientation = document.getElementById('editOwnOrientation').value;
  const year = document.getElementById('editOwnYear').value;
  const division = document.getElementById('editOwnDivision')?.value || 'A';
  const pass = document.getElementById('editOwnPass').value;

  if (!name || !dni || pass.length < 4) {
    showToast('Completá tus datos y una contraseña de al menos 4 caracteres.', 'error');
    return;
  }

  stu.name = name;
  stu.dni = dni;
  stu.orientation = orientation;
  stu.year = year;
  stu.division = division;
  stu.password = pass;
  currentSession.name = name;

  saveState();
  saveSession(currentSession);
  currentSubView = 'main';
  renderApp();
  showToast('Tus datos y contraseña se actualizaron correctamente.', 'success');
}

// ==========================================================================
// PANEL 2: PROFESORES CONFIRMADOS (BUSCADOR POR NOMBRE / DNI + CARGA DE HORAS)
// ==========================================================================

function renderTeacherWorkspace() {
  const container = document.getElementById('workspaceMainContainer');

  if (currentSubView === 'historial') {
    const allLogs = [];
    appState.students.forEach((stu) => {
      (stu.logs || []).forEach((log) => {
        allLogs.push({
          ...log,
          studentId: stu.id,
          studentName: stu.name,
          studentDni: stu.dni,
          orientation: stu.orientation,
          courseLabel: formatCourseLabel(stu)
        });
      });
    });
    allLogs.sort((a, b) => String(b.date).localeCompare(String(a.date)));

    container.innerHTML = `
      <div class="neu-card">
        <span class="hero-top-badge">REGISTRO DE ACREDITACIONES DOCENTES</span>
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Historial de Horas Cargadas</h2>
        <div class="logs-list">
          ${
            allLogs.length === 0
              ? `<div class="neu-well" style="text-align:center;">No hay horas cargadas todavía.</div>`
              : allLogs
                  .map(
                    (item) => `
                  <div class="log-item ${item.orientation === 'Electromecánica' ? '' : 'alimentacion'}">
                    <div>
                      <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700;">
                        ${escapeHtml(item.studentName)} — <span class="font-mono">DNI ${formatDni(item.studentDni)}</span>
                        <span style="font-weight: 500; color: var(--text-muted);">(${escapeHtml(item.courseLabel)} • ${item.orientation})</span>
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
                        <strong>${escapeHtml(item.place)}:</strong> ${escapeHtml(item.description)}
                      </div>
                      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                        📅 ${formatDateAR(item.date)} • Cargado por: ${escapeHtml(item.teacherName)} (${escapeHtml(item.teacherEmail)})
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.45rem;">
                      <span class="log-item-hours">+${item.hours} HS</span>
                      <button
                        type="button"
                        class="neu-btn neu-btn-danger"
                        style="padding: 0.25rem 0.6rem; font-size: 0.74rem;"
                        onclick="deletePracticeLog('${item.studentId}', '${item.id}')"
                      >
                        Anular
                      </button>
                    </div>
                  </div>
                `
                  )
                  .join('')
          }
        </div>
      </div>
    `;
    return;
  }

  if (!selectedTeacherStudentId || !appState.students.some((s) => s.id === selectedTeacherStudentId)) {
    selectedTeacherStudentId = appState.students[0]?.id || null;
  }

  const todayIso = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="neu-card workspace-header-banner">
      <div>
        <span class="hero-top-badge">PANEL DE PROFESORES • E.P.E.T. N° 4</span>
        <h1 style="font-size: 1.65rem;">Buscador de Alumnos y Carga de Horas</h1>
        <p style="font-size: 0.88rem; color: var(--text-secondary);">
          Buscá al alumno por <strong>Nombre, Apellido o DNI</strong>, seleccionalo y acreditale las horas de Prácticas Profesionalizantes.
        </p>
      </div>
      <span class="neu-pill">
        ${appState.students.length} alumnos en base de datos
      </span>
    </div>

    <section class="neu-card">
      <div style="display: grid; grid-template-columns: 1.8fr 1fr; gap: 1rem; align-items: end;">
        <div>
          <label class="form-label" for="teacherSearchInput">
            1. Buscar Alumno por Nombre, Apellido o DNI
          </label>
          <input
            type="text"
            id="teacherSearchInput"
            class="neu-input"
            placeholder="Escribí apellido, nombre o DNI (ej: Cañicul, Ríos, 46945112)..."
            value="${escapeHtml(teacherSearchQuery)}"
            oninput="handleTeacherSearchInput(this.value)"
          />
        </div>
        <div>
          <label class="form-label" for="teacherOriFilterSelect">Filtrar por Orientación</label>
          <select id="teacherOriFilterSelect" class="neu-select" onchange="handleTeacherOriFilter(this.value)">
            <option value="ALL" ${teacherOrientationFilter === 'ALL' ? 'selected' : ''}>Todas las Orientaciones</option>
            <option value="Electromecánica" ${teacherOrientationFilter === 'Electromecánica' ? 'selected' : ''}>⚙️ Electromecánica</option>
            <option value="Ciencias de la Alimentación" ${teacherOrientationFilter === 'Ciencias de la Alimentación' ? 'selected' : ''}>🧪 Ciencias de la Alimentación</option>
          </select>
        </div>
      </div>

      <div id="teacherSearchResultsContainer" class="teacher-search-results"></div>
    </section>

    <section class="neu-card" id="teacherLoadHoursCard"></section>
  `;

  renderTeacherSearchResults();
  renderTeacherLoadHoursForm(todayIso);
}

function handleTeacherSearchInput(val) {
  teacherSearchQuery = val;
  renderTeacherSearchResults();
}

function handleTeacherOriFilter(val) {
  teacherOrientationFilter = val;
  renderTeacherSearchResults();
}

function renderTeacherSearchResults() {
  const resultsEl = document.getElementById('teacherSearchResultsContainer');
  if (!resultsEl) return;

  const q = teacherSearchQuery.trim().toLowerCase();
  const filtered = appState.students.filter((s) => {
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      String(s.dni).toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q);
    const matchOri = teacherOrientationFilter === 'ALL' || s.orientation === teacherOrientationFilter;
    return matchQ && matchOri;
  });

  if (filtered.length === 0) {
    resultsEl.innerHTML = `
      <div class="neu-well-sm" style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">
        No se encontraron alumnos con "<strong>${escapeHtml(teacherSearchQuery)}</strong>".
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = filtered
    .map((stu) => {
      const hrs = getStudentTotalHours(stu);
      const rem = getStudentRemainingHours(stu);
      const isSelected = stu.id === selectedTeacherStudentId;
      const isElectro = stu.orientation === 'Electromecánica';

      return `
        <div
          class="student-search-card ${isSelected ? 'selected' : ''}"
          onclick="selectStudentForTeacher('${stu.id}')"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.98rem;">
              ${escapeHtml(stu.name)}
            </div>
            <span class="year-tag">${escapeHtml(formatCourseLabel(stu))}</span>
          </div>
          <div class="font-mono" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
            DNI: <strong>${formatDni(stu.dni)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.65rem; gap: 0.4rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: ${isElectro ? 'var(--electro-cyan)' : 'var(--alimentos-emerald)'};">
              ${isElectro ? '⚙️ Electromecánica' : '🧪 Alimentación'}
            </span>
            <span class="neu-pill font-mono" style="padding: 0.22rem 0.65rem; font-size: 0.74rem; color: ${
              hrs >= REQUIRED_HOURS ? 'var(--alimentos-emerald)' : 'var(--text-primary)'
            };">
              ${hrs}/200 hs ${rem > 0 ? `(faltan ${rem})` : '✓'}
            </span>
          </div>
        </div>
      `;
    })
    .join('');
}

function selectStudentForTeacher(studentId) {
  selectedTeacherStudentId = studentId;
  renderTeacherSearchResults();
  const dateVal = document.getElementById('inputPracticeDate')?.value || new Date().toISOString().split('T')[0];
  renderTeacherLoadHoursForm(dateVal);
}

function renderTeacherLoadHoursForm(defaultDate) {
  const card = document.getElementById('teacherLoadHoursCard');
  if (!card) return;

  const stu = appState.students.find((s) => s.id === selectedTeacherStudentId);
  if (!stu) {
    card.innerHTML = `<p style="color: var(--text-secondary);">Seleccioná un alumno arriba para cargarle horas.</p>`;
    return;
  }

  const currentHours = getStudentTotalHours(stu);
  const remaining = getStudentRemainingHours(stu);

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
      <div>
        <span class="hero-top-badge" style="margin-bottom: 0.2rem;">
          2. CARGAR HORAS AL ALUMNO SELECCIONADO
        </span>
        <h3 style="font-size: 1.35rem;">
          ${escapeHtml(stu.name)} <span class="font-mono" style="font-size: 1rem; color: var(--tech-yellow);">(DNI ${formatDni(stu.dni)})</span>
        </h3>
        <div style="font-size: 0.83rem; color: var(--text-secondary);">
          ${escapeHtml(formatCourseLabel(stu))} • Orientación ${escapeHtml(stu.orientation)} • Gmail: ${escapeHtml(stu.email || 'Cargado manualmente')}
        </div>
      </div>

      <div class="neu-well-sm" style="text-align: right;">
        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">
          Estado Actual
        </div>
        <div class="font-mono" style="font-size: 1.2rem; font-weight: 800; color: var(--mech-orange);">
          ${currentHours} / ${REQUIRED_HOURS} HS
          <span style="font-size: 0.82rem; color: ${remaining === 0 ? 'var(--alimentos-emerald)' : 'var(--tech-yellow)'};">
            (${remaining === 0 ? '¡Certificado listo!' : `faltan ${remaining} hs`})
          </span>
        </div>
      </div>
    </div>

    <form onsubmit="handleAddHoursSubmit(event)">
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label" for="inputHoursAmount">Cantidad de Horas Realizadas *</label>
          <input
            type="number"
            id="inputHoursAmount"
            class="neu-input font-mono"
            min="1"
            max="200"
            placeholder="Ej: 15"
            required
          />
          <div style="display: flex; gap: 0.45rem; margin-top: 0.55rem; flex-wrap: wrap;">
            <button type="button" class="neu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="document.getElementById('inputHoursAmount').value=4">+4 hs</button>
            <button type="button" class="neu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="document.getElementById('inputHoursAmount').value=8">+8 hs</button>
            <button type="button" class="neu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="document.getElementById('inputHoursAmount').value=15">+15 hs</button>
            <button type="button" class="neu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="document.getElementById('inputHoursAmount').value=25">+25 hs</button>
            <button type="button" class="neu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="document.getElementById('inputHoursAmount').value=40">+40 hs</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="inputPracticeDate">Fecha de Realización *</label>
          <input type="date" id="inputPracticeDate" class="neu-input" value="${defaultDate}" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="inputPracticePlace">Institución / Empresa / Entorno Formativo *</label>
        <input
          type="text"
          id="inputPracticePlace"
          class="neu-input"
          placeholder="Ej: EPEN Junín de los Andes / Laboratorio Bromatología / Taller EPET N° 4"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="inputPracticeDesc">Descripción de Actividades Realizadas *</label>
        <textarea
          id="inputPracticeDesc"
          class="neu-textarea"
          rows="2"
          placeholder="Detalle técnico de las tareas desarrolladas por el alumno..."
          required
        ></textarea>
      </div>

      <button type="submit" class="neu-btn neu-btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem;">
        Acreditar Horas a ${escapeHtml(stu.name)}
      </button>
    </form>
  `;
}

function handleAddHoursSubmit(e) {
  e.preventDefault();
  if (!currentSession || currentSession.role !== 'profesor') return;

  const stu = appState.students.find((s) => s.id === selectedTeacherStudentId);
  if (!stu) return;

  const hours = Number(document.getElementById('inputHoursAmount').value);
  const date = document.getElementById('inputPracticeDate').value;
  const place = document.getElementById('inputPracticePlace').value.trim();
  const description = document.getElementById('inputPracticeDesc').value.trim();

  if (!hours || hours <= 0) {
    showToast('Ingresá una cantidad de horas válida.', 'error');
    return;
  }

  const prevHours = getStudentTotalHours(stu);
  stu.logs.unshift({
    id: 'log-' + Date.now(),
    date,
    hours,
    place,
    description,
    teacherName: currentSession.name,
    teacherEmail: currentSession.email
  });

  const newTotal = getStudentTotalHours(stu);
  saveState();
  renderApp();

  if (prevHours < REQUIRED_HOURS && newTotal >= REQUIRED_HOURS) {
    showToast(`¡${stu.name} alcanzó ${newTotal} hs y desbloqueó su Certificado PDF!`, 'success');
  } else {
    showToast(`Se cargaron +${hours} hs a ${stu.name} (Total: ${newTotal} / 200 hs).`, 'success');
  }
}

function deletePracticeLog(studentId, logId) {
  if (!currentSession || (currentSession.role !== 'profesor' && currentSession.role !== 'coordinador')) return;
  const stu = appState.students.find((s) => s.id === studentId);
  if (!stu) return;
  stu.logs = stu.logs.filter((l) => l.id !== logId);
  saveState();
  renderApp();
  showToast('Registro de horas anulado.', 'success');
}

// ==========================================================================
// PANEL 3: COORDINADOR / DIRECTOR
// - Confirmar Profesores en Standby + Pre-autorizar Gmails
// - Buscador de Alumnos + Registrar Alumnos a mano (con División A, B, C)
// - Cambiar Usuario/Contraseña de Coordinación (sin botón de restaurar fábrica)
// ==========================================================================

function renderCoordinatorWorkspace() {
  const container = document.getElementById('workspaceMainContainer');

  // Sub-vista 2: Buscador de Alumnos + Alta Manual de Alumnos por el Coordinador
  if (currentSubView === 'alumnos') {
    container.innerHTML = `
      <div class="neu-card workspace-header-banner">
        <div>
          <span class="hero-top-badge">GESTIÓN Y BÚSQUEDA DE ALUMNOS • COORDINACIÓN</span>
          <h1 style="font-size: 1.65rem;">Buscador de Alumnos y Registro Manual</h1>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">
            Buscá alumnos por Nombre, Apellido, DNI o curso (4° a 6° Año, Divisiones A, B y C) o registralos manualmente.
          </p>
        </div>
        <button type="button" class="neu-btn" onclick="exportBackupCSV()">
          📥 Exportar Padrón CSV
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 1.6rem; align-items: start;">
        <!-- Alta Manual de Alumno por el Coordinador (con División A, B, C) -->
        <section class="neu-card">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem;">Registrar Alumno a Mano</h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.15rem;">
            Cargá al alumno para que ya figure en la base de datos. Cuando el alumno se registre con su DNI, su cuenta se vinculará automáticamente.
          </p>

          <form onsubmit="handleCoordinatorManualStudentSubmit(event)">
            <div class="form-group">
              <label class="form-label" for="manualStuName">Nombre y Apellido del Alumno *</label>
              <input type="text" id="manualStuName" class="neu-input" placeholder="Ej: Valentín Nahuelpan" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="manualStuDni">DNI (sin puntos) *</label>
              <input type="text" id="manualStuDni" class="neu-input font-mono" placeholder="Ej: 47812903" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="manualStuOri">Orientación *</label>
              <select id="manualStuOri" class="neu-select" required>
                <option value="Electromecánica">⚙️ Electromecánica</option>
                <option value="Ciencias de la Alimentación">🧪 Ciencias de la Alimentación</option>
              </select>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="manualStuYear">Año *</label>
                <select id="manualStuYear" class="neu-select" required>
                  <option value="4° Año">4° Año</option>
                  <option value="5° Año">5° Año</option>
                  <option value="6° Año" selected>6° Año</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="manualStuDivision">División *</label>
                <select id="manualStuDivision" class="neu-select" required>
                  <option value="A">División A</option>
                  <option value="B">División B</option>
                  <option value="C">División C</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="manualStuEmail">Gmail (Opcional)</label>
                <input type="email" id="manualStuEmail" class="neu-input" placeholder="Opcional" />
              </div>
              <div class="form-group">
                <label class="form-label" for="manualStuPass">Clave Inicial (Opcional)</label>
                <input type="password" id="manualStuPass" class="neu-input" placeholder="Opcional" />
              </div>
            </div>

            <button type="submit" class="neu-btn neu-btn-primary" style="width: 100%; padding: 0.9rem;">
              + Guardar Alumno en la Base de Datos
            </button>
          </form>
        </section>

        <!-- Buscador y Padrón de Alumnos Registrados -->
        <section class="neu-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-size: 1.2rem;">Buscar en el Padrón de Alumnos</h3>
            <span class="neu-pill" id="coordStudentsCountPill">${appState.students.length} alumnos</span>
          </div>

          <!-- Barra de Búsqueda y Filtros para el Coordinador -->
          <div class="neu-well-sm" style="margin-bottom: 1.15rem;">
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <input
                type="text"
                id="coordSearchStudentInput"
                class="neu-input"
                placeholder="🔍 Buscar alumno por Nombre, Apellido, DNI o Gmail..."
                value="${escapeHtml(coordStudentSearchQuery)}"
                oninput="handleCoordStudentSearch(this.value)"
              />
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 0.65rem;">
              <select class="neu-select" onchange="handleCoordFilterOri(this.value)">
                <option value="ALL" ${coordStudentOriFilter === 'ALL' ? 'selected' : ''}>Todas las Orientaciones</option>
                <option value="Electromecánica" ${coordStudentOriFilter === 'Electromecánica' ? 'selected' : ''}>⚙️ Electromecánica</option>
                <option value="Ciencias de la Alimentación" ${coordStudentOriFilter === 'Ciencias de la Alimentación' ? 'selected' : ''}>🧪 Alimentación</option>
              </select>

              <select class="neu-select" onchange="handleCoordFilterYear(this.value)">
                <option value="ALL" ${coordStudentYearFilter === 'ALL' ? 'selected' : ''}>Todos los Años</option>
                <option value="4° Año" ${coordStudentYearFilter === '4° Año' ? 'selected' : ''}>4° Año</option>
                <option value="5° Año" ${coordStudentYearFilter === '5° Año' ? 'selected' : ''}>5° Año</option>
                <option value="6° Año" ${coordStudentYearFilter === '6° Año' ? 'selected' : ''}>6° Año</option>
              </select>

              <select class="neu-select" onchange="handleCoordFilterDiv(this.value)">
                <option value="ALL" ${coordStudentDivFilter === 'ALL' ? 'selected' : ''}>Todas las Div. (A/B/C)</option>
                <option value="A" ${coordStudentDivFilter === 'A' ? 'selected' : ''}>División A</option>
                <option value="B" ${coordStudentDivFilter === 'B' ? 'selected' : ''}>División B</option>
                <option value="C" ${coordStudentDivFilter === 'C' ? 'selected' : ''}>División C</option>
              </select>
            </div>
          </div>

          <div id="coordStudentsListContainer" class="logs-list"></div>
        </section>
      </div>
    `;

    renderCoordinatorStudentsList();
    return;
  }

  // Sub-vista 3: Configuración de Credenciales del Coordinador y Certificado PDF (sin botón de restaurar datos)
  if (currentSubView === 'config') {
    container.innerHTML = `
      <div class="neu-card" style="max-width: 740px;">
        <span class="hero-top-badge">SEGURIDAD DEL COORDINADOR Y CERTIFICADO</span>
        <h2 style="font-size: 1.45rem; margin-bottom: 1.1rem;">Credenciales de Coordinación y Autoridades del PDF</h2>

        <form onsubmit="handleSaveCoordinatorConfig(event)">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="cfgCoordUser">Usuario del Coordinador *</label>
              <input type="text" id="cfgCoordUser" class="neu-input" value="${escapeHtml(appState.config.coordUsername)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfgCoordPass">Contraseña del Coordinador *</label>
              <input type="password" id="cfgCoordPass" class="neu-input" value="${escapeHtml(appState.config.coordPassword)}" required />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="cfgDirectorName">Director/a E.P.E.T. N° 4 (Firma PDF)</label>
              <input type="text" id="cfgDirectorName" class="neu-input" value="${escapeHtml(appState.config.directorName)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfgCoordinatorName">Coordinador/a de Prácticas (Firma PDF)</label>
              <input type="text" id="cfgCoordinatorName" class="neu-input" value="${escapeHtml(appState.config.coordinatorName)}" required />
            </div>
          </div>

          <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
            <button type="submit" class="neu-btn neu-btn-primary">
              Guardar Credenciales y Configuración
            </button>
          </div>
        </form>
      </div>
    `;
    return;
  }

  // Sub-vista 1 (Principal): Confirmar Profesores en Standby + Administrar Profesores
  const standbyTeachers = appState.teachers.filter((t) => t.status === 'standby');
  const activeOrOtherTeachers = appState.teachers.filter((t) => t.status !== 'standby');

  container.innerHTML = `
    <div class="neu-card workspace-header-banner">
      <div>
        <span class="hero-top-badge">PANEL DEL COORDINADOR / DIRECTOR • E.P.E.T. N° 4</span>
        <h1 style="font-size: 1.65rem;">Confirmación de Profesores en Standby y Permisos</h1>
        <p style="font-size: 0.88rem; color: var(--text-secondary);">
          Confirmá las solicitudes de los profesores que se registraron en la web o pre-habilitá correos Gmail docentes.
        </p>
      </div>
    </div>

    <section class="neu-card" style="border-left: 4px solid var(--tech-yellow);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span class="hero-top-badge" style="color: var(--tech-yellow); margin-bottom: 0.2rem;">
            ⏳ SOLICITUDES DE PROFESORES EN STANDBY
          </span>
          <h3 style="font-size: 1.25rem;">Profesores Esperando tu Confirmación (${standbyTeachers.length})</h3>
        </div>
      </div>

      ${
        standbyTeachers.length === 0
          ? `<div class="neu-well-sm" style="color: var(--text-secondary); font-size: 0.88rem;">
               No hay solicitudes de profesores en Standby en este momento. Cuando un docente nuevo se registre en el apartado de Profesores con su Gmail y contraseña, aparecerá aquí para que lo confirmes.
             </div>`
          : `<div class="logs-list">
               ${standbyTeachers
                 .map(
                   (t) => `
                   <div class="log-item standby" style="align-items: center;">
                     <div>
                       <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.02rem; color: var(--tech-yellow);">
                         ${escapeHtml(t.name)} — ${escapeHtml(t.email)}
                       </div>
                       <div style="font-size: 0.83rem; color: var(--text-secondary); margin-top: 0.15rem;">
                         Orientación declarada: <strong>${escapeHtml(t.orientation)}</strong> • Registrado el ${formatDateAR(t.addedAt)}
                       </div>
                     </div>

                     <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
                       <button
                         type="button"
                         class="neu-btn neu-btn-success"
                         style="padding: 0.55rem 1rem; font-size: 0.83rem;"
                         onclick="confirmStandbyTeacher('${t.id}')"
                       >
                         ✓ Confirmar Profesor
                       </button>
                       <button
                         type="button"
                         class="neu-btn neu-btn-danger"
                         style="padding: 0.55rem 0.9rem; font-size: 0.83rem;"
                         onclick="deleteTeacherRecord('${t.id}')"
                       >
                         ✕ Rechazar
                       </button>
                     </div>
                   </div>
                 `
                 )
                 .join('')}
             </div>`
      }
    </section>

    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.6rem; align-items: start;">
      <section class="neu-card">
        <h3 style="font-size: 1.18rem; margin-bottom: 0.35rem;">Pre-habilitar / Cargar Profesor</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.15rem;">
          Podés dejar pre-autorizado el Gmail de un docente (con o sin contraseña inicial).
        </p>

        <form onsubmit="handleCoordinatorAddTeacherSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="coordAddProfEmail">Correo Gmail del Profesor *</label>
            <input type="email" id="coordAddProfEmail" class="neu-input" placeholder="profesor@gmail.com" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="coordAddProfName">Nombre y Apellido *</label>
            <input type="text" id="coordAddProfName" class="neu-input" placeholder="Ej: Ing. Marcos Riquelme" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="coordAddProfOri">Orientación</label>
            <select id="coordAddProfOri" class="neu-select">
              <option value="Electromecánica">⚙️ Electromecánica</option>
              <option value="Ciencias de la Alimentación">🧪 Ciencias de la Alimentación</option>
              <option value="Ambas Orientaciones">Ambas Orientaciones</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="coordAddProfPass">Contraseña Inicial (Opcional)</label>
            <input
              type="password"
              id="coordAddProfPass"
              class="neu-input"
              placeholder="Si la dejás vacía, el profesor la crea al registrarse"
            />
          </div>

          <button type="submit" class="neu-btn neu-btn-primary" style="width: 100%; padding: 0.9rem;">
            + Habilitar Profesor
          </button>
        </form>
      </section>

      <section class="neu-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.18rem;">Profesores Habilitados (${activeOrOtherTeachers.length})</h3>
        </div>

        <div class="logs-list">
          ${activeOrOtherTeachers
            .map((t) => {
              const isAct = t.status === 'active';
              const isPre = t.status === 'preapproved';
              return `
                <div class="log-item" style="align-items: center;">
                  <div>
                    <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.95rem;">
                      ${escapeHtml(t.name)} — ${escapeHtml(t.email)}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">
                      ${escapeHtml(t.orientation)}
                    </div>
                    <div style="margin-top: 0.25rem;">
                      <span class="year-tag" style="color: ${
                        isAct ? 'var(--alimentos-emerald)' : isPre ? 'var(--electro-cyan)' : 'var(--danger-crimson)'
                      };">
                        ${
                          isAct
                            ? '● Confirmado y Activo'
                            : isPre
                            ? '● Pre-habilitado (creará clave al registrarse)'
                            : '○ Suspendido'
                        }
                      </span>
                    </div>
                  </div>

                  <div style="display: flex; gap: 0.5rem;">
                    ${
                      isAct
                        ? `<button type="button" class="neu-btn" style="padding: 0.38rem 0.7rem; font-size: 0.75rem;" onclick="setTeacherStatus('${t.id}', 'suspended')">Suspender</button>`
                        : `<button type="button" class="neu-btn neu-btn-success" style="padding: 0.38rem 0.7rem; font-size: 0.75rem;" onclick="setTeacherStatus('${t.id}', 'active')">Activar</button>`
                    }
                    <button type="button" class="neu-btn neu-btn-danger" style="padding: 0.38rem 0.7rem; font-size: 0.75rem;" onclick="deleteTeacherRecord('${t.id}')">Quitar</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </section>
    </div>
  `;
}

// Funciones del Buscador de Alumnos del Coordinador
function handleCoordStudentSearch(val) {
  coordStudentSearchQuery = val;
  renderCoordinatorStudentsList();
}

function handleCoordFilterOri(val) {
  coordStudentOriFilter = val;
  renderCoordinatorStudentsList();
}

function handleCoordFilterYear(val) {
  coordStudentYearFilter = val;
  renderCoordinatorStudentsList();
}

function handleCoordFilterDiv(val) {
  coordStudentDivFilter = val;
  renderCoordinatorStudentsList();
}

function renderCoordinatorStudentsList() {
  const listEl = document.getElementById('coordStudentsListContainer');
  const countPill = document.getElementById('coordStudentsCountPill');
  if (!listEl) return;

  const q = coordStudentSearchQuery.trim().toLowerCase();
  const filtered = appState.students.filter((stu) => {
    const matchQ =
      !q ||
      stu.name.toLowerCase().includes(q) ||
      String(stu.dni).toLowerCase().includes(q) ||
      (stu.email || '').toLowerCase().includes(q);
    const matchOri = coordStudentOriFilter === 'ALL' || stu.orientation === coordStudentOriFilter;
    const matchYear = coordStudentYearFilter === 'ALL' || stu.year === coordStudentYearFilter;
    const matchDiv = coordStudentDivFilter === 'ALL' || (stu.division || 'A') === coordStudentDivFilter;
    return matchQ && matchOri && matchYear && matchDiv;
  });

  if (countPill) {
    countPill.textContent = `${filtered.length} de ${appState.students.length} alumnos`;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="neu-well-sm" style="text-align: center; color: var(--text-secondary);">
        No se encontraron alumnos con esos criterios de búsqueda.
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered
    .map((stu) => {
      const hrs = getStudentTotalHours(stu);
      const completed = hrs >= REQUIRED_HOURS;
      return `
        <div class="log-item ${stu.orientation === 'Electromecánica' ? '' : 'alimentacion'}">
          <div>
            <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.98rem;">
              ${escapeHtml(stu.name)} — <span class="font-mono">DNI ${formatDni(stu.dni)}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">
              <strong>${escapeHtml(formatCourseLabel(stu))}</strong> • ${escapeHtml(stu.orientation)} • Gmail: <strong>${escapeHtml(
        stu.email || 'Pendiente de vincular por el alumno'
      )}</strong>
            </div>
            <div style="margin-top: 0.25rem;">
              <span class="year-tag" style="color: ${stu.password ? 'var(--alimentos-emerald)' : 'var(--tech-yellow)'};">
                ${stu.password ? '🔐 Con contraseña activa' : '⏳ Sin contraseña aún (creará su clave al registrarse)'}
              </span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.45rem;">
            <span class="log-item-hours" style="color: ${completed ? 'var(--alimentos-emerald)' : 'var(--mech-orange)'};">
              ${hrs} / 200 HS
            </span>
            <div style="display: flex; gap: 0.4rem;">
              ${
                completed
                  ? `<button type="button" class="neu-btn neu-btn-success" style="padding: 0.3rem 0.65rem; font-size: 0.74rem;" onclick="downloadCertificatePDF('${stu.id}')">PDF</button>`
                  : ''
              }
              <button type="button" class="neu-btn neu-btn-danger" style="padding: 0.3rem 0.65rem; font-size: 0.74rem;" onclick="deleteStudentRecord('${stu.id}')">Borrar</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function confirmStandbyTeacher(teacherId) {
  const t = appState.teachers.find((item) => item.id === teacherId);
  if (!t) return;
  t.status = 'active';
  saveState();
  renderApp();
  showToast(`Profesor/a ${t.name} (${t.email}) CONFIRMADO. Ya puede iniciar sesión y cargar horas.`, 'success');
}

function setTeacherStatus(teacherId, newStatus) {
  const t = appState.teachers.find((item) => item.id === teacherId);
  if (!t) return;
  t.status = newStatus;
  saveState();
  renderApp();
  showToast(`Estado de ${t.email} actualizado.`, 'success');
}

function deleteTeacherRecord(teacherId) {
  appState.teachers = appState.teachers.filter((item) => item.id !== teacherId);
  saveState();
  renderApp();
  showToast('Registro de profesor eliminado.', 'success');
}

function handleCoordinatorAddTeacherSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('coordAddProfEmail').value.trim().toLowerCase();
  const name = document.getElementById('coordAddProfName').value.trim();
  const orientation = document.getElementById('coordAddProfOri').value;
  const pass = document.getElementById('coordAddProfPass').value;

  const existing = findTeacherByEmail(email);
  if (existing) {
    existing.name = name;
    existing.orientation = orientation;
    if (pass) existing.password = pass;
    existing.status = existing.password ? 'active' : 'preapproved';
  } else {
    appState.teachers.unshift({
      id: 'prof-' + Date.now(),
      email,
      password: pass || '',
      name,
      orientation,
      status: pass ? 'active' : 'preapproved',
      addedAt: new Date().toISOString().split('T')[0]
    });
  }

  saveState();
  renderApp();
  showToast(`Profesor ${name} (${email}) habilitado por Coordinación.`, 'success');
}

function handleCoordinatorManualStudentSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('manualStuName').value.trim();
  const dni = document.getElementById('manualStuDni').value.replace(/\D/g, '');
  const orientation = document.getElementById('manualStuOri').value;
  const year = document.getElementById('manualStuYear').value;
  const division = document.getElementById('manualStuDivision')?.value || 'A';
  const email = document.getElementById('manualStuEmail').value.trim().toLowerCase();
  const pass = document.getElementById('manualStuPass').value;

  if (!name || !dni) {
    showToast('Ingresá el Nombre y Apellido y el DNI del alumno.', 'error');
    return;
  }

  const existing = appState.students.find((s) => s.dni === dni);
  if (existing) {
    showToast('Ya existe un alumno registrado con ese DNI.', 'error');
    return;
  }

  appState.students.unshift({
    id: 'stu-' + Date.now(),
    email: email || '',
    password: pass || '',
    name,
    dni,
    orientation,
    year,
    division,
    registeredAt: new Date().toISOString().split('T')[0],
    logs: []
  });

  saveState();
  renderApp();
  showToast(`Alumno ${name} (${year} "${division}") registrado manualmente.`, 'success');
}

function deleteStudentRecord(studentId) {
  if (!confirm('¿Seguro que deseás eliminar el registro de este alumno?')) return;
  appState.students = appState.students.filter((s) => s.id !== studentId);
  saveState();
  renderApp();
  showToast('Alumno eliminado de la base de datos.', 'success');
}

function handleSaveCoordinatorConfig(e) {
  e.preventDefault();
  appState.config.coordUsername = document.getElementById('cfgCoordUser').value.trim() || 'coordinador';
  appState.config.coordPassword = document.getElementById('cfgCoordPass').value || 'epet4';
  appState.config.directorName = document.getElementById('cfgDirectorName').value.trim();
  appState.config.coordinatorName = document.getElementById('cfgCoordinatorName').value.trim();

  saveState();
  renderApp();
  showToast('Usuario, contraseña y autoridades actualizados.', 'success');
}

// ==========================================================================
// Certificado Oficial PDF Listo para Imprimir (200 Horas Cumplidas)
// ==========================================================================

function getCertificateVerificationCode(stu) {
  const base = `${stu.dni}-${stu.id}-${getStudentTotalHours(stu)}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `EPET4-PP-${Math.abs(hash).toString(16).toUpperCase().padStart(6, '0')}`;
}

function openCertificatePreviewModal(studentId) {
  const stu = appState.students.find((s) => s.id === studentId);
  if (!stu) return;

  const totalHours = getStudentTotalHours(stu);
  if (totalHours < REQUIRED_HOURS) {
    showToast(`Aún tenés ${totalHours} hs (se requieren 200 hs).`, 'error');
    return;
  }

  const paper = document.getElementById('certificatePreviewPaper');
  const btnDownload = document.getElementById('btnModalDownloadPdf');
  const title = getOfficialTechnicalTitle(stu.orientation);
  const code = getCertificateVerificationCode(stu);
  const logoSrc = window.EPET4_LOGO_BASE64 || 'logo_epet4.png';
  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  btnDownload.onclick = () => downloadCertificatePDF(stu.id);

  paper.innerHTML = `
    <div class="cert-header">
      <img src="${logoSrc}" alt="Escudo EPET N° 4" />
      <div style="text-align: center; flex: 1;">
        <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: #475569;">
          Provincia del Neuquén • Consejo Provincial de Educación
        </h4>
        <h2 style="font-size: 1.35rem; color: #0f172a; margin: 0.25rem 0;">
          E.P.E.T. N° 4 "GENDARMERÍA NACIONAL"
        </h2>
        <div style="font-size: 0.85rem; color: #334155; font-weight: 600;">
          Junín de los Andes — Ciclo Superior de Educación Secundaria Técnica
        </div>
      </div>
      <div style="text-align: right; font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem; color: #475569;">
        <div><strong>CÓDIGO:</strong> ${code}</div>
        <div><strong>ESTADO:</strong> APROBADO</div>
        <div><strong>HORAS:</strong> ${totalHours} HS RELOJ</div>
      </div>
    </div>

    <div style="text-align: center; line-height: 1.75; font-size: 1.02rem;">
      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 0.84rem; font-weight: 700; letter-spacing: 0.12em; color: #b91c1c; text-transform: uppercase;">
        Certificado Oficial de Acreditación de Prácticas Profesionalizantes
      </div>

      <p style="margin-top: 0.85rem;">
        La Dirección y la Coordinación General de Prácticas Profesionalizantes de la
        <strong>Escuela Provincial de Educación Técnica N° 4 "Gendarmería Nacional"</strong> de la ciudad de
        <strong>Junín de los Andes</strong>, certifican por la presente que el/la estudiante:
      </p>

      <div style="font-size: 1.45rem; font-weight: bold; color: #0f172a; margin: 0.6rem 0; text-transform: uppercase;">
        ${escapeHtml(stu.name)}
      </div>

      <p>
        Titular del <strong>D.N.I. N° ${formatDni(stu.dni)}</strong>, cursante de <strong>${escapeHtml(formatCourseLabel(stu))}</strong>
        del Ciclo Superior en la orientación <strong>${escapeHtml(stu.orientation.toUpperCase())}</strong>,
        ha completado y aprobado satisfactoriamente un total de <strong>${totalHours} (${numberToSpanishWords(totalHours)}) HORAS RELOJ</strong>
        de <strong>Prácticas Profesionalizantes</strong> (exigencia curricular mínima: 200 horas reloj),
        cumpliendo con el requisito obligatorio establecido para la obtención del título de:
      </p>

      <div style="margin: 0.75rem auto; padding: 0.5rem 1rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; display: inline-block; font-weight: bold; color: #1e3a8a;">
        ${escapeHtml(title.toUpperCase())}
      </div>

      <p style="font-size: 0.85rem; color: #475569; margin-top: 0.55rem;">
        Se extiende el presente certificado en Junín de los Andes, Provincia del Neuquén, el ${todayFormatted}.
      </p>
    </div>

    <div class="cert-signatures">
      <div class="cert-sig-line">
        <strong>${escapeHtml(appState.config.coordinatorName)}</strong><br/>
        Coordinador/a de Prácticas Profesionalizantes
      </div>
      <div class="cert-sig-line">
        <strong>SELLO INSTITUCIONAL</strong><br/>
        E.P.E.T. N° 4 — Junín de los Andes
      </div>
      <div class="cert-sig-line">
        <strong>${escapeHtml(appState.config.directorName)}</strong><br/>
        Director/a E.P.E.T. N° 4
      </div>
    </div>
  `;

  document.getElementById('certificatePreviewModal').classList.add('open');
}

function closeCertificateModal() {
  document.getElementById('certificatePreviewModal').classList.remove('open');
}

function downloadCertificatePDF(studentId) {
  const stu = appState.students.find((s) => s.id === studentId);
  if (!stu) return;

  const totalHours = getStudentTotalHours(stu);
  if (totalHours < REQUIRED_HOURS) {
    showToast(`Todavía faltan ${REQUIRED_HOURS - totalHours} hs para habilitar el certificado.`, 'error');
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    openCertificatePreviewModal(studentId);
    window.print();
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 297;
  const pageH = 210;
  const code = getCertificateVerificationCode(stu);
  const title = getOfficialTechnicalTitle(stu.orientation);
  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  doc.setDrawColor(185, 28, 28);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageW - 16, pageH - 16);

  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.6);
  doc.rect(11, 11, pageW - 22, pageH - 22);

  doc.setFillColor(185, 28, 28);
  doc.rect(8, 8, 6, 6, 'F');
  doc.rect(pageW - 14, 8, 6, 6, 'F');
  doc.rect(8, pageH - 14, 6, 6, 'F');
  doc.rect(pageW - 14, pageH - 14, 6, 6, 'F');

  const logoData = processedTransparentLogoDataUrl || window.EPET4_LOGO_BASE64;
  if (logoData && logoData.startsWith('data:image')) {
    try {
      doc.addImage(logoData, 'PNG', 18, 15, 42, 26);
    } catch (_) {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PROVINCIA DEL NEUQUÉN • CONSEJO PROVINCIAL DE EDUCACIÓN', pageW / 2, 21, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('E.P.E.T. N° 4 "GENDARMERÍA NACIONAL"', pageW / 2, 29, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Junín de los Andes — Educación Secundaria Técnica (Ciclo Superior)', pageW / 2, 35, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageW - 68, 15, 52, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text(`CERTIFICADO: ${code}`, pageW - 42, 21, { align: 'center' });
  doc.setTextColor(4, 120, 87);
  doc.text(`TOTAL ACREDITADO: ${totalHours} HS`, pageW - 42, 27, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.text('REQUISITO 200 HS: CUMPLIDO', pageW - 42, 33, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(18, 44, pageW - 18, 44);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(185, 28, 28);
  doc.text('CERTIFICADO DE ACREDITACIÓN DE PRÁCTICAS PROFESIONALIZANTES', pageW / 2, 53, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('La Dirección y la Coordinación de Prácticas Profesionalizantes de la E.P.E.T. N° 4 "Gendarmería Nacional"', pageW / 2, 62, { align: 'center' });
  doc.text('de la localidad de Junín de los Andes, Provincia del Neuquén, dejan constancia que el/la alumno/a:', pageW / 2, 68, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(stu.name.toUpperCase(), pageW / 2, 79, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `D.N.I. N° ${formatDni(stu.dni)}, estudiante de ${stu.year} (División "${
      stu.division || 'A'
    }") del Ciclo Superior en la Orientación ${stu.orientation.toUpperCase()},`,
    pageW / 2,
    88,
    { align: 'center' }
  );
  doc.text(`ha realizado y aprobado satisfactoriamente un total de ${totalHours} (${numberToSpanishWords(totalHours)}) HORAS RELOJ de Prácticas Profesionalizantes,`, pageW / 2, 95, { align: 'center' });
  doc.text('cumpliendo el mínimo reglamentario de 200 (doscientas) horas reloj exigido para acceder al título técnico de:', pageW / 2, 102, { align: 'center' });

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(48, 106, pageW - 96, 10, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text(title.toUpperCase(), pageW / 2, 112.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DETALLE DE ENTORNOS FORMATIVOS Y HORAS ACREDITADAS:', 22, 123);

  let yRow = 128;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  (stu.logs || []).slice(0, 4).forEach((log) => {
    const lineStr = `• ${formatDateAR(log.date)} | ${log.place} (${log.hours} hs) — Avalado por: ${log.teacherName}`;
    doc.text(lineStr.substring(0, 125), 24, yRow);
    yRow += 5;
  });

  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Emitido en Junín de los Andes, Provincia del Neuquén, el ${todayFormatted}.`, pageW / 2, 156, { align: 'center' });

  const sigY = 182;
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.4);

  doc.line(26, sigY, 96, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(appState.config.coordinatorName || 'Coordinador/a de Prácticas', 61, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Coordinación Prácticas Profesionalizantes', 61, sigY + 9, { align: 'center' });

  doc.line(116, sigY, 181, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SELLO DEL ESTABLECIMIENTO', 148.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('E.P.E.T. N° 4 — Junín de los Andes', 148.5, sigY + 9, { align: 'center' });

  doc.line(201, sigY, 271, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(appState.config.directorName || 'Dirección E.P.E.T. N° 4', 236, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Director/a E.P.E.T. N° 4 "Gendarmería Nacional"', 236, sigY + 9, { align: 'center' });

  const safeFileName = stu.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_');

  doc.save(`Certificado_200hs_EPET4_${safeFileName}.pdf`);
  showToast(`Certificado PDF de ${stu.name} descargado y listo para imprimir.`, 'success');
}

// ==========================================================================
// Utilidades
// ==========================================================================

function exportBackupCSV() {
  const rows = [
    ['Alumno', 'DNI', 'Gmail', 'Año', 'División', 'Orientación', 'Horas Acreditadas', 'Horas Faltantes', 'Estado Certificado']
  ];
  appState.students.forEach((s) => {
    const hrs = getStudentTotalHours(s);
    const rem = getStudentRemainingHours(s);
    rows.push([
      `"${s.name.replace(/"/g, '""')}"`,
      s.dni,
      s.email || '',
      s.year,
      s.division || 'A',
      s.orientation,
      hrs,
      rem,
      hrs >= REQUIRED_HOURS ? 'CERTIFICADO HABILITADO' : 'EN CURSO'
    ]);
  });

  const csvContent = '\uFEFF' + rows.map((r) => r.join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Padron_Practicas_Profesionalizantes_EPET4.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Planilla CSV descargada.', 'success');
}

function formatDni(dni) {
  const clean = String(dni || '').replace(/\D/g, '');
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDateAR(isoDate) {
  if (!isoDate) return '-';
  const parts = String(isoDate).split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : isoDate;
}

function numberToSpanishWords(n) {
  if (n === 200) return 'doscientas';
  if (n === 210) return 'doscientas diez';
  if (n === 220) return 'doscientas veinte';
  return String(n);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `neu-toast ${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 4200);
}

window.addEventListener('DOMContentLoaded', () => {
  processLogoTransparency();
  renderApp();
  syncFromServerIfAvailable();
});
