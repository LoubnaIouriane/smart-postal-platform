// Decode le payload d'un JWT (sans verification de signature - usage affichage uniquement).
export function decodeToken(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalise = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalise));
  } catch {
    return null;
  }
}

// Recupere l'identifiant reel du client connecte (claim "sub" du token).
export function getIdentifiantConnecte(token) {
  const payload = decodeToken(token);
  return payload?.sub || null;
}