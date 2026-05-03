"import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderConfirmed() {
  const { id } = useParams();
  return (
    <div className=\"py-24\" data-testid=\"page-order-confirmed\">
      <div className=\"max-w-2xl mx-auto px-6 text-center\">
        <div className=\"w-16 h-16 rounded-full bg-mr-terracotta/15 flex items-center justify-center mx-auto\">
          <CheckCircle2 size={32} className=\"text-mr-terracotta\" />
        </div>
        <div className=\"overline text-mr-success mt-6\">Order Received</div>
        <h1 className=\"font-serif text-5xl lg:text-6xl mt-4 tracking-tight font-light\">Thank you!</h1>
        <p className=\"mt-4 text-lg text-mr-text2 font-light leading-relaxed\">
          Your order is in the kitchen. We'll call you in a few minutes to confirm timing and address.
        </p>
        {id && <div className=\"mt-6 overline text-mr-text2\">Reference #{id.slice(0, 8).toUpperCase()}</div>}
        <div className=\"mt-10 flex gap-3 justify-center\">
          <Link to=\"/menu\" className=\"btn-ghost\" data-testid=\"order-back-menu\">Order More</Link>
          <Link to=\"/\" className=\"btn-primary\" data-testid=\"order-back-home\">Back Home <ArrowRight size={14} /></Link>
        </div>
      </div>
    </div>
  );
}
"