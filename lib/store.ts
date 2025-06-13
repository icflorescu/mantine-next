import { proxy } from 'valtio';

export const store = proxy({
  mobileNavVisible: false,
});

export function toggleMobileNavVisibility() {
  store.mobileNavVisible = !store.mobileNavVisible;
}

export function hideMobileNav() {
  store.mobileNavVisible = false;
}
