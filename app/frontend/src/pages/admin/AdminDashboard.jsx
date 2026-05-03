"import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { LogOut, Trash2, Plus, Edit3, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'menu', label: 'Menu' },
];

const STATUS_OPTS = {
  orders: ['received', 'preparing', 'ready', 'delivered', 'cancelled'],
  reservations: ['pending', 'confirmed', 'cancelled'],
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('mr_admin_token')) navigate('/admin/login');
    else loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [o, r, m] = await Promise.all([
        adminApi().get('/admin/orders'),
        adminApi().get('/admin/reservations'),
        adminApi().get('/menu'),
      ]);
      setOrders(o.data); setReservations(r.data); setMenu(m.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('mr_admin_token');
        navigate('/admin/login');
      } else toast.error('Failed to load data');
    }
  };

  const logout = () => {
    localStorage.removeItem('mr_admin_token');
    navigate('/admin/login');
  };

  const updateStatus = async (kind, id, status) => {
    try {
      await adminApi().put(`/admin/${kind}/${id}`, { status });
      toast.success('Updated');
      loadAll();
    } catch { toast.error('Failed'); }
  };

  const deleteMenu = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await adminApi().delete(`/admin/menu/${id}`);
      toast.success('Deleted');
      loadAll();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className=\"bg-mr-surface min-h-screen\" data-testid=\"page-admin-dashboard\">
      <div className=\"border-b border-mr-border bg-mr-bg\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between\">
          <div>
            <div className=\"overline text-mr-terracotta\">Control Room</div>
            <div className=\"font-serif text-3xl mt-1\">Admin Dashboard</div>
          </div>
          <button onClick={logout} className=\"btn-ghost\" data-testid=\"admin-logout\">
            <LogOut size={14} /> Logout
          </button>
        </div>
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 flex gap-1 -mb-px\">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} data-testid={`tab-${t.id}`}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-medium border-b-2 transition ${tab === t.id ? 'border-mr-terracotta text-mr-terracotta' : 'border-transparent text-mr-text2 hover:text-mr-charcoal'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-10\">
        {tab === 'orders' && (
          <div data-testid=\"orders-table\">
            <h2 className=\"font-serif text-3xl mb-6\">{orders.length} Orders</h2>
            <Table cols={['Time', 'Customer', 'Type', 'Items', 'Total', 'Status']}>
              {orders.map(o => (
                <tr key={o.id} className=\"border-b border-mr-border\">
                  <td className=\"py-4 px-3 text-sm font-light\">{new Date(o.created_at).toLocaleString()}</td>
                  <td className=\"py-4 px-3 text-sm\">
                    <div className=\"font-medium\">{o.customer_name}</div>
                    <div className=\"text-xs text-mr-text2\">{o.phone}</div>
                  </td>
                  <td className=\"py-4 px-3 text-sm capitalize\">{o.order_type}</td>
                  <td className=\"py-4 px-3 text-sm font-light\">{o.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}</td>
                  <td className=\"py-4 px-3 font-serif text-lg text-mr-terracotta\">₹{o.total.toFixed(0)}</td>
                  <td className=\"py-4 px-3\">
                    <select value={o.status} onChange={e => updateStatus('orders', o.id, e.target.value)} data-testid={`order-status-${o.id}`}
                      className=\"bg-mr-bg border border-mr-border rounded-sm px-2 py-1.5 text-xs\">
                      {STATUS_OPTS.orders.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className=\"text-center py-12 text-mr-text2 font-light\">No orders yet.</td></tr>}
            </Table>
          </div>
        )}

        {tab === 'reservations' && (
          <div data-testid=\"reservations-table\">
            <h2 className=\"font-serif text-3xl mb-6\">{reservations.length} Reservations</h2>
            <Table cols={['Created', 'Guest', 'Party', 'Date / Time', 'Notes', 'Status']}>
              {reservations.map(r => (
                <tr key={r.id} className=\"border-b border-mr-border\">
                  <td className=\"py-4 px-3 text-sm font-light\">{new Date(r.created_at).toLocaleString()}</td>
                  <td className=\"py-4 px-3 text-sm\">
                    <div className=\"font-medium\">{r.name}</div>
                    <div className=\"text-xs text-mr-text2\">{r.phone}</div>
                  </td>
                  <td className=\"py-4 px-3 text-sm\">{r.party_size}</td>
                  <td className=\"py-4 px-3 text-sm\">{r.date} · {r.time}</td>
                  <td className=\"py-4 px-3 text-xs text-mr-text2 font-light max-w-xs truncate\">{r.notes || '—'}</td>
                  <td className=\"py-4 px-3\">
                    <select value={r.status} onChange={e => updateStatus('reservations', r.id, e.target.value)} data-testid={`res-status-${r.id}`}
                      className=\"bg-mr-bg border border-mr-border rounded-sm px-2 py-1.5 text-xs\">
                      {STATUS_OPTS.reservations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && <tr><td colSpan={6} className=\"text-center py-12 text-mr-text2 font-light\">No reservations yet.</td></tr>}
            </Table>
          </div>
        )}

        {tab === 'menu' && (
          <div data-testid=\"menu-table\">
            <div className=\"flex items-center justify-between mb-6\">
              <h2 className=\"font-serif text-3xl\">{menu.length} Menu Items</h2>
              <button onClick={() => { setEditing(null); setShowForm(true); }} className=\"btn-primary\" data-testid=\"add-menu-btn\">
                <Plus size={14} /> Add Item
              </button>
            </div>
            <Table cols={['Item', 'Category', 'Price', 'Signature', '']}>
              {menu.map(m => (
                <tr key={m.id} className=\"border-b border-mr-border\">
                  <td className=\"py-4 px-3 text-sm\">
                    <div className=\"font-medium\">{m.name}</div>
                    <div className=\"text-xs text-mr-text2 font-light max-w-md truncate\">{m.description}</div>
                  </td>
                  <td className=\"py-4 px-3 text-sm capitalize\">{m.category}</td>
                  <td className=\"py-4 px-3 font-serif text-lg text-mr-terracotta\">₹{m.price.toFixed(0)}</td>
                  <td className=\"py-4 px-3 text-sm\">{m.is_signature ? <Check size={16} className=\"text-mr-success\" /> : <X size={16} className=\"text-mr-text2\" />}</td>
                  <td className=\"py-4 px-3 text-right\">
                    <button onClick={() => { setEditing(m); setShowForm(true); }} className=\"text-mr-charcoal hover:text-mr-terracotta p-1\" data-testid={`edit-${m.id}`}><Edit3 size={14} /></button>
                    <button onClick={() => deleteMenu(m.id)} className=\"text-mr-charcoal hover:text-mr-error p-1 ml-2\" data-testid={`del-${m.id}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>

      {showForm && (
        <MenuForm
          item={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadAll(); }}
        />
      )}
    </div>
  );
}

function Table({ cols, children }) {
  return (
    <div className=\"bg-mr-bg border border-mr-border rounded-sm overflow-x-auto\">
      <table className=\"w-full\">
        <thead>
          <tr className=\"border-b border-mr-border bg-mr-surface\">
            {cols.map((c, i) => (
              <th key={i} className=\"text-left overline text-mr-text2 px-3 py-3 text-[10px]\">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function MenuForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || 'mutton',
    image_url: item?.image_url || '',
    is_signature: item?.is_signature || false,
    is_available: item?.is_available !== false,
    spice_level: item?.spice_level || 2,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), spice_level: Number(form.spice_level) };
      if (item) await adminApi().put(`/admin/menu/${item.id}`, payload);
      else await adminApi().post('/admin/menu', payload);
      toast.success(item ? 'Updated' : 'Added');
      onSaved();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className=\"fixed inset-0 bg-mr-charcoal/60 z-50 flex items-center justify-center p-6\" onClick={onClose} data-testid=\"menu-form-modal\">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className=\"bg-mr-bg w-full max-w-2xl rounded-sm p-8 max-h-[90vh] overflow-y-auto\">
        <div className=\"flex items-center justify-between mb-6\">
          <h3 className=\"font-serif text-3xl\">{item ? 'Edit Item' : 'Add Item'}</h3>
          <button type=\"button\" onClick={onClose} className=\"p-2\"><X size={20} /></button>
        </div>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <Inp label=\"Name\" v={form.name} on={v => setForm({...form, name: v})} required />
          <Sel label=\"Category\" v={form.category} on={v => setForm({...form, category: v})}
            opts={[['mutton','Mutton'],['seafood','Seafood'],['traditional','Traditional Odia'],['sides','Sides'],['beverages','Beverages']]} />
          <Inp label=\"Price (₹)\" v={form.price} on={v => setForm({...form, price: v})} type=\"number\" required />
          <Sel label=\"Spice Level\" v={form.spice_level} on={v => setForm({...form, spice_level: v})}
            opts={[[1,'Mild'],[2,'Medium'],[3,'Hot']]} />
          <div className=\"md:col-span-2\"><Inp label=\"Image URL\" v={form.image_url} on={v => setForm({...form, image_url: v})} /></div>
          <div className=\"md:col-span-2\"><Inp label=\"Description\" v={form.description} on={v => setForm({...form, description: v})} textarea required /></div>
          <label className=\"flex items-center gap-2 text-sm\">
            <input type=\"checkbox\" checked={form.is_signature} onChange={e => setForm({...form, is_signature: e.target.checked})} /> Signature
          </label>
          <label className=\"flex items-center gap-2 text-sm\">
            <input type=\"checkbox\" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} /> Available
          </label>
        </div>
        <div className=\"mt-8 flex gap-3 justify-end\">
          <button type=\"button\" onClick={onClose} className=\"btn-ghost\">Cancel</button>
          <button type=\"submit\" disabled={saving} className=\"btn-primary\" data-testid=\"menu-save-btn\">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

function Inp({ label, v, on, type='text', textarea, required }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className=\"block\">
      <span className=\"overline text-mr-text2 block mb-1.5\">{label}</span>
      <Tag value={v} onChange={e => on(e.target.value)} type={type} required={required} rows={textarea ? 3 : undefined}
        className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-3 py-2.5 rounded-sm text-sm font-light\" />
    </label>
  );
}

function Sel({ label, v, on, opts }) {
  return (
    <label className=\"block\">
      <span className=\"overline text-mr-text2 block mb-1.5\">{label}</span>
      <select value={v} onChange={e => on(e.target.value)} className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-3 py-2.5 rounded-sm text-sm font-light\">
        {opts.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
      </select>
    </label>
  );
}
"