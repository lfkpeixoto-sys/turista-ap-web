const KEY = "turistaapp_favorites_v1";

function now() {
  return Date.now();
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function freshState() {
  return {
    // favoritos atuais
    favorites: [],
    // histórico de removidos
    history: [],
    // timestamp da última vez que resetou histórico
    historyResetAt: now(),
  };
}

function ensure() {
  const data = load() || freshState();

  // reset do histórico a cada 4 dias
  const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
  if (!data.historyResetAt) data.historyResetAt = now();

  if (now() - data.historyResetAt >= FOUR_DAYS) {
    data.history = [];
    data.historyResetAt = now();
    save(data);
  }

  return data;
}

export function getFavoritesState() {
  return ensure();
}

// item mínimo esperado: { id, title, subtitle?, img?, meta? }
export function isFavorite(id) {
  const { favorites } = ensure();
  return favorites.some((x) => x.id === id);
}

export function toggleFavorite(item) {
  const data = ensure();

  const idx = data.favorites.findIndex((x) => x.id === item.id);

  // se já é favorito -> remove e manda pro histórico
  if (idx >= 0) {
    const removed = data.favorites[idx];
    data.favorites.splice(idx, 1);

    // adiciona no histórico (sem duplicar)
    const hIdx = data.history.findIndex((x) => x.id === removed.id);
    const entry = { ...removed, removedAt: now() };

    if (hIdx >= 0) data.history[hIdx] = entry;
    else data.history.unshift(entry);

    save(data);
    return { favorited: false, state: data };
  }

  // se não é favorito -> adiciona
  const toAdd = { ...item, addedAt: now() };
  data.favorites.unshift(toAdd);

  // se estava no histórico, remove de lá (voltou a ser favorito)
  data.history = data.history.filter((x) => x.id !== item.id);

  save(data);
  return { favorited: true, state: data };
}

export function clearHistory() {
  const data = ensure();
  data.history = [];
  data.historyResetAt = now();
  save(data);
  return data;
}
