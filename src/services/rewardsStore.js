const KEY = "turistaapp_rewards_v1";

function now() {
  return Date.now();
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// ano-semana (ISO simplificado)
function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function emit(state) {
  window.dispatchEvent(new CustomEvent("turistaapp:rewards", { detail: state }));
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  emit(state);
}

function freshState() {
  return {
    points: 10,
    visits: 1,
    rewardsClaimed: 0,

    streak: 1,
    lastActive: todayKey(),

    dailyDone: {},        // { [dateKey]: { missionId: true } }
    weeklyDone: {},       // { [weekKey]: { missionId: true } }
    weeklyCounters: {},   // { [weekKey]: { fav, visit, search, map } }

    unlocked: {},         // loja
    badges: {},           // badges
  };
}

function ensure() {
  const s = load() || freshState();

  const today = todayKey();
  if (s.lastActive !== today) {
    const prev = new Date(s.lastActive);
    const cur = new Date(today);
    const diffDays = Math.round((cur - prev) / 86400000);

    if (diffDays === 1) s.streak = (s.streak || 0) + 1;
    else s.streak = 1;

    s.lastActive = today;
    save(s);
  }

  return s;
}

export function getRewardsState() {
  return ensure();
}

export function subscribeRewards(cb) {
  const handler = (e) => cb(e.detail);
  window.addEventListener("turistaapp:rewards", handler);
  return () => window.removeEventListener("turistaapp:rewards", handler);
}

function addPointsInternal(s, amount) {
  s.points = (s.points || 0) + amount;
}

function bumpWeeklyCounter(s, key, field, inc = 1) {
  s.weeklyCounters = { ...(s.weeklyCounters || {}) };
  const wk = { ...(s.weeklyCounters[key] || { fav: 0, visit: 0, search: 0, map: 0 }) };
  wk[field] = (wk[field] || 0) + inc;
  s.weeklyCounters[key] = wk;
}

function markDailyDone(s, missionId) {
  const day = todayKey();
  s.dailyDone = { ...(s.dailyDone || {}) };
  const obj = { ...(s.dailyDone[day] || {}) };
  obj[missionId] = true;
  s.dailyDone[day] = obj;
}

function markWeeklyDone(s, missionId) {
  const wk = weekKey();
  s.weeklyDone = { ...(s.weeklyDone || {}) };
  const obj = { ...(s.weeklyDone[wk] || {}) };
  obj[missionId] = true;
  s.weeklyDone[wk] = obj;
}

export function completeDailyMission(missionId, points) {
  const s = ensure();
  const day = todayKey();
  const done = !!(s.dailyDone?.[day]?.[missionId]);
  if (done) return s;

  markDailyDone(s, missionId);
  addPointsInternal(s, points);
  save(s);
  return s;
}

export function completeWeeklyMission(missionId, points, canComplete = true) {
  const s = ensure();
  const wk = weekKey();
  const done = !!(s.weeklyDone?.[wk]?.[missionId]);
  if (done) return s;
  if (!canComplete) return s;

  markWeeklyDone(s, missionId);
  addPointsInternal(s, points);
  save(s);
  return s;
}

// ==== REGISTROS AUTOMÁTICOS ====

// chamado pelo favoritesStore
export function recordFavoriteToggle(favorited) {
  const s = ensure();
  const wk = weekKey();

  if (favorited) {
    bumpWeeklyCounter(s, wk, "fav", 1);
    addPointsInternal(s, 1);
    markDailyDone(s, "d_fav");
  }

  save(s);
  return s;
}

// chamado no CityPage
export function recordVisit() {
  const s = ensure();
  const wk = weekKey();

  s.visits = (s.visits || 0) + 1;
  bumpWeeklyCounter(s, wk, "visit", 1);
  addPointsInternal(s, 2);
  markDailyDone(s, "d_visit");

  save(s);
  return s;
}

// chamado na busca (debounced)
export function recordSearch() {
  const s = ensure();
  const wk = weekKey();

  bumpWeeklyCounter(s, wk, "search", 1);
  addPointsInternal(s, 1);
  markDailyDone(s, "d_search");

  save(s);
  return s;
}

// chamado ao abrir mapa
export function recordMapOpen() {
  const s = ensure();
  const wk = weekKey();

  bumpWeeklyCounter(s, wk, "map", 1);
  addPointsInternal(s, 1);
  markDailyDone(s, "d_map");

  save(s);
  return s;
}

// ==== LOJA ====
export function redeemReward(itemId, cost) {
  const s = ensure();
  if (s.unlocked?.[itemId]) return s;
  if ((s.points || 0) < cost) return s;

  s.points -= cost;
  s.rewardsClaimed = (s.rewardsClaimed || 0) + 1;

  s.unlocked = { ...(s.unlocked || {}) };
  s.unlocked[itemId] = true;

  save(s);
  return s;
}
