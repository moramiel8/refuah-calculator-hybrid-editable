/** Shared chunk / stale-bundle recovery (vite dynamic imports, legacy builds, CDN deploy skew). */

export const CHUNK_RECOVERY_KEY = "chunk-load-recovery-attempted";
export const RECOVERY_CACHE_BUSTER_PARAM = "__cv";

let chunkRecoveryAttemptedInMemory = false;

const isLocalDevHost = () => {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
};

const safeSessionGet = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSessionSet = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
};

const safeSessionRemove = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

export const buildRecoveryUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.set(RECOVERY_CACHE_BUSTER_PARAM, Date.now().toString());
  return url.toString();
};

export const clearRecoveryParamFromUrl = () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(RECOVERY_CACHE_BUSTER_PARAM)) return;
  url.searchParams.delete(RECOVERY_CACHE_BUSTER_PARAM);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", next);
};

/** One automatic reload with cache-bust per navigation when chunk load is suspect. */
export const reloadForChunkRecovery = () => {
  // In local dev, cache-bust reload loops are noisy and rarely useful.
  if (isLocalDevHost()) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const alreadyHasRecoveryParam = currentUrl.searchParams.has(RECOVERY_CACHE_BUSTER_PARAM);

  if (chunkRecoveryAttemptedInMemory || safeSessionGet(CHUNK_RECOVERY_KEY) === "1" || alreadyHasRecoveryParam) {
    chunkRecoveryAttemptedInMemory = false;
    safeSessionRemove(CHUNK_RECOVERY_KEY);
    return;
  }

  chunkRecoveryAttemptedInMemory = true;
  safeSessionSet(CHUNK_RECOVERY_KEY, "1");
  window.location.replace(buildRecoveryUrl());
};

/** Call on window "load" so the next in-tab navigation can recover again if needed. */
export const resetChunkRecoverySession = () => {
  chunkRecoveryAttemptedInMemory = false;
  safeSessionRemove(CHUNK_RECOVERY_KEY);
};

export const isChunkLoadError = (value: unknown) => {
  const message =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : "";

  const lower = message.toLowerCase();
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("Failed to load module script") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("is not a valid JavaScript MIME type") ||
    message.includes("ChunkLoadError") ||
    lower.includes("loading chunk") ||
    lower.includes("loading css chunk")
  );
};
