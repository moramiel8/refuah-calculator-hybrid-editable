import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { reloadForChunkRecovery } from "./chunkRecovery";
import { isChunkLoadError } from "./chunkRecovery";

type LazyModule<T extends ComponentType<any>> = { default: T };

function resolveDefaultExport<T extends ComponentType<any>>(
  mod: unknown,
  label: string
): LazyModule<T> | null {
  if (!mod || typeof mod !== "object") return null;
  const rec = mod as Record<string, unknown>;

  if (rec.default && typeof rec.default === "function") {
    return { default: rec.default as T };
  }

  const exact = rec[label];
  if (typeof exact === "function") {
    return { default: exact as T };
  }

  const withoutPage = label.endsWith("Page") ? label.slice(0, -4) : label;
  if (withoutPage && typeof rec[withoutPage] === "function") {
    return { default: rec[withoutPage] as T };
  }

  const firstFunctionExport = Object.values(rec).find((v) => typeof v === "function");
  if (firstFunctionExport) {
    return { default: firstFunctionExport as T };
  }

  return null;
}

async function loadLazyModule<T extends ComponentType<any>>(
  loader: () => Promise<LazyModule<T>>,
  label: string
): Promise<LazyModule<T>> {
  let lastError: unknown = null;

  try {
    const mod = await loader();
    const resolved = resolveDefaultExport<T>(mod, label);
    if (resolved) return resolved;
  } catch (err) {
    lastError = err;
    // First load can fail during deploy skew / stale chunk windows.
    if (!(err instanceof Error) || !err.message.includes("default export")) {
      await new Promise((r) => setTimeout(r, 80));
      try {
        const modRetry = await loader();
        const resolvedRetry = resolveDefaultExport<T>(modRetry, label);
        if (resolvedRetry) return resolvedRetry;
      } catch (retryErr) {
        lastError = retryErr;
        // handled by recovery below
      }
    }
  }

  // Transient network / legacy chunk races — one quick retry before treating as stale deploy.
  await new Promise((r) => setTimeout(r, 50));
  try {
    const mod = await loader();
    const resolved = resolveDefaultExport<T>(mod, label);
    if (resolved) return resolved;
  } catch (err) {
    lastError = err;
    // handled below via one-shot recovery + throw
  }

  const defaultExportError = new Error(`Lazy module "${label}" did not provide a default export`);
  const shouldRecover =
    isChunkLoadError(lastError) ||
    isChunkLoadError(defaultExportError);

  if (shouldRecover) {
    reloadForChunkRecovery();
    throw defaultExportError;
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw defaultExportError;
}

export function safeLazy<T extends ComponentType<any>>(
  loader: () => Promise<LazyModule<T>>,
  label: string
): LazyExoticComponent<T> {
  return lazy(() => loadLazyModule(loader, label));
}
