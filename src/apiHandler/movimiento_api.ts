import { post } from "./post";
import { get } from "./get";

export const movimiento_api = {
  async registrar<T = unknown>(jsonParam: Record<string, unknown>): Promise<T> {
    return post<T>("MOVIMIENTO_REGISTRAR", jsonParam);
  },

  async obtener<T = unknown>(jsonParam: Record<string, unknown> = {}): Promise<T> {
    return get<T>("MOVIMIENTO_OBTENER", jsonParam);
  },
};
