// Busca sempre a versão mais nova e usa a cópia guardada só quando estiver sem internet.
const CACHE = "brasil-presidente-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== CACHE).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET" || !evento.request.url.startsWith(self.location.origin)) return;
  evento.respondWith(
    fetch(evento.request)
      .then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        }
        return resposta;
      })
      .catch(() =>
        caches
          .match(evento.request, { ignoreSearch: true })
          .then((guardada) => guardada ?? Response.error()),
      ),
  );
});
