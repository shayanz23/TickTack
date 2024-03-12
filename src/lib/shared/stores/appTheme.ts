// Done with the help of https://rodneylab.com/using-local-storage-sveltekit/,
// https://m2.material.io/design/color/dark-theme.html,
// https://www.w3schools.com/howto/howto_js_media_queries.asp,
// and https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers.

import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { onMount } from 'svelte';


// Color pref to get system theme.
let colorPrefMedQuery: MediaQueryList;

// 0 is system, 1 is dark, 2 is light.
const appDefaultValue: number = 0;

const darkDefaultVal: boolean = false;

// Sets the initial pickedTheme value to whats in the localstorage or to 0.
const appInitialValue: number = (() => {
	if (!browser) {
		return appDefaultValue;
	}

	setcolorPrefMedQuery();

	let localval = window.localStorage.getItem('pickedTheme');
	if (localval !== null && !isNaN(+localval) && +localval < 3) {
		return +localval;
	} else {
		return appDefaultValue;
	}
})();





// Creating the svelte store and setting its value to the initial value.
const pickedTheme = writable<number>(appInitialValue);

const darkInitValue: boolean = (() => {
	if (!browser) {
		return darkDefaultVal;
	}

  let value = get(pickedTheme)

	if (value === 0) {
    return isDark();
  } else if (value === 1) {
    return true;
  } else {
    return false;
  }
})();

export const darkTheme = writable<boolean>(darkInitValue);

function setcolorPrefMedQuery() {
  if (browser) {
    if (colorPrefMedQuery === undefined) {
      colorPrefMedQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }
  }
  
}

// sets the theme to the system one.
function isDark(): boolean {
  let bool = false;
  setcolorPrefMedQuery();
	if (colorPrefMedQuery.matches) {
    bool = true;
	}
  return bool;
}

// Everytime the pickedTheme changes, the value in localstorage and the darktheme state is changed.
pickedTheme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('pickedTheme', value.toString());
		if (value === 0) {
			darkTheme.set(isDark());
		} else if (value === 1) {
			darkTheme.set(true);
		} else {
			darkTheme.set(false);
		}
	}
});

export default pickedTheme;
