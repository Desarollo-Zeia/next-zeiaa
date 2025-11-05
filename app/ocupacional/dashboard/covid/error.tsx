// Importa el componente reutilizable
'use client'

import CustomErrorUI from "@/app/ui/error-found";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Simplemente delega la lógica y la UI al componente importado
  return <CustomErrorUI error={error} reset={reset} />;
}