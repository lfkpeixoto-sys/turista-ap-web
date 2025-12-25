// src/services/rankingStore.js
import { getRewardsState } from "./rewardsStore";

const KEY = "turistaapp_ranking_v1";

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

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// ranks por pontos (pode ajustar)
export const RANKS = [
  { id: "novato", label: "Novato", min: 0, icon: "🎯" },
  { id: "explorador", label: "Explorador", min: 100, icon: "⚡" },
  { id: "aventureiro", label: "Aventureiro", min: 500, icon: "🏅" },
  { id: "mestre", label: "Mestre", min: 1000, icon: "🎖️" },
  { id: "lenda", label: "Lenda", min: 2500, icon: "👑" },
];

export function getRankByPoints(points) {
  const p = Number(points || 0);
  let r = RANKS[0];
  for (const item of RANKS) {
    if (p >= item.min) r = item;
  }
  return r;
}

// gera jogadores fake pra ficar divertido
function seedPlayersIfNeeded(data, me) {
  if (data?.players?.length) return data;

  const sample = [
    { name: "Ana Souza", visits: 18, points: 420 },
    { name: "Bruno Lima", visits: 23, points: 610 },
    { name: "Camila Rocha", visits: 14, points: 320 },
    { name: "Diego Martins", visits: 31, points: 980 },
    { name: "Eduarda Alves", visits: 9, points: 190 },
    { name: "Felipe Santos", visits: 27, points: 760 },
    { name: "Giovana Costa", visits: 33, points: 1200 },
    { name: "Henrique Dias", visits: 6, points: 90 },
    { name: "Isabela Nunes", visits: 21, points: 540 },
    { name: "João Pedro", visits: 16, points: 410 },
  ];

  const players = sample.map((p, idx) => ({
    id: `p${idx + 1}`,
    name: p.name,
    avatar: p.name.trim().charAt(0).toUpperCase(),
    visits: p.visits,
    points: p.points,
    updatedAt: now(),
  }));

  // adiciona o usuário (Você)
  players.unshift({
    id: "me",
    name: me.name,
    avatar: me.avatar,
    visits: me.visits,
    points: me.points,
    updatedAt: now(),
  });

  return { ...data, players };
}

function ensure(me) {
  const base = load() || { players: [], lastSyncAt: now() };
  const seeded = seedPlayersIfNeeded(base, me);

  // atualiza "me" sempre com o estado real (rewardsStore)
  const idx = seeded.players.findIndex((p) => p.id === "me");
  if (idx >= 0) {
    seeded.players[idx] = {
      ...seeded.players[idx],
      name: me.name,
      avatar: me.avatar,
      visits: me.visits,
      points: me.points,
      updatedAt: now(),
    };
  }

  save(seeded);
  return seeded;
}

// me: vem do rewardsStore
export function getRankingState({ displayName = "Usuário" } = {}) {
  const rewards = getRewardsState?.() || { points: 0, visits: 0 };
  const me = {
    name: displayName,
    avatar: displayName.trim().charAt(0).toUpperCase(),
    points: clamp(rewards.points || 0, 0, 999999),
    visits: clamp(rewards.visits || 0, 0, 999999),
  };

  return ensure(me);
}

// modo: "points" | "visits"
export function getLeaderboard(mode = "points", { displayName } = {}) {
  const data = getRankingState({ displayName });

  const sorted = [...data.players].sort((a, b) => {
    if (mode === "visits") return b.visits - a.visits || b.points - a.points;
    return b.points - a.points || b.visits - a.visits;
  });

  const withPos = sorted.map((p, i) => ({
    ...p,
    pos: i + 1,
    rank: getRankByPoints(p.points),
  }));

  const me = withPos.find((p) => p.id === "me");

  return { list: withPos, me };
}
