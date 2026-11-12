// Busca sempre a versão mais nova e usa a cópia guardada só quando estiver sem internet.
const CACHE = "brasil-presidente-v2";

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
  // Áudio chega em pedaços (Range) e não pode ir para o cache: o navegador cuida dele sozinho.
  if (evento.request.headers.has("range") || evento.request.url.includes("/audio/")) return;
  evento.respondWith(
    fetch(evento.request)
      .then((resposta) => {
        if (resposta.status === 200) {
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
