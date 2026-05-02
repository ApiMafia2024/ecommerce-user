const WISHLIST_STORAGE_KEY = 'wishlist_items';

/**
 * Get all product IDs from localStorage wishlist
 */
export function getWishlistFromStorage(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
}

/**
 * Add a product ID to localStorage wishlist
 */
export function addToWishlistStorage(productId: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getWishlistFromStorage();
    if (!current.includes(productId)) {
      const updated = [...current, productId];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Error adding to wishlist in localStorage:', error);
  }
}

/**
 * Remove a product ID from localStorage wishlist
 */
export function removeFromWishlistStorage(productId: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getWishlistFromStorage();
    const updated = current.filter((id) => id !== productId);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from wishlist in localStorage:', error);
  }
}

/**
 * Check if a product ID is in localStorage wishlist
 */
export function isInWishlistStorage(productId: number): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const wishlist = getWishlistFromStorage();
  return wishlist.includes(productId);
}

/**
 * Clear all items from localStorage wishlist
 */
export function clearWishlistStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing wishlist from localStorage:', error);
  }
}

