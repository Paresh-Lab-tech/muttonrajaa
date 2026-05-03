
Action: file_editor create /app/frontend/src/components/Footer.jsx --file-text "import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className=\"bg-mr-charcoal text-mr-bg mt-32\" data-testid=\"site-footer\">
      <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-20\">
        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-12\">
          <div className=\"md:col-span-5\">
            <div className=\"font-serif text-5xl tracking-tight\">Mutton Rajaa</div>
            <p className=\"mt-6 text-mr-bg/70 max-w-md font-light leading-relaxed\">
              An ode to Odia heritage cooking. Slow-stewed mutton, fire-kissed seafood from Chilika, and the cool comfort of pakhala — all under one terracotta roof in Kalinganagar.
            </p>
            <div className=\"mt-8 flex gap-4\">
              <a href=\"#\" aria-label=\"instagram\" className=\"w-10 h-10 rounded-full border border-mr-bg/25 flex items-center justify-center hover:bg-mr-terracotta hover:border-mr-terracotta transition\" data-testid=\"footer-instagram\">
                <Instagram size={16} />
              </a>
              <a href=\"#\" aria-label=\"facebook\" className=\"w-10 h-10 rounded-full border border-mr-bg/25 flex items-center justify-center hover:bg-mr-terracotta hover:border-mr-terracotta transition\" data-testid=\"footer-facebook\">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div className=\"md:col-span-3\">
            <div className=\"overline text-mr-saffron mb-4\">Visit</div>
            <div className=\"space-y-3 text-sm font-light leading-relaxed\">
              <div className=\"flex gap-3\"><MapPin size={16} className=\"mt-0.5 shrink-0\" /><span>Near Tata Ariana, Kalinganagar,<br/>Bhubaneswar, Odisha 751029</span></div>
              <div className=\"flex gap-3\"><Phone size={16} className=\"mt-0.5 shrink-0\" /><span>+91 98765 43210</span></div>
              <div className=\"flex gap-3\"><Clock size={16} className=\"mt-0.5 shrink-0\" /><span>Daily 11:30am – 11:00pm</span></div>
            </div>
          </div>

          <div className=\"md:col-span-2\">
            <div className=\"overline text-mr-saffron mb-4\">Explore</div>
            <ul className=\"space-y-2 text-sm font-light\">
              <li><Link to=\"/menu\" className=\"hover:text-mr-terracotta\">Menu</Link></li>
              <li><Link to=\"/reservations\" className=\"hover:text-mr-terracotta\">Reservations</Link></li>
              <li><Link to=\"/gallery\" className=\"hover:text-mr-terracotta\">Gallery</Link></li>
              <li><Link to=\"/about\" className=\"hover:text-mr-terracotta\">About</Link></li>
            </ul>
          </div>

          <div className=\"md:col-span-2\">
            <div className=\"overline text-mr-saffron mb-4\">Account</div>
            <ul className=\"space-y-2 text-sm font-light\">
              <li><Link to=\"/admin/login\" className=\"hover:text-mr-terracotta\" data-testid=\"footer-admin-link\">Staff Login</Link></li>
              <li><Link to=\"/contact\" className=\"hover:text-mr-terracotta\">Press &amp; Inquiries</Link></li>
            </ul>
          </div>
        </div>

        <div className=\"border-t border-mr-bg/15 mt-16 pt-8 flex flex-col md:flex-row gap-3 md:items-center justify-between text-xs text-mr-bg/60 font-light tracking-wider\">
          <div>© {new Date().getFullYear()} Mutton Rajaa. Cooked with patience.</div>
          <div className=\"italic font-serif\">Sva­ad ra Rajaa — the king of taste.</div>
        </div>
      </div>
    </footer>
  );
}
"
Observation: Create successful: /app/frontend/src/components/Footer.jsx