
// wrapper de armazenamento usando asyncStorage senão usa o fallback

let AsyncStorageImpl = null;
let asyncAvailable = false;

try {
  // tenta importar a biblioteca padrao
  AsyncStorageImpl = require("@react-native-async-storage/async-storage").default;
  if (AsyncStorageImpl && typeof AsyncStorageImpl.getItem === "function") {
    asyncAvailable = true;
    console.log("storage.js: usando @react-native-async-storage/async-storage");
  }
} catch (e) {
  console.warn(
    "storage.js: AsyncStorage não disponível, usando fallback em memória.",
    e && e.message
  );
}

// fallback na memoria
const memoryStore = {};

async function getRaw(key) {
  if (asyncAvailable) {
    try {
      return await AsyncStorageImpl.getItem(key);
    } catch (e) {
      console.warn("storage.js.getRaw: erro no AsyncStorage.getItem:", e);
      // fallback pra memoria
      return memoryStore[key] || null;
    }
  } else {
    return memoryStore[key] || null;
  }
}

async function setRaw(key, value) {
  if (asyncAvailable) {
    try {
      await AsyncStorageImpl.setItem(key, value);
    } catch (e) {
      console.warn("storage.js.setRaw: erro no AsyncStorage.setItem:", e);
      // salvar na memoria como fallback
      memoryStore[key] = value;
    }
  } else {
    memoryStore[key] = value;
  }
}

// salva a estrutura por mês YYYY-MM
export async function saveActivityRecord(activityId, seconds) {
  const now = new Date();
  const key = `records:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const day = String(now.getDate());

  try {
    const raw = await getRaw(key);
    const parsed = raw ? JSON.parse(raw) : {};

    if (!parsed[day]) parsed[day] = [];

    parsed[day].push({
      activityId,
      seconds,
      timestamp: now.toISOString(),
    });

    await setRaw(key, JSON.stringify(parsed));
    // retorno booleano
    return true;
  } catch (e) {
    console.error("storage.saveActivityRecord falhou", e);
    throw e;
  }
}

export async function getRecordsOfMonth(year, month) {
  const key = `records:${year}-${String(month).padStart(2, "0")}`;
  try {
    const raw = await getRaw(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("storage.getRecordsOfMonth erro:", e);
    return {};
  }
}

// depuração(sendo o a+)
export async function _debug_listAllMemory() {
  return { asyncAvailable, memoryStore };
}
