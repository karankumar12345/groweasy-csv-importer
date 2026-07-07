
"use client"
import React, { useLayoutEffect, useMemo, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Max height for vertical scrolling inside the table area.
   * Use a CSS value like "70vh" / "600px". Default: "70vh"
   */
  maxHeight?: string;
};

export function TableScrollArea({ children, className, maxHeight = "70vh" }: Props) {
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const topInnerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const maxHeightStyle = useMemo<React.CSSProperties>(
    () => ({ maxHeight }),
    [maxHeight],
  );

  useLayoutEffect(() => {
    const bodyEl = bodyScrollRef.current;
    const topEl = topScrollRef.current;
    const topInnerEl = topInnerRef.current;
    if (!bodyEl || !topEl || !topInnerEl) return;

    const syncWidths = () => {
      const bodyScrollWidth = bodyEl.scrollWidth;
      topInnerEl.style.width = `${bodyScrollWidth}px`;

      // Hide top scrollbar if not needed
      const needsHorizontal = bodyEl.scrollWidth > bodyEl.clientWidth + 1;
      topEl.style.display = needsHorizontal ? "block" : "none";
    };

    const syncFromTop = () => {
      if (!bodyEl || !topEl) return;
      bodyEl.scrollLeft = topEl.scrollLeft;
    };

    const syncFromBody = () => {
      if (!bodyEl || !topEl) return;
      topEl.scrollLeft = bodyEl.scrollLeft;
    };

    const onBodyScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncFromBody);
    };

    const onTopScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncFromTop);
    };

    const ro = new ResizeObserver(() => syncWidths());
    ro.observe(bodyEl);

    syncWidths();
    topEl.addEventListener("scroll", onTopScroll, { passive: true });
    bodyEl.addEventListener("scroll", onBodyScroll, { passive: true });
    window.addEventListener("resize", syncWidths, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      topEl.removeEventListener("scroll", onTopScroll);
      bodyEl.removeEventListener("scroll", onBodyScroll);
      window.removeEventListener("resize", syncWidths);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={className}>
      {/* Top horizontal scrollbar (under fixed headers) */}
      <div
        ref={topScrollRef}
        className="va-scrollbar-thick overflow-x-auto overflow-y-hidden"
      >
        <div ref={topInnerRef} className="h-1" />
      </div>

      {/* Main scroll container */}
      <div
        ref={bodyScrollRef}
        className="va-scrollbar-thick overflow-auto"
        style={maxHeightStyle}
      >
        {children}
      </div>
    </div>
  );
}

