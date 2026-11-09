
async function fetchJSON(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error("Error cargando " + ruta);
  }

  return respuesta.json();
}

// Guardamos los idiomas y la función de actualizar proyectos
let idiomasData = null;
let renderProyectos = null;


// -------------------- IDIOMA --------------------

function getIdioma() {
  return localStorage.getItem('idioma') || 'es';
}

function traducir(key, fallback) {
  if (!idiomasData) return fallback || '';

  const idioma = idiomasData[getIdioma()];

  return idioma[key] || fallback || '';
}

async function initIdioma() {
  const select = document.getElementById('idiomaSelect');

  if (!select) return;

  idiomasData = await fetchJSON('data/language.json');

  select.value = getIdioma();

  function cambiarIdioma() {
    const idioma = select.value;

    localStorage.setItem('idioma', idioma);

    document.documentElement.lang = idioma;

    const textos = idiomasData[idioma];

    document.querySelectorAll('[data-idioma]').forEach(elemento => {
      const clave = elemento.getAttribute('data-idioma');

      if (textos[clave]) {
        elemento.textContent = textos[clave];
      }
    });

    if (renderProyectos) {
      renderProyectos();
    }
  }

  cambiarIdioma();

  select.addEventListener('change', cambiarIdioma);
}


// -------------------- HABILIDADES --------------------

async function loadSkills() {
  const container = document.getElementById('skills-container');

  if (!container) return;

  try {
    const categorias = await fetchJSON('data/badgesLanguages.json');

    container.innerHTML = '';

    categorias.forEach(categoria => {
      const tecnologias = categoria.tecnologias;

      container.innerHTML += `
        <div class="skills-bloque">
          <h3>${categoria.categoria}</h3>

          <div class="skills-track">
            ${tecnologias.map(tecnologia => `
              <img
                src="${tecnologia.badge}"
                alt="${tecnologia.nombre}"
                class="skill"
              >
            `).join('')}
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error('Error cargando las habilidades:', error);
  }
}


// -------------------- PROYECTOS --------------------

async function initProyectos() {
  const filtroSelect = document.getElementById('filtroLenguaje');
  const contenedor = document.getElementById('proyectos-container');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  if (!filtroSelect || !contenedor) return;

  try {
    const proyectos = await fetchJSON('data/proyectos.json');

    // Crear las opciones del filtro
    const categorias = [...new Set(proyectos.map(p => p.categoria))].sort();

    filtroSelect.innerHTML = '<option value="todos">Todos</option>';

    categorias.forEach(categoria => {
      filtroSelect.innerHTML += `
        <option value="${categoria}">${categoria}</option>
      `;
    });

    // Mostrar los proyectos
    renderProyectos = function() {
      const filtro = filtroSelect.value;

      const lista = filtro === 'todos'
        ? proyectos
        : proyectos.filter(p => p.categoria === filtro);

      if (mensajeVacio) {
        mensajeVacio.classList.toggle('oculto', lista.length > 0);
      }

      contenedor.innerHTML = lista.map(proyecto => {
        const descripcion = traducir(
          proyecto.descripcionKey,
          proyecto.descripcionFallback
        );

        const estado = traducir(
          proyecto.estadoKey,
          proyecto.estadoFallback
        );

        const construccion = proyecto.estadoTipo === 'construccion';

        return `
          <div class="proyecto ${construccion ? 'proyecto-construccion' : ''}">
            <div>
              <h3>
                ${proyecto.nombre}
                <span class="badge-estado badge-${proyecto.estadoTipo}">
                  ${estado}
                </span>
              </h3>

              <p>${descripcion}</p>

              <div class="tags-container">
                ${proyecto.tecnologias.map(tecnologia => `
                  <img
                    src="${tecnologia.badge}"
                    alt="${tecnologia.nombre}"
                    class="badge-tech"
                  >
                `).join('')}
              </div>
            </div>

            <a href="${proyecto.githubUrl}" target="_blank" rel="noopener noreferrer">
              GitHub →
            </a>
          </div>
        `;
      }).join('');
    };

    filtroSelect.addEventListener('change', renderProyectos);

    renderProyectos();

  } catch (error) {
    console.error('Error cargando los proyectos:', error);
  }
}


// -------------------- INICIO --------------------

document.addEventListener('DOMContentLoaded', async function() {
  await initIdioma();
  await initProyectos();
  await loadSkills();
});
