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
  try {
    proyectos = await fetchJSON('../data/proyectos.json');
  } catch (error) {
    console.error(error);
    return;
  }

  // Extraer lenguajes únicos y rellenar el select
  const unicos = [...new Set(proyectos.flatMap(p => p.lenguajes))].sort();
  filtroSelect.insertAdjacentHTML(
    'beforeend',
    unicos.map(l => `<option value="${l}">${l}</option>`).join('')
  );

  function render() {
    const lang = filtroSelect.value;
    const lista = lang === 'todos'
      ? proyectos
      : proyectos.filter(p => p.lenguajes.includes(lang));

    mensajeVacio.classList.toggle('oculto', lista.length > 0);

    // Usar idioma guardado o español por defecto
    const idioma = localStorage.getItem('idioma') || 'es';

    contenedor.innerHTML = lista.map(p => `
      <div class="proyecto">
        <div>
          <h3>${p.titulo}</h3>
          <p>${p.descripcion[idioma] ?? p.descripcion.es}</p>
          <div class="tags-container">
            ${p.lenguajes.map(l => `<span class="badge-lang">${l}</span>`).join('')}
          </div>
        </div>
        ${p.link !== '#'
          ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">Ver →</a>`
          : `<span class="badge-construccion">En construcción</span>`}
      </div>
    `).join('');
  }

  filtroSelect.addEventListener('change', render);
  render();
}

document.addEventListener('DOMContentLoaded', initProyectosPage);
