export const useArgentineDate = () => {
  /**
   * Retorna la fecha actual específicamente en la zona horaria de Argentina.
   * Esto evita que a partir de las 21:00hs se guarde con el día siguiente.
   */
  const getNowISO = () => {
    const ahora = new Date();

    // Usamos toLocaleString con sv-SE (Suecia) porque genera naturalmente el formato YYYY-MM-DD HH:mm:ss
    // pero forzamos la zona horaria de Buenos Aires.
    const argString = ahora.toLocaleString("sv-SE", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    // Retornamos formato compatible ISO (YYYY-MM-DDTHH:mm:ss) sin el indicador Z (UTC)
    return argString.replace(" ", "T");
  };

  const getTodayARG = () => {
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date());
  };

  return { getNowISO, getTodayARG };
};
