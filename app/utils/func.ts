export const capitalizeFirstLetter = (str : string) => {
  if (!str) return str; // Verifica si la cadena está vacía
  return str.charAt(0).toUpperCase() + str.slice(1);
};