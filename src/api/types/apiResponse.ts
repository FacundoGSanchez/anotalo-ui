export interface ApiResponse<T = unknown> {
  data: T;
  mensaje?: string;
}
