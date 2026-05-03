
Action: file_editor create /app/frontend/src/pages/About.jsx --file-text "import React from 'react';
import { Link } from 'react-router-dom';

const IMG1 = 'https://images.pexels.com/photos/15751615/pexels-photo-15751615.jpeg?auto=compress&cs=tinysrgb&w=1200';
const IMG2 = 'https://images.pexels.com/photos/5789179/pexels-photo-5789179.jpeg?auto=compress&cs=tinysrgb&w=1000';
const IMG3 = 'https://images.unsplash.com/photo-1545247181-516773cae754?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000';

export default function About() {
  return (
    <div data-testid=\"page-about\">
      <section className=\"pt-24 pb-12\">
        <div className=\"max-w-5xl mx-auto px-6 lg:px-10\">
          <div className=\"overline text-mr-terracotta\">Our Story</div>
          <h1 className=\"font-serif text-6xl lg:text-8xl mt-6 leading-[0.95] tracking-tight font-light\">
            A kitchen that<br/>refuses to <em className=\"italic text-mr-terracotta\">hurry</em>.
          </h1>
        </div>
      </section>

      <section className=\"py-16 lg:py-24\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start\">
          <div className=\"lg:col-span-6 lg:sticky lg:top-28\">
            <div className=\"mr-img-frame aspect-[4/5] shadow-[0_30px_60px_-25px_rgba(44,36,30,0.35)]\">
              <img src={IMG1} alt=\"The kitchen\" />
            </div>
          </div>
          <div className=\"lg:col-span-6 space-y-10 font-light leading-relaxed text-lg text-mr-text2\">
            <p>
              <span className=\"font-serif italic text-3xl text-mr-charcoal float-left mr-3 leading-none mt-1\">M</span>utton Rajaa was born from a single iron handi, a sack of mustard seeds, and an obstinate belief that mutton was meant to be coaxed, not rushed. Our founder Bibhu Bhai grew up in a household where Sunday meant a four-hour kasa — onions browned slow, garlic pounded fresh, and mutton that fell off the bone before the rice was even rinsed.
            </p>
            <p>
              Today the same recipe runs in our kitchen. We refuse pressure cookers. We don't believe in shortcuts. Every gravy is finished in an open kadhai, every spice is tempered to order, and every plate that leaves our pass tastes like someone's grandmother made it.
            </p>
            <h3 className=\"font-serif text-4xl text-mr-charcoal pt-6\">The pantry, sourced honestly.</h3>
            <p>
              Our mutton arrives every morning from a single farm in Khurda. Mustard oil from a hand press in Cuttack. Chilika prawns and crab from the lagoon's southern shore. Wild mushrooms (chattu) from foragers in Similipal. We pay full price, every time, because the food is only as honest as the kitchen behind it.
            </p>

            <div className=\"grid grid-cols-2 gap-6 pt-6\">
              <div className=\"mr-img-frame aspect-square\">
                <img src={IMG2} alt=\"Spices\" />
              </div>
              <div className=\"mr-img-frame aspect-square\">
                <img src={IMG3} alt=\"Mutton dish\" />
              </div>
            </div>

            <h3 className=\"font-serif text-4xl text-mr-charcoal pt-6\">Why \"Rajaa\"?</h3>
            <p>
              Rajaa means king. Not because we're proud — but because in our part of Odisha, mutton has always been the king of the meal, the dish that arrives when family comes home, when the harvest is in, when something must be celebrated. We're just the kitchen that holds the crown for an evening.
            </p>

            <div className=\"pt-6\">
              <Link to=\"/reservations\" className=\"btn-primary\" data-testid=\"about-reserve-cta\">Book your table</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/About.jsx