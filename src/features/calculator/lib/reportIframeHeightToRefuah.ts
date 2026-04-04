import { useEffect } from "react";

/** Must match Refuah `iframeContentHeight.ts` contract so the parent iframe grows with content. */
const SOURCE = "sechemeter-iframe";
const HEIGHT_TYPE = "REFUAH_IFRAME_CONTENT_HEIGHT";
const PARENT_SOURCE = "refuah-parent";
const REQUEST_TYPE = "REFUAH_REQUEST_IFRAME_HEIGHT";

/**
 * Call after layout changes (e.g. תוצאת חישוב) so האתר האם מגדיל iframe — אחרת כפתורי Refuah נשארים מתחת לקיפול.
 */
export function postCalculatorIframeHeightToParent(): void {
  if (typeof window === "undefined" || window.parent === window) return;
  const run = () => {
    const h = Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight ?? 0,
      document.documentElement.offsetHeight,
      document.body?.offsetHeight ?? 0,
    );
    if (!(h > 0)) return;
    try {
      window.parent.postMessage({ source: SOURCE, type: HEIGHT_TYPE, height: h }, "*");
    } catch {
      /* ignore */
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(run));
}

/**
 * Reports document height to Refuah parent so the embedded iframe is not clipped
 * (e.g. profile + share buttons below the fold).
 */
export function useReportIframeHeightToRefuahParent() {
  useEffect(() => {
    const postHeight = () => {
      postCalculatorIframeHeightToParent();
    };

    const schedule = () => {
      postHeight();
      requestAnimationFrame(() => requestAnimationFrame(postHeight));
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);

    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);

    const onMsg = (e: MessageEvent) => {
      const d = e.data as { source?: string; type?: string } | null;
      if (d?.source === PARENT_SOURCE && d?.type === REQUEST_TYPE) schedule();
    };
    window.addEventListener("message", onMsg);

    schedule();

    return () => {
      ro.disconnect();
      window.removeEventListener("load", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("message", onMsg);
    };
  }, []);
}
