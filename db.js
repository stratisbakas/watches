// Stockage local (IndexedDB) : les montres et leurs photos restent sur l'appareil.

const DB_NAME = 'ecrin';
const VERSION = 1;
let dbPromise;

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('watches')) db.createObjectStore('watches', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const result = fn(t.objectStore(store));
    t.oncomplete = () => resolve(result && 'result' in result ? result.result : result);
    t.onerror = () => reject(t.error);
  });
}

export const allWatches = () => tx('watches', 'readonly', s => s.getAll());
export const putWatch = w => tx('watches', 'readwrite', s => s.put(w));
export const deleteWatch = id => tx('watches', 'readwrite', s => s.delete(id));

export const getPhoto = async id => (await tx('photos', 'readonly', s => s.get(id)))?.blob;
export const putPhoto = (id, blob) => tx('photos', 'readwrite', s => s.put({ id, blob }));
export const deletePhoto = id => tx('photos', 'readwrite', s => s.delete(id));

export async function clearAll() {
  await tx('watches', 'readwrite', s => s.clear());
  await tx('photos', 'readwrite', s => s.clear());
}

// Demande à iOS de ne pas purger les données.
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {});
}
