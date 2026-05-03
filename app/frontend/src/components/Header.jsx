Now let me create the layout components and main pages:
Action: file_editor create /app/frontend/src/components/Header.jsx --file-text "import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reserve' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className=\"sticky top-0 z-40 mr-glass\" data-testid=\"site-header\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-10\">
        <div className=\"flex items-center justify-between h-20\">
          <Link to=\"/\" className=\"flex items-center gap-3 group\" data-testid=\"logo-link\">
            <div className=\"w-10 h-10 rounded-full bg-mr-charcoal text-mr-bg flex items-center justify-center\">
              <UtensilsCrossed size={18} strokeWidth={1.4} />
            </div>
            <div className=\"leading-tight\">
              <div className=\"font-serif text-2xl tracking-tight text-mr-charcoal\">Mutton Rajaa</div>
              <div className=\"overline text-mr-text2\">Authentic Odia Kitchen</div>
            </div>
          </Link>

          <nav className=\"hidden lg:flex items-center gap-9\">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-sans tracking-wider uppercase link-underline ${isActive ? 'text-mr-terracotta' : 'text-mr-charcoal hover:text-mr-terracotta'}`
                }
                data-testid={`nav-${n.label.toLowerCase()}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className=\"flex items-center gap-3\">
            <button
              onClick={() => navigate('/cart')}
              className=\"relative p-2 rounded-full hover:bg-mr-surface transition\"
              aria-label=\"Cart\"
              data-testid=\"cart-button\"
            >
              <ShoppingBag size={20} strokeWidth={1.5} className=\"text-mr-charcoal\" />
              {count > 0 && (
                <span data-testid=\"cart-count\" className=\"absolute -top-1 -right-1 bg-mr-terracotta text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center\">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/menu')}
              className=\"hidden md:inline-flex btn-primary\"
              data-testid=\"header-order-cta\"
            >
              Order Now
            </button>

            <button
              className=\"lg:hidden p-2\"
              onClick={() => setOpen(!open)}
              aria-label=\"menu\"
              data-testid=\"mobile-menu-toggle\"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className=\"lg:hidden pb-6 pt-2 border-t border-mr-border\" data-testid=\"mobile-nav\">
            <div className=\"flex flex-col gap-3\">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `py-2 text-base ${isActive ? 'text-mr-terracotta' : 'text-mr-charcoal'}`}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
"
Observation: Create successful: /app/frontend/src/components/Header.jsx