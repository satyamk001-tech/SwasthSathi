import { SEED_MEMBERS, SEED_MEDICATIONS, SEED_VITALS, SEED_LAB_REPORTS, SEED_APPOINTMENTS } from '../data/seedData';

let _db: IDBDatabase | null = null;

export const DB_NAME = 'SwasthSathiIndianV2';
export const DB_VERSION = 1;

export const STORES = [
  'members',
  'medications',
  'med_logs',
  'lab_reports',
  'appointments',
  'drug_logs',
  'symptom_logs',
  'chat_history',
  'vitals'
] as const;

export type StoreName = typeof STORES[number];

export const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (_db) return resolve(_db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      STORES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const idb = {
  put: async <T extends { id: string }>(storeName: StoreName, obj: T): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put({ ...obj, _ts: (obj as any)._ts || Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  get: async <T>(storeName: StoreName, id: string): Promise<T | null> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  all: async <T>(storeName: StoreName): Promise<T[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []) as T[]);
      req.onerror = () => reject(req.error);
    });
  },

  del: async (storeName: StoreName, id: string): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  clear: async (storeName: StoreName): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

export async function seedInitialData(force = false): Promise<void> {
  const existingMembers = await idb.all('members');
  if (existingMembers.length > 0 && !force) {
    return;
  }

  for (const m of SEED_MEMBERS) await idb.put('members', m);
  for (const med of SEED_MEDICATIONS) await idb.put('medications', med);
  for (const v of SEED_VITALS) await idb.put('vitals', v);
  for (const lr of SEED_LAB_REPORTS) await idb.put('lab_reports', lr);
  for (const ap of SEED_APPOINTMENTS) await idb.put('appointments', ap);
}
