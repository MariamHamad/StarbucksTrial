const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/espresso.jpg",
  "/images/espressoConPanna.jpg",
  "/images/caffeAmericano.jpg",
  "/images/cappuccino.jpg",
  "/images/caffeMisto.jpg",
  "/images/caramelMacciato.jpg",
  "/images/darkChocolateMocha.jpg",
  "/images/whiteChocolateMocha.jpg",
  "/images/peppermintWhiteChocolateMocha.jpg"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});


