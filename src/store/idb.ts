// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IDBVersionChangeEvent, IDBRequest } from "std:dom";
// TODO: Remove the above duct tape

interface TableConfig {
  name: string;
  keyPath: string;
  autoIncrement: boolean;
}

interface Database<T> {
  getAllRecords: (tableName: string) => Promise<T & { id: number }[]>;
  getRecordById: (tableName: string, id: number) => Promise<T & { id: number }>;
  addRecord: (tableName: string, data: T) => Promise<T & { id: number }>;
  updateRecord: (
    tableName: string,
    id: number,
    newData: Partial<T>
  ) => Promise<T & { id: number }>;
  removeRecord: (tableName: string, id: number) => Promise<void>;
}

export function openDb<T>(
  dbName: string,
  tableConfigs: TableConfig[]
): Database<T> {
  const dbPromise: Promise<IDBDatabase> = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const database = event.target.result;

      for (const tableConfig of tableConfigs) {
        if (!database.objectStoreNames.contains(tableConfig.name)) {
          database.createObjectStore(tableConfig.name, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      }
    };

    request.onsuccess = (event: IDBRequest<IDBDatabase>) => {
      resolve(event.target.result);
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });

  return {
    getAllRecords: async (tableName: string) =>
      getAllRecords(await dbPromise, tableName),
    getRecordById: async (tableName: string, id: number) =>
      getRecordById(await dbPromise, tableName, id),
    addRecord: async <T>(tableName: string, data: T) =>
      addRecord(await dbPromise, tableName, data),
    updateRecord: async <T>(
      tableName: string,
      id: number,
      newData: Partial<T>
    ) => updateRecord<T>(await dbPromise, tableName, id, newData),
    removeRecord: async (tableName: string, id: number) =>
      removeRecord(await dbPromise, tableName, id),
  };
}

async function getAllRecords<T>(
  db: IDBDatabase,
  tableName: string
): Promise<T & { id: number }[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readonly");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.getAll();

    request.onsuccess = (event: IDBRequest<IDBDatabase>) => {
      resolve(event.target.result);
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });
}

async function addRecord<T>(
  db: IDBDatabase,
  tableName: string,
  data: T
): Promise<T & { id: number }> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.add(data);

    request.onsuccess = (event: IDBRequest<IDBDatabase>) => {
      resolve({ ...data, id: event.target.result });
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });
}

async function getRecordById<T>(
  db: IDBDatabase,
  tableName: string,
  id: number
): Promise<T & { id: number }> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readonly");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.get(id);

    request.onsuccess = (event: IDBRequest<IDBDatabase>) => {
      resolve(event.target.result);
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });
}

async function updateRecord<T>(
  db: IDBDatabase,
  tableName: string,
  id: number,
  newData: Partial<T>
): Promise<T & { id: number }> {
  const prevData = await getRecordById<T>(db, tableName, id);
  const updateData = {
    ...prevData,
    ...newData,
  };
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.put(updateData);

    request.onsuccess = (event: IDBRequest<IDBDatabase>) => {
      resolve(event.target.result);
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });
}

async function removeRecord(
  db: IDBDatabase,
  tableName: string,
  id: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: IDBRequest<IDBDatabase>) => {
      reject(event.target.error);
    };
  });
}
