export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: string;
  membership_tier: string;
  is_active: boolean;
  created_at: string;
}

export interface Trainer {
  id: string;
  profile_id: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
  years_experience: number;
  hourly_rate?: number;
  rating: number;
  is_verified: boolean;
}
