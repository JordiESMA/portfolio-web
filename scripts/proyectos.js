
async function fetchJSON(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error("Error cargando " + ruta);
  }

  return respuesta.json();
}

async function initProyectosPage() {

  const filtroSelect = document.getElementById('filtroLenguaje');
  const contenedor = document.getElementById('proyectos-container');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  if (!filtroSelect || !contenedor) return;

  let proyectos;
  let idiomasData;

  try {
    proyectos = await fetchJSON('../data/proyectos.json');
    idiomasData = await fetchJSON('../data/language.json');

  } catch (error) {
    console.error('Error cargando los datos:', error);
    return;
  }

  // Obtener el idioma seleccionado
  function getIdioma() {
    return localStorage.getItem('idioma') || 'es';
  }

  // Traducir textos
  function traducir(clave, textoPorDefecto) {
    const idioma = idiomasData[getIdioma()];

    return idioma[clave] || textoPorDefecto || '';
  }

  // Crear las opciones del filtro
  const categorias = [...new Set(proyectos.map(p => p.categoria))].sort();

  filtroSelect.innerHTML = '<option value="todos">Todos</option>';

  categorias.forEach(categoria => {
    filtroSelect.innerHTML += `
      <option value="${categoria}">${categoria}</option>
    `;
  });

  // Mostrar los proyectos
  function render() {

    const filtro = filtroSelect.value;

    const lista = filtro === 'todos'
      ? proyectos
      : proyectos.filter(p => p.categoria === filtro);

    // Mostrar mensaje si no hay proyectos
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

          <a
            href="${proyecto.githubUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub →
          </a>

        </div>
      `;

    }).join('');
  }

  // Actualizar proyectos al cambiar el filtro
  filtroSelect.addEventListener('change', render);

  // Mostrar proyectos al entrar
  render();

}

document.addEventListener('DOMContentLoaded', initProyectosPage);
