const staticBailaBollywood = "baila-site"
const assets = [
  "index.html",
  "/stylesheets/all.min.css",
  "/stylesheets/fontawesome.min.css",
  "/stylesheets/index.css",
  "/stylesheets/login-register.css",
  "/stylesheets/navbar.css",
  "/stylesheets/styles.css",
  "/stylesheets/swiper.min.css",
  "/html/dashboard.html",
  "/html/login.html",
  "/html/recover-password.html",
  "/html/register.html",
  "/scripts/all.min.js",
  "/scripts/swiper.min.js",
  "/scripts/fontawesome.min.js",
  "/scripts/redirect-to-forgot-pass.js",
  "/scripts/spanish-to-english-translate.js",
  "/scripts/sticky-navbar.js",
  "/scripts/swiper.min.js",
  "/images/chand-sifarish.png",
  "/images/dance-indian.png",
  "/images/dil-hi-toh-hai.png",
  "/images/duji-vaari-pyaar.png",
  "/images/dummy-image.png",
  "/images/founder-sir.png",
  "/images/header-image-1.png",
  "/images/jaan-nisar.png",
  "/images/kadar.png",
  "/images/kalank.png",
  "/images/khairiyat.png",
  "/images/khamoshiyan.png",
  "/images/kuch-dino-se.png",
  "/images/la-musica.jpeg",
  "/images/logo_white.png",
  "/images/mann-bharya.png",
  "/images/medium-article.jpeg",
  "/images/namaste-bollywood-medium.jpeg",
  "/images/navbar-toggler-icon.png",
  "/images/painting-1.jpg",
  "/images/painting-2.jpg",
  "/images/painting-3.jpg",
  "/images/painting-4.jpg",
  "/images/red-forest-bg.jpg",
  "/images/sapna-jahan.png",
  "/images/section-background.jpg",
  "/images/Spanish-bolo-natraj-transparent.png",
  "/images/spanish-bolo.png",
  "/images/spanish-man.gif",
  "/images/tu-haqeqat.png",
  "/images/tu-har-lamha.png",
  "/images/video-frame-img.jpeg",
  "/images/zehnaseeb.png",
  "/images/zero.png",
  "/images/video-frame-img.jpeg",
  "/images/baila-bollywood-transparent-white.png",
  "/scripts/spanish-to-english-translate.js",
  "/scripts/internal-scroll-to-links.js",
  "/scripts/internal-scroll-to-links.js"

]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticBailaBollywood).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })