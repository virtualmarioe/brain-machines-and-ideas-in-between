/** Explicit reading actions move to the updated panel after React commits it. */
export function focusReading() {
  requestAnimationFrame(() => {
    const panel = document.getElementById('reading-view');
    panel?.scrollIntoView({ block: 'start', behavior: 'instant' });
    panel?.focus({ preventScroll: true });
  });
}
