export const ROOT_ROUTE = '/';

// Public equipment detail page.
export const EQUIPMENT_ROOT = '/equipment';

export const EQUIPMENT_ROUTES = {
  detail: ({id}: {id: string}) => `${EQUIPMENT_ROOT}/${id}`,
};

// Checkout / booking flow (frontend-only demo).
export const CHECKOUT_ROUTE = '/checkout';
