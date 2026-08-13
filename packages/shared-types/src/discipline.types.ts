export interface Discipline {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon_url?: string;
  banner_url?: string;
  color_hex: string;
  is_active: boolean;
}

export interface Class {
  id: string;
  discipline_id: string;
  trainer_id?: string;
  title: string;
  description?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  duration_minutes: number;
  max_participants: number;
  price: number;
  start_time: string;
  end_time: string;
  status: string;
}

export interface WorkoutPlan {
  id: string;
  discipline_id: string;
  title: string;
  description?: string;
  difficulty_level: string;
  duration_weeks?: number;
  is_premium: boolean;
  price: number;
}
