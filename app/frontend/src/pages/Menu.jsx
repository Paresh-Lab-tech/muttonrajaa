
Action: file_editor create /app/frontend/src/pages/Menu.jsx --file-text "import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Plus, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mutton', label: 'Mutton Specials' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'traditional', label: 'Traditional Odia' },
  { id: 'sides', label: 'Sides & Breads' },
  { id: 'beverages', label: 'Beverages' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const { add, count } = useCart();

  useEffect(() => {
    api.get('/menu').then(r => setItems(r.data)).catch(() => toast.error('Could not load menu')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => activeCat === 'all' ? items : items.filter(i => i.category === activeCat), [items, activeCat]);

  return (
    <div data-testid=\"page-menu\">
      <section className=\"pt-20 pb-12 border-b border-mr-border\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"overline text-mr-terracotta\">The Carte</div>
          <h1 className=\"font-serif text-6xl lg:text-7xl mt-4 tracking-tight font-light\">Menu</h1>
          <p className=\"mt-6 max-w-2xl text-lg font-light leading-relaxed text-mr-text2\">
            All dishes are cooked to order in mustard oil, finished with hand-pounded spice and ghee tempering. Spice levels are honest — please ask if you'd like us to dial up or down.
          </p>
        </div>
      </section>

      <section className=\"sticky top-20 z-30 mr-glass border-b border-mr-border\" data-testid=\"menu-categories\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-4\">
          <div className=\"flex gap-2 overflow-x-auto no-scrollbar\">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                data-testid={`cat-${c.id}`}
                className={`shrink-0 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium border transition
                  ${activeCat === c.id ? 'bg-mr-charcoal text-mr-bg border-mr-charcoal' : 'border-mr-border text-mr-charcoal hover:border-mr-charcoal'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className=\"py-16 lg:py-24\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          {loading ? (
            <div className=\"text-center py-20 text-mr-text2 font-light\" data-testid=\"menu-loading\">Stirring the pot…</div>
          ) : filtered.length === 0 ? (
            <div className=\"text-center py-20 text-mr-text2 font-light\">No dishes in this category yet.</div>
          ) : (
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10\" data-testid=\"menu-grid\">
              {filtered.map(item => (
                <article key={item.id} className=\"group flex flex-col bg-mr-surface/40 border border-mr-border/60 rounded-sm overflow-hidden hover:shadow-[0_20px_45px_-25px_rgba(44,36,30,0.4)] transition-all\" data-testid={`menu-item-${item.id}`}>
                  <div className=\"mr-img-frame aspect-[4/3]\">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} loading=\"lazy\" />
                    ) : (
                      <div className=\"w-full h-full bg-mr-surface2\" />
                    )}
                    {item.is_signature && (
                      <span className=\"absolute top-3 left-3 bg-mr-charcoal text-mr-bg text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full\">Signature</span>
                    )}
                  </div>
                  <div className=\"p-6 flex-1 flex flex-col\">
                    <div className=\"flex items-start justify-between gap-4\">
                      <h3 className=\"font-serif text-2xl leading-tight tracking-tight\">{item.name}</h3>
                      <div className=\"font-serif text-2xl text-mr-terracotta whitespace-nowrap\">₹{item.price.toFixed(0)}</div>
                    </div>
                    <p className=\"text-sm font-light text-mr-text2 mt-3 flex-1 leading-relaxed\">{item.description}</p>
                    <div className=\"mt-5 flex items-center justify-between\">
                      <div className=\"flex items-center gap-1\" aria-label={`spice level ${item.spice_level}`}>
                        {[1,2,3].map(n => (
                          <Flame key={n} size={14} className={n <= item.spice_level ? 'text-mr-terracotta fill-mr-terracotta' : 'text-mr-border'} />
                        ))}
                      </div>
                      <button
                        onClick={() => { add(item); toast.success(`${item.name} added to cart`); }}
                        className=\"inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium px-4 py-2 rounded-full bg-mr-charcoal text-mr-bg hover:bg-mr-terracotta transition\"
                        data-testid={`add-${item.id}`}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {count > 0 && (
        <div className=\"fixed bottom-6 right-6 z-40\">
          <Link to=\"/cart\" className=\"btn-primary shadow-2xl\" data-testid=\"floating-cart-cta\">
            View Cart ({count})
          </Link>
        </div>
      )}
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Menu.jsx