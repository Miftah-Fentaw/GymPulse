export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'member' | 'trainer' | 'admin' | 'super_admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
  phone?: string;
}
