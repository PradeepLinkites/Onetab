import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Loads a string from storage.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
;
  } catch {
    // not sure why this would fail...
    return null;
  }
}

/**
 * Saves a string to storage.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    // return false
    throw new Error("Unable to save to local storage");
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 */
export async function load(key: string): Promise<any | null> {
  try {
    const almostThere = await AsyncStorage.getItem(key)
;
    if (almostThere) {
      return JSON.parse(almostThere);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 */
export async function save(key: string, value: any): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // return false
    throw new Error("Unable to save to local storage");
  }
}

/**
 * Removes something from storage.
 */
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
;
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {}
}