/**
 * Sets of Replaces the given searchParam without triggering rerenders
 *
 * @param key
 * @param value
 */
export const setSearchParam = <T extends { toString(): string }>(key: string, value: T): void => {
  // Check for SSR: window is not available server-side.
  if (typeof window === 'undefined') return;

  const newValue = value.toString();
  const currentUrl = new URL(window.location.href);
  const currentValue = currentUrl.searchParams.get(key);

  // Only update if the parameter has changed.
  if (currentValue === newValue) return;

  currentUrl.searchParams.set(key, newValue);
  const updatedUrl = currentUrl.toString();

  window.history.replaceState(
    { ...window.history.state, as: updatedUrl, url: updatedUrl },
    '',
    updatedUrl
  );
};
