import { useState, useEffect, useCallback, useMemo } from 'react'
import Lightning from './components/Lightning'
import CircularGallery from './components/CircularGallery'
import Stack from './components/Stack'

const digits = s => (s || '').replace(/\D/g, '')

export default function App() {
  const G = window.GYM || {}
  const [ready, setReady] = useState(false)
  const [pct, setPct] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalReason, setModalReason] = useState('Book a free trial')
  const [form, setForm] = useState({ n: '', p: '', r: '' })
  const [err, setErr] = useState('')
  const [demoHidden, setDemoHidden] = useState(() => sessionStorage.getItem('demoDismissed') === '1')

  useEffect(() => {
    const srcs = [
      '/img/hero.jpg',
      ...(G.stackImages || []),
      ...(G.gallery || []).map(g => g.image)
    ]
    let done = 0
    const load = src => new Promise(res => {
      const im = new Image()
      im.crossOrigin = 'anonymous'
      im.onload = im.onerror = () => {
        done++
        setPct(Math.round((done / srcs.length) * 100))
        res()
      }
      im.src = src
    })
    Promise.all([
      Promise.all(srcs.map(load)),
      Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 2000))
      ])
    ]).then(() => setTimeout(() => setReady(true), 280))
  }, [])

  const openModal = useCallback((reason = 'Book a free trial') => {
    setModalReason(reason)
    setErr('')
    setModalOpen(true)
    setMenuOpen(false)
  }, [])

  const closeModal = () => {
    setModalOpen(false)
    setErr('')
  }

  const submitForm = e => {
    e.preventDefault()
    const name = form.n.trim()
    let ph = form.p.replace(/\D/g, '')
    if (ph.length > 10 && /^(91|0)/.test(ph)) ph = ph.slice(-10)
    if (name.length < 2) {
      setErr('Add your name so we know who to reply to.')
      return
    }
    if (ph.length !== 10) {
      setErr('Enter a 10-digit mobile number.')
      return
    }
    const reason = form.r.trim() || modalReason
    setErr('')
    const text = `Hi ${G.name}, I'm ${name}. ${reason}. You can reach me on ${ph}.`
    window.open(`https://wa.me/${digits(G.phone)}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    closeModal()
  }

  const stackCards = useMemo(() =>
    (G.stackImages || []).map((src, i) => (
      <img key={i} src={src} alt={`Gym ${i + 1}`} className="card-image" crossOrigin="anonymous" />
    )), [G.stackImages])

  const leftLines = (G.heroLeft || '').split('\n')
  const rightLines = (G.heroRight || '').split('\n')

  return (
    <div className={ready ? 'ready' : ''}>
      <div id="pre" aria-hidden={ready}>
        <div>
          <p className="pre-name">{G.name}</p>
          <p className="pre-pct">{pct}<span>%</span></p>
        </div>
        <div className="pre-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      </div>

      <header className="top">
        <a className="brand" href="#top">
          <span className="logo" aria-hidden="true">
            {G.logo
              ? <img src={G.logo} alt="" />
              : <span className="logo-letter">{(G.name || 'A').trim().charAt(0)}</span>}
          </span>
          <span className="mark">{G.name}</span>
        </a>
        <button
          className="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <i /><i /><i />
        </button>
        <nav className={`menu${menuOpen ? ' open' : ''}`} aria-label="Site menu">
          <a className="hl" href="#" onClick={e => { e.preventDefault(); openModal('Book a free trial') }}>Book a trial</a>
          <a href={`tel:+${digits(G.phone)}`}>Call us</a>
          <a href={G.links?.instagram || '#'} target="_blank" rel="noopener">Instagram</a>
          <a href={G.links?.maps || '#'} target="_blank" rel="noopener">Location</a>
          <a href="#why" onClick={() => setMenuOpen(false)}>Why us?</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" id="hero">
          <div className="lightning-wrap" aria-hidden="true">
            <Lightning hue={210} xOffset={0} speed={0.9} intensity={1.8} size={1.2} />
          </div>
          <div className="hero-inner">
            <div className="hero-text left">
              {leftLines.map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="hero-fig">
              <img src="/img/hero.png" alt="Athlete" width="480" height="640" />
            </div>
            <div className="hero-text right">
              {rightLines.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
          <p className="hero-sub">{G.heroSub}</p>
          <div className="ctas">
            <button className="btn primary" type="button" onClick={() => openModal('Book a free trial')}>Book a trial</button>
            <button className="btn" type="button" onClick={() => openModal('I have a question')}>Other enquiries</button>
          </div>
        </section>

        <section className="why" id="why">
          <div className="why-stack">
            <div className="stack-wrap">
              <Stack
                randomRotation
                sensitivity={150}
                sendToBackOnClick
                autoplay
                autoplayDelay={3200}
                pauseOnHover
                cards={stackCards}
              />
            </div>
          </div>
          <div className="why-copy">
            <h2>Why people stay past the first month</h2>
            <div className="reasons">
              <div>
                <h3>The floor has what you need</h3>
                <p>Racks, machines, a proper dumbbell range and cardio that works. You won't stand around for twenty minutes waiting on one bench.</p>
              </div>
              <div>
                <h3>Trainers who watch your form</h3>
                <p>Coaches who are on the floor, not on their phones. They fix your squat before it turns into a knee problem.</p>
              </div>
              <div>
                <h3>A plan that's yours</h3>
                <p>We start with your goal, your week and what your body can do today, then write the program. No copied charts, no guessing what to do next.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="gal" id="gallery">
          <h2>Inside the gym</h2>
          <div className="gal-wrap">
            <CircularGallery
              items={G.gallery || []}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.04}
              font="bold 28px Bebas Neue"
            />
          </div>
        </section>

        <section className="find" id="find">
          <div>
            <h2>Come see the floor</h2>
            <address>{G.address}</address>
            <p className="hours">{G.hours}</p>
          </div>
          <nav className="links" aria-label="Find us">
            <a href={G.links?.maps || '#'} target="_blank" rel="noopener">Google Maps</a>
            <a href={G.links?.instagram || '#'} target="_blank" rel="noopener">Instagram</a>
            <a href={`tel:+${digits(G.phone)}`}>Call {G.phone}</a>
          </nav>
        </section>

        {G.rating?.value && (
          <section className="rev" id="reviews">
            <div className="rate">
              <p className="big">{G.rating.value}</p>
              <p>Google rating from <span>{G.rating.count}</span> reviews</p>
            </div>
            <div className="quotes">
              {(G.reviews || []).map((r, i) => (
                <blockquote key={i}>
                  <p>&ldquo;{r.text}&rdquo;</p>
                  <cite>{r.name}</cite>
                </blockquote>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>{G.name}{G.area ? `, ${G.area}` : ''}{G.city ? `, ${G.city}` : ''}</p>
        <p>&copy; {new Date().getFullYear()} {G.name}</p>
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-x" type="button" aria-label="Close" onClick={closeModal}>&times;</button>
            <h2 id="modal-title">{modalReason === 'Book a free trial' ? 'Book a free trial' : 'Other enquiries'}</h2>
            <p className="modal-lead">Fill this in and WhatsApp opens with your message ready. Just hit send.</p>
            <form onSubmit={submitForm} noValidate>
              <label>Your name
                <input name="n" autoComplete="name" value={form.n} onChange={e => setForm(f => ({ ...f, n: e.target.value }))} />
              </label>
              <label>Phone number
                <input name="p" inputMode="tel" autoComplete="tel" value={form.p} onChange={e => setForm(f => ({ ...f, p: e.target.value }))} />
              </label>
              <label>Reason / message
                <textarea name="r" rows={3} placeholder={modalReason} value={form.r} onChange={e => setForm(f => ({ ...f, r: e.target.value }))} />
              </label>
              {err && <p className="err" role="alert">{err}</p>}
              <button className="btn primary" type="submit">Send on WhatsApp</button>
            </form>
          </div>
        </div>
      )}

      {!demoHidden && G.demo && (
        <aside className="demo">
          <p>Demo made for <b>{G.name}</b> by {G.demo.by}. Want it live?</p>
          <a
            className="demo-btn"
            href={`https://wa.me/${digits(G.demo.whatsapp)}?text=${encodeURIComponent(`Hi ${G.demo.by}, I saw the demo you built for ${G.name}. Let's talk.`)}`}
            target="_blank"
            rel="noopener"
          >WhatsApp me</a>
          <button type="button" className="demo-x" aria-label="Close this bar" onClick={() => { setDemoHidden(true); sessionStorage.setItem('demoDismissed', '1') }}>&times;</button>
        </aside>
      )}
    </div>
  )
}
