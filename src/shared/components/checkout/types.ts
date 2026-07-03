import type {Equipment} from '@/shared/types/rental';
import type {CartItem} from '@/shared/hooks/useCart';

// A cart entry joined with its catalog record + derived pricing.
export interface CheckoutLine {
  item: CartItem;
  eq: Equipment;
  from: Date;
  to: Date;
  days: number;
  lineTotal: number;
}

export interface ScheduleState {
  dropOff?: string;
  pickup?: string;
  // We always deliver to and collect from the customer's site, so a site
  // address is always part of the schedule.
  address?: string;
  city?: string;
  region?: string; // state
  zip?: string;
}

export interface AccountState {
  firstName: string;
  lastName: string;
  email: string;
}

// Flow order: Review → Logistics → Agreement → Sign → Account (final) → done.
export type StepId = 'cart' | 'schedule' | 'agreement' | 'sign' | 'account' | 'done';
