import * as Sentry from "@sentry/react";
import { isChunkLoadError } from "./chunkRecovery";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
const SENTRY_RELEASE = import.meta.env.VITE_APP_VERSION;
const SESSION_MARKER_KEY = "sentry:session-pending";
const LAST_ROUTE_KEY = "sentry:last-route";
const LAST_INTERACTION_KEY = "sentry:last-interaction";

let sentryInitialized = false;

function safeStorageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeStorageGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function isSentryEnabled() {
  return Boolean(SENTRY_DSN);
}

export function initSentry() {
  if (!isSentryEnabled() || sentryInitialized) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: true,
    environment: SENTRY_ENVIRONMENT,
    release: SENTRY_RELEASE,
    attachStacktrace: true,
    sendDefaultPii: false,
    normalizeDepth: 5,
    initialScope: {
      tags: {
        app: "refuah-web",
      },
    },
    beforeSend(event, hint) {
      // Drop noisy synthetic recovery events from issue stream.
      if (
        event.message === "Recovered from probable previous session interruption" ||
        event.tags?.source === "session-recovery"
      ) {
        return null;
      }

      // Drop transient stale-bundle / chunk-load browser errors.
      // Runtime recovery already handles these by cache-bust reload.
      const exceptionValue = event.exception?.values?.[0]?.value ?? "";
      if (
        isChunkLoadError(event.message ?? "") ||
        isChunkLoadError(exceptionValue) ||
        isChunkLoadError((hint as any)?.originalException)
      ) {
        return null;
      }

      // Improve unhandled rejection objects so they are readable in Sentry
      // instead of generic "[object Object]".
      const original: any = (hint as any)?.originalException;
      const isPlainObjectRejection =
        original &&
        typeof original === "object" &&
        !Array.isArray(original) &&
        (typeof original.message === "string" || typeof original.code === "string");

      if (isPlainObjectRejection) {
        const msg = original.message ? String(original.message) : "Unhandled promise rejection (object)";
        event.message = `UnhandledRejection: ${msg}`;
        event.extra = {
          ...(event.extra ?? {}),
          rejection: {
            code: original.code ?? null,
            details: original.details ?? null,
            hint: original.hint ?? null,
            message: original.message ?? null,
          },
        };
        event.fingerprint = ["unhandled-rejection-object", String(original.code ?? "no-code"), msg];
      }

      // Fallback for SDK-generated generic unhandled-rejection value when the
      // original rejection object is not available in hint.
      const exception = event.exception?.values?.[0];
      if (
        exception?.type === "UnhandledRejection" &&
        typeof exception.value === "string" &&
        exception.value.startsWith("Object captured as promise rejection with keys:")
      ) {
        event.message = "UnhandledRejection: object rejection (missing original exception details)";
        event.fingerprint = ["unhandled-rejection-object", "missing-hint"];
      }

      return event;
    },
  });

  sentryInitialized = true;
}

type SentryUser = {
  id?: string;
  email?: string | null;
  username?: string | null;
  role?: string | null;
  primaryRole?: string | null;
};

export function syncSentryUser(user: SentryUser | null) {
  if (!isSentryEnabled()) {
    return;
  }

  if (!user) {
    Sentry.setUser(null);
    Sentry.setTag("auth_state", "anonymous");
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email ?? undefined,
    username: user.username ?? undefined,
  });
  Sentry.setTag("auth_state", "authenticated");
  Sentry.setTag("user_role", user.role ?? "unknown");
  Sentry.setTag("user_primary_role", user.primaryRole ?? "unknown");
}

export function addNavigationBreadcrumb(pathname: string, search: string, hash: string) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.addBreadcrumb({
    category: "navigation",
    type: "navigation",
    level: "info",
    message: `Navigated to ${pathname}${search}${hash}`,
    data: {
      pathname,
      search,
      hash,
    },
  });
  Sentry.setTag("current_route", pathname || "/");
  safeStorageSet(
    LAST_ROUTE_KEY,
    JSON.stringify({
      pathname,
      search,
      hash,
      at: new Date().toISOString(),
    })
  );
}

function describeElement(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const clickable = target.closest("a, button, [role='button'], [data-sentry-label]");
  if (!clickable) {
    return null;
  }

  const label =
    clickable.getAttribute("data-sentry-label") ||
    clickable.getAttribute("aria-label") ||
    clickable.getAttribute("title") ||
    clickable.textContent?.replace(/\s+/g, " ").trim() ||
    clickable.getAttribute("href") ||
    clickable.tagName.toLowerCase();

  return {
    tagName: clickable.tagName.toLowerCase(),
    label: label?.slice(0, 120) || "unknown",
    href: clickable instanceof HTMLAnchorElement ? clickable.href : undefined,
  };
}

export function registerInteractionBreadcrumbs() {
  if (!isSentryEnabled() || typeof window === "undefined") {
    return () => {};
  }

  const handleClick = (event: MouseEvent) => {
    const description = describeElement(event.target);
    if (!description) {
      return;
    }

    Sentry.addBreadcrumb({
      category: "ui.click",
      type: "user",
      level: "info",
      message: `Clicked ${description.label}`,
      data: description,
    });
    safeStorageSet(
      LAST_INTERACTION_KEY,
      JSON.stringify({
        ...description,
        at: new Date().toISOString(),
      })
    );
  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
}

export function captureSentryTestEvent(context: Record<string, string | null | undefined> = {}) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.captureMessage("Sentry connectivity test", {
    level: "info",
    tags: {
      source: "manual_test",
    },
    extra: context,
  });
}

export function markSessionPending(context: { pathname: string; search: string; hash: string }) {
  if (!isSentryEnabled()) {
    return;
  }

  safeStorageSet(
    SESSION_MARKER_KEY,
    JSON.stringify({
      ...context,
      startedAt: new Date().toISOString(),
    })
  );
}

export function clearSessionPending() {
  if (!isSentryEnabled()) {
    return;
  }

  safeStorageRemove(SESSION_MARKER_KEY);
}

export function reportPreviousInterruptedSession() {
  if (!isSentryEnabled()) {
    return;
  }

  const pendingSession = safeStorageGet(SESSION_MARKER_KEY);
  if (!pendingSession) {
    return;
  }

  safeStorageRemove(SESSION_MARKER_KEY);

  let sessionData: unknown = pendingSession;
  let lastRoute: unknown = null;
  let lastInteraction: unknown = null;

  try {
    sessionData = JSON.parse(pendingSession);
  } catch {}

  try {
    const routeRaw = safeStorageGet(LAST_ROUTE_KEY);
    if (routeRaw) {
      lastRoute = JSON.parse(routeRaw);
    }
  } catch {}

  try {
    const interactionRaw = safeStorageGet(LAST_INTERACTION_KEY);
    if (interactionRaw) {
      lastInteraction = JSON.parse(interactionRaw);
    }
  } catch {}

  Sentry.captureMessage("Recovered from probable previous session interruption", {
    level: "warning",
    tags: {
      source: "session-recovery",
    },
    extra: {
      pendingSession: sessionData,
      lastRoute,
      lastInteraction,
    },
  });
}
