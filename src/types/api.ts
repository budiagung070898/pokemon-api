export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}
