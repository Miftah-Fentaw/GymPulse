/** @deprecated Use @/lib/catalog — kept for any leftover imports. */
export {
  fetchTrainers as trainersAsync,
  fetchWorkouts as workoutsAsync,
  workoutTypes,
  type Trainer,
  type Workout,
} from "./catalog";

import type { Trainer, Workout } from "./catalog";

/** Empty static fallbacks — live data comes from the API via catalog.ts */
export const trainers: Trainer[] = [];
export const workouts: Workout[] = [];

export function workoutById(_id: string) {
  return undefined;
}

export function trainerById(_id: string) {
  return undefined;
}

export function trainerForWorkout(_w: Workout) {
  return undefined;
}
