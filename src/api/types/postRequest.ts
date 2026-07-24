export type PostRequest<TData extends object = Record<string, unknown>> = TData & {
  pProceso: string;
};
