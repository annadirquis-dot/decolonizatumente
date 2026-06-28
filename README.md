# Decoloniza tu Mente

Sitio web estático, responsive y listo para ejecutar sobre el pensamiento de Rufino Sacaca Sánchez.

## Cómo abrir

1. Descomprime el ZIP.
2. Abre `index.html` en tu navegador.
3. Para una vista local más realista, abre una terminal dentro de la carpeta y ejecuta:

```bash
python -m http.server 8000
```

Luego entra a `http://localhost:8000`.

## Cómo editar contenido

- Textos, libros, artículos, videos, recursos, galería y eventos: `assets/js/data.js`.
- Colores, diseño y responsive: `assets/css/styles.css`.
- Imágenes: `assets/img/`.
- Documentos descargables: `assets/docs/`.

## Videos de YouTube

En `assets/js/data.js`, busca la lista `videos` y coloca el ID del video en `youtubeId`.
Ejemplo: para `https://www.youtube.com/watch?v=ABC123`, usa `youtubeId: 'ABC123'`.

## Contacto

El formulario usa `mailto:` para abrir el cliente de correo. Para hacerlo 100% backend, puedes conectarlo a Netlify Forms, Formspree o un servidor propio.

## Derechos de autor

El libro completo cargado como fuente no se incluye dentro del ZIP. Solo se integran imágenes proporcionadas y materiales de apoyo originales creados para este sitio.
