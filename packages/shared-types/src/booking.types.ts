export interface Booking {
  id: string;
  class_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'no_show' | 'cancelled' | 'refunded';
  booking_type: string;
  payment_status: string;
  checked_in_at?: string;
  created_at: string;
}
