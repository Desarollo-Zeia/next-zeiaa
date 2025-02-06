import { addDays, format } from "date-fns"
import { es } from 'date-fns/locale'

export const capitalizeFirstLetter = (str : string) => {
  if (!str) return str; // Verifica si la cadena está vacía
  return str.charAt(0).toUpperCase() + str.slice(1)
};

export const formattedDate = (date: string) => {
  // Parsear la cadena de fecha en un objeto Date
  const parsedDate = new Date(date);

  // Verificar si la fecha es válida
  // if (isNaN(parsedDate.getTime())) {
  //   throw new Error("Invalid date format");
  // }

  // Sumar un día a la fecha analizada
  const nextDay = addDays(parsedDate, 1);

  // Formatear la fecha
  return capitalizeFirstLetter(format(nextDay, "EEEE d 'de' MMMM", { locale: es }));
};