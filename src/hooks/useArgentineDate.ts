interface UseArgentineDateResult {
  getNowISO: () => string;
  getTodayARG: () => string;
}

export const useArgentineDate = (): UseArgentineDateResult => {
  const getNowISO = (): string => {
    const f = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

    return f.replace(" ", "T") + "-03:00";
  };

  const getTodayARG = (): string => {
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date());
  };

  return { getNowISO, getTodayARG };
};
