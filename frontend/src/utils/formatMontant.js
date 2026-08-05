export function formatMontant(valeur) {
  if (valeur === null || valeur === undefined || Number.isNaN(Number(valeur))) {
    return "-";
  }

  return `${Number(valeur).toLocaleString("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MAD`;
}
