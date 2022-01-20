/**
 *
 * @returns boolean - Whether the user prefers dark mode or not
 * @note This function only runs on the browser
 * @note This function was created with Github Copilot's help
 */

const userPrefersDarkMode = (): boolean => {
  // Try to get user preference from local storage
  const localStoragePrefersDarkMode =
    window.localStorage.getItem("darkmode") === "true";

  // If preference is on local storage, return it
  if (window.localStorage.getItem("darkmode")) {
    return localStoragePrefersDarkMode;
  }

  // If preference is not on local storage, try to get it from the browser
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
  // Store preference in local storage
  window.localStorage.setItem("darkmode", prefersDarkMode.matches.toString());
  return prefersDarkMode.matches;
};

export default userPrefersDarkMode;
