document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById('content');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive(name) {
    console.log('Attivazione sezione:', name);
    navLinks.forEach((l) => {
      l.classList.remove('is-active');
      const href = l.getAttribute('href');
      if (href === `#${name}`) {
        l.classList.add('is-active');
      }
    });
  }

  async function loadSection(name) {
      // Imposto subito il menu attivo per feedback immediato
      setActive(name);
      
      const content = document.getElementById('content');
      
      // 1. Inizio animazione uscita (Slide Out)
      // La classe slide-out fa muovere il contenuto verso sinistra e fuori schermo
      content.classList.add('slide-out');
      
      try {
        // Attendo sia il fetch che la fine della transizione CSS (o timeout di sicurezza)
        const fetchPromise = fetch(`sections/${name}.html`);
        const transitionPromise = new Promise(resolve => {
           const onEnd = () => {
             content.removeEventListener('transitionend', onEnd);
             resolve();
           };
           content.addEventListener('transitionend', onEnd);
           // Fallback di sicurezza se l'evento non parte (es. tab in background)
           setTimeout(onEnd, 600); 
        });

        const [res] = await Promise.all([fetchPromise, transitionPromise]);

        if (res.ok) {
          const html = await res.text();
          
          // 2. Preparo l'entrata (imposto posizione iniziale a destra senza animazione)
          // Rimuovo slide-out così la transizione torna normale, MA...
          content.classList.remove('slide-out');
          // ...applico "slide-in-start" che blocca la transizione e sposta a destra istantaneamente
          content.classList.add('slide-in-start');
          
          // Sostituisco il contenuto HTML mentre è invisibile (fuori schermo a destra)
          content.innerHTML = html;
          
          // Forza il browser a ricalcolare il layout (Reflow) per applicare slide-in-start prima di animare
          void content.offsetWidth;
          
          // 3. Eseguo l'animazione di entrata rimuovendo la classe start
          // Il contenuto scorrerà da destra verso il centro
          requestAnimationFrame(() => {
             content.classList.remove('slide-in-start');
          });
          
          return;
        }
        throw new Error(`Status: ${res.status}`)
      } catch (err) {
        // In caso di errore, resetto le classi di animazione per mostrare il messaggio
        content.classList.remove('slide-out', 'slide-in-start');
        
        console.error('Error loading section', name, err)
        // Check if fallback element exists
        const fallback = document.getElementById('cta-fallback');
        if (fallback) {
          content.innerHTML = '';
          const msg = fallback.cloneNode(true);
          msg.removeAttribute('id');
          msg.style.display = 'block';
          content.appendChild(msg);
        } else {
          content.innerHTML = `
            <div style="padding:40px; text-align:center; color:var(--muted);">
              <p>Sezione non trovata.</p>
              <p style="font-size:0.9em; margin-top:10px;">(Se sei in locale, usa un server HTTP per evitare blocchi CORS)</p>
            </div>`
        }
      }
  }

  // nav clicks
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const name = href.slice(1);
        
        // Aggiorno l'URL in modo sicuro (ignora errori se su file system locale)
        try {
          history.pushState(null, '', `#${name}`);
        } catch (e) {
          // Fallback silenzioso per file:// o browser vecchi
        }
        
        loadSection(name);
      });
    }
  });

  // initial load (hash or home)
  const initial = (location.hash && location.hash.slice(1)) || 'home';
  loadSection(initial);

  // support back/forward
  window.addEventListener('popstate', () => {
    const name = (location.hash && location.hash.slice(1)) || 'home';
    loadSection(name);
  });
});
