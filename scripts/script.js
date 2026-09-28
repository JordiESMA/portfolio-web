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

const misProyectos = [
  {
    titulo: "Java DragonQuest",
    descripcion: "Un juego RPG de consola basado en la clásica saga.",
    lenguajes: ["Java"],
    link: "https://github.com/JordiESMA"
  },
  {
    titulo: "EA FC 26 Player Search",
    descripcion: "Buscador de jugadores consumiendo una API externa.",
    lenguajes: ["JavaScript", "HTML", "CSS"],
    link: "https://github.com/JordiESMA"
  },
  {
    titulo: "Mini API con Spring",
    descripcion: "Backend robusto para gestión de usuarios.",
    lenguajes: ["Java", "Spring Boot", "SQL"],
    link: "#"
  },
  {
    titulo: "Portfolio Personal",
    descripcion: "Diseño estilo Obsidian oscuro.",
    lenguajes: ["HTML", "CSS", "JavaScript"],
    link: "#"
  }
];

const filtroSelect = document.getElementById("filtroLenguaje");
const contenedor = document.getElementById("proyectos-container");
const mensajeVacio = document.getElementById("mensaje-vacio");

function cargarFiltros() {
  const unicos = [...new Set(misProyectos.flatMap(p => p.lenguajes))].sort();
  filtroSelect.insertAdjacentHTML(
    "beforeend",
    unicos.map(l => `<option value="${l}">${l}</option>`).join("")
  );
}

function renderizar(lista) {
  mensajeVacio.classList.toggle("oculto", lista.length > 0);

  contenedor.innerHTML = lista.map(p => `
    <div class="proyecto">
      <div>
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <div class="tags-container">
          ${p.lenguajes.map(l => `<span class="badge-lang">${l}</span>`).join("")}
        </div>
      </div>
      ${p.link !== "#"
        ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">Ver →</a>`
        : `<span class="badge-construccion">En construcción</span>`}
    </div>
  `).join("");
}

filtroSelect.addEventListener("change", e => {
  const lang = e.target.value;
  renderizar(
    lang === "todos"
      ? misProyectos
      : misProyectos.filter(p => p.lenguajes.includes(lang))
  );
});

cargarFiltros();
renderizar(misProyectos);