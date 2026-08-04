# Portfolio Web

Estructura:
- index.html
- css/index.css
- scripts/script.js
- language.json

## Antes de subirlo
La carpeta `images/` está vacía — copia tu `cv.jpeg` original ahí (la foto no se pudo incluir en este paquete).

## Cómo probarlo en local
No abras `index.html` directamente con doble clic (el `fetch('language.json')` falla por CORS en `file://`).
Usa un servidor local, por ejemplo:

```
npx serve .
```

o con Python:

```
python3 -m http.server
```
