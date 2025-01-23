import { format } from "date-fns"
import { es } from 'date-fns/locale'

export const capitalizeFirstLetter = (str : string) => {
  if (!str) return str; // Verifica si la cadena está vacía
  return str.charAt(0).toUpperCase() + str.slice(1)
};

export const formattedDate = (date: string) => capitalizeFirstLetter(format(date.toString(), "EEEE d 'de' MMMM", { locale: es }))