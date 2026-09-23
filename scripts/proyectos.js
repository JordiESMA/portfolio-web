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

const filtroSelect = document.getElementById('filtroLenguaje');
const contenedorProyectos = document.getElementById('proyectos-container');
const mensajeVacio = document.getElementById('mensaje-vacio');

function cargarFiltros() {
  const todosLosLenguajes = misProyectos.flatMap(proyecto => proyecto.lenguajes);
  const lenguajesUnicos = [...new Set(todosLosLenguajes)].sort();

  lenguajesUnicos.forEach(lenguaje => {
    filtroSelect.innerHTML += `<option value="${lenguaje}">${lenguaje}</option>`;
  });
}

function renderizarProyectos(proyectosAMostrar) {
  if (proyectosAMostrar.length === 0) {
    contenedorProyectos.innerHTML = "";
    mensajeVacio.classList.remove("oculto"); // Mostramos el mensaje
    return;
  }

  mensajeVacio.classList.add("oculto"); // Escondemos el mensaje

  const html = proyectosAMostrar.map(proyecto => {
    const tagsHTML = proyecto.lenguajes
      .map(lang => `<span class="badge-construccion">${lang}</span>`)
      .join('');

    return `
      <div class="proyecto">
        <div>
          <h3>${proyecto.titulo}</h3>
          <p>${proyecto.descripcion}</p>
          <div class="tags-container">
            ${tagsHTML}
          </div>
        </div>
        <a href="${proyecto.link}" target="_blank">Ver →</a>
      </div>
    `;
  }).join('');

  contenedorProyectos.innerHTML = html;
}

filtroSelect.addEventListener('change', (evento) => {
  const lenguajeSeleccionado = evento.target.value;

  if (lenguajeSeleccionado === "todos") {
    renderizarProyectos(misProyectos);
  } else {
    const proyectosFiltrados = misProyectos.filter(proyecto => 
      proyecto.lenguajes.includes(lenguajeSeleccionado)
    );
    renderizarProyectos(proyectosFiltrados);
  }
});

cargarFiltros();
renderizarProyectos(misProyectos);