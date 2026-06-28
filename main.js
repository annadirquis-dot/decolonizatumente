/* Interactividad principal del sitio Decoloniza tu Mente */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const data = window.siteData;

document.addEventListener('DOMContentLoaded', () => {
  setRandomThought();
  renderBooks();
  renderReflections();
  renderArticles();
  renderVideos();
  renderResources();
  renderEvents();
  renderGallery();
  renderSources();
  initNavigation();
  initTimeline();
  initScrollReveal();
  initContactForm();
  initBackToTop();
});

function setRandomThought() {
  const target = $('#dailyThoughtText');
  const thoughts = data.thoughts;
  target.textContent = thoughts[Math.floor(Math.random() * thoughts.length)];
}

function tagList(tags = []) {
  return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

function renderBooks() {
  const container = $('#booksGrid');
  container.innerHTML = data.books.map((book, index) => `
    <article class="book-card reveal" style="--delay:${index * 70}ms">
      <div class="book-cover"><img src="${book.image}" alt="Portada de ${book.title}" loading="lazy"></div>
      <div class="book-content">
        <p class="eyebrow">${book.year} · ${book.isbn}</p>
        <h3>${book.title}</h3>
        <p class="subtitle">${book.subtitle}</p>
        <p>${book.description}</p>
        <div class="tags">${tagList(book.tags)}</div>
        <button class="link-button" data-modal="book" data-index="${index}">Leer más</button>
      </div>
    </article>
  `).join('');
  $$('[data-modal="book"]').forEach(btn => btn.addEventListener('click', () => openBookModal(+btn.dataset.index)));
}

function openBookModal(index) {
  const book = data.books[index];
  openModal(`
    <div class="modal-book">
      <img src="${book.image}" alt="Portada de ${book.title}">
      <div>
        <p class="eyebrow">${book.year} · ISBN: ${book.isbn}</p>
        <h3>${book.title}</h3>
        <p class="subtitle">${book.subtitle}</p>
        <p>${book.details}</p>
        <div class="tags">${tagList(book.tags)}</div>
        <a class="btn btn-small" href="${book.source}" target="_blank" rel="noopener">Ver fuente</a>
      </div>
    </div>
  `);
}

function renderReflections() {
  $('#reflectionsGrid').innerHTML = data.reflections.map((item, i) => `
    <article class="reflection-card reveal" style="--delay:${i * 60}ms">
      <span>${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderArticles() {
  const list = $('#articlesGrid');
  list.innerHTML = data.articles.map((article, index) => `
    <article class="article-card reveal" style="--delay:${index * 70}ms">
      <img src="${article.image}" alt="${article.title}" loading="lazy">
      <div>
        <p class="eyebrow">${formatDate(article.date)} · ${article.category} · ${article.read}</p>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <button class="link-button" data-modal="article" data-index="${index}">Leer artículo</button>
      </div>
    </article>
  `).join('');
  $$('[data-modal="article"]').forEach(btn => btn.addEventListener('click', () => openArticleModal(+btn.dataset.index)));
}

function openArticleModal(index) {
  const a = data.articles[index];
  openModal(`
    <article class="modal-article">
      <img src="${a.image}" alt="${a.title}">
      <p class="eyebrow">${formatDate(a.date)} · ${a.category} · ${a.read}</p>
      <h3>${a.title}</h3>
      <p>${a.content}</p>
    </article>
  `);
}

function renderVideos() {
  $('#videosGrid').innerHTML = data.videos.map((video, i) => {
    const iframe = video.youtubeId
      ? `<iframe src="https://www.youtube.com/embed/${video.youtubeId}" title="${video.title}" loading="lazy" allowfullscreen></iframe>`
      : `<div class="video-placeholder" style="background-image:linear-gradient(180deg, rgba(31,24,17,.22), rgba(31,24,17,.85)), url('${video.image}')"><span>Insertar video de YouTube</span></div>`;
    return `<article class="video-card reveal" style="--delay:${i * 70}ms">${iframe}<h3>${video.title}</h3><p>${video.description}</p></article>`;
  }).join('');
}

function renderResources() {
  $('#resourcesGrid').innerHTML = data.resources.map((r, i) => `
    <article class="resource-card reveal" style="--delay:${i * 70}ms">
      <span class="resource-type">${r.type}</span>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <a class="link-button" href="${r.file}" download>Descargar</a>
    </article>
  `).join('');
}

function renderEvents() {
  const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  $('#eventsList').innerHTML = events.map((event, i) => {
    const d = new Date(`${event.date}T12:00:00`);
    return `<article class="event-card reveal" style="--delay:${i * 60}ms">
      <div class="event-date"><strong>${String(d.getDate()).padStart(2, '0')}</strong><span>${d.toLocaleDateString('es-BO', { month: 'short' })}</span></div>
      <div><p class="eyebrow">${event.type} · ${event.place}</p><h3>${event.title}</h3><p>${event.description}</p></div>
    </article>`;
  }).join('');
}

function renderGallery() {
  const gallery = $('#galleryGrid');
  gallery.innerHTML = data.gallery.map((img, i) => `
    <button class="gallery-item reveal" style="--delay:${i * 50}ms" data-src="${img.src}" data-alt="${img.alt}">
      <img src="${img.thumb}" alt="${img.alt}" loading="lazy">
    </button>
  `).join('');
  $$('.gallery-item').forEach(item => item.addEventListener('click', () => {
    openModal(`<figure class="lightbox"><img src="${item.dataset.src}" alt="${item.dataset.alt}"><figcaption>${item.dataset.alt}</figcaption></figure>`);
  }));
}

function renderSources() {
  $('#sourcesList').innerHTML = data.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join('');
}

function initNavigation() {
  const toggle = $('#menuToggle');
  const menu = $('#siteMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.site-menu a').forEach(link => link.addEventListener('click', () => menu.classList.remove('is-open')));

  const sections = $$('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = $(`.site-menu a[href="#${entry.target.id}"]`);
      if (entry.isIntersecting && link) {
        $$('.site-menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

function initTimeline() {
  const items = $$('.timeline-item');
  const detail = $('#timelineDetail');
  items.forEach((item, index) => item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    detail.innerHTML = `<p class="eyebrow">${item.dataset.year}</p><h3>${item.dataset.title}</h3><p>${item.dataset.text}</p>`;
  }));
  items[0]?.click();
}

function initScrollReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));
}

function initContactForm() {
  const form = $('#contactForm');
  const status = $('#formStatus');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    if (!name || !email || !message) {
      status.textContent = 'Completa todos los campos para enviar el mensaje.';
      return;
    }
    const subject = encodeURIComponent(`Mensaje desde Decoloniza tu Mente - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
    window.location.href = `mailto:rufosacaca@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = 'Se abrió tu cliente de correo. Revisa el mensaje antes de enviarlo.';
    form.reset();
  });
}

function initBackToTop() {
  const btn = $('#backToTop');
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 700));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function openModal(markup) {
  const modal = $('#modal');
  $('.modal-body', modal).innerHTML = markup;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  $('.modal-close', modal).focus();
}

function closeModal() {
  const modal = $('#modal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

$('#modal')?.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal')) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' });
}
