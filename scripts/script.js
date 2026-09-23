async function cargarIdiomas() {
  const respuesta = await fetch('language.json');
  return respuesta.json();
}

function aplicarIdioma(dict) {
  document.querySelectorAll('[data-idioma]').forEach(el => {
    const key = el.getAttribute('data-idioma');
    if (dict[key]) el.textContent = dict[key];
  });
}

(async () => {
  const idiomas = await cargarIdiomas();
  const select = document.getElementById('idiomaSelect');

  const guardado = localStorage.getItem('idioma') || 'es';
  select.value = guardado;
  aplicarIdioma(idiomas[guardado]);
  document.documentElement.lang = guardado;

  select.addEventListener('change', () => {
    const lang = select.value;
    aplicarIdioma(idiomas[lang]);
    document.documentElement.lang = lang;
    localStorage.setItem('idioma', lang);
  });
})();

async function loadSkills() {
  try {
    const response = await fetch("badgesLanguages.json");
    if (!response.ok) throw new Error("Error cargando badgesLanguages.json");
    
    const jsonResponse = await response.json();
    const container = document.getElementById('skills-container');
    
    if (!container) return; 

    const bloquesHtml = jsonResponse
      .filter(c => c.categoria !== "Herramientas")
      .map(categoria => {
        const badgesHtml = categoria.tecnologias
          .map(t => `<img src="${t.badge}" alt="${t.nombre}" class="skill">`)
          .join('');

        return `
          <div class="skills-bloque">
            <h3>${categoria.categoria}</h3>
            <div class="skills-track">
              ${badgesHtml}
            </div>
          </div>
        `;
      })
      .join('');

    container.innerHTML = bloquesHtml;

  } catch (error) {
    console.error("Error al cargar las habilidades:", error);
  }
}

document.addEventListener('DOMContentLoaded', loadSkills);  
