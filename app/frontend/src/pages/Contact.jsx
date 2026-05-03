
Action: file_editor create /app/frontend/src/pages/Contact.jsx --file-text "import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <div data-testid=\"page-contact\">
      <section className=\"pt-20 pb-12 border-b border-mr-border\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"overline text-mr-terracotta\">Find Us</div>
          <h1 className=\"font-serif text-6xl lg:text-7xl mt-4 tracking-tight font-light\">Come hungry.</h1>
        </div>
      </section>

      <section className=\"py-16 lg:py-24\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12\">
          <div className=\"lg:col-span-5 space-y-10\">
            <div>
              <div className=\"overline text-mr-terracotta mb-3\">Address</div>
              <div className=\"flex gap-4\">
                <MapPin size={22} className=\"text-mr-charcoal mt-1 shrink-0\" />
                <div className=\"text-lg font-light leading-relaxed\">
                  Mutton Rajaa<br/>
                  Near Tata Ariana, Kalinganagar<br/>
                  Subudhipur, Bhubaneswar<br/>
                  Odisha 751029, India
                </div>
              </div>
            </div>

            <div>
              <div className=\"overline text-mr-terracotta mb-3\">Hours</div>
              <div className=\"flex gap-4\">
                <Clock size={22} className=\"text-mr-charcoal mt-1 shrink-0\" />
                <div className=\"text-lg font-light leading-relaxed\">
                  Daily 11:30 am — 11:00 pm<br/>
                  Last orders at 10:30 pm
                </div>
              </div>
            </div>

            <div>
              <div className=\"overline text-mr-terracotta mb-3\">Reach Us</div>
              <div className=\"space-y-3\">
                <a href=\"tel:+919876543210\" className=\"flex gap-4 items-center group\" data-testid=\"contact-phone\">
                  <Phone size={22} className=\"text-mr-charcoal\" />
                  <span className=\"text-lg font-light link-underline\">+91 98765 43210</span>
                </a>
                <a href=\"mailto:hello@muttonrajaa.in\" className=\"flex gap-4 items-center group\" data-testid=\"contact-email\">
                  <Mail size={22} className=\"text-mr-charcoal\" />
                  <span className=\"text-lg font-light link-underline\">hello@muttonrajaa.in</span>
                </a>
              </div>
            </div>

            <a
              href=\"https://www.google.com/maps/search/?api=1&query=Mutton+Rajaa+Kalinganagar+Bhubaneswar\"
              target=\"_blank\" rel=\"noopener noreferrer\"
              className=\"btn-primary\"
              data-testid=\"contact-directions-btn\"
            >
              Get Directions <ArrowUpRight size={14} />
            </a>
          </div>

          <div className=\"lg:col-span-7\">
            <div className=\"mr-img-frame aspect-[4/3] border border-mr-border\">
              <iframe
                title=\"Mutton Rajaa Map\"
                src=\"https://www.google.com/maps?q=Mutton+Rajaa+Kalinganagar+Bhubaneswar&output=embed\"
                className=\"w-full h-full border-0\"
                loading=\"lazy\"
                referrerPolicy=\"no-referrer-when-downgrade\"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}