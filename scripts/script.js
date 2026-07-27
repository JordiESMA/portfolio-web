// Objeto donde guardamos los textos de todos los idiomas una vez cargados
let datos = {};

// Miramos si el usuario ya eligió idioma antes, si no, "es" por defecto
let idiomaActual = localStorage.getItem('idioma') || 'es';

// Cargamos el archivo language.json (contiene las traducciones)
fetch('../../language.json')
  .then(res => res.json()) // convertimos la respuesta a objeto JS
  .then(json => {
    datos = json; // guardamos todo el JSON en la variable datos

    // pintamos el idioma que corresponda nada más cargar la página
    aplicarIdioma(idiomaActual);
  })
  .catch(err => console.error('Error cargando language.json:', err));


// Función que rellena el HTML con los textos del idioma indicado
function aplicarIdioma(idioma) {

  // si ese idioma no existe en el JSON, no hacemos nada
  if (!datos[idioma]) return;

  idiomaActual = idioma;

  // guardamos el idioma elegido para recordarlo la próxima vez
  localStorage.setItem('idioma', idioma);

  // buscamos TODOS los elementos que tengan el atributo data-idioma
  document.querySelectorAll('[data-idioma]').forEach(el => {

    const clave = el.getAttribute('data-idioma'); // ej: "sobreMi_texto"
    const texto = datos[idioma][clave]; // buscamos la traducción de esa clave

    if (texto) el.textContent = texto; // lo escribimos en el elemento
  });

  // actualizamos el select para que muestre el idioma activo
  const selector = document.getElementById('idiomaSelect');
  if (selector) selector.value = idioma;
}


// Cuando el usuario cambia el select de idioma, aplicamos el nuevo idioma
document.getElementById('idiomaSelect')?.addEventListener('change', (e) => {
  aplicarIdioma(e.target.value);
});


// ---- MENÚ HAMBURGUESA ----

const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');

// función para cerrar el menú (quita las clases activas)
function cerrarMenu() {
  sideMenu?.classList.remove('open');
  overlay?.classList.remove('active');
  menuBtn?.classList.remove('open');
}

// al pulsar el botón hamburguesa, abrimos o cerramos el menú
menuBtn?.addEventListener('click', () => {
  sideMenu?.classList.toggle('open');
  overlay?.classList.toggle('active');
  menuBtn?.classList.toggle('open');
});

// si el usuario clica fuera del menú (overlay), lo cerramos
overlay?.addEventListener('click', cerrarMenu);

// al pulsar el botón de cerrar (✕), lo cerramos también
closeMenuBtn?.addEventListener('click', cerrarMenu);