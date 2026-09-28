async function fetchJSON(ruta) {
  const res = await fetch(ruta);
  if (!res.ok) throw new Error(`Error cargando ${ruta}`); // fetch no falla solo con 404
  return res.json();
}

let renderProyectos = null; // se rellena solo si la página tiene proyectos

/* ---------- IDIOMA ---------- */
function aplicarIdioma(dict) {
  if (!dict) return;
  document.querySelectorAll('[data-idioma]').forEach(el => {
    const key = el.getAttribute('data-idioma');
    if (dict[key]) el.textContent = dict[key];
  });
}

async function initIdioma() {
  const select = document.getElementById('idiomaSelect');
  if (!select) return; // si la página no tiene select, salimos

  const idiomas = await fetchJSON('data/language.json');
  const guardado = localStorage.getItem('idioma') || 'es'; // || = valor por defecto

  select.value = guardado;
  aplicarIdioma(idiomas[guardado]);
  document.documentElement.lang = guardado;

  select.addEventListener('change', () => {
    const lang = select.value;
    aplicarIdioma(idiomas[lang]);
    document.documentElement.lang = lang;
    localStorage.setItem('idioma', lang);
    if (renderProyectos) renderProyectos(); // repintamos con el nuevo idioma
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
  if (!filtroSelect || !contenedor) return; // en otras páginas no hace nada

  let proyectos = [];
  try {
    proyectos = await fetchJSON('data/proyectos.json');
  } catch (error) {
    console.error(error);
    return;
  }

  const idioma = () => localStorage.getItem('idioma') || 'es';

  // flatMap aplana, Set quita duplicados, [...] lo vuelve array
  const unicos = [...new Set(proyectos.flatMap(p => p.lenguajes))].sort();

  // añade las opciones sin recrear el select entero
  filtroSelect.insertAdjacentHTML(
    'beforeend',
    unicos.map(l => `<option value="${l}">${l}</option>`).join('')
  );

  renderProyectos = () => {
    const lang = filtroSelect.value;
    const lista = lang === 'todos'
      ? proyectos
      : proyectos.filter(p => p.lenguajes.includes(lang));

    // toggle: pone la clase si es true, la quita si es false
    mensajeVacio.classList.toggle('oculto', lista.length > 0);

    contenedor.innerHTML = lista.map(p => `
      <div class="proyecto">
        <div>
          <h3>${p.titulo}</h3>
          <p>${p.descripcion[idioma()] ?? p.descripcion.es}</p> <!-- ?? = si no hay traducción, español -->
          <div class="tags-container">
            ${p.lenguajes.map(l => `<span class="badge-lang">${l}</span>`).join('')}
          </div>
        </div>
        ${p.link !== '#'
          ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">Ver →</a>`
          : `<span class="badge-construccion">En construcción</span>`}
      </div>
    `).join('');
  };

  filtroSelect.addEventListener('change', renderProyectos);
  renderProyectos();
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  await initProyectos(); // primero, para que renderProyectos ya exista
  await initIdioma();
  loadSkills();
});