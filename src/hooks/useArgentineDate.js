export const useArgentineDate = () => {
  /**
   * Retorna la fecha actual en formato ISO local (sin Z)
   * ajustada a la zona horaria del navegador (Argentina UTC-3).
   */
  const getNowISO = () => {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora - offset).toISOString().slice(0, -1);
  };

  return { getNowISO };
};
