export interface PaginationLinks {
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
  }
  
  export interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  }

  
export interface Pagination {
    links: PaginationLinks;
    meta: PaginationMeta;
  }


  // ============ User Type ============
export interface User {
    id: number;
    email: string;
    name?: string;
    phone?: string;
    image?: {
      original: string;
      last_update?: string;
    } | null;
  }

  export interface ProfileUser extends User {
    socialite_account: boolean,
    last_update?: string,
    locations: Location[],
  }



  export interface Location {
    id?: number;
    country: string;
    state: string;
    city: string;
    street: string;
    google_map_url: string;
  }
  // ============ Response Meta Types ============
export interface ResponseMeta {
    message: string;
    code: number;
    error: boolean;
    validation_errors: Record<string, string[]> | [];
  }


  // Define all possible paginated data shapes
type PaginatedDataShape<T> = 
| { items: T[]; pagination: Pagination }      // data.items
| { data: T[]; pagination: Pagination }       // data.data  
| T[];                                         // data -> direct array


  // For paginated responses (lists)
export interface ApiPaginatedResponse<T> {
    data: PaginatedDataShape<T>;
    meta: ResponseMeta;
  }


  // For single item responses
export interface ApiResponse<T> {
    data: T;
    meta: ResponseMeta;
  }

  // For responses with no data (e.g., delete operations)
export interface ApiEmptyResponse {
    data: null;
    meta: ResponseMeta;
  }


  // ============ Error Class ============
export class ApiError extends Error {
    constructor(
      message: string,
      public code: number,
      public validationErrors: Record<string, string[]> | [] = []
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }



  
// Utility to normalize and extract items from any format
export function extractItems<T>(data: PaginatedDataShape<T>): T[] {
    if (Array.isArray(data)) {
      return data;
    }
    if ('items' in data) {
      return data.items;
    }
    if ('data' in data) {
      return data.data;
    }
    return [];
  }
  
  // Utility to extract pagination (returns null if direct array)
  export function extractPagination<T>(data: PaginatedDataShape<T>): Pagination | null {
    if (Array.isArray(data)) {
      return null;
    }
    return data.pagination ?? null;
  }