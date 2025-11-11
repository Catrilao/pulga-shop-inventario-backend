export function generateSKU(
  id_tienda: number,
  nombre: string,
  marca: string,
  categoria: string,
  condicion: string,
): string {
  // Ejemplo de formato: P1-NOM-MAR-CAT-CON
  const nombreCodigo = nombre.substring(0, 3).toUpperCase();
  const marcaCodigo = marca.substring(0, 3).toUpperCase();
  const categoriaCodigo = categoria.substring(0, 3).toUpperCase();
  const condicionCodigo = condicion.substring(0, 3).toUpperCase();

  return `P${id_tienda}-${nombreCodigo}-${marcaCodigo}-${categoriaCodigo}-${condicionCodigo}`;
}
