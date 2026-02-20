const CACHE_NAME = 'finanzas-v6'; // Solo tendrás que cambiar este numerito en el futuro

// INSTALACIÓN: Obligamos a instalar la nueva versión sin esperar
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon.png' // Asegúrate de que el nombre del icono sea el que usas
      ]);
    })
  );
});

// ACTIVACIÓN: Borramos la basura vieja y tomamos el control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// FETCH: Servimos desde la caché, y si no está, de internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Si falla todo (sin internet y sin caché) no hacemos nada especial
    })
  );
});
