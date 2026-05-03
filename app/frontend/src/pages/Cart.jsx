
Action: file_editor create /app/frontend/src/pages/Cart.jsx --file-text "import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function Cart() {
  const { items, updateQty, remove, subtotal, tax, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: '', phone: '', address: '', notes: '', order_type: 'delivery',
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    if (!form.customer_name || !form.phone) return toast.error('Name and phone are required');
    if (form.order_type === 'delivery' && !form.address) return toast.error('Delivery address required');

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        address: form.order_type === 'pickup' ? 'Pickup at restaurant' : form.address,
        items: items.map(({ item_id, name, price, quantity }) => ({ item_id, name, price, quantity })),
      };
      const { data } = await api.post('/orders', payload);
      clear();
      toast.success('Order placed! We will call you shortly.');
      navigate(`/order-confirmed/${data.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid=\"page-cart\">
      <section className=\"pt-20 pb-12 border-b border-mr-border\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"overline text-mr-terracotta\">Your Order</div>
          <h1 className=\"font-serif text-6xl lg:text-7xl mt-4 tracking-tight font-light\">Cart &amp; Checkout</h1>
        </div>
      </section>

      <section className=\"py-16\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12\">
          {/* Items */}
          <div className=\"lg:col-span-7\">
            {items.length === 0 ? (
              <div className=\"border border-mr-border rounded-sm p-12 text-center\" data-testid=\"empty-cart\">
                <div className=\"font-serif text-3xl\">Your cart is empty.</div>
                <p className=\"mt-3 text-mr-text2 font-light\">Try the Mutton Kasa — it changed lives.</p>
                <Link to=\"/menu\" className=\"btn-primary mt-8 inline-flex\">Browse Menu <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className=\"space-y-5\" data-testid=\"cart-items\">
                {items.map(it => (
                  <div key={it.item_id} className=\"flex gap-5 border-b border-mr-border pb-5\">
                    {it.image_url && <img src={it.image_url} alt={it.name} className=\"w-24 h-24 object-cover rounded-sm\" />}
                    <div className=\"flex-1\">
                      <div className=\"flex items-start justify-between gap-4\">
                        <div className=\"font-serif text-2xl\">{it.name}</div>
                        <button onClick={() => remove(it.item_id)} className=\"text-mr-text2 hover:text-mr-terracotta\" data-testid={`remove-${it.item_id}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className=\"mt-2 text-sm text-mr-text2 font-light\">₹{it.price.toFixed(0)} each</div>
                      <div className=\"mt-3 flex items-center justify-between\">
                        <div className=\"inline-flex items-center border border-mr-border rounded-full\">
                          <button onClick={() => updateQty(it.item_id, it.quantity - 1)} className=\"p-2 hover:bg-mr-surface rounded-l-full\" data-testid={`dec-${it.item_id}`}><Minus size={14} /></button>
                          <span className=\"px-4 text-sm font-medium\" data-testid={`qty-${it.item_id}`}>{it.quantity}</span>
                          <button onClick={() => updateQty(it.item_id, it.quantity + 1)} className=\"p-2 hover:bg-mr-surface rounded-r-full\" data-testid={`inc-${it.item_id}`}><Plus size={14} /></button>
                        </div>
                        <div className=\"font-serif text-xl text-mr-terracotta\">₹{(it.price * it.quantity).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout */}
          <div className=\"lg:col-span-5\">
            <div className=\"bg-mr-surface border border-mr-border rounded-sm p-8 lg:sticky lg:top-28\">
              <div className=\"overline text-mr-terracotta mb-4\">Checkout</div>
              <div className=\"space-y-3 pb-5 border-b border-mr-border\">
                <Row label=\"Subtotal\" val={`₹${subtotal.toFixed(0)}`} testId=\"subtotal\" />
                <Row label=\"GST (5%)\" val={`₹${tax.toFixed(0)}`} testId=\"tax\" />
              </div>
              <div className=\"flex justify-between items-center pt-5 mb-6\">
                <div className=\"font-serif text-2xl\">Total</div>
                <div className=\"font-serif text-3xl text-mr-terracotta\" data-testid=\"total\">₹{total.toFixed(0)}</div>
              </div>

              <form onSubmit={submit} className=\"space-y-4\" data-testid=\"checkout-form\">
                <div className=\"flex gap-2 mb-1\">
                  {['delivery', 'pickup'].map(t => (
                    <label key={t} className={`flex-1 py-3 rounded-full text-xs uppercase tracking-widest text-center cursor-pointer border transition ${form.order_type === t ? 'bg-mr-charcoal text-mr-bg border-mr-charcoal' : 'border-mr-border text-mr-charcoal hover:border-mr-charcoal'}`}>
                      <input type=\"radio\" name=\"order_type\" value={t} checked={form.order_type === t} onChange={change} className=\"sr-only\" data-testid={`order-type-${t}`} />
                      {t}
                    </label>
                  ))}
                </div>

                <Field label=\"Full Name\" name=\"customer_name\" value={form.customer_name} onChange={change} required testId=\"input-name\" />
                <Field label=\"Phone\" name=\"phone\" value={form.phone} onChange={change} required type=\"tel\" testId=\"input-phone\" />
                {form.order_type === 'delivery' && (
                  <Field label=\"Delivery Address\" name=\"address\" value={form.address} onChange={change} required textarea testId=\"input-address\" />
                )}
                <Field label=\"Notes (optional)\" name=\"notes\" value={form.notes} onChange={change} textarea testId=\"input-notes\" />

                <button type=\"submit\" disabled={submitting || items.length === 0} className=\"btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed\" data-testid=\"place-order-btn\">
                  {submitting ? 'Placing order…' : `Place Order · ₹${total.toFixed(0)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, val, testId }) {
  return (
    <div className=\"flex justify-between text-sm\">
      <span className=\"text-mr-text2 font-light\">{label}</span>
      <span className=\"font-medium\" data-testid={testId}>{val}</span>
    </div>
  );
}

function Field({ label, name, value, onChange, required, type = 'text', textarea, testId }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className=\"block\">
      <span className=\"overline text-mr-text2 block mb-1.5\">{label}{required && <span className=\"text-mr-terracotta\">*</span>}</span>
      <Tag
        name={name} value={value} onChange={onChange} required={required} type={type} rows={textarea ? 3 : undefined}
        data-testid={testId}
        className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light transition\"
      />
    </label>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Cart.jsx