import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export const userId: Writable<string | null> = writable(browser && localStorage.getItem("userId") || null)
userId.subscribe((val) => {
  if (browser) return (localStorage.userId = val)
})

export const email: Writable<string | null> = writable(null);
export const username: Writable<string | null> = writable(null);
export const xp: Writable<number | null> = writable(null);
export const role: Writable<string | null> = writable(null);