
Action: file_editor create /app/frontend/src/pages/Reservations.jsx --file-text "import React, { useState } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Calendar, Clock, Users } from 'lucide-react';

const TIMES = ['12:00','12:30','13:00','13:30','14:00','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

export default function Reservations() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', party_size: 2, date: '', time: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return toast.error('Please fill all required fields');
    setSubmitting(true);
    try {
      const payload = { ...form, party_size: Number(form.party_size) };
      const { data } = await api.post('/reservations', payload);
      setDone(data);
      toast.success('Reservation requested! We will confirm shortly.');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Could not submit reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div data-testid=\"page-reservations\">
      <section className=\"pt-20 pb-12 border-b border-mr-border\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"overline text-mr-terracotta\">Reservations</div>
          <h1 className=\"font-serif text-6xl lg:text-7xl mt-4 tracking-tight font-light\">Hold a table.</h1>
          <p className=\"mt-6 max-w-2xl text-lg font-light leading-relaxed text-mr-text2\">
            Bookings open daily 11:30am – 11:00pm. We'll call your phone within 30 minutes to confirm.
          </p>
        </div>
      </section>

      <section className=\"py-16 lg:py-24\">
        <div className=\"max-w-5xl mx-auto px-6 lg:px-10\">
          {done ? (
            <div className=\"bg-mr-surface border border-mr-border p-12 text-center rounded-sm\" data-testid=\"reservation-success\">
              <div className=\"overline text-mr-success\">Confirmed</div>
              <h2 className=\"font-serif text-5xl mt-4\">See you soon, {done.name.split(' ')[0]}.</h2>
              <p className=\"mt-4 text-mr-text2 font-light\">
                Table for {done.party_size} on <strong>{done.date}</strong> at <strong>{done.time}</strong>.
              </p>
              <p className=\"mt-2 text-sm text-mr-text2 font-light\">Reference #{done.id.slice(0, 8).toUpperCase()}</p>
              <button onClick={() => { setDone(null); setForm({ name: '', phone: '', email: '', party_size: 2, date: '', time: '', notes: '' }); }} className=\"btn-ghost mt-8\" data-testid=\"reservation-new\">
                Make Another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className=\"grid grid-cols-1 md:grid-cols-2 gap-6\" data-testid=\"reservation-form\">
              <Field label=\"Full Name\" name=\"name\" value={form.name} onChange={change} required testId=\"res-name\" />
              <Field label=\"Phone\" name=\"phone\" value={form.phone} onChange={change} required type=\"tel\" testId=\"res-phone\" />
              <Field label=\"Email (optional)\" name=\"email\" value={form.email} onChange={change} type=\"email\" testId=\"res-email\" />

              <label className=\"block\" data-testid=\"res-party-wrapper\">
                <span className=\"overline text-mr-text2 block mb-1.5 flex items-center gap-1.5\"><Users size={12} /> Party Size *</span>
                <select name=\"party_size\" value={form.party_size} onChange={change} required data-testid=\"res-party\"
                  className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light\">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                </select>
              </label>

              <label className=\"block\">
                <span className=\"overline text-mr-text2 block mb-1.5 flex items-center gap-1.5\"><Calendar size={12} /> Date *</span>
                <input type=\"date\" name=\"date\" min={today} value={form.date} onChange={change} required data-testid=\"res-date\"
                  className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light\" />
              </label>

              <label className=\"block\">
                <span className=\"overline text-mr-text2 block mb-1.5 flex items-center gap-1.5\"><Clock size={12} /> Time *</span>
                <select name=\"time\" value={form.time} onChange={change} required data-testid=\"res-time\"
                  className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light\">
                  <option value=\"\">Choose a time</option>
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <div className=\"md:col-span-2\">
                <Field label=\"Special Requests (optional)\" name=\"notes\" value={form.notes} onChange={change} textarea testId=\"res-notes\" />
              </div>

              <div className=\"md:col-span-2\">
                <button type=\"submit\" disabled={submitting} className=\"btn-primary w-full md:w-auto justify-center\" data-testid=\"res-submit\">
                  {submitting ? 'Submitting…' : 'Request Reservation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, value, onChange, required, type = 'text', textarea, testId }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className=\"block\">
      <span className=\"overline text-mr-text2 block mb-1.5\">{label}{required && <span className=\"text-mr-terracotta\"> *</span>}</span>
      <Tag
        name={name} value={value} onChange={onChange} required={required} type={type} rows={textarea ? 3 : undefined}
        data-testid={testId}
        className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light\"
      />
    </label>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Reservations.jsx