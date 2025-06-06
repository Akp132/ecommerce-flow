import { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading…</p>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
