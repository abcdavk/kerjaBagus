// Fungsi membuat inisial nama (misal: "Rian Ardiansyah" -> "RA")
export function getUsernameInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};