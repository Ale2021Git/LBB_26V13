const CACHE_NAME = 'bbraun-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'
];

// 1. Instalação: Cacheia os arquivos e força a ativação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache instalado com sucesso');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Faz o novo Service Worker assumir o controle imediatamente
});

// 2. Ativação: Limpa caches de versões anteriores (ex: v11, v10)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Começa a controlar as abas abertas imediatamente
});

// 3. Estratégia de Busca: Tenta Rede, se falhar (offline), usa o Cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET (como POST de formulários)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Se a rede falhar, busca no cache
        return caches.match(event.request);
      })
  );
});
