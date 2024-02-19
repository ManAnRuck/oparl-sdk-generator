export interface Pagination {
  elementsPerPage: number;
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface Links {
  first: string; // format: uri
  prev: string; // format: uri
  self: string; // format: uri
  next: string; // format: uri
  last: string; // format: uri
  web: string; // format: uri
}

type PaginationFunctions<T> = {
  next?: () => Promise<ObjectList<T>>;
  previous?: () => Promise<ObjectList<T>>;
  first?: () => Promise<ObjectList<T>>;
  last?: () => Promise<ObjectList<T>>;
};

export interface ObjectList<T> extends PaginationFunctions<T> {
  data: T[];
  pagination: Pagination;
  links: Links;
}
