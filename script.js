/**
 * SCRIPT.JS - GOOGLE SEARCH RESUME / PORTFOLIO
 * Features:
 * 1. Typewriter animation inside Google search input
 * 2. Instant view switching (Google Home -> Google Search Results Page)
 * 3. Search category tabs filtering (All, Projects, Skills, Experience, Contact)
 * 4. "I'm Feeling Lucky" easter egg button
 * 5. Logo click to return to Google Home
 * 6. Contact form simulation
 */

document.addEventListener('DOMContentLoaded', () => {

  // DOM Elements (able to interact with HTML)
  const homeView = document.getElementById('home-view');
  const resultsView = document.getElementById('results-view');

  const homeSearchForm = document.getElementById('home-search-form'); 
  const homeSearchInput = document.getElementById('home-search-input');

  const resultsSearchForm = document.getElementById('results-search-form');
  const resultsSearchInput = document.getElementById('results-search-input');

  const btnLucky = document.getElementById('btn-lucky');
  const logoBackHome = document.getElementById('logo-back-home');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  const tabButtons = document.querySelectorAll('.tab-item');
  const serpCards = document.querySelectorAll('.serp-card');
  const pillButtons = document.querySelectorAll('.pill-btn');
  const navToAbout = document.getElementById('nav-to-about');

  /* =========================================================
     1. TYPEWRITER EFFECT IN SEARCH BOX
  ========================================================= */
  const greetingText = "Hello, my name is Reya Jindal";
  let typewriterTimeout = null;
  let userInterrupted = false;

  function startTypewriter() {
    if (!homeSearchInput) return;

    // Clear any previous timeouts
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }

    userInterrupted = false;
    homeSearchInput.value = "";
    let charIdx = 0;

    function typeNextChar() {
      if (userInterrupted) return;

      if (charIdx < greetingText.length) {
        homeSearchInput.value += greetingText.charAt(charIdx);
        charIdx++;
        typewriterTimeout = setTimeout(typeNextChar, 60);
      }
    }

    // Small initial pause for smooth presentation
    typewriterTimeout = setTimeout(typeNextChar, 300);
  }

  if (homeSearchInput) {
    // Only stop auto-typing if the user actually starts typing
    homeSearchInput.addEventListener('keydown', (e) => {
      if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
        userInterrupted = true;
      }
    });

    homeSearchInput.addEventListener('input', () => {
      userInterrupted = true;
    });

    // Start typing on initial page load
    startTypewriter();

    // Also restart on pageshow (e.g. browser reload or back navigation)
    window.addEventListener('pageshow', () => {
      startTypewriter();
    });
  }

  /* =========================================================
     2. VIEW SWITCHING (Home <-> Search Results)
  ========================================================= */
  function showResults(query = "Hello, my name is Reya Jindal", category = "all") {
    // Stop any active typewriter
    userInterrupted = true;
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
    }

    // Hide home, show results
    homeView.classList.remove('view-active');
    homeView.classList.add('view-hidden');

    resultsView.classList.remove('view-hidden');
    resultsView.classList.add('view-active');

    // Update query inputs
    if (resultsSearchInput) {
      resultsSearchInput.value = query;
    }

    // Filter results tab
    filterResults(category);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHome() {
    resultsView.classList.remove('view-active');
    resultsView.classList.add('view-hidden');

    homeView.classList.remove('view-hidden');
    homeView.classList.add('view-active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Replay typewriter animation when returning to Home!
    startTypewriter();
  }

  // Home search form submit
  if (homeSearchForm) {
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawQuery = homeSearchInput.value.trim() || "Hello, my name is Reya Jindal";
      showResults(rawQuery, "all");
      
      const query = rawQuery.toLowerCase();
      if (query.includes('extracurriculars') || query.includes('ecs')) {
        filterResults('extracurriculars');
      } else if (query.includes('skill') || query.includes('c++') || query.includes('python')) {
        filterResults('skills');
      } else if (query.includes('experience') || query.includes('education')) {
        filterResults('experience');
      } else if (query.includes('contact') || query.includes('email')) {
        filterResults('contact');
      } else {
        filterResults('all');
      }
    });
  }

  // Results search form submit
  if (resultsSearchForm) {
    resultsSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = resultsSearchInput.value.trim().toLowerCase();
      
      // Smart search detection
      if (query.includes('extracurriculars') || query.includes('ecs')) {
        filterResults('extracurriculars');
      } else if (query.includes('skill') || query.includes('c++') || query.includes('python')) {
        filterResults('skills');
      } else if (query.includes('experience') || query.includes('education')) {
        filterResults('experience');
      } else if (query.includes('contact') || query.includes('email')) {
        filterResults('contact');
      } else {
        filterResults('all');
      }
    });
  }

  // Return to Google home when clicking REYA logo
  if (logoBackHome) {
    logoBackHome.addEventListener('click', showHome);
  }

  // Clear search button in results header
  if (clearSearchBtn && resultsSearchInput) {
    clearSearchBtn.addEventListener('click', () => {
      resultsSearchInput.value = "";
      resultsSearchInput.focus();
    });
  }

  // Header "About" link
  if (navToAbout) {
    navToAbout.addEventListener('click', (e) => {
      e.preventDefault();
      showResults("About Reya Jindal", "about");
    });
  }

  // Quick pill buttons on home
  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      let cat = "all";
      if (query.includes('Extracurriculars')) cat = "extracurriculars";
      if (query.includes('Skills')) cat = "skills";
      if (query.includes('Experience')) cat = "experience";
      if (query.includes('Contact')) cat = "contact";
      if (query.includes('About')) cat = "about";
      showResults(query, cat);
    }); 
  });

  /* =========================================================
     3. "I'M FEELING LUCKY" BUTTON (Jumps to Featured Project)
  ========================================================= */
  /*
  if (btnLucky) {
    btnLucky.addEventListener('click', () => {
      showResults("Reya Jindal CP Algorithm Visualizer", "projects");
    });
  } 
  */

  /* =========================================================
     4. CATEGORY TABS FILTERING (All, Projects, Skills, etc.)
  ========================================================= */
  function filterResults(category) {
    // Update tab UI active state
    tabButtons.forEach((tab) => {
      if (tab.getAttribute('data-filter') === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Show/hide organic result cards
    serpCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-filter');
      filterResults(category);
    });
  });

  /* =========================================================
     5. CONTACT FORM SUBMISSION (FORMSPREE INTEGRATION)
  ========================================================= */
  const contactForm = document.getElementById('results-contact-form');
  const contactToast = document.getElementById('contact-toast');

  if (contactForm && contactToast) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(contactForm);
      const name = formData.get('name') || 'there';

      try {
        const response = await fetch('https://formspree.io/f/xnppnqlz', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactToast.className = 'contact-toast success';
          contactToast.textContent = `Thanks ${name}! Your message has been sent directly to my email.`;
          contactToast.style.display = 'block';
          contactForm.reset();
        } else {
          const data = await response.json();
          contactToast.className = 'contact-toast error';
          contactToast.textContent = data.errors ? data.errors.map(err => err.message).join(', ') : 'Oops! There was a problem submitting your form.';
          contactToast.style.display = 'block';
        }
      } catch (error) {
        contactToast.className = 'contact-toast error';
        contactToast.textContent = 'Network error. Please email me directly at jindalreya@gmail.com.';
        contactToast.style.display = 'block';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        setTimeout(() => {
          contactToast.style.display = 'none';
        }, 6000);
      }
    });
  }

});
