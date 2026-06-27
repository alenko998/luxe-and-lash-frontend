import { useState, useEffect, useRef } from "react";

const NAV = [
  { id: "home",     label: "Home" },
  { id: "about",    label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact",  label: "Contact" },
];

const NAILS = [
  { name: "Classic Manicure",  desc: "Shaping, cuticle care & polish",    price: "$25" },
  { name: "Gel Manicure",      desc: "Long-lasting gel color, 3–4 weeks", price: "$35" },
  { name: "Acrylic Full Set",  desc: "Acrylic extensions with color",      price: "$55" },
  { name: "Nail Art & Design", desc: "Custom art, gems, chrome, airbrush", price: "from $15" },
];

const LASHES = [
  { name: "Classic Lashes",   desc: "Natural one-to-one extension",      price: "$45" },
  { name: "Volume Lashes",    desc: "Full & dramatic fans",               price: "$60" },
  { name: "Mega Volume",      desc: "Maximum fullness & drama",           price: "$75" },
  { name: "Lash Lift & Tint", desc: "Lifts & tints your natural lashes", price: "$40" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:      #FAF6F3;
    --ink:     #1E1220;
    --acc:     #B8826A;
    --acc-lt:  #E4C5B4;
    --muted:   #7A5E6A;
    --surface: #F2ECE8;
    --border:  #DDD0C8;
    --nav-h:   64px;
    --fd: 'Cormorant Garamond', Georgia, serif;
    --fb: 'DM Sans', system-ui, sans-serif;
    --t: 0.3s ease;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--fb); background: var(--bg); color: var(--ink); }

  /* ── NAVBAR ── */
  .nav {
    position: sticky; top: 0; z-index: 200;
    height: var(--nav-h);
    background: rgba(250,246,243,.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 56px;
  }
  .logo {
    font-family: var(--fd); font-size: 1.35rem; font-weight: 300;
    letter-spacing: .1em; text-transform: uppercase; color: var(--ink);
    cursor: pointer; user-select: none; flex-shrink: 0;
  }
  .logo span { color: var(--acc); }
  .nav-links { display: flex; gap: 34px; list-style: none; }
  .nl {
    font-size: .74rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); cursor: pointer; padding-bottom: 3px;
    border-bottom: 1.5px solid transparent;
    transition: color var(--t), border-color var(--t);
    user-select: none;
  }
  .nl:hover { color: var(--ink); }
  .nl.active { color: var(--acc); border-bottom-color: var(--acc); }

  /* ── NAV AUTH ── */
  .nav-auth { display: flex; align-items: center; gap: 16px; }
  .btn-signin {
    font-family: var(--fb); font-size: .74rem; letter-spacing: .14em;
    text-transform: uppercase; color: var(--muted); background: none;
    border: none; cursor: pointer; transition: color var(--t); padding: 0;
  }
  .btn-signin:hover { color: var(--ink); }
  .btn-sm { padding: 10px 20px; font-size: .7rem; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-block; font-family: var(--fb); font-size: .74rem;
    font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; border: none; padding: 14px 32px; border-radius: 2px;
    transition: background var(--t), transform var(--t), border-color var(--t), color var(--t);
    line-height: 1;
  }
  .btn-primary { background: var(--acc); color: #fff; }
  .btn-primary:hover { background: #A0705A; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: var(--acc-lt); border: 1px solid rgba(228,197,180,.4); }
  .btn-outline:hover { border-color: var(--acc-lt); color: #fff; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(30,18,32,.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal-box {
    background: #fff; width: 100%; max-width: 440px;
    padding: 48px 48px 40px; position: relative; border-radius: 2px;
  }
  .modal-close {
    position: absolute; top: 18px; right: 20px;
    background: none; border: none; cursor: pointer;
    font-size: 1rem; color: var(--muted); transition: color var(--t);
  }
  .modal-close:hover { color: var(--ink); }
  .modal-header { margin-bottom: 28px; }
  .modal-title {
    font-family: var(--fd); font-size: 2.4rem; font-weight: 300;
    line-height: 1.1; color: var(--ink);
  }
  .modal-title em { font-style: italic; color: var(--acc); }
  .mform { display: flex; flex-direction: column; gap: 14px; }
  .mform-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .mfield { display: flex; flex-direction: column; gap: 6px; }
  .mfield label {
    font-size: .67rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted);
  }
  .mfield input {
    background: var(--bg); border: 1px solid var(--border);
    color: var(--ink); font-family: var(--fb); font-size: .9rem; font-weight: 300;
    padding: 12px 15px; border-radius: 2px; outline: none; width: 100%;
    transition: border-color var(--t);
  }
  .mfield input::placeholder { color: var(--border); }
  .mfield input:focus { border-color: var(--acc); }
  .modal-switch {
    font-size: .8rem; color: var(--muted); text-align: center; margin-top: 4px;
  }
  .modal-switch span {
    color: var(--acc); cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px;
  }

  /* ── SHARED ── */
  .eyebrow {
    font-size: .7rem; letter-spacing: .22em; text-transform: uppercase;
    color: var(--acc); margin-bottom: 14px; display: block;
  }
  .section-title {
    font-family: var(--fd); font-size: clamp(2.4rem, 4.5vw, 3.8rem);
    font-weight: 300; line-height: 1.12; color: var(--ink); margin-bottom: 28px;
  }
  .section-title em { font-style: italic; color: var(--acc); }

  /* ── HOME ── */
  #home {
    min-height: calc(100vh - var(--nav-h));
    background: var(--ink);
    display: grid; grid-template-columns: 55% 45%;
  }
  .hero-text {
    padding: 80px 56px 80px 72px;
    display: flex; flex-direction: column; justify-content: center; gap: 24px;
  }
  .hero-label {
    font-size: .7rem; letter-spacing: .25em; text-transform: uppercase;
    color: rgba(228,197,180,.65);
  }
  .hero-h1 {
    font-family: var(--fd); font-size: clamp(3.2rem, 5.5vw, 5.8rem);
    font-weight: 300; line-height: 1.05; color: #FAF6F3;
  }
  .hero-h1 em { font-style: italic; color: var(--acc-lt); }
  .hero-sub {
    font-size: .97rem; font-weight: 300; color: rgba(250,246,243,.5);
    max-width: 360px; line-height: 1.8;
  }
  .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }

  /* ── ABOUT ── */
  #about { background: #fff; padding: 120px 56px; }
  .about-grid {
    max-width: 1080px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .about-img { aspect-ratio: 4/5; }
  .about-body p {
    font-size: .96rem; font-weight: 300; color: var(--muted); line-height: 1.82; margin-bottom: 18px;
  }
  .pillars { margin-top: 40px; display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .pillar { border-top: 1.5px solid var(--acc); padding-top: 14px; }
  .pillar-name { font-family: var(--fd); font-size: 1.05rem; color: var(--ink); margin-bottom: 5px; }
  .pillar-desc { font-size: .8rem; color: var(--muted); font-weight: 300; line-height: 1.6; }

  /* ── SERVICES ── */
  #services { background: var(--surface); padding: 120px 56px; }
  .srv-wrap { max-width: 1080px; margin: 0 auto; }
  .srv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 56px; }
  .cat-label {
    font-size: .7rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--muted); padding-bottom: 12px; margin-bottom: 4px;
    border-bottom: 1px solid var(--border);
  }
  .srv-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 18px 0; border-bottom: 1px solid var(--border);
  }
  .srv-row:last-child { border-bottom: none; }
  .srv-name { font-family: var(--fd); font-size: 1.1rem; color: var(--ink); margin-bottom: 3px; }
  .srv-desc { font-size: .8rem; color: var(--muted); font-weight: 300; }
  .srv-price {
    font-family: var(--fd); font-size: 1.1rem; font-weight: 300;
    color: var(--acc); white-space: nowrap; margin-left: 24px; flex-shrink: 0;
  }
  .srv-cta { margin-top: 56px; text-align: center; }

  /* ── CONTACT ── */
  #contact { background: var(--ink); padding: 120px 56px; }
  .contact-grid {
    max-width: 1080px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  }
  .contact-title {
    font-family: var(--fd); font-size: clamp(2rem, 4vw, 3.4rem);
    font-weight: 300; color: #FAF6F3; margin-bottom: 32px; line-height: 1.1;
  }
  .contact-title em { font-style: italic; color: var(--acc-lt); }
  .info-list { display: flex; flex-direction: column; gap: 22px; }
  .info-row label {
    display: block; font-size: .67rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(250,246,243,.35); margin-bottom: 4px;
  }
  .info-row p { font-size: .93rem; font-weight: 300; color: rgba(250,246,243,.78); line-height: 1.65; }

  .form { display: flex; flex-direction: column; gap: 14px; }
  .form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label {
    font-size: .67rem; letter-spacing: .15em; text-transform: uppercase;
    color: rgba(250,246,243,.38);
  }
  .field input, .field select, .field textarea {
    background: rgba(250,246,243,.055); border: 1px solid rgba(250,246,243,.13);
    color: #FAF6F3; font-family: var(--fb); font-size: .9rem; font-weight: 300;
    padding: 12px 15px; border-radius: 2px; outline: none; width: 100%;
    transition: border-color var(--t);
  }
  .field input::placeholder, .field textarea::placeholder { color: rgba(250,246,243,.2); }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--acc); }
  .field select option { background: #1E1220; color: #FAF6F3; }
  .field textarea { resize: vertical; min-height: 96px; }

  /* ── FOOTER ── */
  footer {
    background: #120A13; padding: 28px 56px;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(250,246,243,.07);
  }
  .footer-logo {
    font-family: var(--fd); font-size: 1.05rem; font-weight: 300;
    letter-spacing: .1em; text-transform: uppercase; color: rgba(250,246,243,.38);
  }
  .footer-logo span { color: var(--acc); }
  .footer-copy { font-size: .72rem; color: rgba(250,246,243,.22); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .nav-links { gap: 18px; }
    .nav-auth { gap: 10px; }
    .btn-signin { display: none; }

    #home { grid-template-columns: 1fr; }
    .hero-img-col { display: none; }
    .hero-text { padding: 56px 20px 72px; }

    #about, #services, #contact { padding: 80px 20px; }
    .about-grid { grid-template-columns: 1fr; gap: 36px; }
    .about-img { aspect-ratio: 16/9; }
    .pillars { grid-template-columns: 1fr; gap: 18px; }
    .srv-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .form-row2 { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 10px; text-align: center; padding: 24px 20px; }

    .modal-box { padding: 36px 24px 28px; }
    .mform-row2 { grid-template-columns: 1fr; }
  }

  @media (max-width: 480px) {
    .nav-links { gap: 12px; }
    .nl { font-size: .68rem; letter-spacing: .1em; }
    .logo { font-size: 1.1rem; }
  }
`;

export default function App() {
  const [active, setActive] = useState("home");
  const [modal, setModal]   = useState(null); // null | "login" | "register"

  const homeRef     = useRef(null);
  const aboutRef    = useRef(null);
  const servicesRef = useRef(null);
  const contactRef  = useRef(null);

  const refs = {
    home:     homeRef,
    about:    aboutRef,
    services: servicesRef,
    contact:  contactRef,
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 90;
      let cur = "home";
      for (const { id } of NAV) {
        const el = refs[id].current;
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    const el = refs[id].current;
    if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 64), behavior: "smooth" });
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ─── NAVBAR ─── */}
      <nav className="nav">
        <div className="logo" onClick={() => goTo("home")}>
          Luxe<span>&</span>Lash
        </div>
        <ul className="nav-links">
          {NAV.map(({ id, label }) => (
            <li key={id} className={`nl${active === id ? " active" : ""}`} onClick={() => goTo(id)}>
              {label}
            </li>
          ))}
        </ul>
        <div className="nav-auth">
          <button className="btn-signin" onClick={() => setModal("login")}>Sign in</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal("register")}>Register</button>
        </div>
      </nav>

      {/* ─── HOME ─── */}
      <section id="home" ref={homeRef}>
        <div className="hero-text">
          <p className="hero-label">Nails &amp; Lashes Studio · Belgrade</p>
          <h1 className="hero-h1">
            Where every<br />detail <em>shines.</em>
          </h1>
          <p className="hero-sub">
            Professional nail art and lash extensions — crafted with
            precision, care, and attention to every detail.
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => goTo("contact")}>Book a session</button>
            <button className="btn btn-outline" onClick={() => goTo("services")}>View services</button>
          </div>
        </div>
        <img
          className="hero-img-col"
          src="/pic1.jpg"
          alt="Luxe and Lash studio"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" ref={aboutRef}>
        <div className="about-grid">
          <img
            className="about-img"
            src="/pic2.jpg"
            alt="Luxe and Lash studio"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="about-body">
            <span className="eyebrow">About Us</span>
            <h2 className="section-title">
              The craft that<br /><em>makes the difference.</em>
            </h2>
            <p>
              Luxe &amp; Lash was built on one simple idea — that every
              visit should feel like an experience, not just a service.
              A space that remembers every detail about you.
            </p>
            <p>
              Our technicians bring years of focused training and a genuine
              dedication to their craft. Every nail, every lash — done with
              precision and care.
            </p>
            <div className="pillars">
              {[
                { t: "Precision", d: "Every detail placed with intention and care." },
                { t: "Hygiene",   d: "Hospital-grade sterilization, always." },
                { t: "Expertise", d: "Ongoing training in the latest techniques." },
              ].map(p => (
                <div className="pillar" key={p.t}>
                  <div className="pillar-name">{p.t}</div>
                  <p className="pillar-desc">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" ref={servicesRef}>
        <div className="srv-wrap">
          <span className="eyebrow">What We Offer</span>
          <h2 className="section-title">Our <em>services.</em></h2>
          <div className="srv-grid">
            <div>
              <p className="cat-label">Nails</p>
              {NAILS.map(s => (
                <div className="srv-row" key={s.name}>
                  <div>
                    <div className="srv-name">{s.name}</div>
                    <div className="srv-desc">{s.desc}</div>
                  </div>
                  <div className="srv-price">{s.price}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="cat-label">Lashes</p>
              {LASHES.map(s => (
                <div className="srv-row" key={s.name}>
                  <div>
                    <div className="srv-name">{s.name}</div>
                    <div className="srv-desc">{s.desc}</div>
                  </div>
                  <div className="srv-price">{s.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="srv-cta">
            <button className="btn btn-primary" onClick={() => goTo("contact")}>
              Book your appointment
            </button>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" ref={contactRef}>
        <div className="contact-grid">
          <div>
            <h2 className="contact-title">
              Let's create<br /><em>something beautiful.</em>
            </h2>
            <div className="info-list">
              {[
                { l: "Address", v: "123 Main Street\nNew York, NY 10001" },
                { l: "Phone",   v: "+1 (212) 000-0000" },
                { l: "Hours",   v: "Mon – Sat: 9:00 AM – 8:00 PM\nSunday: Closed" },
                { l: "Email",   v: "hello@luxeandlash.com" },
              ].map(i => (
                <div className="info-row" key={i.l}>
                  <label>{i.l}</label>
                  <p style={{ whiteSpace: "pre-line" }}>{i.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="form">
            <div className="form-row2">
              <div className="field">
                <label>First name</label>
                <input type="text" placeholder="Emma" />
              </div>
              <div className="field">
                <label>Last name</label>
                <input type="text" placeholder="Johnson" />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="emma@example.com" />
            </div>
            <div className="field">
              <label>Service</label>
              <select defaultValue="">
                <option value="" disabled>Choose a service...</option>
                <optgroup label="Nails">
                  {NAILS.map(s => <option key={s.name}>{s.name}</option>)}
                </optgroup>
                <optgroup label="Lashes">
                  {LASHES.map(s => <option key={s.name}>{s.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div className="field">
              <label>Message (optional)</label>
              <textarea placeholder="Any special requests or notes..." />
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 6 }}
              onClick={() => alert("Thank you! We'll be in touch soon. 💅")}
            >
              Send booking request
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-logo">Luxe<span>&</span>Lash</div>
        <p className="footer-copy">© 2026 Luxe &amp; Lash Studio</p>
      </footer>

      {/* ─── MODAL ─── */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>

            {modal === "register" ? (
              <>
                <div className="modal-header">
                  <span className="eyebrow">Join Us</span>
                  <h2 className="modal-title">Create an <em>account.</em></h2>
                </div>
                <div className="mform">
                  <div className="mform-row2">
                    <div className="mfield">
                      <label>First name</label>
                      <input type="text" placeholder="Emma" />
                    </div>
                    <div className="mfield">
                      <label>Last name</label>
                      <input type="text" placeholder="Johnson" />
                    </div>
                  </div>
                  <div className="mfield">
                    <label>Email</label>
                    <input type="email" placeholder="emma@example.com" />
                  </div>
                  <div className="mfield">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="mfield">
                    <label>Confirm password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 8 }}
                    onClick={() => alert("Account created! 💅")}
                  >
                    Create account
                  </button>
                  <p className="modal-switch">
                    Already have an account?{" "}
                    <span onClick={() => setModal("login")}>Sign in</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <span className="eyebrow">Welcome back</span>
                  <h2 className="modal-title">Sign <em>in.</em></h2>
                </div>
                <div className="mform">
                  <div className="mfield">
                    <label>Email</label>
                    <input type="email" placeholder="emma@example.com" />
                  </div>
                  <div className="mfield">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 8 }}
                    onClick={() => setModal(null)}
                  >
                    Sign in
                  </button>
                  <p className="modal-switch">
                    Don't have an account?{" "}
                    <span onClick={() => setModal("register")}>Create one</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
