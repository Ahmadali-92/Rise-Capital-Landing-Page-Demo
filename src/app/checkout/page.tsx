import CheckoutFlow from '@/shared/components/checkout/CheckoutFlow';
import {rcCheckoutFontVars} from '@/shared/premium-fonts';

// Checkout / booking flow — cart review → logistics → account → agreement →
// signature. Frontend-only click-through demo (no backend).
export default function CheckoutPage() {
  return (
    <div className={rcCheckoutFontVars}>
      <CheckoutFlow />
    </div>
  );
}
