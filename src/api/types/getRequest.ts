export interface GetRequest<TData = unknown> {
  pProceso: string;
  data?: TData;
}
