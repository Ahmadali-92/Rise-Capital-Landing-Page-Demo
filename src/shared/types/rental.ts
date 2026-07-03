// Equipment domain type used by the landing + detail pages.
// (Frontend-only demo — the shape mirrors the API-facing catalog item.)

export type Availability = 'Available' | 'Rented' | 'Maintenance';

export interface Equipment {
  id: string;
  sku: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  dailyRate: number;
  weeklyRate: number;
  availability: Availability;
  depot: string;
  specs: {label: string; value: string}[];
  utilization: number;
  rateType?: string;
  condition?: string;
  rigType?: string;
  fulfillmentMode?: string;
  maintenanceDueDate?: string | null;
  unavailableRanges?: {
    from: string;
    to: string;
    reason: 'rented' | 'maintenance';
  }[];
}
