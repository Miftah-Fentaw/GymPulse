import { getSession } from "@/lib/auth";

export type Workout = {
  id: string;
  title: string;
  level: string;
  durationMin: number;
  kcal: number;
  rating: number;
  image: string;
  trainerId: string;
  description: string;
  category: string;
};

export type Trainer = {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  bio: string;
  clientCount?: number;
};

export type ClassSession = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  booked: number;
  trainerId: string;
  trainerName: string;
  image: string;
};

const CLASS_IMAGES: Record<string, string> = {
  fitness: "/media/class-fitness.jpg",
  yoga: "/media/class-yoga.jpg",
  hiit: "/media/class-cardio.jpg",
  strength: "/media/class-bodybuilding.jpg",
  cardio: "/media/class-cardio.jpg",
};

const TRAINER_IMAGES = [
  "/media/trainer-1.jpg",
  "/media/trainer-2.jpg",
  "/media/trainer-3.jpg",
  "/media/trainer-4.jpg",
];

export const workoutTypes = [
  { id: "strength", labelKey: "types.strength", image: "/media/class-bodybuilding.jpg" },
  { id: "yoga", labelKey: "types.yoga", image: "/media/class-yoga.jpg" },
  { id: "cardio", labelKey: "types.cardio", image: "/media/class-cardio.jpg" },
  { id: "hiit", labelKey: "types.hiit", image: "/media/process-2.jpg" },
];

function imageForClass(name: string) {
  const key = name.toLowerCase();
  for (const [k, img] of Object.entries(CLASS_IMAGES)) {
    if (key.includes(k)) return img;
  }
  return "/media/class-fitness.jpg";
}

function trainerImage(index: number) {
  return TRAINER_IMAGES[index % TRAINER_IMAGES.length]!;
}

async function domainGet(path: string) {
  const token = getSession().accessToken;
  if (!token || token === "demo-access") {
    return { items: [] as Record<string, unknown>[] };
  }
  const res = await fetch(path, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { items: [] as Record<string, unknown>[] };
  const json = (await res.json()) as { items?: Record<string, unknown>[] };
  return { items: json.items ?? [] };
}

export async function fetchTrainers(): Promise<Trainer[]> {
  const { items } = await domainGet("/v1/trainers");
  return items.map((row, i) => ({
    id: String(row.id ?? ""),
    name: String(row.name || row.email || "Trainer"),
    role: "Trainer",
    rating: 4.7 + (i % 3) * 0.1,
    image: trainerImage(i),
    bio: `${row.name || "Trainer"} coaches members at GymPulse Demo.`,
    clientCount: Number(row.client_count ?? 0),
  }));
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const [types, trainers] = await Promise.all([domainGet("/v1/class-types"), fetchTrainers()]);
  if (types.items.length === 0) return [];
  return types.items.map((row, i) => {
    const name = String(row.name ?? "Class");
    const trainer = trainers[i % Math.max(trainers.length, 1)];
    return {
      id: String(row.id ?? ""),
      title: name,
      level: i % 3 === 0 ? "Beginner" : i % 3 === 1 ? "Intermediate" : "Advanced",
      durationMin: 45,
      kcal: 180 + i * 40,
      rating: 4.6 + (i % 4) * 0.1,
      image: imageForClass(name),
      trainerId: trainer?.id ?? "",
      description: String(row.description || `${name} group class at the gym.`),
      category: name,
    };
  });
}

export async function fetchSessions(): Promise<ClassSession[]> {
  const { items } = await domainGet("/v1/sessions");
  return items.map((row) => {
    const name = String(row.name ?? "Class");
    return {
      id: String(row.id ?? ""),
      name,
      startsAt: String(row.starts_at ?? ""),
      endsAt: String(row.ends_at ?? ""),
      capacity: Number(row.capacity ?? 0),
      booked: Number(row.booked ?? 0),
      trainerId: String(row.trainer_user_id ?? ""),
      trainerName: String(row.trainer_name || "Trainer"),
      image: imageForClass(name),
    };
  });
}

export async function fetchMyMemberId(): Promise<string | null> {
  const session = getSession();
  if (!session.accessToken || session.accessToken === "demo-access") return null;
  const email = session.user?.email?.toLowerCase();
  if (!email) return null;
  const { items } = await domainGet("/v1/members?limit=100");
  const mine = items.find((m) => String(m.email ?? "").toLowerCase() === email);
  return mine ? String(mine.id) : null;
}

export async function fetchMyWorkouts(memberId: string): Promise<Workout[]> {
  const { items } = await domainGet(`/v1/members/${memberId}/workouts`);
  return items.map((row, i) => {
    const metrics = (row.metrics ?? {}) as Record<string, unknown>;
    return {
      id: String(row.id ?? ""),
      title: String(row.title ?? "Workout"),
      level: "Custom",
      durationMin: Number(metrics.minutes ?? 35),
      kcal: Number(metrics.kcal ?? 200),
      rating: 4.8,
      image: TRAINER_IMAGES[i % TRAINER_IMAGES.length]!,
      trainerId: "",
      description: String(row.notes ?? ""),
      category: "Logged",
    };
  });
}

export async function fetchMeasurements(memberId: string) {
  const { items } = await domainGet(`/v1/members/${memberId}/measurements`);
  return items.map((row) => ({
    kind: String(row.kind ?? ""),
    value: Number(row.value ?? 0),
    unit: String(row.unit ?? ""),
    at: String(row.measured_at ?? ""),
  }));
}
