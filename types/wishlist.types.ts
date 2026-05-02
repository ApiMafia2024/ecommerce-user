export interface WishlistImage {
  original: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  description: string;
  code: string;
  images: WishlistImage[];
}

export interface WishlistData {
  items: WishlistItem[];
  pagination: {
    links: {
      first_page_url: string;
      last_page_url: string;
      prev_page_url: string | null;
      next_page_url: string | null;
    };
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}
