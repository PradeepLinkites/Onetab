import * as storage from "./storage";
const ROOT_STATE_STORAGE_KEY = "root";
const DEVICEID_STATE_STORAGE_KEY = "deviceId";
const DEVICE_TOKEN_ID_STATE_STORAGE_KEY = "deviceTokenId";

export async function getFromStorage() {
  let data: any;
  try {
    // load data from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {
      useraAccessToken: null,
      userLogin: null,
      isLoggedIn: false,
      // isPrime: false,
      isPrime: true,
    };
    return data;
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
  }
  // track changes & save to storage
  return data;
}

export async function getDeviceIdFromStorage() {
  let data: any;
  try {
    // load data from storage
    data = (await storage.load(DEVICEID_STATE_STORAGE_KEY)) || {
      deviceId: null,
    };
    return data.deviceId;
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
  }
  // track changes & save to storage
  return data.deviceId;
}

export async function getDeviceTokenToStorage() {
  let data: any;
  try {
    // load data from storage
    data = (await storage.load(DEVICE_TOKEN_ID_STATE_STORAGE_KEY)) || {
      deviceTokenId: null,
    };
    return data.deviceTokenId;
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
  }
  // track changes & save to storage
  return data.deviceTokenId;
}

export async function saveToStorage(value: any) {
  let data: any;
  try {
    // save data to storage
    await storage.save(ROOT_STATE_STORAGE_KEY, value);
  } catch (e) {}
}

export async function saveDeviceIdToStorage(value: any) {
  try {
    // save data to storage
    await storage.save(DEVICEID_STATE_STORAGE_KEY, value);
  } catch (e) {}
}

export async function saveDeviceTokenToStorage(value: any) {
  try {
    // save data to storage
    await storage.save(DEVICE_TOKEN_ID_STATE_STORAGE_KEY, value);
  } catch (e) {}
}
