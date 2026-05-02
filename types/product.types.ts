
export interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  images: Image[];
  video: Image[];
  category: Category;
  vendor: string;
  variations: Variation[];
  reviews: Review[];
  total_reviews: number;
  rate: Rate;
}

export interface Image {
  original: string;
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Variation {
  id: number;
  price: number;
  stock: number;
  notify_me: boolean;
    is_default: boolean;
  discount: number;
  attributes: Attribute[];
}


export interface Review {
  user: User;
  comment: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Rate {
  average: number;
  count: number;
  details: {
    [key: string]: string;
  };
}

export interface Attribute {
  attribute: Attribute;
  value: Value;
}
export interface Value {
  id: number;
  name: string;
}

export type productStatusTypes = 'inStock' | 'outOfStock' | 'notifyMe' | 'notAvailable'