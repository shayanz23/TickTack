// Done with the help of https://rodneylab.com/using-local-storage-sveltekit/,
// https://m2.material.io/design/color/dark-theme.html,
// https://www.w3schools.com/howto/howto_js_media_queries.asp,
// and https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers,

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Color pref to get system theme.
let colorPrefMedQuery: MediaQueryList;

// 0 is system, 1 is dark, 2 is light.
const appDefaultValue: number = 0;

// Sets the initial appTheme value to whats in the localstorage or to 0.
const appInitialValue: number = (() => {
  if (!browser) {
    return appDefaultValue;
  }

  colorPrefMedQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorPrefMedQuery.addEventListener("change",
    pickPreferedTheme);

  let localval = window.localStorage.getItem("appTheme");
  if (localval !== null && typeof localval === 'number') {
    return localval;
  } else {
    return appDefaultValue;
  }
})();

// Creating the svelte store and setting its value to the initial value.
const appTheme = writable<number>(appInitialValue);
export const darkTheme = writable<boolean>(false);

// sets the theme to the system one.
function pickPreferedTheme() {
  if (colorPrefMedQuery.matches) { 
    darkTheme.set(true);
  } else {
    darkTheme.set(false);
  }
}

// Everytime the apptheme changes, the value in localstorage and the darktheme state is changed.
appTheme.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('appTheme', value.toString());
    if (value === 0) {
      pickPreferedTheme();
    } else if (value === 1) {
      darkTheme.set(true);
    } else {
      darkTheme.set(false);
    }
  }
});


export default appTheme;