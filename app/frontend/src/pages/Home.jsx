Now let me create all the pages:
Action: file_editor create /app/frontend/src/pages/Home.jsx --file-text "import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Leaf, Award } from 'lucide-react';

const HERO = 'https://images.unsplash.com/photo-1710091692253-a31df7ba2a6d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600';
const AMB = 'https://images.pexels.com/photos/15751615/pexels-photo-15751615.jpeg?auto=compress&cs=tinysrgb&w=1200';
const SP1 = 'https://images.pexels.com/photos/5789179/pexels-photo-5789179.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function Home() {
  return (
    <div data-testid=\"page-home\">
      {/* HERO */}
      <section className=\"relative min-h-[92vh] flex items-end overflow-hidden\" data-testid=\"hero-section\">
        <img src={HERO} alt=\"Mutton Kasa\" className=\"absolute inset-0 w-full h-full object-cover\" />
        <div className=\"absolute inset-0 bg-gradient-to-t from-mr-charcoal via-mr-charcoal/50 to-transparent\" />
        <div className=\"absolute inset-0 mr-noise opacity-40\" />

        <div className=\"relative max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28 w-full\">
          <div className=\"max-w-3xl\">
            <div className=\"overline text-mr-saffron mb-6 mr-rise\">Est. Bhubaneswar · Kalinganagar</div>
            <h1 className=\"font-serif text-mr-bg text-6xl sm:text-7xl lg:text-[7.5rem] leading-[0.95] tracking-tight font-light mr-rise\">
              The king of <em className=\"italic text-mr-terracotta\">mutton</em>,<br/>
              <span className=\"text-mr-bg/85\">cooked the </span>
              <span className=\"text-mr-bg\">Odia way</span>.
            </h1>
            <p className=\"mt-8 text-mr-bg/75 text-lg max-w-xl font-light leading-relaxed mr-rise\" style={{animationDelay: '180ms'}}>
              Slow-simmered curries, fire-kissed Chilika crab, and the unmistakable bite of Similipal forest spices. A 4.7★ Bhubaneswar institution.
            </p>
            <div className=\"mt-10 flex flex-wrap gap-4 mr-rise\" style={{animationDelay: '300ms'}}>
              <Link to=\"/menu\" className=\"btn-primary\" data-testid=\"hero-order-cta\">
                Order Online <ArrowRight size={16} />
              </Link>
              <Link to=\"/reservations\" className=\"btn-ghost text-mr-bg border-mr-bg/40 hover:bg-mr-bg/10 hover:border-mr-bg\" data-testid=\"hero-reserve-cta\">
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className=\"border-y border-mr-border bg-mr-surface overflow-hidden\">
        <div className=\"mr-marquee-track py-5 text-mr-charcoal\">
          {Array.from({length: 2}).map((_, j) => (
            <div key={j} className=\"flex shrink-0 items-center gap-12 px-6 font-serif text-2xl italic\">
              {['Mutton Kasa', 'Similipal Mutton', 'Chingudi Cheha', 'Pakhala Bhata', 'Chilika Crab', 'Kalija Kasa', 'Macha Besara'].map((d, i) => (
                <React.Fragment key={i}>
                  <span>{d}</span>
                  <span className=\"text-mr-terracotta\">✦</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section className=\"py-28 lg:py-36\" data-testid=\"story-section\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center\">
          <div className=\"lg:col-span-5\">
            <div className=\"mr-img-frame aspect-[4/5] shadow-[0_30px_60px_-25px_rgba(44,36,30,0.35)]\">
              <img src={AMB} alt=\"Restaurant ambiance\" />
            </div>
          </div>
          <div className=\"lg:col-span-7\">
            <div className=\"overline text-mr-terracotta\">Our Heritage</div>
            <h2 className=\"font-serif text-5xl lg:text-6xl mt-4 leading-[1.05] tracking-tight\">
              Three generations of <em className=\"italic text-mr-terracotta\">slow fire</em> and stone-pounded spice.
            </h2>
            <p className=\"mt-8 text-lg font-light leading-relaxed text-mr-text2 max-w-xl\">
              Mutton Rajaa began as a humble roadside kitchen on the road to Tata Ariana. Today it is Bhubaneswar's most-loved address for authentic, home-style mutton. We refuse shortcuts: every curry is built on hand-pounded panchphutana, mustard oil from Cuttack, and meat that arrives the morning it is cooked.
            </p>

            <div className=\"mt-10 grid grid-cols-3 gap-6 max-w-xl\">
              {[
                { icon: Flame, k: '4.7★', v: 'Google Rating' },
                { icon: Award, k: '12+', v: 'Years of Service' },
                { icon: Leaf, k: '100%', v: 'Locally Sourced' },
              ].map((s, i) => (
                <div key={i} className=\"border-l-2 border-mr-terracotta pl-4\">
                  <s.icon size={18} className=\"text-mr-terracotta mb-2\" />
                  <div className=\"font-serif text-3xl\">{s.k}</div>
                  <div className=\"overline text-mr-text2 mt-1 text-[10px]\">{s.v}</div>
                </div>
              ))}
            </div>

            <Link to=\"/about\" className=\"mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium link-underline\">
              Read the full story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SIGNATURES — bento */}
      <section className=\"bg-mr-surface py-28 lg:py-36 relative\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16\">
            <div>
              <div className=\"overline text-mr-terracotta\">The Signatures</div>
              <h2 className=\"font-serif text-5xl lg:text-6xl mt-4 tracking-tight\">Dishes that earned the title.</h2>
            </div>
            <Link to=\"/menu\" className=\"btn-ghost self-start lg:self-end\" data-testid=\"signatures-view-menu\">
              View Full Menu <ArrowRight size={14} />
            </Link>
          </div>

          <div className=\"grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8\">
            <Card cls=\"md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[640px]\"
              img=\"https://images.unsplash.com/photo-1710091692253-a31df7ba2a6d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1100\"
              title=\"Mutton Kasa\"
              tag=\"Signature\"
              desc=\"Thick, fiery, slow-stewed onion-tomato gravy clinging to falling-tender mutton.\"
              price=\"₹380\" />
            <Card cls=\"md:col-span-5 aspect-[4/3]\"
              img=\"https://images.unsplash.com/photo-1559847844-5315695dadae?crop=entropy&cs=srgb&fm=jpg&q=85&w=900\"
              title=\"Chingudi Cheha\"
              tag=\"Coastal\"
              desc=\"Mustard-tempered prawn, light and unmistakably Odia.\"
              price=\"₹360\" />
            <Card cls=\"md:col-span-5 aspect-[4/3]\"
              img=\"https://images.unsplash.com/photo-1653403020036-22f7e6922912?crop=entropy&cs=srgb&fm=jpg&q=85&w=900\"
              title=\"Chilika Crab Masala\"
              tag=\"From the lake\"
              desc=\"Brackish-water crab, roasted spice masala, sweet-savoury bite.\"
              price=\"₹520\" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className=\"py-28\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"relative overflow-hidden rounded-sm bg-mr-terracotta text-mr-bg p-12 lg:p-20\">
            <img src={SP1} alt=\"\" className=\"absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-multiply\" />
            <div className=\"relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center\">
              <div>
                <div className=\"overline text-mr-bg/85\">Reserve a table</div>
                <h2 className=\"font-serif text-5xl lg:text-6xl mt-4 leading-[1.05] tracking-tight\">
                  Hold your seat at the <em className=\"italic\">Rajaa's</em> table.
                </h2>
              </div>
              <div className=\"lg:justify-self-end\">
                <p className=\"text-mr-bg/85 mb-6 max-w-md font-light leading-relaxed\">
                  Weekends fill fast. Block your spot in 30 seconds — no payment, no fuss. We'll confirm by phone.
                </p>
             <Link
                to=\"/reservations\"
                className=\"inline-flex items-center gap-2 px-6 py-[0.85rem] rounded-full text-mr-bg border border-mr-bg/40 hover:bg-mr-bg/10 hover:border-mr-bg transition uppercase tracking-widest font-medium text-xs\"
                data-testid=\"hero-reserve-cta\"
              >
                Reserve a Table
             </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ cls, img, title, tag, desc, price }) {
  return (
    <div className={`${cls} mr-img-frame group bg-mr-charcoal relative`}>
      <img src={img} alt={title} />
      <div className=\"absolute inset-0 bg-gradient-to-t from-mr-charcoal via-mr-charcoal/30 to-transparent\" />
      <div className=\"absolute inset-0 p-8 flex flex-col justify-end text-mr-bg\">
        <div className=\"overline text-mr-saffron mb-2\">{tag}</div>
        <div className=\"font-serif text-3xl lg:text-4xl\">{title}</div>
        <div className=\"text-mr-bg/80 font-light text-sm mt-2 max-w-md\">{desc}</div>
        <div className=\"mt-4 font-serif text-xl\">{price}</div>
      </div>
    </div>
  );
}