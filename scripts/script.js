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
