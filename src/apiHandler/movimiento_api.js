import { post } from "./post";
import { get } from "./get";

export const movimiento_api = {
  async registrar(jsonParam) {
    return post("MOVIMIENTO_REGISTRAR", jsonParam);
  },

  async obtener(jsonParam = {}) {
    return get("MOVIMIENTO_OBTENER", jsonParam);
  },
};
