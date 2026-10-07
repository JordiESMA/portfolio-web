async function fetchJSON(ruta) {
  const res = await fetch(ruta);
  if (!res.ok) throw new Error(`Error cargando ${ruta}`);
  return res.json();
}

let renderProyectos = null;
let idiomasData = null; // guardamos los idiomas globalmente

/* ---------- IDIOMA ---------- */
function getIdioma() {
  return localStorage.getItem('idioma') || 'es';
}

function traducir(key, fallback) {
  if (!idiomasData) return fallback || '';
  const dict = idiomasData[getIdioma()];
  return (dict && dict[key]) || fallback || '';
}

function aplicarIdioma(dict) {
  if (!dict) return;
  document.querySelectorAll('[data-idioma]').forEach(el => {
    const key = el.getAttribute('data-idioma');
    if (dict[key]) el.textContent = dict[key];
  });
}

async function initIdioma() {
  const select = document.getElementById('idiomaSelect');
  if (!select) return;

  idiomasData = await fetchJSON('data/language.json');
  const guardado = getIdioma();

  select.value = guardado;
  aplicarIdioma(idiomasData[guardado]);
  document.documentElement.lang = guardado;

  select.addEventListener('change', () => {
    const lang = select.value;
    aplicarIdioma(idiomasData[lang]);
    document.documentElement.lang = lang;
    localStorage.setItem('idioma', lang);
    if (renderProyectos) renderProyectos();
  });
}

/* ---------- SKILLS ---------- */
async function loadSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  try {
    const data = await fetchJSON('data/badgesLanguages.json');

    container.innerHTML = data
      .filter(c => c.categoria !== 'Herramientas')
      .map(categoria => `
        <div class="skills-bloque">
          <h3>${categoria.categoria}</h3>
          <div class="skills-track">
            ${categoria.tecnologias
              .map(t => `<img src="${t.badge}" alt="${t.nombre}" class="skill">`)
              .join('')}
          </div>
        </div>
      `).join('');
  } catch (error) {
    console.error('Error al cargar las habilidades:', error);
  }
}

/* ---------- PROYECTOS ---------- */
async function initProyectos() {
  const filtroSelect = document.getElementById('filtroLenguaje');
  const contenedor = document.getElementById('proyectos-container');
  const mensajeVacio = document.getElementById('mensaje-vacio');
  if (!filtroSelect || !contenedor) return;

  let proyectos = [];
  try {
    proyectos = await fetchJSON('data/proyectos.json');
  } catch (error) {
    console.error(error);
    return;
  }

  // Extraer categorías únicas para el filtro
  const categorias = [...new Set(proyectos.map(p => p.categoria))].sort();

  filtroSelect.insertAdjacentHTML(
    'beforeend',
    categorias.map(c => `<option value="${c}">${c}</option>`).join('')
  );

  renderProyectos = () => {
    const filtro = filtroSelect.value;
    const lista = filtro === 'todos'
      ? proyectos
      : proyectos.filter(p => p.categoria === filtro);

    mensajeVacio.classList.toggle('oculto', lista.length > 0);

    contenedor.innerHTML = lista.map(p => {
      const desc = traducir(p.descripcionKey, p.descripcionFallback);
      const estado = traducir(p.estadoKey, p.estadoFallback);
      const esConstruccion = p.estadoTipo === 'construccion';

      return `
      <div class="proyecto${esConstruccion ? ' proyecto-construccion' : ''}">
        <div>
          <h3>
            ${p.nombre}
            <span class="badge-estado badge-${p.estadoTipo}">${estado}</span>
          </h3>
          <p>${desc}</p>
          <div class="tags-container">
            ${p.tecnologias.map(t =>
              `<img src="${t.badge}" alt="${t.nombre}" class="badge-tech">`
            ).join('')}
          </div>
        </div>
        <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub →</a>
      </div>`;
    }).join('');
  };

  filtroSelect.addEventListener('change', renderProyectos);
  renderProyectos();
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  await initIdioma();       // primero idiomas, para que traducir() funcione
  await initProyectos();    // luego proyectos que usan traducir()
  loadSkills();
});