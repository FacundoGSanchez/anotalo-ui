const formatFloat = (value: number | string): string => {
  const n = Number(value) || 0;

  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export default formatFloat;
