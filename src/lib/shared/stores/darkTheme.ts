import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const defaultValue: Boolean = true;
const initialValue: Boolean = browser ? (window.localStorage.getItem("darkTheme") === 'true') : defaultValue;

const darkTheme = writable<Boolean>(initialValue);

darkTheme.subscribe((value) => {
    if (browser) {
      window.localStorage.setItem('darkTheme', value.toString());
    }
  });

export default darkTheme;