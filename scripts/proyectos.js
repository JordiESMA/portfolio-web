async function fetchJSON(ruta) {
  const res = await fetch(ruta);
  if (!res.ok) throw new Error(`Error cargando ${ruta}`);
  return res.json();
}

async function initProyectosPage() {
  const filtroSelect  = document.getElementById('filtroLenguaje');
  const contenedor    = document.getElementById('proyectos-container');
  const mensajeVacio  = document.getElementById('mensaje-vacio');
  if (!filtroSelect || !contenedor) return;

  let proyectos = [];
  let idiomasData = null;

  try {
    [proyectos, idiomasData] = await Promise.all([
      fetchJSON('../data/proyectos.json'),
      fetchJSON('../data/language.json')
    ]);
  } catch (error) {
    console.error(error);
    return;
  }

  const getIdioma = () => localStorage.getItem('idioma') || 'es';

  function traducir(key, fallback) {
    const dict = idiomasData[getIdioma()];
    return (dict && dict[key]) || fallback || '';
  }

  // Extraer categorías únicas y rellenar el select
  const categorias = [...new Set(proyectos.map(p => p.categoria))].sort();
  filtroSelect.insertAdjacentHTML(
    'beforeend',
    categorias.map(c => `<option value="${c}">${c}</option>`).join('')
  );

  function render() {
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
  }

  filtroSelect.addEventListener('change', render);
  render();
}

document.addEventListener('DOMContentLoaded', initProyectosPage);
